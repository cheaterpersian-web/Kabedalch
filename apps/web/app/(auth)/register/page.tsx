"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setError(null);
    setOk(false);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001'}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
      });
      if (!res.ok) { setError('ثبت‌نام ناموفق بود'); return; }
      setOk(true);
    } catch {
      setError('اتصال به سرور برقرار نشد');
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h1 className="text-2xl font-bold">ثبت‌نام</h1>
      <div className="grid grid-cols-2 gap-2">
        <input {...register('name', { required: true })} className="border rounded p-2" placeholder="نام" />
        <input {...register('family', { required: true })} className="border rounded p-2" placeholder="نام خانوادگی" />
      </div>
      <input {...register('phone', { required: true })} className="w-full border rounded p-2" placeholder="تلفن" />
      <input {...register('email', { required: true })} className="w-full border rounded p-2" placeholder="ایمیل" />
      <input {...register('password', { required: true })} type="password" className="w-full border rounded p-2" placeholder="رمز عبور" />
      {ok && <div className="text-green-600">ثبت شد. حالا وارد شوید.</div>}
      {error && <div className="text-red-600">{error}</div>}
      <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">{loading ? 'در حال ارسال...' : 'ثبت‌نام'}</button>
    </form>
  );
}
