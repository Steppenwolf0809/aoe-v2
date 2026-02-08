# 🧠 AOE v2 — Brain (Memoria del Proyecto)

> **Última actualización:** 2026-02-07  
> **Arquitecto:** Antigravity AI (Asistente de Desarrollo)  
> **Owner:** Jose Luis — Notaría 18, Quito, Ecuador

---

## 1. 🎯 Identidad del Proyecto

**Nombre:** AOE v2 — Abogados Online Ecuador  
**Dominio:** abogadosonlineecuador.com  
**Tipo:** Plataforma Legal-Tech moderna

### Quiénes Somos
Somos una **firma legal tecnológica** liderada por Jose Luis, abogado notario con 12+ años de experiencia en Quito, Ecuador (Notaría 18).

### Objetivo Principal
1. **Vender contratos automatizados** — Generación de documentos legales (compra-venta vehicular, etc.) con pago integrado
2. **Ofrecer calculadoras legales gratuitas** — Calculadoras Notariales y de Registro de la Propiedad para atraer tráfico orgánico

### Productos y Servicios
| Producto | Tipo | Monetización |
|----------|------|--------------|
| Calculadoras Notariales | Gratuito | Lead generation / SEO |
| Calculadoras Registro Propiedad | Gratuito | Lead generation / SEO |
| Contratos Vehiculares Automatizados | Pago único | $15-25 USD por contrato |
| Suscripción Premium | Mensual | Acceso ilimitado a plantillas |
| Blog Legal SEO | Gratuito | Tráfico orgánico |
| Chatbot Atención | Gratuito | Calificación de leads |

---

## 2. 🛠️ Stack Tecnológico (ESTRICTO)

> ⚠️ **REGLA FUNDAMENTAL:** Este stack es INAMOVIBLE. No sugerir ni implementar tecnologías alternativas.

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15 | Framework principal (App Router + Turbopack) |
| **React** | 19 | Biblioteca UI |
| **TypeScript** | 5 | Tipado estricto (strict mode) |
| **Tailwind CSS** | 4 | Estilos utilitarios |
| **Framer Motion** | 11 | Animaciones fluidas y micro-interacciones |

### Backend & Base de Datos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Supabase** | Latest | Auth + PostgreSQL + Storage + RLS |
| **PostgreSQL** | 16 | Base de datos gestionada (via Supabase) |
| **Drizzle ORM** | Latest | ORM type-safe para PostgreSQL |

### Autenticación
| Tecnología | Propósito |
|------------|-----------|
| **Supabase Auth** | Email/Password + Google OAuth |

> 🚫 **PROHIBIDO:** NO usar Auth.js / NextAuth.js. Usar EXCLUSIVAMENTE Supabase Auth nativo.

### Validación & Forms
| Tecnología | Propósito |
|------------|-----------|
| **Zod** | Validación de schemas (server + client) |
| **React Hook Form** | Gestión de formularios + Zod resolver |

### API & Server
| Tecnología | Propósito |
|------------|-----------|
| **Server Actions** | Mutaciones de datos (Next.js nativo) |

> 🚫 **PROHIBIDO:** NO usar tRPC, NO crear API routes manuales (excepto webhooks)

### Generación de PDFs
| Tecnología | Propósito | Deploy |
|------------|-----------|--------|
| **Python** | Runtime | Railway |
| **FastAPI** | API REST | Railway |
| **WeasyPrint** | Renderizado HTML→PDF | Railway |

### Servicios Externos
| Servicio | Propósito | Plan |
|----------|-----------|------|
| **Resend** | Emails transaccionales | 3,000/día gratis |
| **n8n** | Automatización workflows | Railway ($5/mes) |
| **Cloudflare** | DNS + CDN | Gratis |

### Infraestructura & Deploy
| Servicio | Componente |
|----------|------------|
| **Vercel** | Next.js frontend |
| **Railway** | n8n + PDF Service (Python) |
| **Supabase Cloud** | PostgreSQL + Auth + Storage |

