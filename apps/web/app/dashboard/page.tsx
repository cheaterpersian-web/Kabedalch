export const dynamic = 'force-dynamic';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, { cache: 'no-store', headers: headersWithAuth() } as any);
  if (!res.ok) throw new Error('failed');
  return res.json();
}

function headersWithAuth() {
  if (typeof window === 'undefined') return {} as any;
  const token = localStorage.getItem('accessToken');
  const h = new Headers();
  if (token) h.set('Authorization', `Bearer ${token}`);
  return h as any;
}

export default async function DashboardPage() {
  // This page is client-hydrated due to localStorage; do a simple client redirect if not authed.
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">داشبورد من</h1>
      <section>
        <h2 className="font-semibold mb-2">اطلاعات کاربری</h2>
        <ProfileBlock />
      </section>
      <section>
        <h2 className="font-semibold mb-2">سفارش‌ها</h2>
        <OrdersBlock />
      </section>
      <section>
        <h2 className="font-semibold mb-2">نتایج تست</h2>
        <TestsBlock />
      </section>
    </div>
  );
}

"use client";
import { useEffect, useState } from 'react';

function useAuthFetch<T>(path: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    fetch(`/api/proxy${path}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : fallback as any))
      .then(setData)
      .catch(() => setData(fallback));
  }, [path]);
  return data;
}

function ProfileBlock() {
  const me = useAuthFetch<{ id: string; name: string; family: string; email: string; phone: string; address?: string } | null>(
    '/api/users/me', null,
  );
  const [form, setForm] = useState<any | null>(null);
  useEffect(() => { if (me) setForm(me); }, [me]);
  if (!me) return <div>ابتدا وارد شوید.</div>;
  const save = async () => {
    const token = localStorage.getItem('accessToken');
    await fetch('/api/proxy/api/users/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: form.name, family: form.family, phone: form.phone, address: form.address }) });
    alert('ذخیره شد');
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input value={form?.name||''} onChange={(e)=>setForm({ ...form, name: e.target.value })} className="border rounded p-2" placeholder="نام" />
        <input value={form?.family||''} onChange={(e)=>setForm({ ...form, family: e.target.value })} className="border rounded p-2" placeholder="نام خانوادگی" />
        <input value={form?.phone||''} onChange={(e)=>setForm({ ...form, phone: e.target.value })} className="border rounded p-2" placeholder="تلفن" />
        <input value={form?.address||''} onChange={(e)=>setForm({ ...form, address: e.target.value })} className="border rounded p-2" placeholder="آدرس" />
      </div>
      <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">ذخیره</button>
    </div>
  );
}

function OrdersBlock() {
  const list = useAuthFetch<any[]>('/api/users/me/orders', []);
  if (!list.length) return <div className="text-gray-600">سفارشی وجود ندارد.</div>;
  return (
    <div className="space-y-2">
      {list.map((o) => (
        <div key={o.id} className="border rounded p-3 flex justify-between">
          <div>
            <div className="font-semibold">{o.package?.title}</div>
            <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString('fa-IR')}</div>
          </div>
          <div className="text-gray-800">{o.amountIRR?.toLocaleString('fa-IR')} تومان</div>
        </div>
      ))}
    </div>
  );
}

function TestsBlock() {
  const list = useAuthFetch<any[]>('/api/users/me/tests', []);
  if (!list.length) return <div className="text-gray-600">نتیجه‌ای وجود ندارد.</div>;
  return (
    <div className="space-y-2">
      {list.map((t) => (
        <div key={t.id} className="border rounded p-3">
          <div className="font-semibold">{t.test?.name}</div>
          <div>نمره: {t.score} — تفسیر: {t.grade}</div>
        </div>
      ))}
    </div>
  );
}

