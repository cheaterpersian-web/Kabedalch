export const dynamic = 'force-dynamic';
async function fetchPosts() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/posts`, { next: { revalidate: 60 } });
  return res.json();
}

export default async function BlogPage() {
  const posts = await fetchPosts();
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-bold">مقالات</h1>
      {posts.map((p: any) => (
        <a key={p.id} href={`/blog/${p.slug}`} className="block border rounded p-4">
          <div className="font-semibold">{p.title}</div>
        </a>
      ))}
    </div>
  );
}
