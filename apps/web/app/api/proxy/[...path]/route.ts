export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

async function handler(req: Request, { params }: { params: { path: string[] } }) {
  const targetUrl = `${API_BASE}/${params.path.join('/')}`;
  const init: RequestInit = {
    method: req.method,
    headers: new Headers(req.headers),
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body as any,
    redirect: 'manual',
  };
  // Remove host header to avoid conflicts
  (init.headers as Headers).delete('host');
  const res = await fetch(targetUrl, init as any);
  const headers = new Headers(res.headers);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS };

