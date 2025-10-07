"use client";
import { useState } from 'react';
import HCaptcha from '../../components/HCaptcha';

export default function ConsultationPage() {
  const [state, setState] = useState<'idle'|'submitting'|'success'|'error'>('idle');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState('submitting');
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001'}/api/consultations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('fail');
      setState('success');
      e.currentTarget.reset();
    } catch {
      setState('error');
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">درخواست مشاوره</h1>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <input name="name" required className="w-full border rounded p-2" placeholder="نام" />
        <input name="phone" required className="w-full border rounded p-2" placeholder="تلفن" />
        <input name="email" className="w-full border rounded p-2" placeholder="ایمیل" />
        <textarea name="description" required className="w-full border rounded p-2" placeholder="توضیحات" />
        <HCaptcha sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY} />
        <button disabled={state==='submitting'} className="bg-blue-600 text-white px-4 py-2 rounded">ارسال</button>
        {state==='success' && <div className="text-green-600">ارسال شد</div>}
        {state==='error' && <div className="text-red-600">خطا در ارسال</div>}
      </form>
    </div>
  );
}
