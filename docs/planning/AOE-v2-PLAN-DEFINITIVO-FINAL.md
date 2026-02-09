# AOE v2 — Plan Definitivo para Crear el Proyecto

> **Versión**: FINAL  
> **Fecha**: Febrero 2026  
> **Estado**: Listo para implementar  
> **Tipo**: Proyecto NUEVO desde cero (Greenfield)

---

## 1. Nombre del Proyecto en Claude

**`AOE v2`**

---

## 2. Instrucciones del Proyecto

Copia EXACTAMENTE este bloque como **Project Instructions** en Claude:

```
## Contexto

Soy Jose Luis, abogado en Quito, Ecuador, 12+ años de experiencia notarial. Reconstruyo desde cero mi sitio abogadosonlineecuador.com como plataforma legal-tech moderna. NO es una migración — es un proyecto nuevo.

## Objetivo

Plataforma legal tecnológica que ofrezca:
1. Calculadoras notariales interactivas con animaciones premium
2. Generador de contratos vehiculares automatizado con pago integrado
3. Blog legal SEO-optimizado con generación de contenido via n8n
4. Sistema de autenticación y suscripciones (FREE/PREMIUM)
5. Chatbot de atención de primer nivel
6. Integración futura con sistema de verificación QR "Notaría Segura"

## Stack Técnico

- **Framework:** Next.js 15 (App Router + Turbopack)
- **Runtime:** React 19 + TypeScript 5 (strict mode)
- **Estilos:** Tailwind CSS 4 + Framer Motion 11
- **Base de Datos:** Supabase (PostgreSQL 16 gestionado)
- **Auth:** Supabase Auth (email/password + Google OAuth). NO usar Auth.js/NextAuth.
- **ORM:** Drizzle ORM conectado a Supabase PostgreSQL
- **Validación:** Zod en TODOS los inputs (server + client)
- **Forms:** React Hook Form + Zod resolver
- **API:** Server Actions de Next.js (NO tRPC, NO API routes manuales salvo webhooks)
- **Storage:** Supabase Storage (PDFs, imágenes, documentos)
- **Email:** Resend (3,000/día gratis)
- **PDF Generation:** Python + FastAPI + WeasyPrint (en Railway)
- **Automatización:** n8n (en Railway, $5/mes)
- **Deploy:** Vercel (Next.js) + Railway (n8n + PDF service)
- **DNS/CDN:** Cloudflare
- **Monitoreo:** Vercel Analytics + Supabase Dashboard
- **NO usar:** Auth.js, tRPC, TanStack Query, monorepo Turbo, Express, Prisma, Sanity CMS

## Arquitectura

```
Vercel (Next.js 15) ← Deploy automático desde Git
    ↕ Server Actions + API Routes (webhooks)
Supabase (PostgreSQL + Auth + Storage + RLS)
    ↕ Webhooks
Railway (n8n workflows + PDF service FastAPI)
    ↕
