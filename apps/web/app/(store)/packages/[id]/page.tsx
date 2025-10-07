import Image from 'next/image';
export const dynamic = 'force-dynamic';
async function fetchPackage(id: string) {
  const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  const res = await fetch(`${base}/api/packages/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function PackageDetail({ params }: { params: { id: string } }) {
  const p = await fetchPackage(params.id);
  return (
    <div className="space-y-4 px-3">
      <Image src={`https://picsum.photos/seed/${p.id}/800/400`} alt="" width={800} height={400} className="w-full h-auto rounded-xl" priority={false} />
      <h1 className="text-xl md:text-2xl font-bold">{p.title}</h1>
      <p className="text-gray-700 leading-7 text-sm md:text-base">{p.description}</p>
      <div className="text-primary font-semibold">{p.priceIRR?.toLocaleString('fa-IR')} تومان</div>
      <form action="/cart" method="GET" className="space-x-2" onSubmit={(e)=>{ if (typeof window!== 'undefined'){ localStorage.setItem('cart:packageId', p.id); } }}>
        <button className="bg-green-600 text-white px-4 py-3 rounded w-full md:w-auto">افزودن به سبد و ادامه</button>
      </form>
    </div>
  );
}
