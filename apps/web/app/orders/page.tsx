async function fetchOrders() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  // TODO: attach token from cookies/localStorage in client-side variant
  const res = await fetch(`${base}/api/orders`, { cache: 'no-store' });
  return res.json();
}

export default async function OrdersPage() {
  const orders = await fetchOrders();
  return (
    <div className="container px-3 py-8">
      <h1 className="text-2xl font-bold mb-4">سفارش‌های من</h1>
      <div className="text-sm text-gray-600">برای نسخه واقعی، احراز هویت و دریافت سفارش‌های کاربر لازم است.</div>
      <pre className="mt-4 p-3 rounded bg-gray-50 overflow-auto">{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
}
