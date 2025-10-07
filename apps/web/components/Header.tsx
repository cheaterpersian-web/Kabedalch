"use client";
import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <nav className="container px-3 py-3 flex items-center gap-3">
        <a href="/" className="font-bold text-lg">مرکز کبد چرب و ترک الکل</a>
        <div className="ml-auto hidden md:flex items-center gap-4 text-sm">
          <a href="/tests">تست‌ها</a>
          <a href="/packages">پکیج‌ها</a>
          <a href="/testimonials">رضایت مراجعین</a>
          <a href="/consultation">مشاوره</a>
          <a href="/blog">بلاگ</a>
          <a href="/cart" className="rounded bg-gray-900 text-white px-3 py-1.5">سبد خرید</a>
          <a href="/admin/dashboard" className="text-gray-600">ادمین</a>
          <a href="/login">ورود</a>
          <a href="/register" className="rounded border px-3 py-1.5">ثبت‌نام</a>
        </div>
        <button aria-label="menu" onClick={()=>setOpen(!open)} className="md:hidden ml-auto rounded border px-3 py-1.5">منو</button>
      </nav>
      {open && (
        <div className="md:hidden border-t">
          <div className="container px-3 py-3 grid gap-2 text-sm">
            <a href="/tests" className="py-2">تست‌ها</a>
            <a href="/packages" className="py-2">پکیج‌ها</a>
            <a href="/testimonials" className="py-2">رضایت مراجعین</a>
            <a href="/consultation" className="py-2">مشاوره</a>
            <a href="/blog" className="py-2">بلاگ</a>
            <a href="/cart" className="py-2">سبد خرید</a>
            <a href="/admin/dashboard" className="py-2">ادمین</a>
            <a href="/login" className="py-2">ورود</a>
            <a href="/register" className="py-2">ثبت‌نام</a>
          </div>
        </div>
      )}
    </header>
  );
}
