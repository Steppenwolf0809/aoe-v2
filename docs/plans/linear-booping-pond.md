# Plan: Prompt 16 — PayPhone + Contract PDF + Flujo de pago

## Context

Prompt 15 completó el wizard de contratos vehiculares que guarda contratos como DRAFT en Supabase. Ahora necesitamos el flujo completo: pago con PayPhone → generación de PDF del contrato legal → almacenamiento en Supabase Storage → descarga y email. El modelo maestro de contrato está en `docs/contracts/modelo-compraventa-vehicular.md` con variables y bloques condicionales.

**Decisiones tomadas:**
- PayPhone como pasarela (ecuatoriana, 5%+IVA, redirect-based)
- PDF in-app con `@react-pdf/renderer` (ya instalado v4.3.2)
- Supabase Storage bucket privado para PDFs

---

## Archivos a crear (13)

| # | Archivo | Qué hace |
|---|---------|----------|
| 1 | `src/lib/payphone.ts` | Cliente API PayPhone (Prepare + Confirm) |
| 2 | `src/lib/validations/payment.ts` | Schemas Zod para PayPhone request/response |
| 3 | `src/lib/hash.ts` | Utilidad SHA-256 para integridad del PDF |
| 4 | `src/lib/storage.ts` | Helpers Supabase Storage (upload PDF, signed URL) |
| 5 | `src/lib/pdf/contrato-vehicular.tsx` | Template React PDF del contrato legal (usa modelo maestro) |
| 6 | `src/emails/contrato-generado.tsx` | Template email "tu contrato está listo" |
| 7 | `src/actions/payments.ts` | Server actions: `initiatePayment()`, `confirmAndProcessPayment()` |
| 8 | `src/actions/pdf.ts` | Server actions: `generateContractPdf()`, `getContractDownloadUrl()` |
| 9 | `src/app/(dashboard)/contratos/pago/page.tsx` | Página callback de PayPhone (recibe redirect) |
| 10 | `src/components/contracts/payment-status.tsx` | UI del callback (procesando/éxito/error) |
| 11 | `src/components/contracts/contract-actions.tsx` | Botones de acción por estado (Pagar/Descargar) |
| 12 | `src/app/api/contracts/[id]/download/route.ts` | Ruta descarga por token (para links de email) |
| 13 | `src/app/(dashboard)/contratos/[id]/page.tsx` | Página detalle del contrato |

## Archivos a modificar (4)

| # | Archivo | Cambios |
|---|---------|---------|
| 1 | `src/env.ts` | Agregar `PAYPHONE_TOKEN`, `PAYPHONE_STORE_ID` |
| 2 | `src/actions/contracts.ts` | Agregar `getContract()`, `updateContractStatus()` |
| 3 | `src/app/(dashboard)/contratos/page.tsx` | Agregar botones de acción por contrato |
| 4 | `src/app/api/webhooks/payment/route.ts` | Implementar webhook como fallback |

---

## Flujo de datos

```
Wizard → createContract() → DB: DRAFT
         ↓
Contracts list → [Pagar y generar] botón
         ↓
initiatePayment(contractId)
  → POST PayPhone /api/button/Prepare (Bearer token, amount in cents, responseUrl)
  → Returns { payWithCard: URL }
  → window.location.href = payWithCard
         ↓
Usuario paga en PayPhone
         ↓
PayPhone redirect → /dashboard/contratos/pago?id=X&clientTransactionId=Y
         ↓
confirmAndProcessPayment():
  1. POST PayPhone /api/button/V2/Confirm → statusCode=3 (approved)
  2. DB: status=PAID, paymentId, amount=$9.99
  3. renderToBuffer(ContratoVehicularPdf) → Buffer
  4. sha256(buffer) → hash
  5. uploadContractPdf(buffer) → Supabase Storage
  6. crypto.randomUUID() → downloadToken (24h expiry)
  7. DB: status=GENERATED, pdfUrl, pdfHash, downloadToken
  8. Resend email con PDF adjunto + link descarga
         ↓
Callback page → "¡Contrato generado!" → redirect a lista
         ↓
Contracts list → [Descargar PDF] botón → signed URL → descarga
         ↓
DB: status=DOWNLOADED
```

---

## Orden de implementación

### Paso 1: Infraestructura (env + validations + utils)
- `src/env.ts` — agregar PAYPHONE_TOKEN, PAYPHONE_STORE_ID
- `src/lib/validations/payment.ts` — schemas Zod para PayPhone
- `src/lib/hash.ts` — sha256 utility
- `src/lib/storage.ts` — upload/download helpers con admin client

