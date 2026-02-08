# PROMPT 01 — Inicialización del Proyecto AOE v2

> **Copia y pega este prompt completo en Claude Code**

---

## Contexto previo OBLIGATORIO

Antes de ejecutar CUALQUIER comando, lee estos archivos del proyecto:

1. **Brain del proyecto:** `D:\001 AOEV2\.agent\brain.md` — Contiene el stack técnico ESTRICTO, reglas de diseño, reglas de código, y el workflow obligatorio del agente.
2. **Plan definitivo:** `D:\001 AOEV2\.agent\AOE-v2-PLAN-DEFINITIVO-FINAL.md` — Contiene la estructura completa de carpetas, schema de DB, variables de entorno, y dependencias.
3. **Design plan:** `D:\001 AOEV2\.agent\design\LANDING_PAGE_DESIGN_PLAN.md` — Contiene el plan visual de la landing page.

Lee los 3 archivos COMPLETOS antes de escribir una sola línea de código.

---

## Tarea: Inicializar el proyecto AOE v2

### Paso 1 — Crear la app Next.js 15

Ejecuta en `D:\001 AOEV2\`:

```bash
npx create-next-app@latest aoe-v2 --typescript --tailwind --app --src-dir --import-alias "@/*" --turbopack
```

Opciones del wizard:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **Yes**
- App Router: **Yes**
- Import alias `@/*`: **Yes**

### Paso 2 — Instalar dependencias del proyecto

```bash
cd aoe-v2

# Dependencias de producción
npm install @supabase/supabase-js @supabase/ssr drizzle-orm postgres zod react-hook-form @hookform/resolvers framer-motion resend lucide-react clsx tailwind-merge

# Dependencias de desarrollo
npm install -D drizzle-kit vitest @testing-library/react
```

**NO instalar** nada más. Ni Auth.js, ni tRPC, ni TanStack Query, ni Prisma, ni Express. El brain.md tiene una lista negra explícita.

### Paso 3 — Crear la estructura completa de carpetas

Crea TODAS estas carpetas y archivos placeholder. Los archivos deben tener contenido funcional mínimo (no vacíos), con el export correcto y un comentario `// TODO: implementar` donde corresponda.

para la landing tambien revisa y toma en cuenta el archivo D:\001 AOEV2\.agent\design\LANDING_PAGE_DESIGN_PLAN.md  pero puedes palicar el diseño que consideres mejor. 
```
src/
├── app/
│   ├── layout.tsx             # Root layout con: Inter font (next/font/google), metadata global, <html lang="es">
│   ├── page.tsx               # Landing page placeholder (Server Component)
│   ├── not-found.tsx          # 404 personalizado con diseño glass
│   ├── error.tsx              # Error boundary global ("use client")
│   ├── sitemap.ts             # Sitemap dinámico (export default function)
│   ├── robots.ts              # robots.txt (bloquear /api/, /dashboard/)
│   │
│   ├── (marketing)/           # Páginas públicas con SEO
│   │   ├── layout.tsx         # Header público + Footer
│   │   ├── servicios/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── calculadoras/
│   │   │   ├── page.tsx       # Hub de calculadoras
│   │   │   ├── notarial/
│   │   │   │   └── page.tsx
│   │   │   ├── alcabalas/
│   │   │   │   └── page.tsx
│   │   │   ├── plusvalia/
│   │   │   │   └── page.tsx
│   │   │   └── registro-propiedad/
│   │   │       └── page.tsx
            -----consejo-provincial
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── precios/
│   │   │   └── page.tsx
│   │   └── contacto/
│   │       └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── layout.tsx         # Layout limpio sin header
│   │   ├── iniciar-sesion/
│   │   │   └── page.tsx
│   │   ├── registro/
│   │   │   └── page.tsx
│   │   ├── verificar-email/
│   │   │   └── page.tsx
│   │   ├── recuperar-contrasena/
│   │   │   └── page.tsx
│   │   └── auth/callback/
│   │       └── route.ts       # Callback OAuth Supabase
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx         # Sidebar + verificación auth
│   │   ├── page.tsx           # Dashboard home
│   │   ├── perfil/
│   │   │   └── page.tsx
│   │   ├── contratos/
│   │   │   ├── page.tsx
│   │   │   └── nuevo/
│   │   │       └── page.tsx
│   │   ├── documentos/
│   │   │   └── page.tsx
│   │   └── suscripcion/
│   │       └── page.tsx
│   │
│   └── api/
│       └── webhooks/
│           ├── payment/
│           │   └── route.ts
│           └── n8n/
│               └── route.ts
│
├── components/
│   ├── ui/                    # Design system base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── modal.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   └── toast.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-menu.tsx
│   │   └── sidebar.tsx
│   ├── landing/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── stats.tsx
│   │   ├── calculator-preview.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq.tsx
│   │   └── cta.tsx
│   ├── calculators/
│   │   ├── calculator-shell.tsx
│   │   ├── slider-input.tsx
│   │   ├── animated-counter.tsx
│   │   ├── results-chart.tsx
│   │   └── results-table.tsx
│   ├── contracts/
│   │   ├── wizard-form.tsx
│   │   ├── step-indicator.tsx
│   │   ├── vehicle-data-form.tsx
│   │   ├── buyer-form.tsx
│   │   ├── seller-form.tsx
│   │   └── summary-step.tsx
│   ├── blog/
│   │   ├── post-card.tsx
│   │   ├── post-grid.tsx
│   │   ├── category-filter.tsx
│   │   └── table-of-contents.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   └── auth-guard.tsx
│   ├── dashboard/
│   │   ├── contracts-list.tsx
│   │   ├── profile-form.tsx
│   │   └── subscription-card.tsx
│   └── seo/
│       ├── json-ld.tsx
│       ├── breadcrumbs.tsx
│       └── faq-schema.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # createBrowserClient (para "use client")
│   │   ├── server.ts          # createServerClient (Server Components/Actions)
│   │   ├── admin.ts           # Service role (SOLO server)
│   │   └── middleware.ts      # Helper para middleware auth
│   ├── formulas/
│   │   ├── notarial.ts        # Funciones puras aranceles notariales
│   │   ├── notarial.test.ts
│   │   ├── municipal.ts       # Alcabalas + plusvalía
│   │   ├── municipal.test.ts
│   │   ├── registro.ts        # Registro de la propiedad
│   │   ├── registro.test.ts
│   │   └── types.ts           # Interfaces compartidas de fórmulas
│   ├── validations/
│   │   ├── contract.ts
│   │   ├── auth.ts
│   │   ├── calculator.ts
│   │   ├── contact.ts
│   │   └── index.ts
│   ├── utils.ts               # cn(), formatCurrency(), formatDate()
│   └── constants.ts           # Constantes del dominio legal ecuatoriano
│
├── db/
│   ├── schema.ts              # Schema Drizzle COMPLETO (todas las tablas del plan)
│   ├── migrations/            # Carpeta vacía (se genera con drizzle-kit)
│   └── seed.ts                # Datos iniciales placeholder
│
├── actions/
│   ├── contracts.ts
│   ├── leads.ts
│   ├── blog.ts
│   ├── profile.ts
│   └── contact.ts
│
├── hooks/
│   ├── use-calculator.ts
│   ├── use-animated-counter.ts
│   ├── use-supabase.ts
│   └── use-media-query.ts
│
├── types/
│   ├── calculator.ts
│   ├── contract.ts
│   ├── blog.ts
│   └── database.ts
│
├── styles/
│   └── globals.css            # Tailwind directives + CSS variables del design system
│
├── middleware.ts               # Auth redirect + rate limiting + headers seguridad
└── env.ts                     # Validación de env vars con Zod
```

### Paso 4 — Archivos de configuración con contenido REAL

Estos archivos NO son placeholder — deben tener el contenido funcional completo:

#### 4.1 `src/env.ts` — Validación de variables de entorno con Zod
```typescript
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  PDF_SERVICE_URL: z.string().url().optional(),
  PDF_SERVICE_API_KEY: z.string().optional(),
  N8N_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

#### 4.2 `src/lib/supabase/client.ts` — Cliente browser
Implementar `createBrowserClient()` usando `@supabase/ssr`.

#### 4.3 `src/lib/supabase/server.ts` — Cliente server
Implementar `createServerClient()` con cookies de `next/headers`.

#### 4.4 `src/lib/supabase/admin.ts` — Cliente admin
Implementar con `SUPABASE_SERVICE_ROLE_KEY`, con comentario de advertencia de que NUNCA se use en client.

#### 4.5 `src/lib/supabase/middleware.ts` — Helper middleware
Helper para actualizar sesión en middleware.

#### 4.6 `src/lib/utils.ts` — Utilidades
Implementar: `cn()` (clsx + tailwind-merge), `formatCurrency()` (Intl es-EC USD), `formatDate()`.

#### 4.7 `src/middleware.ts` — Middleware completo
- Proteger rutas `/dashboard/*` y `/contratos/*` (redirect a `/iniciar-sesion`)
- Actualizar sesión de Supabase Auth
- Headers de seguridad (CSP, X-Frame-Options, HSTS, X-Content-Type-Options)

#### 4.8 `src/db/schema.ts` — Schema Drizzle COMPLETO
Copiar EXACTO el schema del plan definitivo (sección 4): profiles, contracts, subscriptions, leads, calculatorSessions, blogPosts, auditLog. Con todos los enums.

#### 4.9 `src/app/layout.tsx` — Root layout
- Font Inter via `next/font/google`
- `<html lang="es">` 
- Metadata global con generateMetadata
- Título: "Abogados Online Ecuador | Servicios Notariales y Legales"
- Description con propuesta de valor

#### 4.10 `src/app/robots.ts` y `src/app/sitemap.ts`
Implementar dinámicos según el plan.

#### 4.11 `src/styles/globals.css` — Design system CSS
Incluir las CSS variables del brain.md (paleta glass, fondos oscuros, acentos).

#### 4.12 `.env.example` — Template de variables
Copiar EXACTO del plan definitivo (sección 6).

#### 4.13 `next.config.ts` — Config con headers de seguridad
Headers: CSP, X-Frame-Options DENY, HSTS, X-Content-Type-Options nosniff. Redirecciones placeholder para legacy URLs.

#### 4.14 `drizzle.config.ts` — Conexión Drizzle → Supabase
Configurar para conectar a Supabase PostgreSQL.

### Paso 5 — Crear carpetas adicionales fuera de src/

```
aoe-v2/
├── public/
│   ├── og/                    # Carpeta vacía (OG images vendrán después)
│   └── brand/                 # Carpeta vacía (logo, favicon)
├── supabase/
│   ├── migrations/
│   │   ├── 001_enable_extensions.sql
│   │   ├── 002_enable_rls.sql
│   │   └── 003_policies.sql
│   └── seed.sql
├── services/
│   └── pdf-generator/
│       ├── Dockerfile         # Placeholder
│       ├── requirements.txt   # fastapi, uvicorn, jinja2, weasyprint
│       ├── main.py            # Placeholder FastAPI
│       └── templates/
│           └── .gitkeep
├── n8n/
│   └── .gitkeep
└── docs/
    ├── formulas-legales.md    # Placeholder
    ├── seo-strategy.md        # Placeholder
    ├── security-checklist.md  # Placeholder
    └── redirects-map.md       # Placeholder
```

Las migraciones SQL de `supabase/migrations/` deben contener el SQL REAL del plan definitivo (sección 5): habilitar extensiones, RLS en todas las tablas, y las policies completas.

### Paso 6 — Verificar que compila

```bash
npm run build
```

Si hay errores de TypeScript, corrígelos. El proyecto debe compilar limpio.

### Paso 7 — Git init

```bash
git init
```

Crear `.gitignore` adecuado (node_modules, .env.local, .next, etc.).

---

## Reglas durante toda la ejecución

1. **TypeScript strict mode** — No `any`, no `as` innecesarios
2. **Server Components por defecto** — Solo agregar `"use client"` cuando sea estrictamente necesario (formularios interactivos, hooks de estado)
3. **Cada page.tsx** debe tener `generateMetadata()` aunque sea con datos placeholder
4. **Variables de dominio legal en español** (avaluoCatastral, escrituraPublica), código técnico en inglés
5. **NO instalar** librerías que no estén en la lista del plan
6. **Seguir las convenciones de naming** del brain.md: PascalCase componentes, camelCase hooks, snake_case tablas DB

---

## Entregable esperado

Al terminar, debo poder:
1. `cd aoe-v2 && npm run dev` → Abre en localhost sin errores
2. `npm run build` → Compila limpio sin errores de TypeScript
3. Ver la estructura completa de carpetas creada
4. Navegar a `/` y ver un placeholder de landing page
5. Navegar a `/calculadoras` y ver un placeholder
6. Los archivos de config (env.ts, middleware.ts, supabase clients, schema.ts) tienen código REAL, no placeholders vacíos