Resend (transactional email)
```

No hay servidor propio (i9). Todo es cloud gestionado.

## Estética y Diseño

- Estilo: Premium, trustworthy, minimalista con micro-interacciones
- Inspiración: Stripe (limpieza), Linear (dashboard), LegalZoom (estructura legal)
- Paleta primaria: Azul profundo (#1a365d), slate grises (#64748b, #f8fafc), acento cian (#06b6d4)
- Tipografía: Inter (body) + font display para headings
- Animaciones: Framer Motion — counters, sliders, gráficos en calculadoras, page transitions, scroll reveals
- Mobile-first OBLIGATORIO (70%+ del tráfico legal en Ecuador es móvil)
- Glassmorphism sutil en cards de servicios sobre fondo oscuro
- Dark/light mode (opcional, fase 2)

## Seguridad (Obligatorio en TODO el código)

- HTTPS obligatorio via Cloudflare + Vercel
- Supabase Auth para sesiones (NO JWT manual)
- Row Level Security (RLS) en TODAS las tablas con datos de usuario
  - Usar auth.uid() nativo de Supabase en policies
  - Cada usuario solo ve SUS contratos, SU perfil, SUS documentos
- Zod para validación de TODOS los inputs (server-side SIEMPRE)
- Server Actions validan datos ANTES de tocar la DB
- Queries parametrizadas SIEMPRE (Drizzle las hace por defecto)
- Rate limiting via Vercel middleware (5/min auth, 20/min contratos, 100/min calculadoras)
- Tokens de descarga de un solo uso para PDFs (UUID + expiración 24h)
- Supabase Storage con policies de acceso (solo dueño descarga su PDF)
- Headers de seguridad en next.config.ts (CSP, X-Frame-Options, HSTS, X-Content-Type-Options)
- Audit trail: tabla audit_log para acciones sobre datos sensibles
- Cumplimiento LOPDP Ecuador: consentimiento explícito, derecho al olvido, política de privacidad visible
- Backups: automáticos por Supabase (point-in-time recovery en plan Pro)
- Middleware Next.js protege /dashboard/* y /contratos/*
- API webhooks protegidos con secret compartido
- NUNCA exponer SUPABASE_SERVICE_ROLE_KEY al cliente

## SEO (Obligatorio en CADA página pública)

- Server Components para TODAS las páginas públicas (SSR/SSG nativo)
- Cada calculadora en su PROPIA URL (NO hash anchors #)
- generateMetadata() en cada page.tsx y layout.tsx
- Títulos: max 60 chars, keyword principal + marca
- Descriptions: max 155 chars, propuesta de valor + CTA
- Canonical URL en cada página
- Open Graph: og:title, og:description, og:image (1200x630px) en cada página
- JSON-LD Schema.org por tipo:
  - Home: LegalService
  - Calculadoras: SoftwareApplication
  - Blog posts: Article
  - FAQs: FAQPage
  - Servicios: Service
- Sitemap.xml dinámico (src/app/sitemap.ts)
- robots.ts dinámico (bloquear /api/, /dashboard/)
- next/image SIEMPRE con width, height, alt descriptivo (nunca <img>)
- Core Web Vitals: LCP <2.5s, INP <200ms, CLS <0.1
- Imágenes en WebP/AVIF con lazy loading
- Redirecciones 301 de TODAS las URLs del sitio legacy
- Internal linking: calculadoras ↔ servicios ↔ blog
- Google Search Console + GA4 con eventos de conversión
- Hreflang es-EC
- Blog: estrategia pillar pages + cluster articles
- URLs en español: /calculadoras/notarial/, /servicios/compraventas/

## Reglas de Código

- TypeScript strict mode (no `any`, no `as` innecesarios)
- Server Components por defecto, "use client" SOLO cuando sea necesario
- Funciones puras para fórmulas de calculadoras (en /lib/formulas/, testables)
- Server Actions para mutaciones (no API routes manuales)
- Variables de entorno: NUNCA hardcodear. Validar con Zod en env.ts
- Código: variables de dominio legal en español, código técnico en inglés
- Path aliases: @/components, @/lib, @/db, @/actions, @/hooks, @/types
- Error handling: error.tsx y not-found.tsx en cada segmento de ruta
- Loading states: loading.tsx con skeletons en cada página dinámica
- No instalar librerías innecesarias. Cada dependencia debe justificarse.
- Supabase clients:
  - Browser: createBrowserClient() en lib/supabase/client.ts
  - Server Component: createServerClient() en lib/supabase/server.ts
  - Server Action/Route: createServerClient() con cookies
  - Admin (service role): SOLO en server, NUNCA en client

## Dominio Legal Ecuatoriano

- Fórmulas de calculadoras basadas en tablas del Consejo de la Judicatura de Ecuador
- Contratos vehiculares requieren: datos del auto, comprador, vendedor
- Impuestos municipales: alcabalas, plusvalía, utilidad
- Calculadoras verificables contra facturas reales de notaría
- Documentos generados deben cumplir formato legal ecuatoriano
```

---

## 3. Estructura del Proyecto

