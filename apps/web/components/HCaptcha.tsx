"use client";
import Script from 'next/script';

export default function HCaptcha({ sitekey }: { sitekey?: string }) {
  if (!sitekey) return null;
  return (
    <>
      <Script src="https://js.hcaptcha.com/1/api.js" async defer />
      <div className="h-captcha" data-sitekey={sitekey}></div>
    </>
  );
}
