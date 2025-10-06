async function fetchPackages() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/packages`, { next: { revalidate: 60 } });
  return res.json();
}

export default async function PackagesPage() {
  const packages = await fetchPackages();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {packages.map((p: any) => (
        <div key={p.id} className="border rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-lg">{p.title}</h3>
          <p className="text-sm text-gray-600">{p.description}</p>
          <div className="text-primary font-semibold">{p.priceIRR.toLocaleString('fa-IR')} تومان</div>
          <a href={`/packages/${p.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded">مشاهده</a>
        </div>
      ))}
    </div>
  );
}
