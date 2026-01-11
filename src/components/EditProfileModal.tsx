import { X, Camera, Pencil, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';

export default function EditProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { profile, updateProfile } = useUser();

  const [name, setName] = useState(profile.name || '');
  const [photo, setPhoto] = useState<string | undefined>(
    (profile as any).photo
  );

  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');

  const [editingPhone, setEditingPhone] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);

  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  if (!open) return null;

  /* ---------------- PHOTO ---------------- */
  const handlePhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      console.log('[Profile] Photo uploaded');
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- OTP MOCK LOGIC ---------------- */
  const sendOtp = (type: 'phone' | 'email') => {
    console.log(`[OTP] Sending OTP to ${type === 'phone' ? phone : email}`);
    if (type === 'phone') setPhoneOtpSent(true);
    if (type === 'email') setEmailOtpSent(true);
  };

  const verifyOtp = (type: 'phone' | 'email') => {
    console.log(`[OTP] Verifying ${type} OTP`, type === 'phone' ? phoneOtp : emailOtp);

    if (type === 'phone') {
      setPhoneVerified(true);
      setEditingPhone(false);
    } else {
      setEmailVerified(true);
      setEditingEmail(false);
    }

    console.log(`[OTP] ${type} verified successfully`);
  };

  /* ---------------- SAVE ---------------- */
  const save = () => {
    console.log('[Profile] Saving profile changes');

    updateProfile({
      name,
      ...(photo ? { photo } : {}),
      ...(phoneVerified ? { phone } : {}),
      ...(emailVerified ? { email } : {}),
    });

    console.log('[Profile] Profile updated successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-xs p-6 space-y-5 relative shadow-xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500">
          <X />
        </button>

        <h2 className="text-lg font-semibold text-center">Edit Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          {photo ? (
            <img src={photo} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#E67E22] text-white flex items-center justify-center text-3xl font-bold">
              {name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm cursor-pointer text-[#E67E22]">
            <Camera size={16} />
            Change photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handlePhoto(e.target.files?.[0])}
            />
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs text-gray-500">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 mt-1"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-xs text-gray-500 flex justify-between">
            Phone number
            {!editingPhone && (
              <button
                onClick={() => setEditingPhone(true)}
                className="text-[#E67E22] text-xs flex items-center gap-1"
              >
                <Pencil size={12} /> Change
              </button>
            )}
          </label>

          <input
            disabled={!editingPhone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 mt-1 ${
              editingPhone ? '' : 'bg-gray-100'
            }`}
          />

          {editingPhone && !phoneOtpSent && (
            <button
              onClick={() => sendOtp('phone')}
              className="text-xs text-[#E67E22] mt-2"
            >
              Send OTP
            </button>
          )}

          {phoneOtpSent && !phoneVerified && (
            <div className="flex gap-2 mt-2">
              <input
                placeholder="Enter OTP"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={() => verifyOtp('phone')}
                className="px-3 rounded-lg bg-green-600 text-white text-sm"
              >
                Verify
              </button>
            </div>
          )}

          {phoneVerified && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle size={14} /> Phone verified
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-xs text-gray-500 flex justify-between">
            Email
            {!editingEmail && (
              <button
                onClick={() => setEditingEmail(true)}
                className="text-[#E67E22] text-xs flex items-center gap-1"
              >
                <Pencil size={12} /> Change
              </button>
            )}
          </label>

          <input
            disabled={!editingEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 mt-1 ${
              editingEmail ? '' : 'bg-gray-100'
            }`}
          />

          {editingEmail && !emailOtpSent && (
            <button
              onClick={() => sendOtp('email')}
              className="text-xs text-[#E67E22] mt-2"
            >
              Send OTP
            </button>
          )}

          {emailOtpSent && !emailVerified && (
            <div className="flex gap-2 mt-2">
              <input
                placeholder="Enter OTP"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={() => verifyOtp('email')}
                className="px-3 rounded-lg bg-green-600 text-white text-sm"
              >
                Verify
              </button>
            </div>
          )}

          {emailVerified && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle size={14} /> Email verified
            </p>
          )}
        </div>

        <button
          onClick={save}
          className="w-full bg-[#E67E22] text-white py-2 rounded-xl font-medium mt-3"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
