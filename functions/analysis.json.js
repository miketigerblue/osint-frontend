// functions/analysis.json.js
export async function onRequest(context) {
    const { env, request } = context;
    const url = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}` +
                `/r2/buckets/osint/objects/analysis.json`;
  
    // Fetch directly from R2 with your read-only token
    const r2resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.SECRET_R2_TOKEN}`
      }
    });
    if (!r2resp.ok) {
      return new Response(await r2resp.text(), { status: r2resp.status });
    }
  
    // Stream the JSON back to the browser
    const body = await r2resp.text();
    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=30'
      }
    });
  }
  