export default function RegisterSuccessPage() {
  return (
    <div className="container py-10 space-y-4">
      <h1 className="text-2xl font-bold">ثبت‌نام با موفقیت انجام شد</h1>
      <p className="text-gray-700">اکنون می‌توانید وارد حساب خود شوید.</p>
      <a href="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">ورود</a>
    </div>
  );
}

