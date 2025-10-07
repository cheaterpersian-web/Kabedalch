async function getOrders() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/admin/orders`, { cache: 'no-store' });
  return res.json();
}

export const dynamic = 'force-static';
export default async function AdminOrdersPage() {
  const list = await getOrders();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">سفارش‌ها</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2">کاربر</th>
            <th className="p-2">پکیج</th>
            <th className="p-2">مبلغ</th>
            <th className="p-2">وضعیت</th>
          </tr>
        </thead>
        <tbody>
          {list.map((o: any) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.userId}</td>
              <td className="p-2">{o.packageId}</td>
              <td className="p-2">{o.amountIRR?.toLocaleString('fa-IR')}</td>
              <td className="p-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
