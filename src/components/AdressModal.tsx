import { useState } from 'react';
import { useCart } from './CartContext';
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
  const { setAddress } = useCart();

  const [type, setType] = useState<'Home' | 'Work'>('Home');
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

  if (!open) return null;

  const fetchLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  const saveAddress = () => {
    const formatted = [
      `${type} Address`,
      form.house,
      `${form.mandal}, ${form.district}`,
      `${form.state} - ${form.pincode}`,
      isServiceable ? 'Serviceable' : 'Not Serviceable',
      `${form.name} • ${form.phone}`,
    ]
      .filter(Boolean)
      .join('\n');

    setAddress(formatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[92%] max-w-md rounded-2xl p-5 space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#E67E22]" />
            Delivery Address
          </h3>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        {/* USER */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
            <User className="w-4 h-4 text-[#6B5A4A]" />
            <input
              placeholder="Name"
              className="w-full text-sm outline-none"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
            <Phone className="w-4 h-4 text-[#6B5A4A]" />
            <input
              placeholder="Phone"
              className="w-full text-sm outline-none"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        {/* TYPE */}
        <div className="flex gap-3">
          <button
            onClick={() => setType('Home')}
            className={`flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 ${
              type === 'Home' ? 'bg-[#E67E22]/10 border-[#E67E22]' : ''
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() => setType('Work')}
            className={`flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 ${
              type === 'Work' ? 'bg-[#E67E22]/10 border-[#E67E22]' : ''
            }`}
          >
            <Briefcase className="w-4 h-4" /> Work
          </button>
        </div>

        {/* ADDRESS */}
        <input
          className="w-full border rounded-xl p-3 text-sm"
          placeholder="House / Street / Area"
          onChange={(e) => setForm({ ...form, house: e.target.value })}
        />

        <input
          className="w-full border rounded-xl p-3 text-sm"
          placeholder="Pincode"
          onChange={(e) => {
            const pin = e.target.value;
            setForm({ ...form, pincode: pin });

            if (pin.length === 6) {
              setIsServiceable(SERVICEABLE_PINCODES.includes(pin));
            } else {
              setIsServiceable(null);
            }
          }}
        />

        {isServiceable !== null && (
          <p
            className={`text-xs font-medium ${
              isServiceable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isServiceable ? '✓ Serviceable area' : '✕ Not serviceable yet'}
          </p>
        )}

        <input
          className="w-full border rounded-xl p-3 text-sm"
          placeholder="Mandal"
          onChange={(e) => setForm({ ...form, mandal: e.target.value })}
        />
        <input
          className="w-full border rounded-xl p-3 text-sm"
          placeholder="District"
          onChange={(e) => setForm({ ...form, district: e.target.value })}
        />
        <input
          className="w-full border rounded-xl p-3 text-sm"
          placeholder="State"
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />

        {/* GPS */}
        <button
          onClick={fetchLocation}
          className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border text-sm"
        >
          <LocateFixed className="w-4 h-4" />
          Use current live location
        </button>

        {/* SAVE */}
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
