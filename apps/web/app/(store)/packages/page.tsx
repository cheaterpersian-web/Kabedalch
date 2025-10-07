async function fetchPackages() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/packages`, { next: { revalidate: 60 } });
  return res.json();
}

export const dynamic = 'force-dynamic';
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
      <form className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input name="q" placeholder="جستجو" className="border rounded p-3" />
        <input name="max" placeholder="حداکثر قیمت" className="border rounded p-3" />
        <button className="bg-gray-900 text-white px-4 py-3 rounded">فیلتر</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((p: any) => (
          <div key={p.id} className="rounded-xl border shadow-sm overflow-hidden bg-white">
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{p.description}</p>
              <div className="text-primary font-semibold">{p.priceIRR.toLocaleString('fa-IR')} تومان</div>
            </div>
            <div className="p-4 pt-0">
              <a href={`/packages/${p.id}`} className="inline-block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg">مشاهده</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
