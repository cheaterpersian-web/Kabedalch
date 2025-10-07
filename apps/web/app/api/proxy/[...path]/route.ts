export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_INTERNAL_URL || 'http://localhost:3001';

async function handler(req: Request, { params }: { params: { path: string[] } }) {
  const url = new URL(req.url);
  const search = url.search || '';
  const targetUrl = `${API_BASE}/${params.path.join('/')}${search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('content-length');
  headers.delete('connection');
  headers.delete('accept-encoding');

  let body: any = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const contentType = headers.get('content-type') || '';
    try {
      if (contentType.includes('application/json')) {
        body = await req.text();
      } else if (contentType.startsWith('multipart/form-data')) {
        body = await (req as any).formData();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        body = await req.text();
      } else {
        const ab = await req.arrayBuffer();
        body = Buffer.from(ab);
      }
    } catch {
      body = undefined;
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
  } as any;

  if (body !== undefined) (init as any).duplex = 'half';

  const res = await fetch(targetUrl, init as any);
  const outHeaders = new Headers(res.headers);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: outHeaders });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS };

