export interface Env {
  PROXY_SECRET: string
  UPSTREAM_BASE_URL: string
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function isHopByHopHeader(name: string): boolean {
  const n = name.toLowerCase()
  return (
    n === 'connection' ||
    n === 'keep-alive' ||
    n === 'proxy-authenticate' ||
    n === 'proxy-authorization' ||
    n === 'te' ||
    n === 'trailer' ||
    n === 'transfer-encoding' ||
    n === 'upgrade'
  )
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const expected = env.PROXY_SECRET
    if (!expected) {
      return json(500, { error: 'Worker misconfigured: missing PROXY_SECRET' })
    }

    const got = request.headers.get('x-proxy-secret') || ''
    if (got !== expected) {
      return json(403, { error: 'Forbidden' })
    }

    const url = new URL(request.url)
    // Accept both "/api" and "/api/*" (some clients use "/api" as a health check).
    if (!(url.pathname === '/api' || url.pathname.startsWith('/api/'))) {
      return json(404, { error: 'Not found', path: url.pathname })
    }

    const upstreamBase = (env.UPSTREAM_BASE_URL || '').replace(/\/+$/, '')
    if (!upstreamBase) {
      return json(500, { error: 'Worker misconfigured: missing UPSTREAM_BASE_URL' })
    }

    // Map: /api/* -> ${UPSTREAM_BASE_URL}/api/*
    const upstreamUrl = new URL(upstreamBase + url.pathname + url.search)

    // Clone headers and remove our auth secret + hop-by-hop headers.
    const headers = new Headers()
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'x-proxy-secret') return
      if (isHopByHopHeader(key)) return
      headers.set(key, value)
    })

    // Ensure PayPhone sees JSON where applicable.
    if (!headers.has('accept')) headers.set('accept', 'application/json')

    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: 'manual',
    }

    // Only forward a body for methods that may include one.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = request.body
    }

    const upstreamResponse = await fetch(upstreamUrl.toString(), init)

    // Add lightweight debug headers so we can confirm correct upstream mapping from Vercel logs.
    const outHeaders = new Headers(upstreamResponse.headers)
    outHeaders.set('x-proxy-upstream-url', upstreamUrl.toString())
    outHeaders.set('x-proxy-path', url.pathname)

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: outHeaders,
    })
  },
}
