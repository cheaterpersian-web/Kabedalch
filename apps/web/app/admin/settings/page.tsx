"use client";
import { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const keys = [
    'testimonials.showFullPhone',
    'telegram.botToken',
    'telegram.adminChatIds',
    'payments.agha.apiKey',
    'payments.callbackBase',
    'sentry.dsn',
    'csrf.enable',
    'analytics.gaId',
    'site.url',
    'hcaptcha.sitekey',
  ];

  const fetchOne = async (key: string, token: string) => {
    let res = await fetch(`/api/proxy/api/admin/settings/${key}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) return null;
      const newToken = localStorage.getItem('accessToken') || '';
      res = await fetch(`/api/proxy/api/admin/settings/${key}`, { headers: { Authorization: `Bearer ${newToken}` } });
    }
    if (!res.ok) return null;
    return res.json();
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('accessToken');
    if (!token) { setError('ابتدا وارد شوید.'); setLoading(false); return; }
    Promise.all(keys.map((k) => fetchOne(k, token)))
      .then((arr) => {
        const next: Record<string, any> = {};
        arr.forEach((v, i) => { next[keys[i]] = v; });
        setValues(next);
      })
      .catch(() => setError('خطا در دریافت تنظیمات.'))
      .finally(() => setLoading(false));
  }, []);

  const save = async (key: string, value: any) => {
    setError(null);
    let token = localStorage.getItem('accessToken');
    if (!token) { setError('ابتدا وارد شوید.'); return; }
    let res = await fetch(`/api/proxy/api/admin/settings/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ value }),
    });
    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) { setError('نشست شما منقضی شده است. دوباره وارد شوید.'); return; }
      token = localStorage.getItem('accessToken');
      res = await fetch(`/api/proxy/api/admin/settings/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value }),
      });
    }
    if (!res.ok) setError('خطا در ذخیره تنظیمات.');
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;
      const res = await fetch('/api/proxy/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const onChange = (k: string, v: any) => setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تنظیمات</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading ? (
        <div className="text-gray-600 text-sm">در حال بارگذاری...</div>
      ) : (
        <>
          <section className="space-y-2">
            <h2 className="font-semibold">رضایت‌نامه‌ها</h2>
            <div className="flex gap-2 items-center">
              <label>نمایش شماره کامل</label>
              <input value={JSON.stringify(!!values['testimonials.showFullPhone'])}
                     onChange={(e)=>onChange('testimonials.showFullPhone', e.target.value)}
                     className="border rounded p-1" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('testimonials.showFullPhone', values['testimonials.showFullPhone'])}>ذخیره</button>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">تلگرام</h2>
            <div className="flex gap-2 items-center">
              <label>Bot Token</label>
              <input value={values['telegram.botToken'] || ''}
                     onChange={(e)=>onChange('telegram.botToken', e.target.value)}
                     className="border rounded p-1 w-96" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('telegram.botToken', values['telegram.botToken'])}>ذخیره</button>
            </div>
            <div className="flex gap-2 items-center">
              <label>Admin Chat IDs (JSON array)</label>
              <input value={JSON.stringify(Array.isArray(values['telegram.adminChatIds']) ? values['telegram.adminChatIds'] : [])}
                     onChange={(e)=>onChange('telegram.adminChatIds', e.target.value)}
                     className="border rounded p-1 w-96" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>{
                        let parsed: any = values['telegram.adminChatIds'];
                        try { parsed = JSON.parse(parsed as any); } catch {}
                        save('telegram.adminChatIds', parsed);
                      }}>ذخیره</button>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">پرداخت (آقای پرداخت)</h2>
            <div className="flex gap-2 items-center">
              <label>API Key</label>
              <input value={values['payments.agha.apiKey'] || ''}
                     onChange={(e)=>onChange('payments.agha.apiKey', e.target.value)}
                     className="border rounded p-1 w-80" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('payments.agha.apiKey', values['payments.agha.apiKey'])}>ذخیره</button>
            </div>
            <div className="flex gap-2 items-center">
              <label>Callback Base</label>
              <input value={values['payments.callbackBase'] || ''}
                     onChange={(e)=>onChange('payments.callbackBase', e.target.value)}
                     className="border rounded p-1 w-80" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('payments.callbackBase', values['payments.callbackBase'])}>ذخیره</button>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">Sentry</h2>
            <div className="flex gap-2 items-center">
              <label>DSN</label>
              <input value={values['sentry.dsn'] || ''}
                     onChange={(e)=>onChange('sentry.dsn', e.target.value)}
                     className="border rounded p-1 w-96" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('sentry.dsn', values['sentry.dsn'])}>ذخیره</button>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">CSRF</h2>
            <div className="flex gap-2 items-center">
              <label>فعال باشد؟</label>
              <input value={JSON.stringify(!!values['csrf.enable'])}
                     onChange={(e)=>onChange('csrf.enable', e.target.value)}
                     className="border rounded p-1" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('csrf.enable', values['csrf.enable'])}>ذخیره</button>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold">آنالیتیکس و سایت</h2>
            <div className="flex gap-2 items-center">
              <label>Google Analytics ID</label>
              <input value={values['analytics.gaId'] || ''}
                     onChange={(e)=>onChange('analytics.gaId', e.target.value)}
                     className="border rounded p-1 w-64" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('analytics.gaId', values['analytics.gaId'])}>ذخیره</button>
            </div>
            <div className="flex gap-2 items-center">
              <label>Site URL</label>
              <input value={values['site.url'] || ''}
                     onChange={(e)=>onChange('site.url', e.target.value)}
                     className="border rounded p-1 w-96" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('site.url', values['site.url'])}>ذخیره</button>
            </div>
            <div className="flex gap-2 items-center">
              <label>HCaptcha Sitekey</label>
              <input value={values['hcaptcha.sitekey'] || ''}
                     onChange={(e)=>onChange('hcaptcha.sitekey', e.target.value)}
                     className="border rounded p-1 w-96" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={()=>save('hcaptcha.sitekey', values['hcaptcha.sitekey'])}>ذخیره</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