### Monitoreo
| Servicio | Propósito |
|----------|-----------|
| **Vercel Analytics** | Performance frontend |
| **Supabase Dashboard** | Métricas DB + Auth |

### ❌ LISTA NEGRA — NO USAR NUNCA
```
- Auth.js / NextAuth.js
- tRPC
- TanStack Query
- Monorepo Turbo
- Express.js
- Prisma ORM
- Sanity CMS
- API routes manuales (excepto webhooks)
```

---

## 3. 🎨 Reglas de Diseño

### Estilo Visual Principal
**"Liquid Glass"** combinado con **"Bento Grid"**

> Inspiración: Stripe, Linear, Vercel, Raycast

### Paleta de Colores
```css
/* Fondos */
--bg-primary: #0a0a0b;      /* Negro profundo */
--bg-secondary: #111113;    /* Negro suave */
--bg-tertiary: #1a1a1c;     /* Gris oscuro */

/* Superficies Glass */
--glass-bg: rgba(255, 255, 255, 0.03);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-hover: rgba(255, 255, 255, 0.06);

/* Acentos */
--accent-primary: #3b82f6;   /* Azul brillante */
--accent-secondary: #8b5cf6; /* Púrpura */
--accent-success: #10b981;   /* Verde esmeralda */
--accent-warning: #f59e0b;   /* Ámbar */
--accent-error: #ef4444;     /* Rojo */

/* Texto */
--text-primary: #fafafa;     /* Blanco */
--text-secondary: #a1a1aa;   /* Gris claro */
--text-muted: #71717a;       /* Gris medio */
```

### Tipografía
| Elemento | Font | Weight | Size |
|----------|------|--------|------|
| **Headings** | Inter | 600-700 | 24-48px |
| **Body** | Inter | 400-500 | 14-16px |
| **Monospace** | JetBrains Mono | 400 | 13-14px |

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Componentes Glass
```css
/* Card Glass Standard */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 20px 50px -12px rgba(0, 0, 0, 0.5);
}
```

### Bento Grid Layout
```css
/* Grid responsive para dashboards */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

### Micro-interacciones (OBLIGATORIAS)
Todos los elementos interactivos DEBEN tener:

1. **Hover states** — Transición suave de 200-300ms
2. **Focus states** — Ring visible para accesibilidad
3. **Active states** — Escala sutil (scale: 0.98)
4. **Loading states** — Skeleton o spinner contextual

```tsx
// Ejemplo con Framer Motion
<motion.button
  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>
  Calcular
</motion.button>
```

### Animaciones de Entrada
```tsx
// Fade + Slide up para cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};
```

### Reglas de Espaciado
- **Padding interno:** 16px (móvil), 24px (desktop)
- **Gap entre elementos:** 12px-16px
- **Margen entre secciones:** 48px-64px
- **Border radius:** 12px (botones), 16px (cards), 24px (modales)

---

## 4. 📝 Reglas de Código

### TypeScript — Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Estructura de Carpetas (App Router)
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── contratos/
│   │   └── calculadoras/
│   ├── (public)/
│   │   ├── calculadora-notarial/
│   │   └── blog/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # Componentes base reutilizables
│   ├── forms/           # Formularios específicos
│   └── calculadoras/    # Componentes de calculadoras
├── lib/
│   ├── supabase/        # Cliente y helpers de Supabase
│   ├── db/              # Drizzle schemas y queries
│   ├── validations/     # Schemas Zod
│   └── utils/           # Utilidades generales
├── actions/             # Server Actions
├── hooks/               # Custom React hooks
└── types/               # TypeScript types globales
```

### Validación con Zod (OBLIGATORIA)
```typescript
// lib/validations/contrato.ts
import { z } from 'zod';

export const contratoVehicularSchema = z.object({
  vendedor: z.object({
    cedula: z.string().length(10, 'Cédula debe tener 10 dígitos'),
    nombres: z.string().min(3, 'Nombre muy corto'),
    email: z.string().email('Email inválido'),
  }),
  vehiculo: z.object({
    placa: z.string().regex(/^[A-Z]{3}-\d{3,4}$/, 'Formato: ABC-1234'),
    anio: z.number().min(1990).max(new Date().getFullYear() + 1),
    avaluo: z.number().positive('Debe ser mayor a 0'),
  }),
});

export type ContratoVehicular = z.infer<typeof contratoVehicularSchema>;
```

