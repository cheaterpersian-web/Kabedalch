async function fetchTemplates() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/tests/templates`, { next: { revalidate: 60 } });
  return res.json();
}

export default async function TestsPage() {
  const templates = await fetchTemplates();
  return (
    <div className="space-y-4 container py-6">
      <h1 className="text-2xl font-bold">تست‌های آنلاین</h1>
      <p className="text-gray-600">با ادامه، با ذخیره‌سازی داده‌های تست موافقت می‌کنید.</p>
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
