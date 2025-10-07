import Head from 'next/head';

export default function Seo({ title, description }: { title?: string; description?: string }) {
  const t = title ? `${title} | مرکز کبد چرب و ترک الکل` : 'مرکز کبد چرب و ترک الکل';
  const api = process.env.NEXT_PUBLIC_API_BASE_URL;
  let apiOrigin: string | null = null;
  try {
    if (api) apiOrigin = new URL(api).origin;
  } catch {}
  return (
    <Head>
      <title>{t}</title>
      <meta name="description" content={description || 'تست‌های آنلاین، پکیج‌های درمانی، و مشاوره تخصصی'} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#0ea5e9" />
      {apiOrigin && <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" />}
      {apiOrigin && <link rel="dns-prefetch" href={apiOrigin} />}
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://js.hcaptcha.com" crossOrigin="anonymous" />
      <meta name="robots" content="index,follow" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Organization', name: 'مرکز کبد چرب و ترک الکل'
      }) }} />
    </Head>
  );
}
