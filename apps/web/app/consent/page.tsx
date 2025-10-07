export default function ConsentPage() {
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-bold">توافق‌نامه رضایت</h1>
      <p>با انجام تست، با ذخیره‌سازی و پردازش داده‌های پزشکی در چارچوب قوانین موافقت می‌کنید.</p>
      <a href="/tests" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">قبول دارم</a>
    </div>
  );
}
