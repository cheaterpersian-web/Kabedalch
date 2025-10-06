async function fetchPackage(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/packages/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function PackageDetail({ params }: { params: { id: string } }) {
  const p = await fetchPackage(params.id);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{p.title}</h1>
      <p>{p.description}</p>
      <div className="text-primary">{p.priceIRR?.toLocaleString('fa-IR')} تومان</div>
      <form action="/cart" method="GET" className="space-x-2" onSubmit={(e)=>{ if (typeof window!== 'undefined'){ localStorage.setItem('cart:packageId', p.id); } }}>
        <button className="bg-green-600 text-white px-4 py-2 rounded">افزودن به سبد و ادامه</button>
      </form>
    </div>
  );
}
