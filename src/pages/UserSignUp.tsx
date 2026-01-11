import React, { useState } from 'react';

export default function UserSignUp() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-center mb-1">
          Create your account ✨
        </h1>
        <p className="text-sm text-center text-[#6B5A4A] mb-6">
          It only takes a moment
        </p>

        {['name', 'phone', 'email', 'password'].map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(form as any)[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
            className="w-full mb-3 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
        ))}

        <button className="w-full bg-[#E67E22] hover:bg-[#CF6C13] text-white font-semibold py-3 rounded-xl transition mt-2">
          Create Account
        </button>

        <p className="text-xs text-center text-[#6B5A4A] mt-3">
          By continuing, you agree to our Terms & Privacy Policy
        </p>

        <div className="text-center text-sm text-[#6B5A4A] mt-4">
          Already have an account?{' '}
          <a href="/signin" className="text-[#E67E22] font-medium">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
