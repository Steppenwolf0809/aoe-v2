# Post-Payment Flow Redesign

**Date:** 2026-02-13
**Goal:** Eliminate mandatory account creation after payment. Deliver contract PDF immediately via download link + email.

## New Flow

```
Formulario vehicular (email ya capturado)
    ↓
Página de pago (/contratos/[id]/pago)
  - Resumen del contrato
  - Campo: "¿Dónde enviamos tu contrato?" (pre-llenado con email comprador, editable)
  - Botón "Pagar $11.99 con PayPhone"
    ↓
PayPhone cobra → redirige a /contratos/pago/callback?id=TX&clientTransactionId=AOExx
    ↓
Callback (server-side, sin auth):
  1. Verifica pago con PayPhone via n8n
  2. Marca contrato como PAID
  3. Genera PDF → sube a Supabase Storage
  4. Crea token de descarga (7 días)
  5. Envía email con link de descarga (sin adjunto)
  6. Redirige a → /contratos/pago/exito?token=xxx
    ↓
Página de éxito:
  - Datos del vehículo
  - Botón "Descargar PDF" (prominente)
  - "Enviamos copia a g****a@email.com"
  - (Opcional) "Crear cuenta gratis" para acceso futuro
  - CTA "Agendar cita en notaría"
```

## Changes by File

### 1. Add `responseUrl` to PayPhone Links request

**Files:** `src/lib/validations/payment.ts`, `src/lib/payphone.ts`, `src/actions/payments.ts`, `n8n/payphone-proxy.workflow.json`

**Schema** (`validations/payment.ts`):
- Add `responseUrl: z.string().url().optional()` to `payphoneLinkRequestSchema`

**PayPhone client** (`payphone.ts`):
- No changes needed — `createPaymentLink` already passes the full request object

**Payment initiation** (`payments.ts` → `initiatePayment()`):
- Accept `deliveryEmail` parameter alongside `contractId`
- Store `deliveryEmail` in contract (`delivery_email` column)
- Add `responseUrl` to `createPaymentLink()` call:
  `responseUrl: '${NEXT_PUBLIC_APP_URL}/contratos/pago/callback'`
- PayPhone will append `?id={txId}&clientTransactionId={clientTxId}` automatically

**n8n workflow** (`n8n/payphone-proxy.workflow.json`):
- Add `responseUrl` to the body parameters forwarded to PayPhone in the HTTP Request: Links node

### 2. Add `delivery_email` field

**Database:** Add `delivery_email TEXT` column to `contracts` table (via Supabase dashboard or migration)

**Payment page** (`src/app/(marketing)/contratos/[id]/pago/page.tsx`):
- Add email input field pre-filled with `contract.data.comprador.email`
- Label: "¿Dónde enviamos tu contrato?"
- Pass `deliveryEmail` in the form data to `initiatePayment()`
- Store in `contracts.delivery_email` column

**Payment action** (`src/actions/payments.ts` → `initiatePayment()`):
- Extract `deliveryEmail` from FormData
- Save to contract via admin client: `{ delivery_email: deliveryEmail }`

### 3. Rewrite callback to generate PDF without auth

**File:** `src/app/(marketing)/contratos/pago/callback/page.tsx`

Current: Updates to PAID → redirects to `/auth/claim-contract` (requires account)
New: Updates to PAID → generates PDF → sends email → redirects to `/contratos/pago/exito`

Changes:
- Remove auth requirement entirely
- After verifying payment and updating to PAID:
  1. Call new `generateContractPdfAdmin(contractId)` function (no auth needed)
  2. On success: redirect to `/contratos/pago/exito?token={downloadToken}`
  3. On PDF failure: redirect to success page with `?token={downloadToken}&pdfPending=true`
     (PDF can be retried — payment is already confirmed)

### 4. New `generateContractPdfAdmin()` function

**File:** `src/actions/pdf.ts`

