async function getPackages() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  const res = await fetch(`${base}/api/admin/packages`, { cache: 'no-store' });
  return res.json();
}

export const dynamic = 'force-dynamic';
export default async function AdminPackagesPage() {
  const list = await getPackages();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">مدیریت پکیج‌ها</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2">عنوان</th>
            <th className="p-2">قیمت</th>
            <th className="p-2">مدت</th>
            <th className="p-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p: any) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.priceIRR?.toLocaleString('fa-IR')}</td>
              <td className="p-2">{p.durationDays} روز</td>
              <td className="p-2"><a href={`./packages/${p.id}`} className="text-blue-600 underline">ویرایش</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
