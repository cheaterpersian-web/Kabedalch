"use client";
import { useState } from 'react';

export default function SubmitTestimonialPage() {
  const [state, setState] = useState<'idle'|'up'|'done'|'err'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState('up');
    let beforeUrl: string | undefined, afterUrl: string | undefined;
    for (const key of ['before','after'] as const) {
      const file = fd.get(key) as File | null;
      if (file && file.size) {
        const up = new FormData();
        up.append('file', file);
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/uploads`, { method: 'POST', body: up });
        const data = await r.json();
        if (key==='before') beforeUrl = data.url; else afterUrl = data.url;
      }
    }
    const payload = {
      userName: fd.get('userName') as string,
      phone: fd.get('phone') as string,
      message: fd.get('message') as string,
      imageBeforeUrl: beforeUrl,
      imageAfterUrl: afterUrl,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/testimonials`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    setState(res.ok ? 'done' : 'err');
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">ارسال رضایت‌نامه</h1>
      <form onSubmit={onSubmit} className="space-y-3 max-w-md">
        <input name="userName" className="w-full border rounded p-2" placeholder="نام" required />
        <input name="phone" className="w-full border rounded p-2" placeholder="تلفن" required />
        <textarea name="message" className="w-full border rounded p-2" placeholder="پیام" required />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">تصویر قبل</label>
            <input type="file" name="before" accept="image/*" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">تصویر بعد</label>
            <input type="file" name="after" accept="image/*" />
          </div>
        </div>
        <button disabled={state==='up'} className="bg-blue-600 text-white px-4 py-2 rounded">ارسال</button>
        {state==='done' && <div className="text-green-600">ثبت شد، پس از تایید نمایش داده می‌شود.</div>}
        {state==='err' && <div className="text-red-600">خطا در ارسال</div>}
      </form>
    </div>
  );
}
