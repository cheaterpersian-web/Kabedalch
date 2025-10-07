export const dynamic = 'force-dynamic';
async function fetchTemplates() {
  const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  try {
    const res = await fetch(`${base}/api/tests/templates`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TestsPage() {
  const templates = await fetchTemplates();
  const firstId = (templates[0] as any)?.id as string | undefined;
  const fallbackFirst = firstId || 'liver-template';
  return (
    <div className="space-y-4 container py-6">
      <h1 className="text-2xl font-bold">تست‌های آنلاین</h1>
      <p className="text-gray-600">با ادامه، با ذخیره‌سازی داده‌های تست موافقت می‌کنید.</p>
      <div>
        <a href={`/tests/${fallbackFirst}`} className="inline-block bg-green-600 text-white px-4 py-2 rounded">ادامه</a>
      </div>
      <div className="space-y-2">
        {templates.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between border rounded p-3">
            <div className="text-sm md:text-base">{t.name}</div>
            <a href={`/tests/${t.id}`} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">شروع</a>
          </div>
        ))}
        {!templates.length && (
          <div className="flex items-center gap-2">
            <a href="/tests/liver-template" className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">شروع کبد چرب</a>
            <a href="/tests/alcohol-template" className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">شروع ترک الکل</a>
          </div>
        )}
      </div>
    </div>
  );
}