```
aoe-v2/
├── next.config.ts                 # Config + headers de seguridad
├── tailwind.config.ts             # Design tokens, colores, fonts
├── drizzle.config.ts              # Conexión Drizzle → Supabase PG
├── .env.local                     # Variables de entorno (NO versionar)
├── .env.example                   # Template de variables
├── package.json
├── tsconfig.json
│
├── public/
│   ├── og/                        # Open Graph images (1200x630)
│   │   ├── home.png
│   │   ├── calculadora-notarial.png
│   │   └── ...
│   └── brand/                     # Logo, favicon, iconos
│       ├── logo.svg
│       ├── logo-horizontal.svg
│       └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout: fonts, metadata global, Supabase provider
│   │   ├── page.tsx               # Landing page (SSG)
│   │   ├── not-found.tsx          # 404 personalizado
│   │   ├── error.tsx              # Error boundary global
│   │   ├── sitemap.ts             # Sitemap dinámico
│   │   ├── robots.ts              # robots.txt dinámico
│   │   │
│   │   ├── (marketing)/           # ── Páginas públicas con SEO ──
│   │   │   ├── layout.tsx         # Header público + Footer
│   │   │   ├── servicios/
│   │   │   │   ├── page.tsx       # Listado de servicios (SSG)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Servicio individual (SSG)
│   │   │   ├── calculadoras/
│   │   │   │   ├── page.tsx       # Hub de calculadoras (SSG)
│   │   │   │   ├── notarial/
│   │   │   │   │   └── page.tsx   # Calculadora notarial
│   │   │   │   ├── alcabalas/
│   │   │   │   │   └── page.tsx   # Calculadora alcabalas
│   │   │   │   ├── plusvalia/
│   │   │   │   │   └── page.tsx   # Calculadora plusvalía
│   │   │   │   └── registro-propiedad/
│   │   │   │       └── page.tsx   # Calculadora registro
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx       # Blog listing (ISR)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Post individual (ISR)
│   │   │   ├── precios/
│   │   │   │   └── page.tsx       # Tabla de precios (SSG)
│   │   │   └── contacto/
│   │   │       └── page.tsx       # Contacto + Server Action
│   │   │
│   │   ├── (auth)/                # ── Autenticación ──
│   │   │   ├── layout.tsx         # Layout limpio (sin header completo)
│   │   │   ├── iniciar-sesion/
│   │   │   │   └── page.tsx
│   │   │   ├── registro/
│   │   │   │   └── page.tsx
│   │   │   ├── verificar-email/
│   │   │   │   └── page.tsx
│   │   │   ├── recuperar-contrasena/
│   │   │   │   └── page.tsx
│   │   │   └── auth/callback/
│   │   │       └── route.ts       # Callback OAuth de Supabase
│   │   │
│   │   ├── (dashboard)/           # ── Área privada (requiere auth) ──
│   │   │   ├── layout.tsx         # Sidebar + verificación auth
│   │   │   ├── page.tsx           # Dashboard home (resumen)
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx
│   │   │   ├── contratos/
│   │   │   │   ├── page.tsx       # Lista mis contratos
│   │   │   │   └── nuevo/
│   │   │   │       └── page.tsx   # Wizard generador
│   │   │   ├── documentos/
│   │   │   │   └── page.tsx
│   │   │   └── suscripcion/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                   # ── Solo webhooks y callbacks ──
│   │       └── webhooks/
│   │           ├── payment/
│   │           │   └── route.ts   # Webhook pasarela de pago
│   │           └── n8n/
│   │               └── route.ts   # Webhook para n8n
│   │
│   ├── components/
│   │   ├── ui/                    # Design system base
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   └── toast.tsx
│   │   ├── layout/                # Estructura de página
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── mobile-menu.tsx
│   │   │   └── sidebar.tsx
│   │   ├── landing/               # Secciones de landing page
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── stats.tsx
│   │   │   ├── calculator-preview.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── faq.tsx
│   │   │   └── cta.tsx
│   │   ├── calculators/           # Componentes de calculadoras
│   │   │   ├── calculator-shell.tsx
│   │   │   ├── slider-input.tsx
│   │   │   ├── animated-counter.tsx
│   │   │   ├── results-chart.tsx
│   │   │   └── results-table.tsx
│   │   ├── contracts/             # Wizard de contratos
│   │   │   ├── wizard-form.tsx
│   │   │   ├── step-indicator.tsx
│   │   │   ├── vehicle-data-form.tsx
│   │   │   ├── buyer-form.tsx
│   │   │   ├── seller-form.tsx
│   │   │   └── summary-step.tsx
│   │   ├── blog/                  # Blog
│   │   │   ├── post-card.tsx
│   │   │   ├── post-grid.tsx
│   │   │   ├── category-filter.tsx
│   │   │   └── table-of-contents.tsx
│   │   ├── auth/                  # Formularios auth
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   └── auth-guard.tsx
│   │   ├── dashboard/             # Área privada
│   │   │   ├── contracts-list.tsx
│   │   │   ├── profile-form.tsx
│   │   │   └── subscription-card.tsx
│   │   └── seo/                   # Helpers SEO
│   │       ├── json-ld.tsx
│   │       ├── breadcrumbs.tsx
│   │       └── faq-schema.tsx
│   │
│   ├── lib/
│   │   ├── supabase/              # Clientes Supabase
│   │   │   ├── client.ts          # createBrowserClient (para "use client")
│   │   │   ├── server.ts          # createServerClient (Server Components/Actions)
│   │   │   ├── admin.ts           # Service role (SOLO server, operaciones admin)
│   │   │   └── middleware.ts      # Helper para el middleware de auth
│   │   ├── formulas/              # Funciones puras de calculadoras
│   │   │   ├── notarial.ts        # Aranceles notariales
│   │   │   ├── notarial.test.ts   # Tests
│   │   │   ├── municipal.ts       # Alcabalas + plusvalía
│   │   │   ├── municipal.test.ts
│   │   │   ├── registro.ts        # Registro de la propiedad
│   │   │   ├── registro.test.ts
│   │   │   └── types.ts           # Interfaces compartidas
│   │   ├── validations/           # Schemas Zod
│   │   │   ├── contract.ts        # Validación contrato vehicular
│   │   │   ├── auth.ts            # Validación login/registro
│   │   │   ├── calculator.ts      # Validación inputs calculadora
│   │   │   ├── contact.ts         # Validación formulario contacto
│   │   │   └── index.ts           # Re-exports
│   │   ├── utils.ts               # cn(), formatCurrency(), formatDate()
│   │   └── constants.ts           # Constantes del dominio legal
│   │
│   ├── db/
│   │   ├── schema.ts              # Schema Drizzle (TODAS las tablas)
│   │   ├── migrations/            # Generadas por drizzle-kit push
│   │   └── seed.ts                # Datos iniciales (servicios, precios, blog)
│   │
│   ├── actions/                   # Server Actions (mutaciones)
│   │   ├── contracts.ts           # createContract, requestPdf, downloadPdf
│   │   ├── leads.ts               # saveLead, trackCalculatorUse
│   │   ├── blog.ts                # getPublishedPosts, getPostBySlug
│   │   ├── profile.ts             # updateProfile, deleteAccount
│   │   └── contact.ts             # submitContactForm
│   │
│   ├── hooks/                     # Custom React hooks (client-side)
│   │   ├── use-calculator.ts      # Lógica compartida calculadoras
│   │   ├── use-animated-counter.ts# Counter animado con Framer Motion
│   │   ├── use-supabase.ts        # Auth state listener
│   │   └── use-media-query.ts     # Responsive breakpoints
│   │
│   ├── types/                     # TypeScript types globales
│   │   ├── calculator.ts          # CalculatorInput, CalculatorResult
│   │   ├── contract.ts            # ContractData, ContractStatus
│   │   ├── blog.ts                # BlogPost, Category
│   │   └── database.ts            # Tipos inferidos del Drizzle schema
│   │
│   ├── styles/
│   │   └── globals.css            # Tailwind directives + CSS custom mínimo
│   │
│   ├── middleware.ts              # Auth redirect + rate limiting + headers
│   └── env.ts                     # Validación de env vars con Zod
│
├── supabase/                      # Config y migraciones SQL directas
│   ├── migrations/
│   │   ├── 001_enable_extensions.sql   # pgcrypto, uuid-ossp
│   │   ├── 002_enable_rls.sql          # RLS en todas las tablas
│   │   ├── 003_policies.sql            # Policies usando auth.uid()
│   │   └── 004_audit_trigger.sql       # Trigger para audit_log
│   ├── seed.sql                        # Datos iniciales
│   └── config.toml                     # Config Supabase CLI (opcional)
│
├── services/                      # Microservicio PDF (deploy en Railway)
│   └── pdf-generator/
│       ├── Dockerfile
│       ├── requirements.txt       # fastapi, uvicorn, jinja2, weasyprint
│       ├── main.py                # FastAPI endpoints
│       ├── templates/
│       │   ├── contrato-vehicular.html
│       │   ├── poder-general.html
│       │   └── base.html          # Layout base
│       └── tests/
│           └── test_pdf.py
│
├── n8n/                           # Workflows exportados (para importar en Railway)
│   ├── blog-content-pipeline.json # AI draft → review → publish → social
│   ├── post-sale-automation.json  # Pago → email PDF → guardar lead
│   └── social-media.json          # Publicar en LinkedIn/Instagram
│
└── docs/                          # Documentación del proyecto
    ├── formulas-legales.md        # Fórmulas verificadas de calculadoras
    ├── seo-strategy.md            # Keywords, URLs, schemas, redirects
    ├── security-checklist.md      # Checklist por fase
    └── redirects-map.md           # URLs legacy → URLs nuevas
```

