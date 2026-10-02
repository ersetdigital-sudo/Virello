'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, ApiError } from '../../../services/adminApi';
import { INPUT_H_CLS } from '../../../components/admin/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Masukkan password admin');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await login(password);
      router.replace('/admin');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setError('Password salah');
      else setError(err instanceof Error ? err.message : 'Gagal masuk, coba lagi');
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#e7e7ec] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-8">
        <div className="flex flex-col items-center gap-3 pb-6 text-center">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#6d28d9] text-lg font-bold text-white">
            V
          </div>
          <div>
            <h1 className="text-xl font-bold">Masuk Admin</h1>
            <p className="mt-1 text-sm text-[#5c5c66]">Dashboard pengelolaan Virello</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c5c66]">
              Password admin
            </div>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={INPUT_H_CLS}
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-[#fdecea] px-3 py-2 text-xs font-medium text-[#b23e33]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#6d28d9] text-sm font-semibold text-white transition-colors hover:bg-[#5b21b6] disabled:opacity-50"
          >
            {busy ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
