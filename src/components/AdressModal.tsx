import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';

import {
  X,
  Home,
  Briefcase,
  Navigation,
  User,
  Phone,
  LocateFixed,
} from 'lucide-react';

const SERVICEABLE_PINCODES = ['533223', '533101', '533103', '533104'];

export default function AdressModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { address, setAddress } = useCart();
  const { addOrUpdateAddress, addresses } = useUser();

  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    house: '',
    pincode: '',
    mandal: '',
    district: '',
    state: '',
  });

  useEffect(() => {
    if (!open) return;

    if (address) {
      setType(address.type);
      setForm(address);
      setIsServiceable(address.isServiceable);
      setCoords(address.coords);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, [open]);

  if (!open) return null;

  const saveAddress = () => {
    // 1️⃣ Always keep cart behavior
    setAddress({
      type,
      ...form,
      isServiceable,
      coords,
    });

    // 2️⃣ ALSO save to user profile
    addOrUpdateAddress({
      id: 'ADDR-' + Date.now(),
      label: type,
      name: form.name,
      phone: form.phone,
      house: form.house,
      mandal: form.mandal,
      district: form.district,
      state: form.state,
      pincode: form.pincode,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      isDefault: addresses.length === 0, // first address auto default
      isServiceable,
    });

    onClose();
  };

  const resetForm = () => {
    setForm({
      name: '',
      phone: '',
      house: '',
      pincode: '',
      mandal: '',
      district: '',
      state: '',
    });
    setIsServiceable(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[92%] max-w-md rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#E67E22]" />
            Delivery Address
          </h3>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Name"
            value={form.name}
            className="border rounded-xl px-3 py-2 text-sm"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            className="border rounded-xl px-3 py-2 text-sm"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          {[Home, Briefcase, Navigation].map((Icon, i) => {
            const labels = ['Home', 'Work', 'Other'] as const;
            return (
              <button
                key={labels[i]}
                onClick={() => {
                  if (type !== labels[i]) {
                    setType(labels[i]);
                    resetForm(); // 🔑 clears fields when switching type
                  }
                }}
                className={`flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 ${type === labels[i] ? 'bg-[#E67E22]/10 border-[#E67E22]' : ''
                  }`}
              >
                <Icon className="w-4 h-4" /> {labels[i]}
              </button>
            );
          })}
        </div>

        {['house', 'pincode', 'mandal', 'district', 'state'].map((f) => (
          <input
            key={f}
            placeholder={f.toUpperCase()}
            value={(form as any)[f]}
            className="w-full border rounded-xl p-3 text-sm"
            onChange={(e) => {
              const v = e.target.value;
              setForm({ ...form, [f]: v });
              if (f === 'pincode' && v.length === 6)
                setIsServiceable(SERVICEABLE_PINCODES.includes(v));
            }}
          />
        ))}

        {isServiceable !== null && (
          <p
            className={`text-xs font-medium ${isServiceable ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {isServiceable ? '✓ Serviceable area' : '✕ Not serviceable yet'}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            if (!navigator.geolocation) {
              alert('Geolocation not supported');
              return;
            }

            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setCoords({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });
              },
              () => {
                alert('Please allow location access');
              }
            );
          }}
          className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border text-sm opacity-60 cursor-pointer"
        >
          <LocateFixed className="w-4 h-4" />
          Use live GPS
        </button>

        <button
          onClick={saveAddress}
          className="w-full h-11 rounded-xl bg-[#E67E22] text-white font-semibold"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}