---

## 4. Schema de Base de Datos (Drizzle + Supabase)

```typescript
// src/db/schema.ts
import { pgTable, uuid, text, timestamp, boolean, jsonb, numeric, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const userRoleEnum = pgEnum('user_role', ['FREE', 'PREMIUM', 'ADMIN'])
export const contractStatusEnum = pgEnum('contract_status', ['DRAFT', 'PAID', 'GENERATED', 'DOWNLOADED'])
export const documentTypeEnum = pgEnum('document_type', [
  'VEHICLE_CONTRACT', 'POWER_OF_ATTORNEY', 'DECLARATION',
  'PROMISE', 'TRANSFER', 'TRAVEL_AUTH', 'CUSTOM'
])

// Nota: La tabla auth.users la gestiona Supabase Auth automáticamente.
// Esta tabla extiende el perfil del usuario.
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().references(() => /* auth.users.id */),
  fullName: text('full_name'),
  phone: text('phone'),
  role: userRoleEnum('role').default('FREE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(), // refs auth.users
  type: documentTypeEnum('type').notNull(),
  data: jsonb('data').notNull(),        // Datos del formulario
  pdfUrl: text('pdf_url'),              // URL en Supabase Storage
  pdfHash: text('pdf_hash'),            // SHA-256 para integridad
  downloadToken: uuid('download_token'), // Token de un solo uso
  tokenExpiresAt: timestamp('token_expires_at'),
  status: contractStatusEnum('status').default('DRAFT').notNull(),
  paymentId: text('payment_id'),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  plan: userRoleEnum('plan').default('FREE').notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  active: boolean('active').default(true).notNull(),
  paymentMethod: text('payment_method'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email'),
  phone: text('phone'),
  source: text('source'),               // 'calculator', 'contact', 'chatbot'
  calculatorType: text('calculator_type'),
  data: jsonb('data'),                   // Contexto adicional
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const calculatorSessions = pgTable('calculator_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  visitorId: text('visitor_id'),         // Fingerprint anónimo
  type: text('type').notNull(),          // 'notarial', 'municipal', 'registro'
  inputs: jsonb('inputs').notNull(),
  result: jsonb('result').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),    // MDX o HTML
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  category: text('category'),
  tags: jsonb('tags').$type<string[]>(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  published: boolean('published').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  action: text('action').notNull(),       // 'contract.created', 'payment.processed', etc.
  resourceType: text('resource_type'),    // 'contract', 'profile', 'subscription'
  resourceId: uuid('resource_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

---

## 5. RLS Policies (Supabase SQL)

```sql
-- supabase/migrations/002_enable_rls.sql

