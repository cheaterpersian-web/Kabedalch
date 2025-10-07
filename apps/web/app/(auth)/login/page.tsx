"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (!res.ok) { setError('ورود ناموفق بود'); return; }
      const tokens = await res.json();
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      window.location.href = '/';
    } catch {
      setError('اتصال به سرور برقرار نشد');
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h1 className="text-2xl font-bold">ورود</h1>
      <input {...register('email', { required: true })} className="w-full border rounded p-2" placeholder="ایمیل" />
      <input {...register('password', { required: true })} type="password" className="w-full border rounded p-2" placeholder="رمز عبور" />
      {error && <div className="text-red-600">{error}</div>}
      <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">{loading ? 'در حال ورود...' : 'ورود'}</button>
    </form>
  );
}