### Server Actions para Mutaciones
```typescript
// actions/contratos.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { contratoVehicularSchema } from '@/lib/validations/contrato';
import { revalidatePath } from 'next/cache';

export async function crearContrato(formData: FormData) {
  const supabase = await createClient();
  
  // Validar con Zod
  const rawData = Object.fromEntries(formData);
  const validated = contratoVehicularSchema.safeParse(rawData);
  
  if (!validated.success) {
    return { error: validated.error.flatten() };
  }
  
  // Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No autenticado' };
  }
  
  // Insertar en DB
  const { data, error } = await supabase
    .from('contratos')
    .insert({ ...validated.data, user_id: user.id })
    .select()
    .single();
    
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/dashboard/contratos');
  return { data };
}
```

### Supabase Auth — Implementación Correcta
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### Convenciones de Naming
| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componentes | PascalCase | `CalculadoraNotarial.tsx` |
| Hooks | camelCase con use | `useCalculadora.ts` |
| Actions | camelCase verbo | `crearContrato.ts` |
| Types | PascalCase | `ContratoVehicular` |
| Schemas Zod | camelCase + Schema | `contratoSchema` |
| DB Tables | snake_case | `contratos_vehiculares` |
| Env vars | SCREAMING_SNAKE | `NEXT_PUBLIC_SUPABASE_URL` |

### Manejo de Errores
```typescript
// Patrón estándar para Server Actions
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function miAction(): Promise<ActionResult<MiTipo>> {
  try {
    // ... lógica
    return { success: true, data: resultado };
  } catch (error) {
    console.error('[miAction]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}
```

---

## 5. 🚀 Funcionalidades Core (MVP)

### Fase 1 — Fundación
- [ ] Setup proyecto Next.js 15 + Supabase
- [ ] Sistema de autenticación (email + Google)
- [ ] Layout base con navegación
- [ ] Design system (componentes glass)

### Fase 2 — Calculadoras (Lead Generation)
- [ ] Calculadora Notarial (compra-venta)
- [ ] Calculadora Registro de la Propiedad
- [ ] Landing pages SEO-optimizadas

### Fase 3 — Contratos (Monetización)
- [ ] Generador contrato vehicular
- [ ] Integración pagos (Stripe/PayPhone)
- [ ] Servicio PDF (Python + Railway)
- [ ] Entrega automática por email

### Fase 4 — Contenido & Automatización
- [ ] Blog legal con MDX
- [ ] Pipeline n8n para generación de contenido
- [ ] Chatbot de primer nivel

### Fase 5 — Premium
- [ ] Sistema de suscripciones
- [ ] Dashboard de usuario
- [ ] Historial de documentos
- [ ] Verificación QR "Notaría Segura"

---

## 6. 📋 Checklist Pre-Commit

Antes de cada commit, verificar:

- [ ] `npm run build` — Sin errores de TypeScript
- [ ] `npm run lint` — ESLint sin warnings
- [ ] Validaciones Zod en todos los forms
- [ ] Server Actions con manejo de errores
- [ ] Componentes con micro-interacciones
- [ ] Mobile-first responsive

---

## 7. 🔗 Referencias de Diseño

