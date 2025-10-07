import Script from 'next/script';

export default function GA() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <Script id="ga-init">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
