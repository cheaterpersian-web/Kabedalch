"use client";
import { useRouter } from 'next/navigation';

export default function ConsentPage() {
  const router = useRouter();
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-bold">توافق‌نامه رضایت</h1>
      <p>با انجام تست آنلاین، با ذخیره‌سازی و پردازش اطلاعات شما مطابق سیاست حریم خصوصی موافقت می‌کنید.</p>
      <button onClick={() => router.push('/tests')} className="bg-blue-600 text-white px-4 py-2 rounded">می‌پذیرم</button>
    </div>
  );
}