-- Habilitar RLS en todas las tablas con datos de usuario
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Tablas públicas (sin RLS o con policy abierta de lectura)
-- blog_posts: lectura pública, escritura solo ADMIN
-- calculator_sessions: escritura pública (anónimo), lectura solo ADMIN
-- leads: escritura pública, lectura solo ADMIN

-- supabase/migrations/003_policies.sql

-- PROFILES: usuario solo ve/edita su perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- CONTRACTS: usuario solo ve/crea sus contratos
CREATE POLICY "Users can view own contracts"
  ON contracts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contracts"
  ON contracts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SUBSCRIPTIONS: usuario solo ve su suscripción
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- BLOG: lectura pública
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- ADMIN: acceso total (usando el role del JWT custom claim)
CREATE POLICY "Admins have full access to profiles"
  ON profiles FOR ALL
  USING (auth.jwt() ->> 'user_role' = 'ADMIN');

CREATE POLICY "Admins have full access to contracts"
  ON contracts FOR ALL
  USING (auth.jwt() ->> 'user_role' = 'ADMIN');
```

---

## 6. Variables de Entorno

```bash
# .env.example

# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...     # SOLO server-side, JAMÁS en client

# ── App ──
NEXT_PUBLIC_APP_URL=https://abogadosonlineecuador.com
NEXT_PUBLIC_APP_NAME="Abogados Online Ecuador"

# ── PDF Service (Railway) ──
PDF_SERVICE_URL=https://aoe-pdf-production.up.railway.app
PDF_SERVICE_API_KEY=sk_pdf_...

# ── n8n (Railway) ──
N8N_WEBHOOK_URL=https://aoe-n8n-production.up.railway.app
N8N_WEBHOOK_SECRET=whsec_...