### Inspiración Principal
- [Stripe](https://stripe.com) — Estética general
- [Linear](https://linear.app) — Dashboard y animaciones
- [Vercel](https://vercel.com) — Componentes glass
- [Raycast](https://raycast.com) — Micro-interacciones

### Recursos
- [Inter Font](https://rsms.me/inter/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase Docs](https://supabase.com/docs)

---

---

## 8. 🧰 Skills y Herramientas Obligatorias

> ⚠️ **REGLA FUNDAMENTAL:** El agente DEBE usar las skills y herramientas instaladas en CADA tarea relevante. No son opcionales.

### 📍 Ubicación de Skills

```
GLOBALES:     C:\Users\Usuario02\.agents\skills\
PROYECTO:     D:\001 AOEV2\.agents\skills\
```

### 🎨 Skills de Diseño (OBLIGATORIAS para UI)

#### 1. `ui-ux-pro-max` — Sistema de Diseño Inteligente

**CUÁNDO USAR:** SIEMPRE al crear/modificar componentes UI, páginas, o landing pages.

**WORKFLOW OBLIGATORIO para diseño UI:**
```bash
# Paso 1: SIEMPRE generar Design System primero
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "legal tech nextjs dark mode professional" --design-system -p "AOE v2"

# Paso 2: Persistir para uso futuro
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "legal tech" --design-system --persist -p "AOE v2"

# Paso 3: Para páginas específicas con override
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "calculator dashboard" --design-system --persist -p "AOE v2" --page "calculadora"

# Paso 4: Consultas específicas
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "glassmorphism dark" --domain style
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "elegant modern" --domain typography
```

**REGLAS de ui-ux-pro-max:**
- ❌ NO usar emojis como iconos — usar SVG (Lucide, Heroicons)
- ✅ SIEMPRE cursor-pointer en elementos clickeables
- ✅ SIEMPRE hover feedback visual (color, shadow, border)
- ✅ Transiciones 150-300ms, nunca >500ms
- ✅ Focus states visibles para accesibilidad
- ✅ Contrast ratio mínimo 4.5:1 para texto

**Pre-Delivery Checklist (de la skill):**
```
□ No emojis como iconos
□ Iconos del mismo set (Lucide)
□ Hover states sin layout shift
□ cursor-pointer en todos los clickeables
□ Transitions smooth (150-300ms)
□ Responsive en 375px, 768px, 1024px, 1440px
```

---

#### 2. `frontend-design` — Diseño Distintivo Premium

**CUÁNDO USAR:** Para cualquier interfaz que deba ser MEMORABLE y evitar estética genérica de AI.

**FILOSOFÍA (de la skill):**
```
"NEVER use generic AI-generated aesthetics":
❌ Fuentes genéricas: Inter, Roboto, Arial, system fonts
❌ Esquemas clichés: purple gradients on white
❌ Layouts predecibles y patrones cookie-cutter
❌ Diseño sin contexto específico

✅ Tipografía distintiva: Display fonts + body fonts únicos
✅ Paleta dominante con acentos marcados
✅ Motion: scroll-triggering, hover surprises, staggered reveals
✅ Composición espacial: asimetría, overlap, diagonal flow
✅ Backgrounds con atmósfera: gradients, noise, patterns
```

**ANTES de codificar UI, responder:**
1. ¿Qué problema resuelve esta interfaz?
2. ¿Cuál es el TONO extremo? (minimal, luxury, playful, brutalist...)
3. ¿Qué la hace INOLVIDABLE?

---

### ⚡ Skills de Performance (OBLIGATORIAS para código)

#### 3. `vercel-react-best-practices` — Performance React/Next.js

**CUÁNDO USAR:** Al escribir/revisar componentes React o páginas Next.js.

**REGLAS CRÍTICAS (Prioridad 1-2):**

| Categoría | Regla | Impacto |
|-----------|-------|---------|
| **Waterfalls** | `async-parallel` — Usar `Promise.all()` para ops independientes | CRÍTICO |
| **Waterfalls** | `async-suspense-boundaries` — Usar Suspense para streaming | CRÍTICO |
| **Bundle** | `bundle-barrel-imports` — Importar directo, evitar barrel files | CRÍTICO |
| **Bundle** | `bundle-dynamic-imports` — `next/dynamic` para componentes pesados | CRÍTICO |
| **Bundle** | `bundle-defer-third-party` — Analytics después de hydration | CRÍTICO |
| **Server** | `server-cache-react` — Usar `React.cache()` para dedup | ALTO |
| **Server** | `server-parallel-fetching` — Reestructurar para fetch paralelo | ALTO |

**Consultar reglas completas:**
```bash
cat ~/.agents/skills/vercel-react-best-practices/rules/async-parallel.md
cat ~/.agents/skills/vercel-react-best-practices/rules/bundle-barrel-imports.md
```

---

#### 4. `supabase-postgres-best-practices` — Optimización DB

**CUÁNDO USAR:** Al diseñar schemas, escribir queries SQL, o configurar RLS.

**REGLAS CRÍTICAS (Prioridad 1-3):**

| Categoría | Regla | Impacto |
|-----------|-------|---------|
| **Query** | `query-missing-indexes` — SIEMPRE indexes en WHERE/JOIN | CRÍTICO |
| **Connection** | `conn-pooling` — Usar connection pooling | CRÍTICO |
| **Security** | `security-rls` — RLS en TODAS las tablas públicas | CRÍTICO |
| **Schema** | `schema-partial-indexes` — Indexes parciales para queries frecuentes | ALTO |

**Consultar reglas:**
```bash
cat ~/.agents/skills/supabase-postgres-best-practices/references/query-missing-indexes.md
cat ~/.agents/skills/supabase-postgres-best-practices/references/_sections.md
```

---

### 🐛 Skill de Debugging (OBLIGATORIA para bugs)

#### 5. `systematic-debugging` — Debugging Estructurado

**CUÁNDO USAR:** Ante CUALQUIER bug, test fallido, o comportamiento inesperado.

**⚠️ LEY DE HIERRO:**
```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

**Las 4 Fases OBLIGATORIAS:**

| Fase | Actividades | Criterio de Éxito |
|------|-------------|-------------------|
| **1. Root Cause** | Leer errores, reproducir, check cambios | Entender QUÉ y POR QUÉ |
| **2. Pattern** | Encontrar ejemplos funcionando, comparar | Identificar diferencias |
| **3. Hypothesis** | Formar teoría, testear mínimamente | Confirmado o nueva hipótesis |
| **4. Implementation** | Crear test, fix, verificar | Bug resuelto, tests pasan |

**RED FLAGS — Si piensas esto, STOP y volver a Fase 1:**
```
❌ "Quick fix for now, investigate later"
❌ "Just try changing X and see"
❌ "Add multiple changes, run tests"
❌ "I don't fully understand but this might work"
❌ "One more fix attempt" (cuando ya intentaste 2+)
```

**Si 3+ fixes fallaron:** Cuestionar la ARQUITECTURA, no el síntoma.

---

### 🛠️ Skills Auxiliares

#### 6. `brainstorming` — Ideación Estructurada
**CUÁNDO USAR:** Al planificar features nuevas o resolver problemas de diseño/arquitectura.

#### 7. `changelog-generator` — Generación de Changelog
**CUÁNDO USAR:** Al preparar releases o documentar cambios.

#### 8. `find-skills` — Descubrir Nuevas Skills
**CUÁNDO USAR:** Cuando necesites una skill que no existe.

---

### 🔌 Herramientas MCP Activas

| Servidor MCP | Propósito | Cuándo Usar |
|--------------|-----------|-------------|
| **TestSprite** | Testing E2E automatizado | SIEMPRE al crear/modificar features |
| **prisma-mcp-server** | Visualización DB + Migraciones | Al trabajar con modelos/datos |

#### TestSprite — Workflow Obligatorio
```
✅ ANTES de marcar cualquier feature como completada:
   1. testsprite_bootstrap → inicializar testing
   2. testsprite_generate_frontend_test_plan → generar plan
   3. testsprite_generate_code_and_execute → ejecutar tests
   4. testsprite_open_test_result_dashboard → revisar resultados

⚠️ NUNCA hacer commit sin pasar tests
```

#### Prisma MCP — Uso
```
✅ Para operaciones de base de datos:
   - Prisma-Studio → visualizar datos
   - migrate-dev → aplicar migraciones
   - migrate-status → verificar estado
```

---

### 📋 Workflow Completo del Agente

**Para CUALQUIER tarea de UI:**
```
1. 🎨 Ejecutar ui-ux-pro-max --design-system
2. ✨ Aplicar principios de frontend-design (diseño memorable)
3. ⚡ Seguir vercel-react-best-practices (performance)
4. 🧪 Generar tests con TestSprite
5. ✅ Verificar checklist antes de entregar
```

**Para CUALQUIER tarea de Backend/DB:**
```
1. 🗄️ Seguir supabase-postgres-best-practices
2. 🔐 Verificar RLS en tablas públicas
3. 🔌 Usar prisma-mcp-server para validar
4. 🧪 Generar tests con TestSprite
```

**Para CUALQUIER bug:**
```
1. 🐛 OBLIGATORIO: Seguir systematic-debugging
2. 📖 Leer errores COMPLETAMENTE
3. 🔍 Trazar data flow hasta root cause
4. 🧪 Crear test que reproduzca el bug
5. 🔧 Fix mínimo que resuelva root cause
```

---

### ✅ Checklist Final del Agente

Antes de considerar CUALQUIER tarea como completada:

```
DISEÑO:
□ Design System generado con ui-ux-pro-max
□ Diseño distintivo (no generic AI aesthetic)
□ Estilos Glass en todas las superficies
□ Micro-animaciones con Framer Motion
□ No emojis como iconos
□ cursor-pointer en clickeables
□ Hover states sin layout shift

CÓDIGO:
□ TypeScript sin errores (npm run build)
□ ESLint sin warnings (npm run lint)
□ Validación Zod en TODOS los formularios
□ Server Actions para mutaciones
□ Manejo de errores con ActionResult
□ Performance patterns de Vercel

DATABASE:
□ RLS en tablas públicas
□ Indexes en WHERE/JOIN columns
□ Connection pooling configurado

TESTING:
□ Tests generados con TestSprite
□ Tests pasando

RESPONSIVE:
□ Mobile-first (375px primero)
□ Probado en 768px, 1024px, 1440px
□ No horizontal scroll en mobile
```

---

### 🎯 Directivas Maestras para el Agente

```
🎨 DISEÑO: "Hazlo MEMORABLE, no funcional mínimo"
   - Ejecutar ui-ux-pro-max ANTES de codificar
   - Diseño que WOW al usuario
   - Evitar estética genérica de AI

⚡ PERFORMANCE: "Optimizado desde el inicio"
   - Promise.all() para operaciones paralelas
   - next/dynamic para componentes pesados
   - Indexes en TODAS las queries frecuentes

🐛 DEBUGGING: "Root cause primero, fix después"
   - NUNCA adivinar fixes
   - Seguir las 4 fases obligatorias
   - Test que reproduzca ANTES del fix

🧪 TESTING: "No shipping sin tests"
   - TestSprite en CADA feature
   - Reportar resultados al usuario
   - Corregir antes de continuar
```

---


---

## 9. 🧮 Arquitectura de Calculadoras (Core)

> **Principio:** Las calculadoras no son herramientas técnicas, son **Lead Magnets**.

### Estructura de Archivos (Backend)
Toda la lógica de cálculo está desacoplada de la UI en `src/lib/calculators/`:
- `inmobiliario.ts`: Agregador de impuestos + notaría + registro. Separa "Gastos de Terceros" de "Honorarios AOE".
- `vehicular.ts`: Cotizador de contratos. Notaría basada SOLO en firmas + Impuestos fiscales (1%).
- `municipal.ts`: Impuestos de Quito (Alcabala, Plusvalía) con rebajas por tiempo.
- `registro.ts`: Aranceles del Registro de la Propiedad.
- `servicios-menores.ts`: Tarifas fijas para poderes, divorcios, etc.

### Estrategia de UI & Lead Capture
1. **Muro de Valor:** El usuario ve resultados parciales (impuestos/gastos externos) GRATIS.
2. **Email Gate:** Para ver el desglose completo y nuestros honorarios, debe dejar su email (`src/components/lead-capture/EmailGate.tsx`).
3. **Precio Inmobiliario Dinámico:** El honorario base ($500) es una variable. Se debe implementar como configurable para pruebas A/B.

### Flujos de Usuario
Ver `docs/plans/2026-02-07-flujo-calculadoras-preview.md` para los diagramas aprobados.
