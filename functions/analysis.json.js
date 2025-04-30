// functions/analysis.json.js

export async function onRequest({ env }) {
    // Build the Cloudflare API URL for your R2 object
    const url = `https://api.cloudflare.com/client/v4/accounts/` +
                `${env.CF_ACCOUNT_ID}` +
                `/r2/buckets/osint/objects/analysis.json`;
  
    // Fetch using your read-only User Token
    const r2resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.R2_USER_TOKEN}`,
        Accept:        'application/json'
      }
    });
  
    if (!r2resp.ok) {
      const text = await r2resp.text();
      return new Response(text, { status: r2resp.status });
    }
  
    // Stream the JSON back
    return new Response(r2resp.body, {
      headers: {
        'Content-Type':  'application/json',
        'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=30'
      }
    });
  }
  