# ── Email (Resend) ──
RESEND_API_KEY=re_...
EMAIL_FROM="Abogados Online Ecuador <noreply@abogadosonlineecuador.com>"

# ── Analytics ──
NEXT_PUBLIC_GA_ID=G-...

# ── Payments (cuando se integre) ──
# STRIPE_SECRET_KEY=sk_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# O PayPal equivalente
```

---

## 7. Dependencias (package.json)

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "drizzle-orm": "^0.38",
    "postgres": "^3.4",
    "zod": "^3.23",
    "react-hook-form": "^7.54",
    "@hookform/resolvers": "^3",
    "framer-motion": "^11",
    "resend": "^4",
    "lucide-react": "^0.460",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5.6",
    "@types/react": "^19",
    "@types/node": "^22",
    "tailwindcss": "^4",
    "drizzle-kit": "^0.30",
    "vitest": "^2",
    "@testing-library/react": "^16",
    "eslint": "^9",
    "eslint-config-next": "^15"
  }
}
```

---

## 8. Costos

| Servicio | MVP ($0-100 users) | Crecimiento (100-500) | Escala (500-2000) |
|----------|-------------------|-----------------------|-------------------|
| Supabase | $0 | $25/mes | $25/mes |
| Vercel | $0 | $0 | $20/mes |
| Railway (n8n + PDF) | $8-10/mes | $10/mes | $15/mes |
| Resend | $0 | $0 | $20/mes |
| Cloudflare | $0 | $0 | $0 |
| Dominio | $1/mes | $1/mes | $1/mes |
| **TOTAL** | **~$10/mes** | **~$36/mes** | **~$81/mes** |

---

## 9. Archivos a Subir al Proyecto Claude

| # | Archivo | Contenido | Prioridad |
|---|---------|-----------|-----------|
| 1 | **Project Instructions** | El bloque de la sección 2 (copiar directo) | OBLIGATORIO |
| 2 | `formulas-legales.md` | Fórmulas de calculadoras verificadas con ejemplos numéricos | OBLIGATORIO |
| 3 | `seo-strategy.md` | Keywords, estructura URLs, JSON-LD templates, redirects 301 | OBLIGATORIO |
| 4 | `security-checklist.md` | Checklist de seguridad por fase, RLS queries, headers | ALTA |
| 5 | `redirects-map.md` | Mapa completo URLs legacy → URLs nuevas | ALTA |
| 6 | `contrato-vehicular-template.html` | Template HTML/Jinja2 del contrato vehicular | MEDIA |
| 7 | `PROJECT_STRUCTURE.md` (legacy) | Solo como referencia de lo que existía antes | BAJA |

---

## 10. Roadmap de Implementación (8 semanas)

### Semana 1: Setup + Infraestructura
```bash
# Día 1: Crear proyecto
npx create-next-app@latest aoe-v2 --typescript --tailwind --app --src-dir --import-alias "@/*"
cd aoe-v2

# Día 1: Instalar dependencias
npm install @supabase/supabase-js @supabase/ssr drizzle-orm postgres zod react-hook-form @hookform/resolvers framer-motion resend lucide-react clsx tailwind-merge

npm install -D drizzle-kit vitest @testing-library/react

# Día 1: Crear proyecto en Supabase (nuevo, separado)
# Dashboard → New Project → Copiar URL + anon key + service role key

# Día 2: Configurar archivos base
# - env.ts (validación Zod)
# - lib/supabase/client.ts, server.ts, admin.ts, middleware.ts
# - db/schema.ts (todo el schema Drizzle)
# - drizzle.config.ts
# - middleware.ts (auth + headers)

# Día 3: Configurar Supabase Auth
# - Dashboard → Auth → Providers → habilitar Email + Google
# - Dashboard → Auth → URL Configuration → redirect URLs
# - Crear app/(auth)/auth/callback/route.ts

# Día 3: Primer push de migraciones
# drizzle-kit push
# Ejecutar RLS policies en SQL Editor de Supabase

# Día 4: Deploy inicial en Vercel
# - Conectar repo Git
# - Configurar env vars en Vercel
# - Verificar que builds correctamente (aunque esté vacío)

# Día 5: Configurar Cloudflare DNS
# - Apuntar dominio a Vercel
# - SSL automático
```

**Entregable Semana 1:** Proyecto desplegado en Vercel, Supabase conectado, auth funcionando (login/registro), schema de DB creado con RLS.

