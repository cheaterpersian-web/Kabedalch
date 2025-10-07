'use client';
export const dynamic = 'force-dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const params = useSearchParams();
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    const packageId = params.get('packageId');
    if (!packageId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId }),
    })
      .then((r) => r.json())
      .then((d) => setRedirect(d.payment_url))
      .catch(() => {});
  }, [params]);

  return (
    <div className="container py-8">
      <h1 className="text-xl font-bold mb-4">در حال انتقال به درگاه پرداخت...</h1>
      {redirect ? (
        <a className="text-blue-600 underline" href={redirect}>اگر منتقل نشدید، اینجا کلیک کنید</a>
      ) : (
        <p className="text-gray-600">لطفاً صبر کنید</p>
      )}
    </div>
  );
}
