export default function HomePage() {
  return (
    <main className="container px-3 py-8 space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold leading-9">سلام! به مرکز کبد چرب و ترک الکل خوش آمدید</h1>
        <p className="text-gray-600 md:text-lg">تست‌های آنلاین، پکیج‌های درمانی، و مشاوره تخصصی</p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-4">
          <a href="/tests" className="bg-blue-600 text-white px-4 py-3 rounded">شروع تست آنلاین</a>
          <a href="/packages" className="bg-green-600 text-white px-4 py-3 rounded">مشاهده پکیج‌ها</a>
          <a href="/consultation" className="bg-gray-900 text-white px-4 py-3 rounded">درخواست مشاوره</a>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4">
          <div className="font-semibold mb-2">تست‌های آنلاین</div>
          <p className="text-sm text-gray-600">نتیجه فوری و پیشنهاد پکیج مرتبط</p>
        </div>
        <div className="rounded-xl border p-4">
          <div className="font-semibold mb-2">پکیج‌های تخصصی</div>
          <p className="text-sm text-gray-600">برنامه‌های ۳۰ تا ۹۰ روزه با پیگیری</p>
        </div>
        <div className="rounded-xl border p-4">
          <div className="font-semibold mb-2">مشاوره حرفه‌ای</div>
          <p className="text-sm text-gray-600">گفت‌وگو با مشاوران مجرب</p>
        </div>
      </section>
    </main>
  );
}
