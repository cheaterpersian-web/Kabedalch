"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
  };
  if (typeof window !== 'undefined') {
    const has = !!localStorage.getItem('accessToken');
    if (has !== authed) setAuthed(has);
  }
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <nav className="container px-3 py-3 flex items-center gap-3">
        <Link href="/" className="font-bold text-lg">مرکز کبد چرب و ترک الکل</Link>
        <div className="ml-auto hidden md:flex items-center gap-4 text-sm">
          <Link href="/tests">تست‌ها</Link>
          <Link href="/packages">پکیج‌ها</Link>
          <Link href="/testimonials">رضایت مراجعین</Link>
          <Link href="/consultation">مشاوره</Link>
          <Link href="/blog">بلاگ</Link>
          <Link href="/cart" className="rounded bg-gray-900 text-white px-3 py-1.5">سبد خرید</Link>
          {authed ? (
            <>
              <Link href="/dashboard" className="text-gray-600">داشبورد</Link>
              <button onClick={logout} className="rounded border px-3 py-1.5">خروج</button>
            </>
          ) : (
            <>
              <Link href="/login">ورود</Link>
              <Link href="/register" className="rounded border px-3 py-1.5">ثبت‌نام</Link>
            </>
          )}
        </div>
        <button aria-label="menu" onClick={()=>setOpen(!open)} className="md:hidden ml-auto rounded border px-3 py-1.5">منو</button>
      </nav>
      {open && (
        <div className="md:hidden border-t">
          <div className="container px-3 py-3 grid gap-2 text-sm">
            <Link href="/tests" className="py-2">تست‌ها</Link>
            <Link href="/packages" className="py-2">پکیج‌ها</Link>
            <Link href="/testimonials" className="py-2">رضایت مراجعین</Link>
            <Link href="/consultation" className="py-2">مشاوره</Link>
            <Link href="/blog" className="py-2">بلاگ</Link>
            <Link href="/cart" className="py-2">سبد خرید</Link>
            {authed ? (
              <>
                <Link href="/dashboard" className="py-2">داشبورد</Link>
                <button onClick={logout} className="text-right py-2">خروج</button>
              </>
            ) : (
              <>
                <Link href="/login" className="py-2">ورود</Link>
                <Link href="/register" className="py-2">ثبت‌نام</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
