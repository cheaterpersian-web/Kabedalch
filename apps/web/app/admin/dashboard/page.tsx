async function fetchDashboard() {
  const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  try {
    const res = await fetch(`${base}/api/admin/dashboard`, { cache: 'no-store' });
    if (!res.ok) return { users: 0, orders: 0, tests: 0, messages: 0 };
    return res.json();
  } catch {
    return { users: 0, orders: 0, tests: 0, messages: 0 };
  }
}

export const dynamic = 'force-dynamic';
export default async function AdminDashboard() {
  const d = await fetchDashboard();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'کاربران', value: d.users },
        { label: 'سفارشات', value: d.orders },
        { label: 'تست‌ها', value: d.tests },
        { label: 'پیام‌ها', value: d.messages },
      ].map((c) => (
        <div key={c.label} className="border rounded p-4 text-center">
          <div className="text-sm text-gray-600">{c.label}</div>
          <div className="text-2xl font-bold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
