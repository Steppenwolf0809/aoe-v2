# AOE v2 â€” Plan Definitivo para Crear el Proyecto

> **VersiÃ³n**: FINAL  
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

Soy Jose Luis, abogado en Quito, Ecuador, 12+ aÃ±os de experiencia notarial. Reconstruyo desde cero mi sitio abogadosonlineecuador.com como plataforma legal-tech moderna. NO es una migraciÃ³n â€” es un proyecto nuevo.

## Objetivo

Plataforma legal tecnolÃ³gica que ofrezca:
1. Calculadoras notariales interactivas con animaciones premium
2. Generador de contratos vehiculares automatizado con pago integrado
3. Blog legal SEO-optimizado con generaciÃ³n de contenido via n8n
4. Sistema de autenticación y dashboard de cliente post-venta (sin suscripción en MVP)
5. Chatbot de atenciÃ³n de primer nivel
6. IntegraciÃ³n futura con sistema de verificaciÃ³n QR "NotarÃ­a Segura"

## Stack TÃ©cnico

- **Framework:** Next.js 15 (App Router + Turbopack)
- **Runtime:** React 19 + TypeScript 5 (strict mode)
- **Estilos:** Tailwind CSS 4 + Framer Motion 11
- **Base de Datos:** Supabase (PostgreSQL 16 gestionado)
- **Auth:** Supabase Auth (email/password + Google OAuth). NO usar Auth.js/NextAuth.
- **ORM:** Drizzle ORM conectado a Supabase PostgreSQL
- **ValidaciÃ³n:** Zod en TODOS los inputs (server + client)
- **Forms:** React Hook Form + Zod resolver
- **API:** Server Actions de Next.js (NO tRPC, NO API routes manuales salvo webhooks)
- **Storage:** Supabase Storage (PDFs, imÃ¡genes, documentos)
- **Email:** Resend (3,000/dÃ­a gratis)
- **PDF Generation:** Python + FastAPI + WeasyPrint (en Railway)
- **AutomatizaciÃ³n:** n8n (en Railway, $5/mes)
- **Deploy:** Vercel (Next.js) + Railway (n8n + PDF service)
- **DNS/CDN:** Cloudflare
- **Monitoreo:** Vercel Analytics + Supabase Dashboard
- **NO usar:** Auth.js, tRPC, TanStack Query, monorepo Turbo, Express, Prisma, Sanity CMS

## Arquitectura

```
Vercel (Next.js 15) â† Deploy automÃ¡tico desde Git
    â†• Server Actions + API Routes (webhooks)
Supabase (PostgreSQL + Auth + Storage + RLS)
    â†• Webhooks
Railway (n8n workflows + PDF service FastAPI)
    â†•
Resend (transactional email)
```

No hay servidor propio (i9). Todo es cloud gestionado.

## EstÃ©tica y DiseÃ±o

