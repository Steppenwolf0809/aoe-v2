# PayPhone Proxy (Cloudflare Worker)

Purpose: route PayPhone API calls through Cloudflare egress when PayPhone blocks Vercel IPs/ASNs.

## Deploy

1. Install Wrangler (once):

```bash
npm i -g wrangler
```

2. Login:

```bash
wrangler login
```

3. Set secrets/vars (in this folder):

```bash
wrangler secret put PROXY_SECRET
wrangler var set UPSTREAM_BASE_URL https://pay.payphonetodoesposible.com
```

4. Deploy:

```bash
wrangler deploy
```

## Configure Vercel

Set:
- `PAYPHONE_PROXY_URL` = `https://payphone-proxy.<account>.workers.dev/api`
- `PAYPHONE_PROXY_SECRET` = same value as Worker `PROXY_SECRET`

Then re-run:
- `POST /api/dev/payphone-test?secret=...` with `{ "multiTest": true }`

