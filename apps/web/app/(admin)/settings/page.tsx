async function getSetting(key: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/admin/settings/${key}`, { cache: 'no-store' });
  return res.json();
}

export default async function AdminSettingsPage() {
  const showPhone = await getSetting('testimonials.showFullPhone');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">تنظیمات</h1>
      <form action={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/admin/settings/testimonials.showFullPhone`} method="POST">
        <label className="flex items-center gap-2">
          <span>نمایش شماره کامل در رضایت‌نامه‌ها</span>
          <input name="value" defaultValue={JSON.stringify(!!showPhone)} className="border rounded p-1" />
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">ذخیره</button>
      </form>
    </div>
  );
}
