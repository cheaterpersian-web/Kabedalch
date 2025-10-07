async function fetchCms(path: string) {
  const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  try {
    const res = await fetch(`${base}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminCMSPage() {
  const [pages, faqs, sliders] = await Promise.all([
    fetchCms('/api/admin/cms/pages'),
    fetchCms('/api/admin/cms/faqs'),
    fetchCms('/api/admin/cms/sliders'),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CMS سبک</h1>
      <section>
        <h2 className="font-semibold mb-2">صفحات</h2>
        <ul className="list-disc pr-5 text-sm">
          {pages.map((p: any) => (<li key={p.id}>{p.title} — /{p.slug}</li>))}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2">FAQ</h2>
        <ul className="list-disc pr-5 text-sm">
          {faqs.map((f: any) => (<li key={f.id}>{f.question}</li>))}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2">اسلایدرها</h2>
        <ul className="list-disc pr-5 text-sm">
          {sliders.map((s: any) => (<li key={s.id}>{s.title}</li>))}
        </ul>
      </section>
    </div>
  );
}
