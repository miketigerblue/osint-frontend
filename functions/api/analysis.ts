// functions/api/analysis.ts
import type { PagesFunction } from '@cloudflare/workers-types'

interface Env {
  OSINT_BUCKET: R2Bucket
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
  // Attempt to fetch the JSON file from R2
  const obj = await env.OSINT_BUCKET.get('analysis.json')
  if (!obj) {
    return new Response('Not found', { status: 404 })
  }

  // Stream the raw JSON back, with proper headers
  return new Response(obj.body, {
    headers: {
      'Content-Type': 'application/json',
      // Cache at the edge for 5 minutes
      'Cache-Control': 'public, max-age=300',
    },
  })
}
