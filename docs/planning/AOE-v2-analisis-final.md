# AOE v2 — Análisis Final del Estudio de Arquitectura

## Veredicto: ¿Está listo para arrancar?

**Casi. El 90% está excelente, pero hay 5 ajustes que recomiendo antes de empezar.**

---

## Lo que está MUY BIEN decidido (no tocar)

### ✅ Next.js 15 App Router — Correcto
Sin discusión. SSR nativo, Server Components, Metadata API para SEO, Image Optimization. Para un sitio legal que vive del tráfico orgánico, es la única opción seria.

### ✅ Vercel para deploy — Correcto
Optimizado para Next.js. Tier gratuito generoso. Deploy automático desde Git. Edge Network global.

### ✅ Supabase para PostgreSQL — Correcto
La decisión de usar Supabase en vez de mantener PostgreSQL en tu servidor i9 es ACERTADA por estas razones:
- Zero mantenimiento de DB (backups automáticos, updates, monitoreo)
- RLS nativo de PostgreSQL funciona igual
- Supabase Storage resuelve el almacenamiento de PDFs sin configurar S3
- Auth de Supabase como alternativa viable a Auth.js (ver ajuste #1)
- $0/mes para empezar, $25/mes cuando escales
- Te libera de la dependencia de que tu servidor i9 esté encendido 24/7

### ✅ Railway para n8n — Correcto
$5/mes, siempre online, cero mantenimiento. Mucho mejor que self-hosted para un servicio crítico de automatización.

### ✅ Calculadoras como package independiente — Correcto
Funciones puras, testables, reutilizables. La mejor decisión del documento.

### ✅ Python + FastAPI + WeasyPrint para PDFs — Correcto
HTML → PDF con CSS completo. Mejor calidad que cualquier solución JS.

### ✅ Resend para email — Correcto
3,000/día gratis, API simple, buen deliverability.

---

## Los 5 Ajustes Que Recomiendo

### Ajuste #1: Supabase Auth vs Auth.js — Simplifica

**El documento dice:** Auth.js v5 (NextAuth)
**Mi recomendación:** Usa **Supabase Auth** directamente

**¿Por qué?** Si ya estás metiendo Supabase para la base de datos, usar TAMBIÉN Auth.js es redundancia innecesaria. Supabase Auth te da:
- Email/password con verificación
- OAuth (Google, GitHub, etc.)
- Magic links
- RLS integrado con el auth (el user_id viene automático en las policies)
- Session management sin configurar JWT manualmente
- Todo con un solo `supabase.auth.signInWithPassword()`

**El problema de Auth.js + Supabase:** Tienes que configurar el Drizzle adapter para Auth.js, manejar las tablas de sessions/accounts de Auth.js EN Supabase, y lidiar con dos sistemas de auth que no se hablan nativamente con RLS. Es complejidad innecesaria.

**Con Supabase Auth + RLS:**
```sql
-- RLS policy que usa el auth nativo de Supabase
CREATE POLICY "Users can view own contracts" ON contracts
  FOR SELECT USING (auth.uid() = user_id);

-- auth.uid() viene AUTOMÁTICO de Supabase Auth. Zero config.
```

**Con Auth.js + Drizzle en Supabase:**
```sql
-- Tienes que setear manualmente el user_id en cada request
-- Y configurar el adapter, callbacks, session strategy...
-- Y las tablas de Auth.js (Account, Session, VerificationToken)
-- son diferentes a las de Supabase Auth
```

**Veredicto:** Si usas Supabase, usa TODO Supabase. Si prefieres Auth.js, usa PostgreSQL directo (sin Supabase). No mezcles.

### Ajuste #2: El monorepo con Turbo — Quizás es demasiado para empezar

**El documento dice:** pnpm workspaces + Turborepo con packages separados
**Mi recomendación:** Empieza con **un solo proyecto Next.js** con carpetas bien organizadas. Migra a monorepo DESPUÉS si lo necesitas.

**¿Por qué?**
- Un monorepo con Turbo, pnpm workspaces, packages/database, packages/calculators, packages/auth, packages/ui... es arquitectura de equipo de 5+ desarrolladores.
- Tú eres UN solo desarrollador. El overhead de configurar, mantener y debuggear imports entre packages te va a comer tiempo que deberías usar en features.
- Si un import falla entre packages, puedes perder horas en configurar tsconfig paths, package.json exports, y build pipelines.

**Estructura recomendada (simple pero escalable):**
```
aoe-v2/
├── src/
│   ├── app/                    # App Router (ya organizado por route groups)
│   ├── components/             # Todos los componentes
│   ├── lib/
│   │   ├── supabase/           # Cliente Supabase (auth + db)
│   │   ├── formulas/           # Funciones puras calculadoras
│   │   │   ├── notarial.ts
│   │   │   ├── municipal.ts
│   │   │   ├── registro.ts
│   │   │   └── __tests__/
│   │   ├── validations/        # Schemas Zod
│   │   └── utils/              # Helpers
│   ├── actions/                # Server Actions
│   ├── hooks/                  # Custom hooks
│   ├── types/                  # TypeScript types
│   └── middleware.ts
├── services/
│   └── pdf-generator/          # Python (se despliega separado)
├── supabase/
│   ├── migrations/             # SQL migrations
│   └── seed.sql
└── n8n/                        # Workflows exportados
```

**Las fórmulas de calculadoras siguen siendo funciones puras** en `lib/formulas/`, perfectamente testables. No necesitan ser un package npm separado para eso.

**¿Cuándo sí harías monorepo?** Cuando tengas un segundo producto (ej: una app móvil, o un portal para otras notarías) que necesite compartir la lógica de calculadoras. Ahí sí extraes `packages/calculators`.

### Ajuste #3: tRPC — Elimínalo del stack

**El documento dice:** Server Actions + tRPC
**Mi recomendación:** Solo **Server Actions**. Sin tRPC.

**¿Por qué?**
- tRPC es excelente cuando tienes un backend separado y un frontend que consume esa API. Pero con Next.js 15 App Router, **Server Actions hacen exactamente lo mismo** sin la complejidad de configurar routers, procedures, y un cliente tRPC.
- Agregar tRPC a un proyecto Next.js 15 con Server Actions es como poner dos motores a un carro. Uno sobra.
- tRPC añade: dependencia extra, boilerplate de routers, configuración de contexto, y una capa más que debuggear.

**Con Server Actions (suficiente):**
```typescript
// src/actions/contracts.ts
"use server"
import { z } from "zod"

const schema = z.object({
  placa: z.string().regex(/^[A-Z]{3}-\d{3,4}$/),
  avaluo: z.number().positive(),
})

export async function createContract(formData: FormData) {
  const data = schema.parse(Object.fromEntries(formData))
  // ... lógica de negocio
  // Type-safe, server-only, zero boilerplate
}
```

**tRPC solo vale la pena si:** tienes un backend Node.js SEPARADO de Next.js que sirve a múltiples clientes (web, móvil, terceros). No es tu caso.

### Ajuste #4: TanStack Query — Probablemente no lo necesitas al inicio

**El documento dice:** TanStack Query v5 para caché de server state
**Mi recomendación:** Empieza SIN él. Agrégalo solo si encuentras un problema real de caché.

**¿Por qué?**
- Next.js 15 con Server Components ya tiene un sistema de caché integrado (fetch cache, revalidateTag, revalidatePath).
- TanStack Query brilla en SPAs donde el cliente hace muchos fetches. Con Server Components, la mayoría de tus datos se obtienen EN el servidor antes de renderizar.
- Las calculadoras son 100% client-side (no necesitan fetch). El blog usa ISR (caché de Next.js). Los contratos usan Server Actions.

**¿Cuándo sí lo agregarías?** Si el dashboard del usuario necesita polling en tiempo real (ej: estado del contrato actualizándose live), o si tienes muchas listas con paginación client-side. Pero eso es Fase 2, no MVP.

### Ajuste #5: Dónde correr el PDF Service

**El documento dice:** Docker en servidor i9 O Railway
**Mi recomendación:** **Railway** también para el PDF service (al menos al inicio)

El PDF service es un contenedor Docker con FastAPI + WeasyPrint. Railway lo corre perfecto:
- Deploy desde Dockerfile
- ~$3-5/mes adicionales (se despierta solo cuando hay requests)
- Zero mantenimiento
- No dependes de que el i9 esté encendido

**Si el volumen de PDFs crece mucho** (>100/día), entonces migras al i9 por costo. Pero para MVP, Railway simplifica todo.

**Arquitectura final simplificada:**
```
Vercel (Next.js 15) .............. $0/mes
    ↓
Supabase (PostgreSQL + Auth + Storage) .. $0/mes
    ↓
Railway (n8n + PDF service) ...... $8-10/mes
    ↓
Resend (Email) ................... $0/mes
    ↓
Cloudflare (DNS + CDN) ........... $0/mes

TOTAL INICIAL: ~$8-10/mes
```

---

## Stack Final Corregido

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Framework** | Next.js 15 (App Router) | SSR, SEO, Server Actions, todo integrado |
| **Runtime** | React 19 + TypeScript 5 | Server Components, type safety |
| **Estilos** | Tailwind CSS 4 + Framer Motion | Diseño premium con animaciones |
| **Base de Datos** | Supabase (PostgreSQL 16) | Managed, RLS nativo, Storage incluido |
| **Auth** | Supabase Auth | Integrado con RLS, zero config extra |
| **ORM** | Drizzle ORM | Type-safe queries sobre Supabase PostgreSQL |
| **Validación** | Zod | Schema validation end-to-end |
| **Forms** | React Hook Form + Zod | Performance + validación |
| **API** | Server Actions (Next.js) | Type-safe, zero boilerplate |
| **PDF** | Python + FastAPI + WeasyPrint (Railway) | Mejor calidad CSS → PDF |
| **Workflows** | n8n (Railway) | Blog, post-venta, social media |
| **Email** | Resend | 3,000/día gratis |
| **Storage** | Supabase Storage | PDFs, imágenes, documentos |
| **Deploy** | Vercel | Optimizado para Next.js |
| **DNS/CDN** | Cloudflare | Caché, protección, SSL |

**Lo que se ELIMINA del estudio original:**
- ~~Auth.js v5~~ → Supabase Auth (evitar redundancia)
- ~~tRPC~~ → Server Actions (suficiente con Next.js 15)
- ~~TanStack Query~~ → Caché nativo de Next.js (agregar después si se necesita)
- ~~Monorepo Turbo~~ → Proyecto único bien organizado (escalar después)
- ~~Servidor i9 para servicios~~ → Todo en cloud por ahora (Railway)

---

## Estructura del Proyecto — Versión Definitiva

```
aoe-v2/
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── .env.local                    # Variables (NO versionar)
├── .env.example                  # Template
├── package.json
├── tsconfig.json
│
├── public/
│   ├── og/                       # Open Graph images
│   └── brand/                    # Logo, favicon
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx              # Landing (SSG)
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── sitemap.ts            # Sitemap dinámico
│   │   ├── robots.ts
│   │   │
│   │   ├── (marketing)/          # Páginas públicas con SEO
│   │   │   ├── layout.tsx        # Header + Footer público
│   │   │   ├── servicios/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── calculadoras/
│   │   │   │   ├── page.tsx      # Hub
│   │   │   │   ├── notarial/page.tsx
│   │   │   │   ├── alcabalas/page.tsx
│   │   │   │   ├── plusvalia/page.tsx
│   │   │   │   └── registro-propiedad/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx      # Listing (ISR)
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── precios/page.tsx
│   │   │   └── contacto/page.tsx
│   │   │
│   │   ├── (auth)/               # Login, registro
│   │   │   ├── layout.tsx        # Layout limpio sin header
│   │   │   ├── iniciar-sesion/page.tsx
│   │   │   ├── registro/page.tsx
│   │   │   └── verificar-email/page.tsx
│   │   │
│   │   ├── (dashboard)/          # Área privada
│   │   │   ├── layout.tsx        # Sidebar + auth check
│   │   │   ├── perfil/page.tsx
│   │   │   ├── contratos/
│   │   │   │   ├── page.tsx      # Mis contratos
│   │   │   │   └── nuevo/page.tsx # Wizard
│   │   │   ├── documentos/page.tsx
│   │   │   └── suscripcion/page.tsx
│   │   │
│   │   └── api/
│   │       └── webhooks/
│   │           ├── payment/route.ts
│   │           └── n8n/route.ts
│   │
│   ├── components/
│   │   ├── ui/                   # Button, Card, Input, Modal, Badge, Skeleton
│   │   ├── layout/               # Header, Footer, MobileMenu, Sidebar
│   │   ├── landing/              # Hero, Features, Stats, Testimonials, CTA
│   │   ├── calculators/          # CalcShell, SliderInput, AnimCounter, ResultsChart
│   │   ├── contracts/            # WizardForm, StepIndicator, VehicleForm
│   │   ├── blog/                 # PostCard, PostGrid, TOC
│   │   ├── auth/                 # LoginForm, RegisterForm, AuthGuard
│   │   ├── dashboard/            # ContractsList, ProfileForm
│   │   └── seo/                  # JsonLd, Breadcrumbs
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Cliente browser (createBrowserClient)
│   │   │   ├── server.ts         # Cliente server (createServerClient)
│   │   │   ├── admin.ts          # Cliente admin (service role, solo server)
│   │   │   └── middleware.ts     # Helper para middleware auth
│   │   ├── formulas/             # FUNCIONES PURAS (la joya)
│   │   │   ├── notarial.ts
│   │   │   ├── notarial.test.ts
│   │   │   ├── municipal.ts
│   │   │   ├── municipal.test.ts
│   │   │   ├── registro.ts
│   │   │   ├── registro.test.ts
│   │   │   └── types.ts
│   │   ├── validations/          # Schemas Zod
│   │   │   ├── contract.ts
│   │   │   ├── auth.ts
│   │   │   └── calculator.ts
│   │   ├── utils.ts              # cn(), formatCurrency(), etc.
│   │   └── constants.ts          # Config del dominio legal
│   │
│   ├── db/
│   │   ├── schema.ts             # Schema Drizzle (todas las tablas)
│   │   ├── migrations/           # Generadas por drizzle-kit
│   │   └── seed.ts               # Datos iniciales
│   │
│   ├── actions/                  # Server Actions
│   │   ├── contracts.ts
│   │   ├── leads.ts
│   │   ├── blog.ts
│   │   └── profile.ts
│   │
│   ├── hooks/
│   │   ├── use-calculator.ts
│   │   ├── use-animated-counter.ts
│   │   └── use-supabase.ts
│   │
│   ├── types/
│   │   ├── calculator.ts
│   │   ├── contract.ts
│   │   └── database.ts           # Inferidos de Drizzle schema
│   │
│   ├── styles/globals.css
│   ├── middleware.ts              # Auth + redirects
│   └── env.ts                    # Validación env vars con Zod
│
├── supabase/
│   ├── migrations/               # SQL puro para RLS policies, triggers
│   │   ├── 001_enable_rls.sql
│   │   ├── 002_policies.sql
│   │   └── 003_audit_trigger.sql
│   └── seed.sql
│
├── services/
│   └── pdf-generator/
│       ├── Dockerfile
│       ├── requirements.txt
│       ├── main.py               # FastAPI
│       ├── templates/
│       │   └── contrato-vehicular.html
│       └── tests/
│
├── n8n/
│   ├── blog-pipeline.json
│   ├── post-sale.json
│   └── social-media.json
│
└── docs/
    ├── formulas-legales.md
    ├── seo-strategy.md
    ├── security-checklist.md
    └── redirects-map.md
```

---

## Variables de Entorno (.env.example)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # SOLO server-side, NUNCA en client

# App
NEXT_PUBLIC_APP_URL=https://abogadosonlineecuador.com

# PDF Service (Railway)
PDF_SERVICE_URL=https://aoe-pdf.up.railway.app
PDF_SERVICE_API_KEY=sk_pdf_...

# n8n
N8N_WEBHOOK_SECRET=whsec_...

# Resend (Email)
RESEND_API_KEY=re_...

# Analytics
NEXT_PUBLIC_GA_ID=G-...
```

---

## Roadmap Actualizado (8 semanas)

### Semana 1: Setup
- [ ] `npx create-next-app@latest aoe-v2 --typescript --tailwind --app --src-dir`
- [ ] Crear proyecto en Supabase (nuevo, separado)
- [ ] Instalar: `drizzle-orm`, `@supabase/ssr`, `@supabase/supabase-js`, `framer-motion`, `zod`, `react-hook-form`
- [ ] Configurar Drizzle con Supabase PostgreSQL
- [ ] Configurar Supabase Auth (email/password + Google)
- [ ] Configurar middleware de auth
- [ ] env.ts con validación Zod
- [ ] Primer deploy en Vercel (aunque esté vacío)

### Semana 2-3: Landing + Diseño
- [ ] Design tokens en Tailwind (colores, tipografía, spacing)
- [ ] Componentes UI base
- [ ] Landing page completa con Framer Motion
- [ ] Header/Footer responsivo
- [ ] Páginas de servicios (SSG)
- [ ] Metadata API + JSON-LD en cada página
- [ ] Mobile-first verificado

### Semana 4: Calculadoras
- [ ] Funciones puras en lib/formulas/ con tests
- [ ] Componentes de calculadora (sliders, animated counters, charts)
- [ ] 4 calculadoras en sus propias URLs
- [ ] Schema SoftwareApplication
- [ ] Texto SEO alrededor de cada calculadora

### Semana 5: Auth + Dashboard
- [ ] Flujo completo: registro → verificar email → login
- [ ] Dashboard layout con sidebar
- [ ] Página de perfil
- [ ] Página de suscripción
- [ ] RLS policies en Supabase
- [ ] Middleware protegiendo /dashboard/*

### Semana 6: Contratos + Pagos
- [ ] Wizard multi-paso con React Hook Form + Zod
- [ ] PDF service en Railway (FastAPI + WeasyPrint)
- [ ] Template contrato vehicular
- [ ] Integración pasarela de pago
- [ ] Descarga segura con token temporal
- [ ] Email de confirmación (Resend)

### Semana 7: Blog + n8n
- [ ] Blog con MDX o desde Supabase
- [ ] ISR para posts
- [ ] n8n en Railway
- [ ] Workflows: post-venta, blog pipeline, social media
- [ ] Primeras pillar pages

### Semana 8: SEO + Seguridad + Lanzamiento
- [ ] Sitemap dinámico + robots.txt
- [ ] Redirecciones 301 del legacy
- [ ] OG images para cada página
- [ ] Google Search Console + GA4
- [ ] Core Web Vitals < thresholds
- [ ] Headers de seguridad verificados
- [ ] Deploy producción + dominio conectado

---

## Costo Total

| Servicio | MVP (mes 1-4) | Crecimiento (mes 5-8) | Escala (mes 9-12) |
|----------|---------------|----------------------|-------------------|
| Supabase | $0 | $25/mes | $25/mes |
| Vercel | $0 | $0 | $20/mes |
| Railway (n8n + PDF) | $8-10 | $10 | $10 |
| Resend | $0 | $0 | $20/mes (si >3k/día) |
| Cloudflare | $0 | $0 | $0 |
| **TOTAL** | **~$10/mes** | **~$35/mes** | **~$75/mes** |

---

## Conclusión

El estudio de arquitectura estaba al 90%. Los ajustes que hice son de **simplificación**, no de cambio de dirección:

1. **Supabase Auth en vez de Auth.js** → Menos complejidad, RLS nativo
2. **Sin monorepo** (por ahora) → Un solo proyecto, escalar después
3. **Sin tRPC** → Server Actions son suficientes
4. **Sin TanStack Query** (por ahora) → Caché de Next.js
5. **PDF service en Railway** → Zero mantenimiento, $5/mes extra

**El stack es robusto, rápido, y bueno.** Y lo más importante: es manejable para un solo desarrollador que también es abogado full-time.

**Estás listo para arrancar.** Crea el proyecto en Claude como "AOE v2", pega las instrucciones, y empieza por la Semana 1.
