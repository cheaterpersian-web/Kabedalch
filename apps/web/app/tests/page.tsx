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
  return (
    <div className="space-y-4 container py-6">
      <h1 className="text-2xl font-bold">تست‌های آنلاین</h1>
      <p className="text-gray-600">با ادامه، با ذخیره‌سازی داده‌های تست موافقت می‌کنید.</p>
      {firstId && (
        <div>
          <a href={`/tests/${firstId}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded">ادامه</a>
        </div>
      )}
      <ul className="list-disc pr-6">
        {templates.map((t: any) => (
          <li key={t.id}>
            <a href={`/tests/${t.id}`} className="text-blue-600 underline">{t.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
