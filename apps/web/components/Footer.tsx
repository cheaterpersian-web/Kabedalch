export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-gray-50">
      <div className="container px-3 py-6 text-xs text-gray-600 grid gap-2 md:flex md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} تمام حقوق محفوظ است.</div>
        <div className="flex gap-4">
          <a href="/privacy">حریم خصوصی</a>
          <a href="/terms">شرایط استفاده</a>
          <a href="/disclaimer">عدم مسئولیت پزشکی</a>
        </div>
      </div>
    </footer>
  );
}
