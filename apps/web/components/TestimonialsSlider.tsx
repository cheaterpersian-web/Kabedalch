"use client";
import { useEffect, useState } from 'react';

export default function TestimonialsSlider() {
  const [items, setItems] = useState<any[]>([]);
  const [i, setI] = useState(0);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/testimonials`)
      .then((r) => r.json()).then(setItems).catch(()=>{});
  }, []);
  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items]);
  if (!items.length) return null;
  const t = items[i];
  return (
    <div className="rounded-xl border bg-white p-4 text-center">
      <div className="text-xs text-gray-500">{t.phoneMasked}</div>
      <div className="font-semibold">{t.userName}</div>
      <p className="text-sm text-gray-700 mt-2">{t.message}</p>
    </div>
  );
}
