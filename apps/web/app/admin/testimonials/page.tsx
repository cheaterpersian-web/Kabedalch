"use client";
import { useEffect, useState } from 'react';

export default function AdminTestimonialsPage() {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { setError('ابتدا وارد شوید.'); setList([]); return; }
      const res = await fetch(`/api/proxy/api/admin/testimonials/pending`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        setError(res.status === 401 ? 'ابتدا وارد شوید.' : 'خطا در دریافت لیست رضایت‌نامه‌ها.');
        setList([]);
        return;
      }
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
      if (!Array.isArray(data)) setError('خطا در دریافت لیست رضایت‌نامه‌ها.');
    } catch {
      setError('خطا در دریافت لیست رضایت‌نامه‌ها.');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const approve = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { setError('ابتدا وارد شوید.'); return; }
      const res = await fetch(`/api/proxy/api/admin/testimonials/${id}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        setError('خطا در تایید رضایت‌نامه.');
        return;
      }
      setList((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setError('خطا در تایید رضایت‌نامه.');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">تایید رضایت‌نامه‌ها</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading ? (
        <div className="text-gray-600 text-sm">در حال بارگذاری...</div>
      ) : (
        <div className="space-y-3">
          {list.map((t: any) => (
            <div key={t.id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{t.userName} — {t.phoneMasked}</div>
                <div>{t.message}</div>
              </div>
              <button onClick={() => approve(t.id)} className="bg-green-600 text-white px-3 py-1 rounded">تایید</button>
            </div>
          ))}
          {!list.length && !error && <div className="text-gray-600">موردی برای تایید وجود ندارد.</div>}
        </div>
      )}
    </div>
  );
}
