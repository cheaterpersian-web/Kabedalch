import './globals.css';
import type { ReactNode } from 'react';
import { Vazirmatn } from 'next/font/google';
import Seo from '../components/Seo';
import GA from '../components/GA';

const vazir = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazir' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head />
      <body className={`${vazir.variable} font-vazir bg-white text-gray-900`}>
        <Seo />
        <GA />
        <header className="border-b">
          <nav className="container py-3 flex gap-4">
            <a href="/" className="font-bold">خانه</a>
            <a href="/tests">تست‌ها</a>
            <a href="/packages">پکیج‌ها</a>
            <a href="/testimonials">رضایت مراجعین</a>
            <a href="/consultation">مشاوره</a>
            <span className="ml-auto" />
            <a href="/login">ورود</a>
            <a href="/register">ثبت‌نام</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
