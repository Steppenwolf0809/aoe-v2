# PayPhone Links Integration Debug Log (Vercel + Proxy Attempts)

Date: 2026-02-12

## Goal
Enable PayPhone payment flow for vehicular contracts ($11.99) on production (Vercel) by generating a PayPhone payment link via:
- `POST https://pay.payphonetodoesposible.com/api/Links`

## Core Problem
From Vercel (server-side), all requests to PayPhone API return HTML errors (ASP.NET runtime error). This blocks the payment flow.

Key observation:
- From a local PC (PowerShell), the same token+storeId works and returns a real payment URL (`https://ppls.me/...`).
- From Vercel (and later Cloudflare Workers), PayPhone returns an error page / redirect to `/Errors/500.html`.

Conclusion: PayPhone is very likely blocking cloud/datacenter egress (IP/ASN), not rejecting our payload/token.

## Verified Facts
- Token is valid (local `Invoke-RestMethod` returns a real `https://ppls.me/...` URL).
- StoreId is correct: `a87ab6ff-a90a-4b52-be11-c728e0ab213a`.
- Body matches PayPhone docs (centavos, max 15 char `clientTransactionId`, etc.).
- `preferredRegion = 'gru1'` (Sao Paulo) did not fix Vercel errors.
- Cloudflare Worker proxy did not fix it (PayPhone also errors/redirects from Cloudflare).

## Key Repo Files
- `src/lib/payphone.ts`: PayPhone client (`createPaymentLink`, `checkTransactionStatus`, etc.)
- `src/actions/payments.ts`: `initiatePayment()` for contract checkout.
- `src/app/api/dev/payphone-test/route.ts`: diagnostic endpoint (multiTest).
- `src/app/api/webhooks/payment/route.ts`: webhook receiver (future/optional; not used by Links API).
- `src/lib/validations/payment.ts`: Zod schemas.

## Commits (Chronological)
- `a36ef28`: set Vercel region to `gru1`.
- `7545a05`: add Cloudflare Worker proxy scaffolding + optional proxy env vars.
- `5d3d2c0`: add proxy debug headers.
- `0791f6f`: handle PayPhone redirects (avoid following `Location: /Errors/500.html`).
- `01c8bea`: allow PayPhone endpoint overrides for n8n/Railway proxy webhooks (`PAYPHONE_LINKS_URL`, `PAYPHONE_SALE_URL`, `PAYPHONE_CONFIRM_URL`).
- `e6bbdbe`: fix build error (duplicate variable name `url` in `src/lib/payphone.ts`).

## Diagnostics: PayPhone Behavior From Cloud Egress
When called from cloud egress (Vercel/Cloudflare), PayPhone returns:
- Status: `302`
- Header: `Location: /Errors/500.html?aspxerrorpath=/api/Links`
- Body: HTML "Object moved" page

This was observed even on:
- `GET https://pay.payphonetodoesposible.com/api`

## Cloudflare Worker Proxy Attempt (Not Solving It)
Worker: `workers/payphone-proxy/`
- Requires `X-Proxy-Secret`
- Proxies to `https://pay.payphonetodoesposible.com/*`

Result:
- PayPhone still returns redirect/error from Cloudflare egress.
- Conclusion: Cloudflare Workers are also blocked (or routed similarly to other datacenters).

## Current Approach: Proxy Through Railway n8n
Rationale: try a different egress (Railway) via n8n webhooks.

### Vercel Env Vars (Production) Used For n8n Proxy
Set these to point to n8n production webhooks.

- `PAYPHONE_LINKS_URL`:
  - `https://<n8n-host>/webhook/payphone-links?secret=<SECRET>`
- `PAYPHONE_SALE_URL`:
  - `https://<n8n-host>/webhook/payphone-sale?id={id}&secret=<SECRET>`

Notes:
- `PAYPHONE_PROXY_URL` (Cloudflare Worker) should be empty/unused.
- `PAYPHONE_PROXY_SECRET` may still be set in Vercel, but it only matters for Cloudflare Worker mode.