New function that uses admin client instead of user session:
- Takes `contractId` parameter
- Uses `createAdminClient()` to fetch contract (bypass RLS)
- Generates PDF with `renderToBuffer(ContratoVehicularPdf(...))`
- Uploads to Supabase Storage (already uses admin client)
- Creates download token (7 days instead of 24h)
- Sends email to `contract.delivery_email` (not `user.email`)
- Updates contract: status='GENERATED', pdf_url, pdf_hash, download_token, download_token_expires_at
- No PDF attachment in email — just download link
- Returns `{ downloadToken, pdfUrl }`

### 5. Create success page

**New file:** `src/app/(marketing)/contratos/pago/exito/page.tsx`

Server Component that:
- Reads `?token=xxx` from search params
- Looks up contract by `download_token` using admin client
- Validates token exists and hasn't expired
- Displays:
  - Vehicle summary (placa, marca, modelo, valor)
  - Download button → `/api/contracts/{id}/download?token={token}`
  - Masked email confirmation ("Enviamos copia a g****a@domain.com")
  - "Enlace válido por 7 días"
  - Optional: "Crear cuenta gratis" link
  - CTA: "Agendar cita en notaría" (link to /contacto or WhatsApp)
- If token invalid/expired: shows error + WhatsApp contact link

### 6. Update email template

**File:** `src/emails/contrato-generado.tsx`

Changes:
- Step 3: Change "Coordina la legalización de firmas" → "Coordina el reconocimiento de firmas ante notario con ambas partes"
- Download note: "24 horas" → "7 días"
- Remove reference to "PDF adjunto en este email" (step 1 text)
- Step 1: "Usa el botón de abajo para descargar tu contrato"
- Add optional CTA: "¿Necesitas un notario? Agendar cita →"

### 7. Change token expiry to 7 days

**Files:**
- `src/actions/pdf.ts` → `generateContractPdfAdmin()`: `expiresAt.setDate(expiresAt.getDate() + 7)` instead of `setHours(+24)`
- `src/lib/storage.ts` → `getContractSignedUrl()`: signed URL expiry = 7 days (`60 * 60 * 24 * 7`)

### 8. Update download endpoint for anonymous access

**File:** `src/app/api/contracts/[id]/download/route.ts`

Current: Uses `createClient()` (user session) — fails for anonymous users.
New: Use `createAdminClient()` for token-based lookups — the token IS the authorization.

- Replace `createClient()` with `createAdminClient()`
- Token validation remains the same (token match + expiry check)
- No auth session required

### 9. Remove forced claim-contract redirect

**File:** `src/app/(marketing)/contratos/pago/callback/page.tsx`

- Remove all redirects to `/auth/claim-contract`
- Remove all redirects to `/dashboard/contratos`
- Only redirect to `/contratos/pago/exito?token={downloadToken}`

**Note:** Keep `claim-contract` page for now (not delete) — it may be useful later when we add dashboard features. Just don't redirect to it from the payment flow.

## Database Changes

Add column to `contracts` table:
```sql
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS delivery_email TEXT;
```

## Files Changed (Summary)

| File | Action |
|------|--------|
| `src/lib/validations/payment.ts` | Add `responseUrl` to schema |
| `src/actions/payments.ts` | Add `responseUrl` + `deliveryEmail` handling |
| `src/app/(marketing)/contratos/[id]/pago/page.tsx` | Add email input field |
| `src/app/(marketing)/contratos/pago/callback/page.tsx` | Rewrite: generate PDF, redirect to exito |
| `src/actions/pdf.ts` | Add `generateContractPdfAdmin()`, 7-day token |
| `src/app/(marketing)/contratos/pago/exito/page.tsx` | **NEW** success page |
| `src/emails/contrato-generado.tsx` | Update steps text + 7 days |
| `src/lib/storage.ts` | Signed URL expiry → 7 days |
| `src/app/api/contracts/[id]/download/route.ts` | Use admin client |
| `n8n/payphone-proxy.workflow.json` | Forward `responseUrl` |

## Not Changed

- Vehicle contract form (already works)
- PayPhone/n8n proxy infrastructure (only add responseUrl param)
- Supabase Storage bucket config (admin client bypasses policies)
- PDF template (`ContratoVehicularPdf`) — corrections are a separate task
- Claim-contract page (kept but not used in payment flow)
