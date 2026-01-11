import React, { useState } from 'react';

export default function UserSignIn() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-center mb-1">Welcome back 👋</h1>
        <p className="text-sm text-center text-[#6B5A4A] mb-6">
          Sign in to continue
        </p>

        <input
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          placeholder="Email or Phone"
          className="w-full mb-3 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#E67E22]"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#E67E22]"
        />

        <button className="w-full bg-[#E67E22] hover:bg-[#CF6C13] text-white font-semibold py-3 rounded-xl transition">
          Sign In
        </button>

        <div className="text-center text-sm text-[#6B5A4A] mt-4">
          New here?{' '}
          <a href="/signup" className="text-[#E67E22] font-medium">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}
