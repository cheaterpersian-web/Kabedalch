"use client";
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [pkgId, setPkgId] = useState<string | null>(null);
  const [payUrl, setPayUrl] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('cart:packageId');
    setPkgId(id);
  }, []);

  async function checkout() {
    if (!pkgId) return;
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packageId: pkgId })
    });
    const d = await r.json();
    setPayUrl(d.payment_url);
  }

  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-bold">سبد خرید</h1>
      <div>پکیج انتخاب‌شده: {pkgId || 'هیچ'}</div>
      <button onClick={checkout} className="bg-green-600 text-white px-4 py-2 rounded">پرداخت</button>
      {payUrl && <a href={payUrl} className="text-blue-600 underline">انتقال به درگاه</a>}
    </div>
  );
}
