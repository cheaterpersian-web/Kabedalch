async function getPending() {
  const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  const res = await fetch(`${base}/api/admin/testimonials/pending`, { cache: 'no-store' });
  return res.json();
}

export const dynamic = 'force-dynamic';
export default async function AdminTestimonialsPage() {
  const list = await getPending();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">تایید رضایت‌نامه‌ها</h1>
      <div className="space-y-3">
        {list.map((t: any) => (
          <div key={t.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">{t.userName} — {t.phoneMasked}</div>
              <div>{t.message}</div>
            </div>
            <form action={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001'}/api/admin/testimonials/${t.id}/approve`} method="POST">
              <button className="bg-green-600 text-white px-3 py-1 rounded">تایید</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
