"use client";
import { useEffect, useState } from 'react';

export default function TestimonialsSlider() {
  const [items, setItems] = useState<any[]>([]);
  const [i, setI] = useState(0);
  useEffect(() => {
    fetch(`/api/proxy/api/testimonials`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(()=>{});
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
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
        {t.imageBeforeUrl && <img src={t.imageBeforeUrl} alt="before" className="rounded border mx-auto" />}
        {t.imageAfterUrl && <img src={t.imageAfterUrl} alt="after" className="rounded border mx-auto" />}
        {t.videoUrl && <video src={t.videoUrl} controls className="rounded border mx-auto" />}
      </div>
    </div>
  );
}
