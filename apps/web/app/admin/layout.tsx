import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container py-6 space-y-6">
      <nav className="flex gap-3 text-sm">
        <a className="px-3 py-1.5 rounded border" href="/admin/dashboard">داشبورد</a>
        <a className="px-3 py-1.5 rounded border" href="/admin/users">کاربران</a>
        <a className="px-3 py-1.5 rounded border" href="/admin/packages">پکیج‌ها</a>
        <a className="px-3 py-1.5 rounded border" href="/admin/posts">بلاگ</a>
        <a className="px-3 py-1.5 rounded border" href="/admin/testimonials">رضایت‌نامه‌ها</a>
        <a className="px-3 py-1.5 rounded border" href="/admin/settings">تنظیمات</a>
      </nav>
      {children}
    </div>
  );
}
