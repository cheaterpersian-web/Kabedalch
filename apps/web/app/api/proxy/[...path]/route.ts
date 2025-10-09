export const dynamic = 'force-dynamic';

// Server-to-server should prefer internal URL; public base is for browser.
const API_BASE = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api:3001';

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
        // Let fetch set correct boundary header
        headers.delete('content-type');
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

  // Note: do NOT set duplex; Next.js runtime/node fetch handles streaming/body

  try {
    const res = await fetch(targetUrl, init as any);
    const outHeaders = new Headers(res.headers);
    // Buffer response to avoid streaming issues in edge/server runtime
    const arrayBuffer = await res.arrayBuffer();
    return new Response(arrayBuffer, { status: res.status, statusText: res.statusText, headers: outHeaders });
  } catch (e: any) {
    console.error('proxy_error', { targetUrl, message: e?.message });
    return Response.json({ error: 'proxy_fetch_failed', message: e?.message || 'Upstream fetch failed' }, { status: 502 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS };

