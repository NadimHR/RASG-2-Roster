import React, { useState } from 'react';
import { Lock } from 'lucide-react';

// ইউজার নেম ও পাসওয়ার্ডের SHA-256 হ্যাশ (সরাসরি পাসওয়ার্ড কোডে রাখা হয়নি)
const ADMIN_HASH = 'dc693e30c72a73b80869627f4b2d9b4b7e183d065e1b6d14d4de4da43e7d5ad9';
export const ADMIN_SESSION_KEY = 'rasg2_admin_session_v1';

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function readAdminSession(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_HASH;
  } catch {
    return false;
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // ignore
  }
}

export const AdminLogin: React.FC<{ onSuccess: () => void; featureBn: string }> = ({ onSuccess, featureBn }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const h = await sha256(`${user.trim()}:${pass}`);
    if (h === ADMIN_HASH) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, h);
      } catch {
        // ignore
      }
      setError('');
      onSuccess();
    } else {
      setError('ইউজার নেম বা পাসওয়ার্ড সঠিক নয়।');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border-2 border-black p-6 mt-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
        <Lock className="w-5 h-5" /> অ্যাডমিন লগইন প্রয়োজন
      </h2>
      <p className="text-sm text-neutral-700 mb-4">“{featureBn}” শুধু অ্যাডমিন ব্যবহার করতে পারবেন।</p>
      <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm font-semibold">
          ইউজার নেম
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            className="block w-full border border-black px-2 py-1.5 mt-1"
          />
        </label>
        <label className="block text-sm font-semibold">
          পাসওয়ার্ড
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
            className="block w-full border border-black px-2 py-1.5 mt-1"
          />
        </label>
        {error && <div className="text-sm font-bold border border-black p-2">{error}</div>}
        <button type="submit" className="w-full px-4 py-2 bg-black text-white font-bold cursor-pointer">
          লগইন
        </button>
      </form>
    </div>
  );
};
