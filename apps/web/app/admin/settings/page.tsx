async function getSetting(key: string) {
  const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/admin/settings/${key}`, { cache: 'no-store' });
  return res.json();
}

export default async function AdminSettingsPage() {
  const [showPhone, aghaKey, callbackBase, sentryDsn, csrfEnable, gaId, siteUrl, hcaptcha] = await Promise.all([
    getSetting('testimonials.showFullPhone'),
    getSetting('payments.agha.apiKey'),
    getSetting('payments.callbackBase'),
    getSetting('sentry.dsn'),
    getSetting('csrf.enable'),
    getSetting('analytics.gaId'),
    getSetting('site.url'),
    getSetting('hcaptcha.sitekey'),
  ]);
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تنظیمات</h1>

      <section className="space-y-2">
        <h2 className="font-semibold">رضایت‌نامه‌ها</h2>
        <form action={`${api}/api/admin/settings/testimonials.showFullPhone`} method="POST" className="flex gap-2 items-center">
          <label>نمایش شماره کامل</label>
          <input name="value" defaultValue={JSON.stringify(!!showPhone)} className="border rounded p-1" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">ذخیره</button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">پرداخت (آقای پرداخت)</h2>
        <form action={`${api}/api/admin/settings/payments.agha.apiKey`} method="POST" className="flex gap-2 items-center">
          <label>API Key</label>
          <input name="value" defaultValue={aghaKey || ''} className="border rounded p-1 w-80" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">ذخیره</button>
        </form>
        <form action={`${api}/api/admin/settings/payments.callbackBase`} method="POST" className="flex gap-2 items-center">
          <label>Callback Base</label>
          <input name="value" defaultValue={callbackBase || ''} className="border rounded p-1 w-80" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">ذخیره</button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Sentry</h2>
        <form action={`${api}/api/admin/settings/sentry.dsn`} method="POST" className="flex gap-2 items-center">
          <label>DSN</label>
          <input name="value" defaultValue={sentryDsn || ''} className="border rounded p-1 w-96" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">ذخیره</button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">CSRF</h2>
        <form action={`${api}/api/admin/settings/csrf.enable`} method="POST" className="flex gap-2 items-center">
          <label>فعال باشد؟</label>
          <input name="value" defaultValue={JSON.stringify(!!csrfEnable)} className="border rounded p-1" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">ذخیره</button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">آنالیتیکس و سایت</h2>
        <form action={`${api}/api/admin/settings/analytics.gaId`} method="POST" className="flex gap-2 items-center">
          <label>Google Analytics ID</label>
          <input name="value" defaultValue={gaId || ''} className="border rounded p-1 w-64" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">ذخیره</button>
        </form>
        <form action={`${api}/api/admin/settings/site.url`} method="POST" className="flex gap-2 items-center">
          <label>Site URL</label>
          <input name="value" defaultValue={siteUrl || ''} className="border rounded p-1 w-96" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">ذخیره</button>
        </form>
        <form action={`${api}/api/admin/settings/hcaptcha.sitekey`} method="POST" className="flex gap-2 items-center">
          <label>HCaptcha Sitekey</label>
          <input name="value" defaultValue={hcaptcha || ''} className="border rounded p-1 w-96" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">ذخیره</button>
        </form>
      </section>
    </div>
  );
}
