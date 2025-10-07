import './globals.css';
import type { ReactNode } from 'react';
import { Vazirmatn, Inter } from 'next/font/google';
import Seo from '../components/Seo';
import Analytics from '../components/Analytics';
import Header from '../components/Header';
import Footer from '../components/Footer';

const vazir = Vazirmatn({ subsets: ['arabic'], display: 'swap', variable: '--font-fa' });
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-en' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head />
      <body className={`${vazir.variable} ${inter.variable} bg-white text-gray-900`}>
        <Seo />
        <Analytics />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
