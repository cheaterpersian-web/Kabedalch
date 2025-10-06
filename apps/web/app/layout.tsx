import './globals.css';
import type { ReactNode } from 'react';
import { Vazirmatn } from 'next/font/google';

const vazir = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazir' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} font-vazir bg-white text-gray-900`}>{children}</body>
    </html>
  );
}
