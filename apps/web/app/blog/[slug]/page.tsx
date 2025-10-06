async function fetchPost(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  const res = await fetch(`${base}/api/posts`, { cache: 'no-store' });
  const posts = await res.json();
  return posts.find((p: any) => p.slug === slug);
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  if (!post) return <div className="container py-8">یافت نشد</div>;
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <article className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