- Estilo: Premium, trustworthy, minimalista con micro-interacciones
- InspiraciÃ³n: Stripe (limpieza), Linear (dashboard), LegalZoom (estructura legal)
- Paleta primaria: Azul profundo (#1a365d), slate grises (#64748b, #f8fafc), acento cian (#06b6d4)
- TipografÃ­a: Inter (body) + font display para headings
- Animaciones: Framer Motion â€” counters, sliders, grÃ¡ficos en calculadoras, page transitions, scroll reveals
- Mobile-first OBLIGATORIO (70%+ del trÃ¡fico legal en Ecuador es mÃ³vil)
- Glassmorphism sutil en cards de servicios sobre fondo oscuro
- Dark/light mode (opcional, fase 2)

## Seguridad (Obligatorio en TODO el cÃ³digo)

- HTTPS obligatorio via Cloudflare + Vercel
- Supabase Auth para sesiones (NO JWT manual)
- Row Level Security (RLS) en TODAS las tablas con datos de usuario
  - Usar auth.uid() nativo de Supabase en policies
  - Cada usuario solo ve SUS contratos, SU perfil, SUS documentos
- Zod para validaciÃ³n de TODOS los inputs (server-side SIEMPRE)
- Server Actions validan datos ANTES de tocar la DB
- Queries parametrizadas SIEMPRE (Drizzle las hace por defecto)
- Rate limiting via Vercel middleware (5/min auth, 20/min contratos, 100/min calculadoras)
- Tokens de descarga de un solo uso para PDFs (UUID + expiraciÃ³n 24h)
- Supabase Storage con policies de acceso (solo dueÃ±o descarga su PDF)
- Headers de seguridad en next.config.ts (CSP, X-Frame-Options, HSTS, X-Content-Type-Options)
- Audit trail: tabla audit_log para acciones sobre datos sensibles
- Cumplimiento LOPDP Ecuador: consentimiento explÃ­cito, derecho al olvido, polÃ­tica de privacidad visible
- Backups: automÃ¡ticos por Supabase (point-in-time recovery en plan Pro)
- Middleware Next.js protege /dashboard/* y /contratos/*
- API webhooks protegidos con secret compartido
- NUNCA exponer SUPABASE_SERVICE_ROLE_KEY al cliente

## SEO (Obligatorio en CADA pÃ¡gina pÃºblica)

- Server Components para TODAS las pÃ¡ginas pÃºblicas (SSR/SSG nativo)
- Cada calculadora en su PROPIA URL (NO hash anchors #)
- generateMetadata() en cada page.tsx y layout.tsx
- TÃ­tulos: max 60 chars, keyword principal + marca
- Descriptions: max 155 chars, propuesta de valor + CTA
- Canonical URL en cada pÃ¡gina
- Open Graph: og:title, og:description, og:image (1200x630px) en cada pÃ¡gina
- JSON-LD Schema.org por tipo:
  - Home: LegalService
  - Calculadoras: SoftwareApplication
  - Blog posts: Article
  - FAQs: FAQPage
  - Servicios: Service
- Sitemap.xml dinÃ¡mico (src/app/sitemap.ts)
- robots.ts dinÃ¡mico (bloquear /api/, /dashboard/)
- next/image SIEMPRE con width, height, alt descriptivo (nunca <img>)
- Core Web Vitals: LCP <2.5s, INP <200ms, CLS <0.1
- ImÃ¡genes en WebP/AVIF con lazy loading
- Redirecciones 301 de TODAS las URLs del sitio legacy
- Internal linking: calculadoras â†” servicios â†” blog
- Google Search Console + GA4 con eventos de conversiÃ³n
- Hreflang es-EC
- Blog: estrategia pillar pages + cluster articles
- URLs en espaÃ±ol: /calculadoras/notarial/, /servicios/compraventas/

## Reglas de CÃ³digo

- TypeScript strict mode (no `any`, no `as` innecesarios)
- Server Components por defecto, "use client" SOLO cuando sea necesario
- Funciones puras para fÃ³rmulas de calculadoras (en /lib/formulas/, testables)
- Server Actions para mutaciones (no API routes manuales)
- Variables de entorno: NUNCA hardcodear. Validar con Zod en env.ts
- CÃ³digo: variables de dominio legal en espaÃ±ol, cÃ³digo tÃ©cnico en inglÃ©s
- Path aliases: @/components, @/lib, @/db, @/actions, @/hooks, @/types
- Error handling: error.tsx y not-found.tsx en cada segmento de ruta
- Loading states: loading.tsx con skeletons en cada pÃ¡gina dinÃ¡mica
- No instalar librerÃ­as innecesarias. Cada dependencia debe justificarse.
- Supabase clients:
  - Browser: createBrowserClient() en lib/supabase/client.ts
  - Server Component: createServerClient() en lib/supabase/server.ts
  - Server Action/Route: createServerClient() con cookies
  - Admin (service role): SOLO en server, NUNCA en client

## Dominio Legal Ecuatoriano

- FÃ³rmulas de calculadoras basadas en tablas del Consejo de la Judicatura de Ecuador
- Contratos vehiculares requieren: datos del auto, comprador, vendedor
- Impuestos municipales: alcabalas, plusvalÃ­a, utilidad
- Calculadoras verificables contra facturas reales de notarÃ­a
- Documentos generados deben cumplir formato legal ecuatoriano
```

---

## 3. Estructura del Proyecto

```
aoe-v2/
â”œâ”€â”€ next.config.ts                 # Config + headers de seguridad
â”œâ”€â”€ tailwind.config.ts             # Design tokens, colores, fonts
â”œâ”€â”€ drizzle.config.ts              # ConexiÃ³n Drizzle â†’ Supabase PG
â”œâ”€â”€ .env.local                     # Variables de entorno (NO versionar)
â”œâ”€â”€ .env.example                   # Template de variables
â”œâ”€â”€ package.json
â”œâ”€â”€ tsconfig.json
â”‚
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ og/                        # Open Graph images (1200x630)
â”‚   â”‚   â”œâ”€â”€ home.png
â”‚   â”‚   â”œâ”€â”€ calculadora-notarial.png
â”‚   â”‚   â””â”€â”€ ...
â”‚   â””â”€â”€ brand/                     # Logo, favicon, iconos
â”‚       â”œâ”€â”€ logo.svg
â”‚       â”œâ”€â”€ logo-horizontal.svg
â”‚       â””â”€â”€ favicon.ico
â”‚
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ layout.tsx             # Root layout: fonts, metadata global, Supabase provider
â”‚   â”‚   â”œâ”€â”€ page.tsx               # Landing page (SSG)
â”‚   â”‚   â”œâ”€â”€ not-found.tsx          # 404 personalizado
â”‚   â”‚   â”œâ”€â”€ error.tsx              # Error boundary global
â”‚   â”‚   â”œâ”€â”€ sitemap.ts             # Sitemap dinÃ¡mico
â”‚   â”‚   â”œâ”€â”€ robots.ts              # robots.txt dinÃ¡mico
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ (marketing)/           # â”€â”€ PÃ¡ginas pÃºblicas con SEO â”€â”€
â”‚   â”‚   â”‚   â”œâ”€â”€ layout.tsx         # Header pÃºblico + Footer
â”‚   â”‚   â”‚   â”œâ”€â”€ servicios/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx       # Listado de servicios (SSG)
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [slug]/
â”‚   â”‚   â”‚   â”‚       â””â”€â”€ page.tsx   # Servicio individual (SSG)
â”‚   â”‚   â”‚   â”œâ”€â”€ calculadoras/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx       # Hub de calculadoras (SSG)
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ notarial/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx   # Calculadora notarial
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ alcabalas/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx   # Calculadora alcabalas
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ plusvalia/
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx   # Calculadora plusvalÃ­a
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ registro-propiedad/
â”‚   â”‚   â”‚   â”‚       â””â”€â”€ page.tsx   # Calculadora registro
â”‚   â”‚   â”‚   â”œâ”€â”€ blog/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx       # Blog listing (ISR)
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [slug]/
â”‚   â”‚   â”‚   â”‚       â””â”€â”€ page.tsx   # Post individual (ISR)
â”‚   â”‚   â”‚   â”œâ”€â”€ precios/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx       # Tabla de precios (SSG)
â”‚   â”‚   â”‚   â””â”€â”€ contacto/
â”‚   â”‚   â”‚       â””â”€â”€ page.tsx       # Contacto + Server Action
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ (auth)/                # â”€â”€ AutenticaciÃ³n â”€â”€
â”‚   â”‚   â”‚   â”œâ”€â”€ layout.tsx         # Layout limpio (sin header completo)
â”‚   â”‚   â”‚   â”œâ”€â”€ iniciar-sesion/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ registro/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ verificar-email/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ recuperar-contrasena/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”‚   â”‚   â””â”€â”€ auth/callback/
â”‚   â”‚   â”‚       â””â”€â”€ route.ts       # Callback OAuth de Supabase
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ (dashboard)/           # â”€â”€ Ãrea privada (requiere auth) â”€â”€
â”‚   â”‚   â”‚   â”œâ”€â”€ layout.tsx         # Sidebar + verificaciÃ³n auth
â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx           # Dashboard home (resumen)
â”‚   â”‚   â”‚   â”œâ”€â”€ perfil/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ contratos/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx       # Lista mis contratos
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ nuevo/
â”‚   â”‚   â”‚   â”‚       â””â”€â”€ page.tsx   # Wizard generador
â”‚   â”‚   â”‚   â”œâ”€â”€ documentos/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”‚   â”‚   â””â”€â”€ suscripcion/
â”‚   â”‚   â”‚       â””â”€â”€ page.tsx
â”‚   â”‚   â”‚
â”‚   â”‚   â””â”€â”€ api/                   # â”€â”€ Solo webhooks y callbacks â”€â”€
â”‚   â”‚       â””â”€â”€ webhooks/
â”‚   â”‚           â”œâ”€â”€ payment/
â”‚   â”‚           â”‚   â””â”€â”€ route.ts   # Webhook pasarela de pago
â”‚   â”‚           â””â”€â”€ n8n/
â”‚   â”‚               â””â”€â”€ route.ts   # Webhook para n8n
â”‚   â”‚
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ ui/                    # Design system base
â”‚   â”‚   â”‚   â”œâ”€â”€ button.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ card.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ input.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ select.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ modal.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ badge.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ skeleton.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ slider.tsx
â”‚   â”‚   â”‚   â””â”€â”€ toast.tsx
â”‚   â”‚   â”œâ”€â”€ layout/                # Estructura de pÃ¡gina
â”‚   â”‚   â”‚   â”œâ”€â”€ header.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ footer.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ mobile-menu.tsx
â”‚   â”‚   â”‚   â””â”€â”€ sidebar.tsx
â”‚   â”‚   â”œâ”€â”€ landing/               # Secciones de landing page
â”‚   â”‚   â”‚   â”œâ”€â”€ hero.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ features.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ stats.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ calculator-preview.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ testimonials.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ faq.tsx
â”‚   â”‚   â”‚   â””â”€â”€ cta.tsx
â”‚   â”‚   â”œâ”€â”€ calculators/           # Componentes de calculadoras
â”‚   â”‚   â”‚   â”œâ”€â”€ calculator-shell.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ slider-input.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ animated-counter.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ results-chart.tsx
â”‚   â”‚   â”‚   â””â”€â”€ results-table.tsx
â”‚   â”‚   â”œâ”€â”€ contracts/             # Wizard de contratos
â”‚   â”‚   â”‚   â”œâ”€â”€ wizard-form.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ step-indicator.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ vehicle-data-form.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ buyer-form.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ seller-form.tsx
â”‚   â”‚   â”‚   â””â”€â”€ summary-step.tsx
â”‚   â”‚   â”œâ”€â”€ blog/                  # Blog
â”‚   â”‚   â”‚   â”œâ”€â”€ post-card.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ post-grid.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ category-filter.tsx
â”‚   â”‚   â”‚   â””â”€â”€ table-of-contents.tsx
â”‚   â”‚   â”œâ”€â”€ auth/                  # Formularios auth
â”‚   â”‚   â”‚   â”œâ”€â”€ login-form.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ register-form.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ forgot-password-form.tsx
â”‚   â”‚   â”‚   â””â”€â”€ auth-guard.tsx
â”‚   â”‚   â”œâ”€â”€ dashboard/             # Ãrea privada
â”‚   â”‚   â”‚   â”œâ”€â”€ contracts-list.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ profile-form.tsx
â”‚   â”‚   â”‚   â””â”€â”€ subscription-card.tsx
â”‚   â”‚   â””â”€â”€ seo/                   # Helpers SEO
â”‚   â”‚       â”œâ”€â”€ json-ld.tsx
â”‚   â”‚       â”œâ”€â”€ breadcrumbs.tsx
â”‚   â”‚       â””â”€â”€ faq-schema.tsx
â”‚   â”‚
â”‚   â”œâ”€â”€ lib/
â”‚   â”‚   â”œâ”€â”€ supabase/              # Clientes Supabase
â”‚   â”‚   â”‚   â”œâ”€â”€ client.ts          # createBrowserClient (para "use client")
â”‚   â”‚   â”‚   â”œâ”€â”€ server.ts          # createServerClient (Server Components/Actions)
â”‚   â”‚   â”‚   â”œâ”€â”€ admin.ts           # Service role (SOLO server, operaciones admin)
â”‚   â”‚   â”‚   â””â”€â”€ middleware.ts      # Helper para el middleware de auth
â”‚   â”‚   â”œâ”€â”€ formulas/              # Funciones puras de calculadoras
â”‚   â”‚   â”‚   â”œâ”€â”€ notarial.ts        # Aranceles notariales
â”‚   â”‚   â”‚   â”œâ”€â”€ notarial.test.ts   # Tests
â”‚   â”‚   â”‚   â”œâ”€â”€ municipal.ts       # Alcabalas + plusvalÃ­a
â”‚   â”‚   â”‚   â”œâ”€â”€ municipal.test.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ registro.ts        # Registro de la propiedad
â”‚   â”‚   â”‚   â”œâ”€â”€ registro.test.ts
â”‚   â”‚   â”‚   â””â”€â”€ types.ts           # Interfaces compartidas
â”‚   â”‚   â”œâ”€â”€ validations/           # Schemas Zod
â”‚   â”‚   â”‚   â”œâ”€â”€ contract.ts        # ValidaciÃ³n contrato vehicular
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.ts            # ValidaciÃ³n login/registro
â”‚   â”‚   â”‚   â”œâ”€â”€ calculator.ts      # ValidaciÃ³n inputs calculadora
â”‚   â”‚   â”‚   â”œâ”€â”€ contact.ts         # ValidaciÃ³n formulario contacto
â”‚   â”‚   â”‚   â””â”€â”€ index.ts           # Re-exports
â”‚   â”‚   â”œâ”€â”€ utils.ts               # cn(), formatCurrency(), formatDate()
â”‚   â”‚   â””â”€â”€ constants.ts           # Constantes del dominio legal
â”‚   â”‚
â”‚   â”œâ”€â”€ db/
â”‚   â”‚   â”œâ”€â”€ schema.ts              # Schema Drizzle (TODAS las tablas)
â”‚   â”‚   â”œâ”€â”€ migrations/            # Generadas por drizzle-kit push
â”‚   â”‚   â””â”€â”€ seed.ts                # Datos iniciales (servicios, precios, blog)
â”‚   â”‚
â”‚   â”œâ”€â”€ actions/                   # Server Actions (mutaciones)
â”‚   â”‚   â”œâ”€â”€ contracts.ts           # createContract, requestPdf, downloadPdf
â”‚   â”‚   â”œâ”€â”€ leads.ts               # saveLead, trackCalculatorUse
â”‚   â”‚   â”œâ”€â”€ blog.ts                # getPublishedPosts, getPostBySlug
â”‚   â”‚   â”œâ”€â”€ profile.ts             # updateProfile, deleteAccount
â”‚   â”‚   â””â”€â”€ contact.ts             # submitContactForm
â”‚   â”‚
â”‚   â”œâ”€â”€ hooks/                     # Custom React hooks (client-side)
â”‚   â”‚   â”œâ”€â”€ use-calculator.ts      # LÃ³gica compartida calculadoras
â”‚   â”‚   â”œâ”€â”€ use-animated-counter.ts# Counter animado con Framer Motion
â”‚   â”‚   â”œâ”€â”€ use-supabase.ts        # Auth state listener
â”‚   â”‚   â””â”€â”€ use-media-query.ts     # Responsive breakpoints
â”‚   â”‚
â”‚   â”œâ”€â”€ types/                     # TypeScript types globales
â”‚   â”‚   â”œâ”€â”€ calculator.ts          # CalculatorInput, CalculatorResult
â”‚   â”‚   â”œâ”€â”€ contract.ts            # ContractData, ContractStatus
â”‚   â”‚   â”œâ”€â”€ blog.ts                # BlogPost, Category
â”‚   â”‚   â””â”€â”€ database.ts            # Tipos inferidos del Drizzle schema
â”‚   â”‚
â”‚   â”œâ”€â”€ styles/
â”‚   â”‚   â””â”€â”€ globals.css            # Tailwind directives + CSS custom mÃ­nimo
â”‚   â”‚
â”‚   â”œâ”€â”€ middleware.ts              # Auth redirect + rate limiting + headers
â”‚   â””â”€â”€ env.ts                     # ValidaciÃ³n de env vars con Zod
â”‚
â”œâ”€â”€ supabase/                      # Config y migraciones SQL directas
â”‚   â”œâ”€â”€ migrations/
â”‚   â”‚   â”œâ”€â”€ 001_enable_extensions.sql   # pgcrypto, uuid-ossp
â”‚   â”‚   â”œâ”€â”€ 002_enable_rls.sql          # RLS en todas las tablas
â”‚   â”‚   â”œâ”€â”€ 003_policies.sql            # Policies usando auth.uid()
â”‚   â”‚   â””â”€â”€ 004_audit_trigger.sql       # Trigger para audit_log
â”‚   â”œâ”€â”€ seed.sql                        # Datos iniciales
â”‚   â””â”€â”€ config.toml                     # Config Supabase CLI (opcional)
â”‚
â”œâ”€â”€ services/                      # Microservicio PDF (deploy en Railway)
â”‚   â””â”€â”€ pdf-generator/
â”‚       â”œâ”€â”€ Dockerfile
â”‚       â”œâ”€â”€ requirements.txt       # fastapi, uvicorn, jinja2, weasyprint
â”‚       â”œâ”€â”€ main.py                # FastAPI endpoints
â”‚       â”œâ”€â”€ templates/
â”‚       â”‚   â”œâ”€â”€ contrato-vehicular.html
â”‚       â”‚   â”œâ”€â”€ poder-general.html
â”‚       â”‚   â””â”€â”€ base.html          # Layout base
â”‚       â””â”€â”€ tests/
â”‚           â””â”€â”€ test_pdf.py
â”‚
â”œâ”€â”€ n8n/                           # Workflows exportados (para importar en Railway)
â”‚   â”œâ”€â”€ blog-content-pipeline.json # AI draft â†’ review â†’ publish â†’ social
â”‚   â”œâ”€â”€ post-sale-automation.json  # Pago â†’ email PDF â†’ guardar lead
â”‚   â””â”€â”€ social-media.json          # Publicar en LinkedIn/Instagram
â”‚
â””â”€â”€ docs/                          # DocumentaciÃ³n del proyecto
    â”œâ”€â”€ formulas-legales.md        # FÃ³rmulas verificadas de calculadoras
    â”œâ”€â”€ seo-strategy.md            # Keywords, URLs, schemas, redirects
    â”œâ”€â”€ security-checklist.md      # Checklist por fase
    â””â”€â”€ redirects-map.md           # URLs legacy â†’ URLs nuevas
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

// Nota: La tabla auth.users la gestiona Supabase Auth automÃ¡ticamente.
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
  visitorId: text('visitor_id'),         // Fingerprint anÃ³nimo
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

-- Tablas pÃºblicas (sin RLS o con policy abierta de lectura)
-- blog_posts: lectura pÃºblica, escritura solo ADMIN
-- calculator_sessions: escritura pÃºblica (anÃ³nimo), lectura solo ADMIN
-- leads: escritura pÃºblica, lectura solo ADMIN

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

-- SUBSCRIPTIONS: usuario solo ve su suscripciÃ³n
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- BLOG: lectura pÃºblica
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

# â”€â”€ Supabase â”€â”€
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...     # SOLO server-side, JAMÃS en client

# â”€â”€ App â”€â”€
NEXT_PUBLIC_APP_URL=https://abogadosonlineecuador.com
NEXT_PUBLIC_APP_NAME="Abogados Online Ecuador"

# â”€â”€ PDF Service (Railway) â”€â”€
PDF_SERVICE_URL=https://aoe-pdf-production.up.railway.app
PDF_SERVICE_API_KEY=sk_pdf_...

# â”€â”€ n8n (Railway) â”€â”€
N8N_WEBHOOK_URL=https://aoe-n8n-production.up.railway.app
N8N_WEBHOOK_SECRET=whsec_...

# â”€â”€ Email (Resend) â”€â”€
RESEND_API_KEY=re_...
EMAIL_FROM="Abogados Online Ecuador <noreply@abogadosonlineecuador.com>"

# â”€â”€ Analytics â”€â”€
NEXT_PUBLIC_GA_ID=G-...

# â”€â”€ Payments (cuando se integre) â”€â”€
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
| 1 | **Project Instructions** | El bloque de la secciÃ³n 2 (copiar directo) | OBLIGATORIO |
| 2 | `formulas-legales.md` | FÃ³rmulas de calculadoras verificadas con ejemplos numÃ©ricos | OBLIGATORIO |
| 3 | `seo-strategy.md` | Keywords, estructura URLs, JSON-LD templates, redirects 301 | OBLIGATORIO |
| 4 | `security-checklist.md` | Checklist de seguridad por fase, RLS queries, headers | ALTA |
| 5 | `redirects-map.md` | Mapa completo URLs legacy â†’ URLs nuevas | ALTA |
| 6 | `contrato-vehicular-template.html` | Template HTML/Jinja2 del contrato vehicular | MEDIA |
| 7 | `PROJECT_STRUCTURE.md` (legacy) | Solo como referencia de lo que existÃ­a antes | BAJA |

---

## 10. Roadmap de ImplementaciÃ³n (8 semanas)

### Semana 1: Setup + Infraestructura
```bash
# DÃ­a 1: Crear proyecto
npx create-next-app@latest aoe-v2 --typescript --tailwind --app --src-dir --import-alias "@/*"
cd aoe-v2

# DÃ­a 1: Instalar dependencias
npm install @supabase/supabase-js @supabase/ssr drizzle-orm postgres zod react-hook-form @hookform/resolvers framer-motion resend lucide-react clsx tailwind-merge

npm install -D drizzle-kit vitest @testing-library/react

# DÃ­a 1: Crear proyecto en Supabase (nuevo, separado)
# Dashboard â†’ New Project â†’ Copiar URL + anon key + service role key

# DÃ­a 2: Configurar archivos base
# - env.ts (validaciÃ³n Zod)
# - lib/supabase/client.ts, server.ts, admin.ts, middleware.ts
# - db/schema.ts (todo el schema Drizzle)
# - drizzle.config.ts
# - middleware.ts (auth + headers)

# DÃ­a 3: Configurar Supabase Auth
# - Dashboard â†’ Auth â†’ Providers â†’ habilitar Email + Google
# - Dashboard â†’ Auth â†’ URL Configuration â†’ redirect URLs
# - Crear app/(auth)/auth/callback/route.ts

# DÃ­a 3: Primer push de migraciones
# drizzle-kit push
# Ejecutar RLS policies en SQL Editor de Supabase

# DÃ­a 4: Deploy inicial en Vercel
# - Conectar repo Git
# - Configurar env vars en Vercel
# - Verificar que builds correctamente (aunque estÃ© vacÃ­o)

# DÃ­a 5: Configurar Cloudflare DNS
# - Apuntar dominio a Vercel
# - SSL automÃ¡tico
```

**Entregable Semana 1:** Proyecto desplegado en Vercel, Supabase conectado, auth funcionando (login/registro), schema de DB creado con RLS.

### Semana 2-3: Landing Page + DiseÃ±o Premium
- [ ] Design tokens en tailwind.config.ts (colores, fonts, spacing, shadows)
- [ ] Componentes UI base: Button, Card, Input, Badge, Modal, Skeleton, Slider
- [ ] Header responsivo con mobile menu (Framer Motion)
- [ ] Footer con links, legal, redes sociales
- [ ] **Landing page completa:**
  - Hero con animaciÃ³n por scroll (contrato armÃ¡ndose)
  - Features/servicios con cards glassmorphism
  - Preview de calculadora con slider + animated counter
  - EstadÃ­sticas animadas (counters al entrar en viewport)
  - Testimonios en carrusel
  - FAQ expandible con Schema FAQPage
  - CTA final
- [ ] PÃ¡ginas de servicios (SSG con generateStaticParams)
- [ ] PÃ¡gina de precios
- [ ] PÃ¡gina de contacto con Server Action
- [ ] generateMetadata() en CADA page.tsx
- [ ] JSON-LD: LegalService (home), Service (cada servicio), FAQPage
- [ ] OG images para home y servicios

**Entregable Semana 3:** Landing page completa, responsiva, con SEO y animaciones. Visualmente premium.

### Semana 4: Calculadoras Interactivas
- [ ] Funciones puras en lib/formulas/ (notarial, municipal, registro)
- [ ] Tests unitarios con Vitest para CADA fÃ³rmula
- [ ] Componentes: CalculatorShell, SliderInput, AnimatedCounter, ResultsChart, ResultsTable
- [ ] hook useCalculator (lÃ³gica compartida)
- [ ] hook useAnimatedCounter (Framer Motion)
- [ ] 4 pÃ¡ginas de calculadoras, cada una en su URL
- [ ] Texto SEO explicativo alrededor de cada calculadora
- [ ] Schema SoftwareApplication en cada una
- [ ] Server Action para trackear uso (analytics â†’ calculator_sessions)
- [ ] generateMetadata() con keywords especÃ­ficos por calculadora

**Entregable Semana 4:** 4 calculadoras funcionando, bonitas, con animaciones, SEO, y analytics.

### Semana 5: Auth + Dashboard
- [ ] Flujo completo: registro → verificar email → login → dashboard
- [ ] Formularios auth con React Hook Form + Zod
- [ ] Google OAuth configurado
- [ ] Dashboard layout con sidebar
- [ ] Página de perfil (editar nombre, teléfono)
- [ ] Dashboard cliente MVP orientado a post-venta (sin cobro recurrente)
- [ ] Módulo de seguimiento de trámite (estado actual, próximo paso, responsable y fecha estimada)
- [ ] Módulo de documentos (checklist + subida/descarga de archivos del cliente)
- [ ] Módulo de comunicación básica (eventos/notas y notificación por email)
- [ ] Middleware protegiendo /dashboard/*
- [ ] Redirect de auth pages si ya estás logueado
- [ ] Crear profile automáticamente al registrarse (trigger SQL o Server Action)
- [ ] RLS policies verificadas (usuario no puede ver datos ajenos)

**Entregable Semana 5:** Sistema de auth completo y dashboard cliente MVP funcional para seguimiento post-venta, con RLS verificado.

### Semana 6: Generador de Contratos + Pagos
- [ ] Wizard multi-paso: Vehicle Data â†’ Buyer â†’ Seller â†’ Summary â†’ Payment
- [ ] React Hook Form con Zod validation por paso
- [ ] Framer Motion transitions entre pasos
- [ ] Step indicator visual
- [ ] PDF service desplegado en Railway (FastAPI + WeasyPrint)
- [ ] Template HTML contrato-vehicular.html con Jinja2
- [ ] Server Action: createContract â†’ procesar pago â†’ llamar PDF service â†’ guardar en Supabase Storage
- [ ] Token de descarga de un solo uso (UUID + 24h expiraciÃ³n)
- [ ] Email de confirmaciÃ³n con Resend
- [ ] Hash SHA-256 del PDF para verificaciÃ³n de integridad
- [ ] Audit log de cada contrato generado
- [ ] Integrar pasarela de pago (PayPal o Stripe)

**Entregable Semana 6:** Flujo completo de generaciÃ³n de contratos: formulario â†’ pago â†’ PDF â†’ descarga â†’ email.

### Semana 7: Blog + AutomatizaciÃ³n n8n
- [ ] Blog posts almacenados en tabla blog_posts de Supabase
- [ ] Admin simple para crear/editar posts (solo ADMIN)
- [ ] ISR para listing y posts individuales
- [ ] Schema Article en cada post
- [ ] Table of contents automÃ¡tico
- [ ] Related posts por categorÃ­a
- [ ] n8n desplegado en Railway
- [ ] Workflow: blog content pipeline (AI draft â†’ revisiÃ³n â†’ publicar â†’ redes)
- [ ] Workflow: post-venta (webhook pago â†’ generar PDF â†’ email â†’ guardar lead)
- [ ] Workflow: social media (publicar en LinkedIn/Instagram)
- [ ] 3-5 pillar pages escritas como contenido inicial

**Entregable Semana 7:** Blog con contenido real, n8n automatizando post-venta y contenido social.

### Semana 8: SEO + Seguridad + Lanzamiento
- [ ] sitemap.ts dinÃ¡mico (todas las pÃ¡ginas pÃºblicas + blog posts)
- [ ] robots.ts (bloquear /api/, /dashboard/)
- [ ] Redirecciones 301 de TODAS las URLs legacy (en next.config.ts redirects)
- [ ] OG images para CADA pÃ¡gina principal
- [ ] Google Search Console: verificar propiedad, enviar sitemap
- [ ] GA4: eventos calculator_used, contract_started, contract_paid, blog_read
- [ ] Core Web Vitals verificados en PageSpeed Insights (LCP <2.5s, INP <200ms, CLS <0.1)
- [ ] Headers de seguridad en next.config.ts verificados en securityheaders.com
- [ ] Rate limiting en middleware verificado
- [ ] RLS double-check: intentar acceder datos ajenos como test
- [ ] PolÃ­tica de privacidad (LOPDP) publicada en /legal/privacidad
- [ ] TÃ©rminos y condiciones en /legal/terminos
- [ ] Testing E2E: flujo completo de compra de contrato
- [ ] Deploy producciÃ³n final
- [ ] Dominio conectado y verificado
- [ ] Google Business Profile actualizado
- [ ] Anuncio en redes sociales

**Entregable Semana 8:** Sitio en producciÃ³n, SEO completo, seguridad verificada, listo para recibir trÃ¡fico real.

---

## 11. Prompts Clave para Claude

### Para arrancar el proyecto (Semana 1):
> "Inicializa el proyecto AOE v2. Crea la estructura de carpetas segÃºn las instrucciones del proyecto. Configura: env.ts con validaciÃ³n Zod, los 3 clientes de Supabase (client.ts, server.ts, admin.ts), el schema completo de Drizzle (db/schema.ts), el middleware.ts con protecciÃ³n de rutas, y el root layout.tsx con fonts Inter y metadata global. Todo en TypeScript strict."

### Para la landing page (Semana 2):
> "Crea la landing page completa de AOE v2. Estilo premium, minimalista, inspirado en Stripe. Usa Tailwind CSS 4 + Framer Motion. Incluye: hero con animaciÃ³n por scroll donde un contrato se arma visualmente, secciÃ³n de servicios con cards glassmorphism sobre fondo oscuro, preview de calculadora con slider y animated counter, estadÃ­sticas con counters que animan al entrar en viewport, testimonios, FAQ expandible, y CTA. Mobile-first. generateMetadata() con SEO completo y JSON-LD LegalService."

### Para las calculadoras (Semana 4):
> "Crea la calculadora notarial ecuatoriana. Server Component para SEO (generateMetadata + JSON-LD SoftwareApplication), Client Component interno para interactividad. Sliders Tailwind para montos, Framer Motion animated counters y grÃ¡ficos de barra en tiempo real. FÃ³rmulas como funciones puras en lib/formulas/notarial.ts con tests. Texto SEO explicativo alrededor del widget. La fÃ³rmula estÃ¡ en el archivo formulas-legales.md."

### Para auth + dashboard cliente (Semana 5 / PROMPT 14):
> "Crea el dashboard de cliente MVP para AOE v2 (sin suscripción de pago recurrente). Objetivo: portal post-venta para clientes de trámites como compraventa. Debe incluir: (1) timeline/estado del trámite con estado actual, próximo paso, responsable y fecha estimada; (2) módulo de documentos con checklist y subida/descarga de archivos; (3) módulo de comunicación básica con eventos/notas y notificaciones por email vía Resend. Usa Supabase Auth + RLS para que cada usuario vea solo sus datos, React Hook Form + Zod para formularios, Server Actions para mutaciones, y UI mobile-first con sidebar simple."

### Para el wizard de contratos (Semana 6):
> "Crea el wizard multi-paso para contrato vehicular. React Hook Form + Zod por paso. Framer Motion transitions. Paso 1: Datos Auto (placa regex /^[A-Z]{3}-\d{3,4}$/, modelo, aÃ±o, avalÃºo). Paso 2: Comprador (cÃ©dula 10 dÃ­gitos, nombre, direcciÃ³n). Paso 3: Vendedor. Paso 4: Resumen + botÃ³n pagar. Server Action para crear el contrato en Supabase y disparar la generaciÃ³n del PDF."

---

## 12. Notas Finales

1. **Proyecto NUEVO desde cero.** El legacy es solo referencia para fÃ³rmulas y contenido.

2. **Todo cloud, zero servidores.** Vercel + Supabase + Railway. ~$10/mes para arrancar.

3. **Supabase es tu plataforma central.** PostgreSQL + Auth + Storage + RLS. Un solo dashboard para todo.

4. **SEO es prioridad #1.** Cada pÃ¡gina nace con SSR, meta tags, Schema.org. No es post-lanzamiento.

5. **Seguridad no es opcional.** RLS con auth.uid(), validaciÃ³n Zod, tokens de descarga, audit log. Manejas cÃ©dulas y dinero.

6. **Las calculadoras son tu gancho de trÃ¡fico.** Gratis, espectaculares visualmente, posicionan en Google.

7. **El generador de contratos es tu negocio.** Wizard fÃ¡cil, pago seguro, PDF profesional, entrega inmediata.

8. **n8n multiplica tu tiempo.** Blog automatizado, post-venta sin esfuerzo, redes sociales. ConfigÃºralo una vez.

9. **Sin sobre-ingenierÃ­a.** Sin monorepo, sin tRPC, sin TanStack Query. Un proyecto Next.js limpio. Escalar despuÃ©s si se necesita.
