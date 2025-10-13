"use client";
import { useEffect, useState } from 'react';

export default function AdminTestimonialsPage() {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

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

  const remove = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { setError('ابتدا وارد شوید.'); return; }
      const res = await fetch(`/api/proxy/api/admin/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        setError('خطا در حذف رضایت‌نامه.');
        return;
      }
      setList((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setError('خطا در حذف رضایت‌نامه.');
    }
  };

  const create = async (e: any) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { setError('ابتدا وارد شوید.'); return; }
      const fd = new FormData(e.currentTarget);
      const uploadOne = async (file: File | null): Promise<string | undefined> => {
        if (!file || !file.size) return undefined;
        const up = new FormData();
        up.append('file', file);
        const r = await fetch(`/api/proxy/api/uploads`, { method: 'POST', body: up, headers: { Authorization: `Bearer ${token}` } });
        if (!r.ok) return undefined;
        const d = await r.json();
        return d?.url as string | undefined;
      };
      const beforeUrl = await uploadOne(fd.get('before') as any as File);
      const afterUrl = await uploadOne(fd.get('after') as any as File);
      const videoUrl = await uploadOne(fd.get('video') as any as File);
      const payload = {
        userName: fd.get('userName') as string,
        phoneMasked: fd.get('phoneMasked') as string,
        message: fd.get('message') as string,
        imageBeforeUrl: beforeUrl,
        imageAfterUrl: afterUrl,
        videoUrl,
      };
      const res = await fetch(`/api/proxy/api/admin/testimonials`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (!res.ok) { setError('خطا در ایجاد رضایت‌نامه.'); return; }
      e.target.reset();
      await fetchList();
    } catch {
      setError('خطا در ایجاد رضایت‌نامه.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">تایید رضایت‌نامه‌ها</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <form onSubmit={create} className="border rounded p-3 space-y-2">
        <div className="font-semibold">افزودن رضایت‌نامه جدید</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input name="userName" className="border rounded p-2" placeholder="نام" required />
          <input name="phoneMasked" className="border rounded p-2" placeholder="شماره (ماسک‌شده)" required />
        </div>
        <textarea name="message" className="border rounded p-2 w-full" placeholder="متن رضایت" required />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">تصویر قبل</label>
            <input type="file" name="before" accept="image/*" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">تصویر بعد</label>
            <input type="file" name="after" accept="image/*" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">ویدیو</label>
            <input type="file" name="video" accept="video/*" />
          </div>
        </div>
        <button disabled={creating} className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60">{creating ? 'در حال ایجاد...' : 'ایجاد'}</button>
      </form>
      {loading ? (
        <div className="text-gray-600 text-sm">در حال بارگذاری...</div>
      ) : (
        <div className="space-y-3">
          {list.map((t: any) => (
            <div key={t.id} className="border rounded p-3 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{t.userName} — {t.phoneMasked}</div>
                  <div>{t.message}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(t.id)} className="bg-green-600 text-white px-3 py-1 rounded">تایید</button>
                  <button onClick={() => remove(t.id)} className="bg-red-600 text-white px-3 py-1 rounded">حذف</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {t.imageBeforeUrl && <img src={t.imageBeforeUrl} alt="before" className="rounded border" />}
                {t.imageAfterUrl && <img src={t.imageAfterUrl} alt="after" className="rounded border" />}
                {t.videoUrl && <video src={t.videoUrl} controls className="rounded border" />}
              </div>
            </div>
          ))}
          {!list.length && !error && <div className="text-gray-600">موردی برای تایید وجود ندارد.</div>}
        </div>
      )}
    </div>
  );
}
