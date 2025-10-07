export const dynamic = 'force-dynamic';
async function fetchTestimonials() {
  const env: any = process.env;
  const base = env.API_INTERNAL_URL || env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  const res = await fetch(`${base}/api/testimonials`, { next: { revalidate: 60 } });
  return res.json();
}

export default async function TestimonialsPage() {
  const list = await fetchTestimonials();
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-bold">رضایت مراجعین</h1>
      <div className="space-y-3">
        {list.map((t: any) => (
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
