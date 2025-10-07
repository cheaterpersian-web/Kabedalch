async function fetchPackages() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/packages`, { next: { revalidate: 60 } });
  return res.json();
}

export default async function PackagesPage({ searchParams }: { searchParams?: { q?: string; max?: string } }) {
  const packages = await fetchPackages();
  const q = searchParams?.q?.toLowerCase() || '';
  const max = Number(searchParams?.max) || Infinity;
  const filtered = packages.filter((p: any) =>
    (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
    (!isFinite(max) || p.priceIRR <= max)
  );
  return (
    <div className="space-y-4">
      <form className="flex gap-2">
        <input name="q" placeholder="جستجو" className="border rounded p-2" />
        <input name="max" placeholder="حداکثر قیمت" className="border rounded p-2" />
        <button className="bg-gray-800 text-white px-4 py-2 rounded">فیلتر</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((p: any) => (
          <div key={p.id} className="border rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-lg">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            <div className="text-primary font-semibold">{p.priceIRR.toLocaleString('fa-IR')} تومان</div>
            <a href={`/packages/${p.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded">مشاهده</a>
          </div>
        ))}
      </div>
    </div>
  );
}
