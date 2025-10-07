import Head from 'next/head';

export default function Seo({ title, description }: { title?: string; description?: string }) {
  const t = title ? `${title} | مرکز کبد چرب و ترک الکل` : 'مرکز کبد چرب و ترک الکل';
  return (
    <Head>
      <title>{t}</title>
      <meta name="description" content={description || 'تست‌های آنلاین، پکیج‌های درمانی، و مشاوره تخصصی'} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="robots" content="index,follow" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Organization', name: 'مرکز کبد چرب و ترک الکل'
      }) }} />
    </Head>
  );
}