### n8n Workflows
We imported/created two production webhooks in n8n:
- `POST /webhook/payphone-links` (creates payment link)
- `GET  /webhook/payphone-sale?id=...` (checks sale status)

We also implemented an HMAC-like guard via query param `?secret=...` and env var:
- `PAYPHONE_PROXY_SECRET` on Railway/n8n

## RESOLVED - Root Causes Found & Fixed

### Root Cause 1: `$env` blocked on Railway
Railway's n8n sets `N8N_BLOCK_ENV_ACCESS_IN_NODE`, so `$env.PAYPHONE_PROXY_SECRET` and
`$env.PAYPHONE_TOKEN` caused `ExpressionError: access to env vars denied` on every execution.
The workflow crashed at the IF node before ever reaching PayPhone.

**Fix**: Replaced IF nodes with Code nodes that hardcode the proxy secret. PayPhone token
is forwarded from Vercel via the Authorization header (not stored in n8n).

### Root Cause 2: `r.body` vs `r.data`
n8n HTTP Request v3 with `fullResponse: true` + `responseFormat: "text"` puts the response
body in `$json.data`, NOT `$json.body`. The Format Response code node read `r.body` (undefined).

**Fix**: Changed to `r.data || r.body || ''`.

### Root Cause 3: PayPhone returns JSON, not plain text
PayPhone Links API returns `{"paymentUrl":"https://ppls.me/..."}` as JSON (content-type: application/json).
With `responseFormat: "text"`, n8n stores the raw JSON string in `.data`.

**Fix**: Added JSON.parse fallback in Format Response to extract `paymentUrl` from parsed JSON.

### Key Finding: Railway egress is NOT blocked by PayPhone
Unlike Vercel and Cloudflare Workers, Railway's IPs are accepted by PayPhone's WAF.
PayPhone returned HTTP 200 with valid payment links via Railway proxy.

## Final Architecture
```
Vercel (blocked by PayPhone WAF)
  → n8n on Railway (not blocked)
    → PayPhone API
    ← returns paymentUrl
  ← JSON { success, statusCode, paymentUrl, proxySource }
```

Env vars on Vercel:
- `PAYPHONE_LINKS_URL` = `https://n8n-production-8de1.up.railway.app/webhook/payphone-links?secret=...`
- `PAYPHONE_SALE_URL` = `https://n8n-production-8de1.up.railway.app/webhook/payphone-sale?secret=...&id={id}`
- `PAYPHONE_PROXY_URL` = (empty/removed)

## How To Debug n8n Quickly (Recommended Next Steps)
1. In n8n, open the workflow and ensure it is **Active** (Production URL only works when active).
2. In `HTTP Request: Links`:
   - Option: `Include Response Headers and Status` = ON
   - `Response Format` = `Text` (or `String`)
3. Temporarily set `Respond: Links` to return the full `$json` so we can see what the previous node produced:
   - Respond With = JSON
   - Response Body = `={{$json}}`
   - Response Code = `={{$json.statusCode || 200}}`
4. Test directly against n8n (PowerShell):

```powershell
$secret  = "<SECRET>"
$storeId = "a87ab6ff-a90a-4b52-be11-c728e0ab213a"
$body = @{
  amount = 315
  amountWithoutTax = 200
  amountWithTax = 100
  tax = 15
  currency = "USD"
  clientTransactionId = "AOE123456789"
  storeId = $storeId
  reference = "Test"
} | ConvertTo-Json -Compress

Invoke-RestMethod -Method Post -Uri "https://<n8n-host>/webhook/payphone-links?secret=$secret" -ContentType "application/json" -Body $body
```

Expected success response should be a plain string:
- `https://ppls.me/...`

## Security Notes
- DO NOT paste or store API keys/JWTs in chat logs or docs. Rotate any exposed n8n API keys immediately.
- Keep `PAYPHONE_TOKEN` server-side only (never `NEXT_PUBLIC_*`).
- For any public webhook (`/webhook/*`), enforce a secret and consider additional rate limiting and logging.

