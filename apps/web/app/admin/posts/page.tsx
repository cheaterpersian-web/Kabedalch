async function getPosts() {
  const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';
  try {
    const res = await fetch(`${base}/api/posts`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminPostsPage() {
  const posts = await getPosts();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">پست‌ها</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2">عنوان</th>
            <th className="p-2">منتشر شده</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p: any) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.published ? 'بله' : 'خیر'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