### Paso 2: Cliente PayPhone
- `src/lib/payphone.ts` — preparePayment() + confirmPayment()

### Paso 3: PDF del contrato
- `src/lib/pdf/contrato-vehicular.tsx` — Template React PDF
  - Usa el modelo maestro de `docs/contracts/modelo-compraventa-vehicular.md`
  - Para MVP: caso simple (vendedor + comprador, sin cónyuge/herencia/poder)
  - Variables se llenan desde el JSONB `data` del contrato
  - Cláusulas: Antecedentes, Objeto, Precio, Estado/Garantías, Gastos, Jurisdicción, Aceptación, Cuantía
  - Firmas al final

### Paso 4: Email template
- `src/emails/contrato-generado.tsx` — React Email template

### Paso 5: Server actions
- `src/actions/contracts.ts` — agregar getContract(), updateContractStatus()
- `src/actions/payments.ts` — initiatePayment(), confirmAndProcessPayment()
- `src/actions/pdf.ts` — generateContractPdf(), getContractDownloadUrl()

### Paso 6: UI de pago
- `src/components/contracts/payment-status.tsx` — estados procesando/éxito/error
- `src/app/(dashboard)/contratos/pago/page.tsx` — callback page
- `src/components/contracts/contract-actions.tsx` — botones Pagar/Descargar

### Paso 7: Actualizar contracts list + detalle
- `src/app/(dashboard)/contratos/page.tsx` — integrar ContractActions
- `src/app/(dashboard)/contratos/[id]/page.tsx` — página detalle
- `src/app/api/contracts/[id]/download/route.ts` — descarga por token

### Paso 8: Webhook fallback
- `src/app/api/webhooks/payment/route.ts` — handler de respaldo

---

## Patrones existentes a reutilizar

| Qué | Dónde | Para qué |
|-----|-------|----------|
| `renderToBuffer()` | `src/actions/send-lead-magnet.ts` | Generar PDF buffer |
| `PresupuestoDetallado` | `src/lib/pdf/generate-presupuesto.tsx` | Clonar estructura del template PDF |
| `resend.emails.send()` | `src/actions/send-lead-magnet.ts` | Enviar email con adjunto |
| `createAdminClient()` | `src/lib/supabase/admin.ts` | Operaciones de Storage |
| `createClient()` | `src/lib/supabase/server.ts` | Auth + queries |
| `ActionResult<T>` | `src/actions/contracts.ts` | Tipo retorno server actions |
| `formatCurrency()` | `src/lib/utils.ts` | Formatear montos |
| `PRECIO_CONTRATO_BASICO` | `src/lib/formulas/vehicular.ts` | Precio del contrato ($9.99) |
| `contratoVehicularSchema` | `src/lib/validations/contract.ts` | Tipo ContratoVehicular |

---

## Modelo de contrato → PDF

El modelo maestro (`docs/contracts/modelo-compraventa-vehicular.md`) tiene ~12 secciones de variables + bloques condicionales. Para el MVP:

**Incluir:** caso simple (compraventa directa, sin cónyuge, sin herencia, sin poder, sin diplomático)
- Comparecencia vendedor + comprador
- Cláusula PRIMERA: Antecedentes (compraventa estándar)
- Cláusula SEGUNDA: Objeto (datos del vehículo)
- Cláusula TERCERA: Precio y forma de pago
- Cláusula CUARTA: Estado y garantías
- Cláusula QUINTA: Gastos
- Cláusula SEXTA: Jurisdicción
- Cláusula SÉPTIMA: Aceptación
- Cláusula OCTAVA: Cuantía
- Firmas vendedor + comprador

**Diferir a futuro:** cónyuge, herencia, poder especial, diplomático, infracciones (requieren campos adicionales en el wizard)

---

## Env vars necesarias

```env
PAYPHONE_TOKEN=Bearer-token-de-payphone-developer
PAYPHONE_STORE_ID=tu-store-id
```

La `responseUrl` se construye dinámicamente: `${NEXT_PUBLIC_APP_URL}/dashboard/contratos/pago`

---

## Setup manual requerido (usuario)

1. Crear cuenta en PayPhone Business → configurar developer → obtener Token + StoreId
2. Crear bucket `contracts` en Supabase Storage (privado)
3. Agregar env vars a `.env.local` y Vercel

---

## Verificación

1. `npm run build` — 0 errores
2. Tests existentes siguen pasando (`npx vitest run`)
3. Flujo manual: crear contrato → pagar (sandbox PayPhone) → verificar PDF generado → descargar
4. Verificar email llega con PDF adjunto
5. Verificar que el link de descarga del email funciona