### Semana 2-3: Landing Page + Diseño Premium
- [ ] Design tokens en tailwind.config.ts (colores, fonts, spacing, shadows)
- [ ] Componentes UI base: Button, Card, Input, Badge, Modal, Skeleton, Slider
- [ ] Header responsivo con mobile menu (Framer Motion)
- [ ] Footer con links, legal, redes sociales
- [ ] **Landing page completa:**
  - Hero con animación por scroll (contrato armándose)
  - Features/servicios con cards glassmorphism
  - Preview de calculadora con slider + animated counter
  - Estadísticas animadas (counters al entrar en viewport)
  - Testimonios en carrusel
  - FAQ expandible con Schema FAQPage
  - CTA final
- [ ] Páginas de servicios (SSG con generateStaticParams)
- [ ] Página de precios
- [ ] Página de contacto con Server Action
- [ ] generateMetadata() en CADA page.tsx
- [ ] JSON-LD: LegalService (home), Service (cada servicio), FAQPage
- [ ] OG images para home y servicios

**Entregable Semana 3:** Landing page completa, responsiva, con SEO y animaciones. Visualmente premium.

### Semana 4: Calculadoras Interactivas
- [ ] Funciones puras en lib/formulas/ (notarial, municipal, registro)
- [ ] Tests unitarios con Vitest para CADA fórmula
- [ ] Componentes: CalculatorShell, SliderInput, AnimatedCounter, ResultsChart, ResultsTable
- [ ] hook useCalculator (lógica compartida)
- [ ] hook useAnimatedCounter (Framer Motion)
- [ ] 4 páginas de calculadoras, cada una en su URL
- [ ] Texto SEO explicativo alrededor de cada calculadora
- [ ] Schema SoftwareApplication en cada una
- [ ] Server Action para trackear uso (analytics → calculator_sessions)
- [ ] generateMetadata() con keywords específicos por calculadora

**Entregable Semana 4:** 4 calculadoras funcionando, bonitas, con animaciones, SEO, y analytics.

