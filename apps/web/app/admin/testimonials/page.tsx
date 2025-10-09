async function getPending() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/proxy/api/admin/testimonials/pending`, { cache: 'no-store' as any });
    if (!res.ok) return { error: `status_${res.status}`, list: [] } as any;
    const data = await res.json();
    return { list: Array.isArray(data) ? data : [], error: Array.isArray(data) ? undefined : 'invalid_data' } as any;
  } catch {
    return { error: 'network_error', list: [] } as any;
  }
}

export const dynamic = 'force-dynamic';
export default async function AdminTestimonialsPage() {
  const { list, error } = await getPending() as any;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">تایید رضایت‌نامه‌ها</h1>
      {error && (
        <div className="text-sm text-red-600">
          {error === 'status_401' ? 'ابتدا وارد شوید.' : 'خطا در دریافت لیست رضایت‌نامه‌ها.'}
        </div>
      )}
      <div className="space-y-3">
        {(Array.isArray(list) ? list : []).map((t: any) => (
          <div key={t.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-semibold">{t.userName} — {t.phoneMasked}</div>
              <div>{t.message}</div>
            </div>
            <form action={`/api/proxy/api/admin/testimonials/${t.id}/approve`} method="POST">
              <button className="bg-green-600 text-white px-3 py-1 rounded">تایید</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
