// functions/api/analysis.ts
export const config = { runtime: 'edge' };

interface Env {
  OSINT_BUCKET: R2Bucket;
}

export default async function handler(
  request: Request,
  env: Env
): Promise<Response> {
  // fetch the object
  const obj = await env.OSINT_BUCKET.get('analysis.json');
  if (!obj) {
    return new Response('Not found', { status: 404 });
  }

  // parse and re-serialise to ensure valid JSON
  const data = await obj.json();
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      // cache at the edge for 5 minutes
      'Cache-Control': 'public, max-age=300',
    },
  });
}
