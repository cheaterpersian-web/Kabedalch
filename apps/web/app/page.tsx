export default function HomePage() {
  return (
    <main className="container py-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold">سلام! به مرکز کبد چرب و ترک الکل خوش آمدید</h1>
        <p className="text-gray-600">تست‌های آنلاین، پکیج‌های درمانی، و مشاوره تخصصی</p>
        <div className="flex justify-center gap-3 mt-4">
          <a href="/tests" className="bg-blue-600 text-white px-4 py-2 rounded">شروع تست آنلاین</a>
          <a href="/packages" className="bg-green-600 text-white px-4 py-2 rounded">مشاهده پکیج‌ها</a>
          <a href="/consultation" className="bg-gray-800 text-white px-4 py-2 rounded">درخواست مشاوره</a>
        </div>
      </section>
    </main>
  );
}