### Semana 5: Auth + Dashboard
- [ ] Flujo completo: registro → verificar email → login → dashboard
- [ ] Formularios auth con React Hook Form + Zod
- [ ] Google OAuth configurado
- [ ] Dashboard layout con sidebar
- [ ] Página de perfil (editar nombre, teléfono)
- [ ] Página de suscripción (FREE vs PREMIUM)
- [ ] Middleware protegiendo /dashboard/*
- [ ] Redirect de auth pages si ya estás logueado
- [ ] Crear profile automáticamente al registrarse (trigger SQL o Server Action)
- [ ] RLS policies verificadas (usuario no puede ver datos ajenos)

**Entregable Semana 5:** Sistema de auth completo, dashboard funcional, RLS verificado.

### Semana 6: Generador de Contratos + Pagos
- [ ] Wizard multi-paso: Vehicle Data → Buyer → Seller → Summary → Payment
- [ ] React Hook Form con Zod validation por paso
- [ ] Framer Motion transitions entre pasos
- [ ] Step indicator visual
- [ ] PDF service desplegado en Railway (FastAPI + WeasyPrint)
- [ ] Template HTML contrato-vehicular.html con Jinja2
- [ ] Server Action: createContract → procesar pago → llamar PDF service → guardar en Supabase Storage
- [ ] Token de descarga de un solo uso (UUID + 24h expiración)
- [ ] Email de confirmación con Resend
- [ ] Hash SHA-256 del PDF para verificación de integridad
- [ ] Audit log de cada contrato generado
- [ ] Integrar pasarela de pago (PayPal o Stripe)

**Entregable Semana 6:** Flujo completo de generación de contratos: formulario → pago → PDF → descarga → email.

### Semana 7: Blog + Automatización n8n
- [ ] Blog posts almacenados en tabla blog_posts de Supabase
- [ ] Admin simple para crear/editar posts (solo ADMIN)
- [ ] ISR para listing y posts individuales
- [ ] Schema Article en cada post
- [ ] Table of contents automático
- [ ] Related posts por categoría
- [ ] n8n desplegado en Railway
- [ ] Workflow: blog content pipeline (AI draft → revisión → publicar → redes)
- [ ] Workflow: post-venta (webhook pago → generar PDF → email → guardar lead)
- [ ] Workflow: social media (publicar en LinkedIn/Instagram)
- [ ] 3-5 pillar pages escritas como contenido inicial

**Entregable Semana 7:** Blog con contenido real, n8n automatizando post-venta y contenido social.

### Semana 8: SEO + Seguridad + Lanzamiento
- [ ] sitemap.ts dinámico (todas las páginas públicas + blog posts)
- [ ] robots.ts (bloquear /api/, /dashboard/)
- [ ] Redirecciones 301 de TODAS las URLs legacy (en next.config.ts redirects)
- [ ] OG images para CADA página principal
- [ ] Google Search Console: verificar propiedad, enviar sitemap
- [ ] GA4: eventos calculator_used, contract_started, contract_paid, blog_read
- [ ] Core Web Vitals verificados en PageSpeed Insights (LCP <2.5s, INP <200ms, CLS <0.1)
- [ ] Headers de seguridad en next.config.ts verificados en securityheaders.com
- [ ] Rate limiting en middleware verificado
- [ ] RLS double-check: intentar acceder datos ajenos como test
- [ ] Política de privacidad (LOPDP) publicada en /legal/privacidad
- [ ] Términos y condiciones en /legal/terminos
- [ ] Testing E2E: flujo completo de compra de contrato
- [ ] Deploy producción final
- [ ] Dominio conectado y verificado
- [ ] Google Business Profile actualizado
- [ ] Anuncio en redes sociales

**Entregable Semana 8:** Sitio en producción, SEO completo, seguridad verificada, listo para recibir tráfico real.

---

## 11. Prompts Clave para Claude

### Para arrancar el proyecto (Semana 1):
> "Inicializa el proyecto AOE v2. Crea la estructura de carpetas según las instrucciones del proyecto. Configura: env.ts con validación Zod, los 3 clientes de Supabase (client.ts, server.ts, admin.ts), el schema completo de Drizzle (db/schema.ts), el middleware.ts con protección de rutas, y el root layout.tsx con fonts Inter y metadata global. Todo en TypeScript strict."

### Para la landing page (Semana 2):
> "Crea la landing page completa de AOE v2. Estilo premium, minimalista, inspirado en Stripe. Usa Tailwind CSS 4 + Framer Motion. Incluye: hero con animación por scroll donde un contrato se arma visualmente, sección de servicios con cards glassmorphism sobre fondo oscuro, preview de calculadora con slider y animated counter, estadísticas con counters que animan al entrar en viewport, testimonios, FAQ expandible, y CTA. Mobile-first. generateMetadata() con SEO completo y JSON-LD LegalService."

### Para las calculadoras (Semana 4):
> "Crea la calculadora notarial ecuatoriana. Server Component para SEO (generateMetadata + JSON-LD SoftwareApplication), Client Component interno para interactividad. Sliders Tailwind para montos, Framer Motion animated counters y gráficos de barra en tiempo real. Fórmulas como funciones puras en lib/formulas/notarial.ts con tests. Texto SEO explicativo alrededor del widget. La fórmula está en el archivo formulas-legales.md."

### Para el wizard de contratos (Semana 6):
> "Crea el wizard multi-paso para contrato vehicular. React Hook Form + Zod por paso. Framer Motion transitions. Paso 1: Datos Auto (placa regex /^[A-Z]{3}-\d{3,4}$/, modelo, año, avalúo). Paso 2: Comprador (cédula 10 dígitos, nombre, dirección). Paso 3: Vendedor. Paso 4: Resumen + botón pagar. Server Action para crear el contrato en Supabase y disparar la generación del PDF."

---

## 12. Notas Finales

1. **Proyecto NUEVO desde cero.** El legacy es solo referencia para fórmulas y contenido.

2. **Todo cloud, zero servidores.** Vercel + Supabase + Railway. ~$10/mes para arrancar.

3. **Supabase es tu plataforma central.** PostgreSQL + Auth + Storage + RLS. Un solo dashboard para todo.

4. **SEO es prioridad #1.** Cada página nace con SSR, meta tags, Schema.org. No es post-lanzamiento.

5. **Seguridad no es opcional.** RLS con auth.uid(), validación Zod, tokens de descarga, audit log. Manejas cédulas y dinero.

6. **Las calculadoras son tu gancho de tráfico.** Gratis, espectaculares visualmente, posicionan en Google.

7. **El generador de contratos es tu negocio.** Wizard fácil, pago seguro, PDF profesional, entrega inmediata.

8. **n8n multiplica tu tiempo.** Blog automatizado, post-venta sin esfuerzo, redes sociales. Configúralo una vez.

9. **Sin sobre-ingeniería.** Sin monorepo, sin tRPC, sin TanStack Query. Un proyecto Next.js limpio. Escalar después si se necesita.
