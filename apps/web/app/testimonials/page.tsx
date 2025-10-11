export const dynamic = 'force-dynamic';
async function fetchTestimonials() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/proxy/api/testimonials`, { next: { revalidate: 60 } });
    if (!res.ok) return [] as any[];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function TestimonialsPage() {
  const list = await fetchTestimonials();
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-bold">رضایت مراجعین</h1>
      <div className="space-y-3">
        {(list.length ? list : [
          { id: 'demo', phoneMasked: '09*********', userName: 'کاربر نمونه', message: 'از خدمات بسیار راضی بودم. ممنون از تیم حرفه‌ای.' }
        ]).map((t: any) => (
          <div key={t.id} className="border rounded p-3">
            <div className="text-sm text-gray-500">{t.phoneMasked}</div>
            <div className="font-semibold">{t.userName}</div>
            <p>{t.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
