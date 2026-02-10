# AOE v2 — Plan Maestro de Implementación

> **Estado actual:** ✅ PROMPTs 01-15 completados (Fase 1-4 + Wizard Contratos)
> **Siguiente paso:** PROMPT 16 — PDF Service + Pasarela de pago
> **Estimación total:** 8 semanas / ~20 prompts para Claude Code
> **Estrategia SEO:** Ver `docs/plans/2026-02-08-seo-calculadoras-strategy.md`

---

## 📍 Mapa General

| Fase | Semana | Estado | Descripción |
|------|--------|--------|-------------|
| **1. Setup + Infra** | 1 | ✅ Completada | Proyecto, Supabase, deploy Vercel |
| **2. Landing + Diseño** | 2-3 | ✅ Completada | UI, componentes, landing, páginas marketing |
| **3. Calculadoras** | 4 | ✅ Completada | 4 calculadoras interactivas con SEO |
| **4. Auth + Dashboard** | 5 | ✅ Completada | Login, registro, área privada |
| **5. Contratos + Pagos** | 6 | ⏳ Pendiente | Wizard, PDF, pasarela de pago |
| **6. Blog + n8n** | 7 | ⏳ Pendiente | Blog SEO, automatización |
| **7. SEO + Lanzamiento** | 8 | ⏳ Pendiente | Optimización final, go-live |

---

## FASE 1 — Setup + Infraestructura (Semana 1)

### ✅ PROMPT 01 — Inicializar proyecto (COMPLETADO)
- Proyecto Next.js 15 creado
- Dependencias instaladas
- Estructura de carpetas completa
- Archivos de configuración con código real
- `npm run build` compila limpio

---

### ✅ PROMPT 02 — Conectar Supabase (COMPLETADO)

**⚠️ ANTES del prompt, tú debes hacer esto manualmente:**

1. Ir a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Crear un nuevo proyecto (nombre: `aoe-v2`, región: us-east-1 o la más cercana)
3. Esperar que se cree (~2 min)
4. Copiar estas 3 claves de **Settings → API**:
   - `Project URL` → para `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → para `SUPABASE_SERVICE_ROLE_KEY`
5. Crear el archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...tu-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Prompt para Claude Code:**

```
Lee el brain.md y el plan definitivo.

Ahora que tenemos .env.local con las credenciales de Supabase, necesito que:

1. VERIFICA que los 3 clientes de Supabase (client.ts, server.ts, admin.ts) funcionen correctamente con @supabase/ssr. Haz un test rápido de conexión.

2. EJECUTA las migraciones SQL en Supabase. Usa el schema de db/schema.ts para hacer `npx drizzle-kit push`. Si hay errores, corrígelos.

3. EJECUTA los archivos SQL de supabase/migrations/ en este orden:
   - 001_enable_extensions.sql
   - 002_enable_rls.sql  
   - 003_policies.sql
   Puedes usar el Supabase CLI o indicarme qué ejecutar en el SQL Editor.

4. CONFIGURA Supabase Auth:
   - Verifica que el callback route en app/(auth)/auth/callback/route.ts esté correcto
   - El middleware.ts debe actualizar la sesión correctamente

5. VERIFICA que `npm run build` sigue compilando limpio.

6. Haz `npm run dev` y confirma que la app corre sin errores de conexión a Supabase.
```

**Entregable:** Supabase conectado, tablas creadas, RLS activo, auth callback funcionando.

---

### ✅ PROMPT 03 — Deploy inicial en Vercel (COMPLETADO)

**⚠️ ANTES del prompt, tú debes:**

1. Subir el proyecto a GitHub (repo privado):
```bash
cd aoe-v2
git add .
git commit -m "feat: initial project setup - AOE v2"
git remote add origin https://github.com/TU-USUARIO/aoe-v2.git
git push -u origin main
```
2. Ir a [vercel.com](https://vercel.com), importar el repo
3. En la configuración de Vercel, agregar las variables de entorno (las mismas de .env.local pero con la URL de producción)

**Prompt para Claude Code:**

```
Lee el brain.md.

Necesito preparar el proyecto para deploy en Vercel:

1. Verifica que next.config.ts tenga los headers de seguridad correctos (CSP, X-Frame-Options, HSTS, X-Content-Type-Options).

2. Verifica que el middleware.ts NO bloquee rutas públicas (/, /calculadoras/*, /servicios/*, /blog/*).

3. Asegúrate de que NO haya imports que fallen en producción (ej: referencias a .env.local que no existan).

4. Ejecuta `npm run build` una vez más y confirma 0 errores.

5. Crea un archivo .vercelignore si es necesario.
```

**⚠️ DESPUÉS del prompt:**
- Configurar Cloudflare DNS apuntando tu dominio a Vercel
- Verificar que https://abogadosonlineecuador.com carga (aunque sea placeholder)

**Entregable Fase 1:** Proyecto en producción, Supabase conectado, deploy automático desde Git.

---

## FASE 2 — Landing Page + Diseño Premium (Semanas 2-3)

### ✅ PROMPT 04 — Design System y componentes UI base (COMPLETADO)

```
Lee el brain.md (sección 3: Reglas de Diseño) y el archivo LANDING_PAGE_DESIGN_PLAN.md.

📦 ASSETS DE MARCA DISPONIBLES:
- Logos SVG: public/logo/logo.svg, logo-horizontal.svg, logo-slogan.svg
- Logos PNG: public/logo/logo-white.png (fondos oscuros), logo-black.png (fondos claros)
- Favicon: public/logo/favicon-32.png
- Manual de marca: docs/brand/manual-marca.pdf
- Tipografía: docs/brand/assets/Fuente Dreams Orphans/

ANTES de escribir código, sigue el workflow obligatorio de diseño del brain.md:
- Ejecuta el design system search para "legal tech nextjs dark mode professional"
- Aplica los principios de frontend-design (diseño memorable, no genérico)
- Consulta el manual de marca en docs/brand/manual-marca.pdf para colores y tipografía oficial

Ahora implementa el Design System base:

1. CONFIGURA tailwind.config.ts con los design tokens del brain.md:
   - Paleta completa (fondos oscuros, glass surfaces, acentos, texto)
   - Font Inter via next/font/google
   - Breakpoints mobile-first
   - Shadows, border-radius, spacing personalizado
   - Animaciones custom para Framer Motion

2. ACTUALIZA globals.css con las CSS variables del design system (glass-bg, glass-border, acentos).

3. CREA los componentes UI base en src/components/ui/:
   - button.tsx — Variantes: primary, secondary, ghost, outline. Con Framer Motion whileHover/whileTap. Tamaños: sm, md, lg. SIEMPRE cursor-pointer.
   - card.tsx — Estilo glass (backdrop-blur, border semi-transparente, shadow). Variante hover con escala sutil.
   - input.tsx — Con label, error state, focus ring visible. Integración con React Hook Form.
   - select.tsx — Dropdown estilizado con glass effect.
   - modal.tsx — Con backdrop blur, Framer Motion AnimatePresence para entrada/salida.
   - badge.tsx — Variantes de color para estados (success, warning, error, info).
   - skeleton.tsx — Skeleton loader animado con pulse.
   - slider.tsx — Range input estilizado para las calculadoras.
   - toast.tsx — Notificaciones con animación de entrada lateral.

REGLAS:
- Cada componente exporta con "use client" SOLO si usa hooks de estado
- Todos los componentes usan cn() de lib/utils.ts para clases condicionales
- Micro-interacciones OBLIGATORIAS: hover 200-300ms, focus ring, active scale(0.98)
- No emojis como iconos — usar Lucide React
- Mobile-first en TODO
```

**Entregable:** Design system completo, 9 componentes UI reutilizables con estilo glass premium.

---

### ✅ PROMPT 05 — Header, Footer, y layout de marketing (COMPLETADO)

```
Lee el brain.md y LANDING_PAGE_DESIGN_PLAN.md.

Crea los componentes de layout:

1. src/components/layout/header.tsx
   - Logo a la izquierda usando /logo/logo-horizontal.svg (versión blanca para header oscuro)
   - Navegación: Servicios, Calculadoras (con badge "Gratis"), Blog, Contacto
   - Botón CTA "Agendar Cita" a la derecha
   - Mobile: hamburger menu con Framer Motion slide-in
   - Efecto glass en scroll (backdrop-blur cuando scrollY > 50)
   - Sticky top con z-50

2. src/components/layout/footer.tsx
   - 4 columnas: Servicios, Calculadoras, Legal (Privacidad, Términos), Contacto
   - Logo usando /logo/logo-slogan.svg + descripción breve
   - Redes sociales con iconos Lucide
   - Copyright dinámico con año actual
   - Links a WhatsApp y email

3. src/components/layout/mobile-menu.tsx
   - Panel lateral full-height con AnimatePresence
   - Mismos links que el header
   - Overlay oscuro clickeable para cerrar

4. src/app/(marketing)/layout.tsx
   - Importa Header + Footer
   - Envuelve {children} entre ambos
   - Este layout aplica a TODAS las páginas públicas

Mobile-first. Probar que se vea bien en 375px.
```

**Entregable:** Navegación completa y responsiva con estilo glass premium.

---

### ✅ PROMPT 06 — Landing page: Hero + Servicios (COMPLETADO)

```
Lee el brain.md, LANDING_PAGE_DESIGN_PLAN.md, y las screenshots del sitio actual como referencia visual.

Crea la primera mitad de la landing page en src/app/page.tsx (o mejor, en src/app/(marketing)/page.tsx si la landing está bajo el marketing layout):

1. HERO SECTION
   - Fondo oscuro con gradiente sutil
   - Título principal: "Tus trámites legales, desde donde estés"
   - Subtítulo con propuesta de valor
   - 3 botones CTA: "Ver Servicios", "Calcular Costos" (destacado), "Agendar Cita"
   - Animación Framer Motion: fade-in escalonado de elementos
   - Elemento visual: animación abstracta de un documento/contrato armándose (puede ser SVG animado o motion divs)

2. SERVICIOS SECTION
   - Título: "Soluciones Legales a su Alcance"
   - Grid de cards glass con los servicios:
     * Generación de Documentos
     * Compraventas
     * Promesas de Compraventa
     * Poderes
     * Posesiones Efectivas
     * Salidas del País
   - Cada card: ícono Lucide, título, descripción breve, link "Saber más →"
   - Animación: staggered fade-in al entrar en viewport (useInView de framer-motion)
   - Botón: "Ver todos nuestros servicios →"

3. CALCULADORA PREVIEW SECTION
   - Título: "Calculadora de Valor de Escrituras"
   - Subtítulo: "Herramientas gratuitas para calcular..."
   - 3 cards con las calculadoras: Notarial ★ (destacada con badge "Recomendado"), Municipal, Registro
   - Cada card: breve descripción + "Calcular ahora →"
   - Botón: "Ver todas las calculadoras →"

generateMetadata() con:
- Título: "Abogados Online Ecuador | Servicios Notariales y Legales en Quito"
- Description: max 155 chars con propuesta de valor
- OG tags completos
- JSON-LD LegalService

Mobile-first OBLIGATORIO. Probar en 375px primero.
```

**Entregable:** Primera mitad de la landing con hero impactante y secciones de servicios/calculadoras.

---

### ✅ PROMPT 07 — Landing page: Stats + Testimonios + FAQ + CTA (COMPLETADO)

```
Lee el brain.md y LANDING_PAGE_DESIGN_PLAN.md.

Crea la segunda mitad de la landing page:

1. STATS SECTION — "Nuestros Números"
   - 4 counters animados: Clientes Satisfechos (200+), Años de Experiencia (12+), Profesionales (5+), Atención Online (24/7)
   - Usar el hook useAnimatedCounter con Framer Motion
   - Los counters SOLO animan cuando entran en viewport (useInView)
   - Cards con fondo sutil, ícono arriba, número grande, label abajo

2. TESTIMONIOS SECTION — "Lo que dicen nuestros clientes"
   - Carrusel horizontal con 3+ testimonios
   - Cada testimonio: avatar placeholder, nombre, ciudad, texto
   - Navegación con flechas y dots
   - Framer Motion para transiciones suaves
   - Auto-play opcional (cada 5 segundos)

3. BLOG PREVIEW SECTION — "Artículos y Recursos Legales"
   - Grid de 3 post cards con imagen placeholder, fecha, autor, título, extracto
   - Botón: "Ver todos los artículos →"

4. FAQ SECTION — "Preguntas Frecuentes"
   - Acordeón expandible con Framer Motion AnimatePresence
   - 5 preguntas frecuentes sobre servicios notariales
   - JSON-LD FAQPage schema incluido en la página
   - Cada pregunta: click para expandir/colapsar con animación suave

5. CTA FINAL
   - Fondo con gradiente o glass destacado
   - "¿Listo para simplificar sus trámites legales?"
   - Botones: "Calcular Costos" + "Contactar Ahora"

IMPLEMENTA también:
- src/hooks/use-animated-counter.ts — Hook que usa useMotionValue + useTransform de Framer Motion
- src/components/seo/faq-schema.tsx — Componente que renderiza JSON-LD FAQPage
```

**Entregable:** Landing page COMPLETA con todas las secciones, animaciones premium, y SEO.

---

### ✅ PROMPT 08 — Páginas de Servicios, Precios, y Contacto (COMPLETADO)

```
Lee el brain.md.

Crea las páginas secundarias del marketing:

1. src/app/(marketing)/servicios/page.tsx
   - Listado de todos los servicios notariales
   - Cards con más detalle que la landing
   - generateMetadata() con SEO
   - JSON-LD Service schema

2. src/app/(marketing)/servicios/[slug]/page.tsx
   - Página individual de cada servicio
   - generateStaticParams() con los slugs de servicios
   - Contenido detallado, requisitos, precios estimados
   - CTA para calcular costos o contactar
   - Breadcrumbs

3. src/app/(marketing)/precios/page.tsx
   - Tabla comparativa FREE vs PREMIUM
   - Cards con glass effect
   - Botón para suscribirse o probar gratis
   - FAQ de precios

4. src/app/(marketing)/contacto/page.tsx
   - Formulario con React Hook Form + Zod validation
   - Campos: nombre, email, teléfono, tipo de consulta, mensaje
   - Server Action para procesar (guardar en leads + enviar email)
   - Datos de contacto: dirección Azuay E2-231 y Av Amazonas, Quito - Ecuador. email   info@abogadosonlineecuador.com, WhatsApp +593 979317579
   - Mapa de ubicación (Google Maps embed o placeholder)

Cada página con generateMetadata() completo.
```

**Entregable:** Todas las páginas públicas de marketing creadas y funcionales.

---

## FASE 3 — Calculadoras como Lead Magnets (Semana 4)

> ⚠️ **ESTRATEGIA CLAVE:** Las calculadoras NO son herramientas técnicas para abogados.
> Son **máquinas de captura de leads** centradas en el usuario final.
> Ver documento de diseño: `docs/plans/2026-02-07-calculadoras-lead-magnet-design.md`
> Ver estrategia SEO: `docs/plans/2026-02-08-seo-calculadoras-strategy.md`

### Enfoque "Job to be Done"

El usuario NO quiere calcular tasas. El usuario quiere resolver:
- *"¿Cuánto dinero extra necesito para comprar mi casa?"*
- *"¿Cuánto me cuesta el papel de mi carro?"*
- *"¿Cuánto cuesta este trámite?"*

### Arquitectura de Productos

| Producto | Tipo | Lead Capture |
|----------|------|--------------|
| 🏠 **Presupuestador Inmobiliario** | Wizard completo | Email gate post-resultado |
| 🚗 **Cotizador Vehicular** | Wizard simple | Email o WhatsApp |
| 📋 **Servicios Menores** | Mini-wizard | CTA WhatsApp (trackeo) |

### Estrategia SEO: Embudo de Calculadoras (Aprobada 2026-02-08)

**Dato clave:** El 96% de los clics del sitio v1 vienen de `/calculadoras` (635 clics, 26k impresiones).

**Arquitectura de páginas:**
```
/calculadoras/notarial           ← SEO entry (2,603 impresiones en "calculadora notarial")
/calculadoras/registro-propiedad ← SEO entry (248 impresiones combinadas)
/calculadoras/consejo-provincial ← SEO entry (123 impresiones, posición 3.9!)
/calculadoras/municipal          ← SEO entry (alcabala + plusvalía)
        │
        ▼  CTA: "Ver costo TOTAL del trámite"
        │
/calculadoras/inmobiliario       ← DESTINO FINAL (total gratis, desglose = email gate)
```

**Reglas:**
1. Cada calculadora individual SÍ muestra resultado (para no tener rebote)
2. Pero señala que hay MÁS costos (empuja al inmobiliario)
3. El inmobiliario muestra TOTAL gratis, desglose requiere email
4. NO hay gate en las páginas individuales
5. FAQ + texto SEO en cada página para capturar long-tail keywords
6. Todas las páginas mobile-first (58% del tráfico es móvil)

---

### ✅ PROMPT 09 — Fórmulas puras + tests unitarios (COMPLETADO)

```
Lee el brain.md, el plan definitivo, y CALCULADORAS_LOGICA.md.

⚠️ IMPORTANTE: Estas fórmulas son lógica de BACKEND. NUNCA se exponen al usuario.
El usuario solo ve el TOTAL, no el desglose técnico (esto filtra abogados).

Implementa las funciones puras de cálculo en lib/formulas/:

1. src/lib/formulas/types.ts — Interfaces compartidas:
   - PresupuestoInmobiliario (notarial + alcabalas + Consejo Provincial +registro + plusvalía)
   - CotizacionVehicular (notarial + IVA)
   - TarifaServicioMenor (precio fijo + IVA)

2. src/lib/formulas/inmobiliario.ts — Presupuestador de compra de vivienda:
   - calcularPresupuestoComprador(datos) → Notaría + Alcabalas + Consejo Provincial+ Registro
   - calcularPresupuestoVendedor(datos) → Plusvalía
   - calcularTotalTransaccion(datos) → Todo integrado
   - INTERNO: usa las fórmulas de notarial.ts, municipal.ts, registro.ts consejo provincial

3. src/lib/formulas/vehicular.ts — Cotizador de vehículos:
   - calcularCotizacionVehiculo(valor, firmas) → Tarifa + IVA

4. src/lib/formulas/servicios-menores.ts — Tarifas fijas:
   - obtenerTarifaServicio(tipoServicio, opciones) → Precio fijo según tabla
   - Servicios: poder, declaracion, autorizacion, reconocimiento, etc.

5. TESTS con Vitest para CADA función:
   - inmobiliario.test.ts — Mínimo 10 test cases (comprador + vendedor)
   - vehicular.test.ts — Mínimo 5 test cases
   - servicios-menores.test.ts — Mínimo 8 test cases

Las fórmulas están en CALCULADORAS_LOGICA.md. Seguirlas AL PIE DE LA LETRA.
El SBU actual es $482.

Ejecuta `npx vitest run` y confirma que TODOS los tests pasan.
```

**Entregable:** Lógica de cálculo 100% implementada y testeada (backend oculto).

---

### ✅ PROMPT 10 — Componentes UI + Sistema de Lead Capture (COMPLETADO)

```
Lee el brain.md (sección diseño glass) y docs/plans/2026-02-07-calculadoras-lead-magnet-design.md.

Crea los componentes reutilizables:

1. src/hooks/use-calculator.ts — Hook genérico con: input state, result, error, loading, calculate(), reset()

2. src/hooks/use-animated-counter.ts — Hook con useMotionValue + useTransform de Framer Motion

3. src/components/calculators/calculator-shell.tsx — Layout wrapper:
   - Título amigable (NO jerga legal)
   - Wizard container con pasos
   - Área de resultados
   - Responsive: form arriba, resultados abajo en mobile

4. src/components/calculators/wizard-step.tsx — Paso individual del wizard:
   - Pregunta en lenguaje natural ("¿Vas a comprar o vender?")
   - Opciones visuales (cards clickeables, NO dropdowns técnicos)
   - Animación de transición entre pasos

5. src/components/calculators/total-display.tsx — Muestra SOLO el total:
   - AnimatedCounter grande y prominente
   - Texto: "Tu total estimado para gastos legales"
   - NO muestra desglose técnico aquí

6. src/components/lead-capture/email-gate.tsx — Muro de valor post-resultado:
   - Aparece DESPUÉS de mostrar el total
   - "¿Quieres el desglose completo + checklist?"
   - Input email + botón "Enviar a mi correo"
   - Alternativa: "Prefiero agendar una cita" → WhatsApp

7. src/components/lead-capture/lead-magnets-menu.tsx — Opciones de lead magnets:
   - 📧 "Recibe el desglose completo por email"
   - 📋 "Descarga la Checklist de Documentos"
   - 💬 "Agenda asesoría gratuita" (WhatsApp directo)

8. src/actions/leads.ts — Server Actions:
   - captureLead(data) — Guarda en tabla leads
   - trackCalculatorSession(data) — Analytics anónimo
   - sendLeadMagnetEmail(leadId, type) — Envía PDF via Resend

9. src/lib/validations/leads.ts — Schemas Zod:
   - LeadCaptureSchema (email, nombre opcional, teléfono opcional, source)

Todos "use client" donde necesario. Mobile-first OBLIGATORIO.
```

**Entregable:** Sistema de UI + lead capture listo para ensamblar.

---

### ✅ PROMPT 11 — Presupuestador Inmobiliario (Producto Principal) (COMPLETADO)

```
Lee brain.md y docs/plans/2026-02-07-calculadoras-lead-magnet-design.md.

⚠️ RENOMBRADO: Ya NO es "Calculadora Notarial". Es "Presupuestador de Compra de Vivienda".
El enfoque es "Job to be Done": resolver el problema del usuario, no calcular tasas.

Crea: src/app/(marketing)/calculadoras/inmuebles/page.tsx

WIZARD (lenguaje natural, NO técnico):

Paso 1: "¿Qué vas a hacer?"
├── "Voy a COMPRAR un inmueble" (card con ícono casa + llave)
└── "Voy a VENDER un inmueble" (card con ícono casa + precio)

Paso 2: "Cuéntanos sobre el inmueble"
├── "¿Cuánto cuesta?" → Slider + input ($50k - $500k range)
├── "¿Cuál es el avalúo catastral?" → Input (link a servicios.quito.gob.ec)
└── (Si no sabe avalúo, usar mismo valor de compra)

Paso 3 (solo vendedor): "¿Cuándo compraste?"
├── Fecha de adquisición (date picker)
└── Valor de adquisición

RESULTADO (visible sin email):
┌────────────────────────────────────────────────────────────────┐
│  💰 TOTAL ESTIMADO                                              │
│  $4,250                                                         │
│  para gastos legales de tu compra                               │
│                                                                 │
│  ⚠️ Valores referenciales para Quito                           │
│  Tarifas vigentes al [fecha actual]                             │
└────────────────────────────────────────────────────────────────┘

LEAD CAPTURE (aparece después del total):
┌────────────────────────────────────────────────────────────────┐
│  📊 ¿Quieres saber a dónde va tu dinero?                       │
│                                                                 │
│  ├── 📧 "Recibe el desglose completo"            [Email input] │
│  ├── 📋 "Descarga checklist de documentos"                     │
│  └── 💬 "Agenda asesoría gratuita"               [WhatsApp]    │
└────────────────────────────────────────────────────────────────┘

SEO:
- Título: "¿Cuánto cuesta escriturar una casa en Quito? | Calculadora 2026"
- Texto SEO DEBAJO del widget (300+ palabras):
  * Gastos ocultos al comprar vivienda
  * Por qué NO debes subdeclarar el valor
  * Requisitos para escriturar
  * Tiempos estimados
- Internal links a /servicios/ y /contacto/
- JSON-LD SoftwareApplication

TRACKING:
- Server Action: guardar cada sesión en calculator_sessions (anónimo)
- Si deja email: guardar en leads con source="presupuestador_inmobiliario"
```

**Entregable:** Presupuestador inmobiliario completo con wizard amigable y lead capture.

---

### ✅ PROMPT 12 — Calculadoras individuales SEO + Hub + Vehicular (COMPLETADO)

```
Lee brain.md, docs/plans/2026-02-07-calculadoras-lead-magnet-design.md,
y docs/plans/2026-02-08-seo-calculadoras-strategy.md.

⚠️ ESTRATEGIA SEO: Cada calculadora individual es una PUERTA DE ENTRADA.
Muestra su resultado, pero empuja al usuario hacia /calculadoras/inmobiliario.

1. CALCULADORAS INDIVIDUALES (SEO entry points):

src/app/(marketing)/calculadoras/notarial/page.tsx
- Target keyword: "calculadora notarial ecuador" (2,603 impresiones)
- Calcula tarifa notarial por tipo de trámite
- Muestra resultado SIN gate
- CTA prominente: "Este es solo el costo notarial. Su trámite incluye
  Municipio, Registro y Consejo Provincial. Ver costo total →"
- FAQ: 3-5 preguntas long-tail
- Texto SEO: 200+ palabras

src/app/(marketing)/calculadoras/registro-propiedad/page.tsx
- Target keyword: "calculadora registro de la propiedad" (248 impresiones)
- Calcula arancel del registro
- CTA: "Falta notarial + municipal + consejo provincial. Ver total →"
- FAQ: 3 preguntas

src/app/(marketing)/calculadoras/consejo-provincial/page.tsx
- Target keyword: "calculadora consejo provincial" (123 impresiones, posición 3.9)
- Calcula impuesto CP (10% de alcabala)
- CTA: "Este impuesto es parte de un trámite mayor. Calcule todo →"
- FAQ: 2-3 preguntas

src/app/(marketing)/calculadoras/municipal/page.tsx
- Target keyword: "calculadora alcabala/plusvalía quito"
- Calcula alcabala (comprador) + utilidad (vendedor)
- CTA: "Estos son solo los impuestos municipales. Ver costo total →"
- FAQ: 3-5 preguntas

2. COTIZADOR VEHICULAR:

src/app/(marketing)/calculadoras/vehiculos/page.tsx
- Wizard simple: valor + firmas → total
- Lead capture: email para contrato PDF o WhatsApp
- FAQ: 2-3 preguntas sobre traspaso vehicular

3. HUB DE CALCULADORAS:

src/app/(marketing)/calculadoras/page.tsx
- Título: "¿Cuánto cuesta tu trámite legal?"
- Cards para cada calculadora, inmobiliario destacado
- SEO: generateMetadata() + JSON-LD

Cada página: generateMetadata(), JSON-LD WebApplication + FAQPage,
mobile-first, internal links.
```

**Entregable:** Sistema completo de calculadoras SEO-optimizadas orientado a leads.

---

### ✅ PROMPT 12.5 — Lead Magnets: PDFs y Emails

```
Lee docs/plans/2026-02-07-calculadoras-lead-magnet-design.md.

Crea los assets de lead magnets:

1. public/downloads/checklist-escrituracion.pdf (contenido)
   - Lista de requisitos para escriturar inmueble
   - Documentos del comprador
   - Documentos del vendedor
   - Documentos del inmueble
   - Plazos estimados

2. public/downloads/guia-5-errores-escritura.pdf (contenido)
   - Error 1: Subdeclarar el valor de compraventa
   - Error 2: No verificar el avalúo catastral
   - Error 3: No considerar la plusvalía
   - Error 4: No tener documentos actualizados
   - Error 5: No elegir bien la notaría

3. src/emails/presupuesto-detallado.tsx — Template de email (React Email)
   - Diseño profesional con logo Abogados Online Ecuador
   - Saludo personalizado
   - Desglose completo de gastos
   - CTA: "Agendar cita"
   - Footer con datos de contacto

4. src/actions/send-lead-magnet.ts — Envío de PDFs
   - Usa Resend para enviar emails
   - Adjunta el PDF correspondiente
   - Trackea open/click si es posible

5. src/lib/pdf/generate-presupuesto.ts — Generador de presupuesto personalizado
   - Usa @react-pdf/renderer
   - Logo de Abogados Online Ecuador
   - Datos del usuario
   - Desglose completo
   - Fecha de generación
   - Disclaimer legal
```

**Entregable:** Sistema de lead magnets listo para producción.

---

## FASE 4 — Auth + Dashboard (Semana 5)

### ✅ PROMPT 13 — Sistema de autenticación completo (COMPLETADO)

```
Lee el brain.md (sección Auth con Supabase).

Implementa el flujo completo de autenticación:

1. src/components/auth/login-form.tsx
   - Email + password con React Hook Form + Zod
   - Botón "Iniciar con Google" (OAuth)
   - Link a registro y recuperar contraseña
   - Error handling visible
   - Diseño glass, centrado

2. src/components/auth/register-form.tsx
   - Nombre completo, email, password, confirmar password
   - Validación Zod (password min 8, match, email válido)
   - Checkbox aceptar términos y privacidad
   - Server Action que registra en Supabase Auth + crea perfil en profiles

3. src/components/auth/forgot-password-form.tsx
   - Solo email, envía magic link de reset

4. src/app/(auth)/iniciar-sesion/page.tsx — Usa LoginForm
5. src/app/(auth)/registro/page.tsx — Usa RegisterForm
6. src/app/(auth)/verificar-email/page.tsx — Mensaje "Revisa tu correo"
7. src/app/(auth)/recuperar-contrasena/page.tsx — Usa ForgotPasswordForm
8. src/app/(auth)/auth/callback/route.ts — Procesa callback OAuth y magic links

9. src/app/(auth)/layout.tsx — Layout limpio sin header completo, solo logo centrado

10. ACTUALIZA middleware.ts:
    - Si usuario NO autenticado intenta /dashboard/* → redirect /iniciar-sesion
    - Si usuario SÍ autenticado visita /iniciar-sesion o /registro → redirect /dashboard

Usa EXCLUSIVAMENTE Supabase Auth. NO Auth.js.
```

**Entregable:** Flujo de auth completo: registro → verificar email → login → redirect a dashboard.

---

### ✅ PROMPT 14 — Dashboard: Layout + Perfil + Suscripción (COMPLETADO)

```
Lee el brain.md.

Crea el área privada del dashboard:

1. src/app/(dashboard)/layout.tsx
   - Sidebar con navegación: Dashboard, Contratos, Documentos, Suscripción, Perfil
   - Header con nombre del usuario y botón cerrar sesión
   - Responsive: sidebar se convierte en bottom nav o drawer en mobile
   - Verificación de auth (redirect si no logueado)

2. src/app/(dashboard)/page.tsx — Dashboard home
   - Resumen: contratos recientes, plan actual, accesos rápidos
   - Cards glass con stats básicos

3. src/app/(dashboard)/perfil/page.tsx
   - Formulario editar: nombre, teléfono
   - React Hook Form + Zod + Server Action updateProfile
   - Botón eliminar cuenta (con confirmación)

4. src/app/(dashboard)/suscripcion/page.tsx
   - Plan actual (FREE/PREMIUM)
   - Comparativa de features
   - Botón upgrade (placeholder por ahora)

5. src/components/auth/auth-guard.tsx — Componente wrapper que verifica auth

Estilo glass oscuro consistente con el rest del sitio.
```

**Entregable:** Dashboard funcional con perfil editable y vista de suscripción.

---

## FASE 5 — Contratos + Pagos (Semana 6)

### ✅ PROMPT 15 — Wizard de contrato vehicular (COMPLETADO)

```
Lee el brain.md y el plan definitivo (sección wizard).

Crea el generador de contratos multi-paso:

1. src/app/(dashboard)/contratos/nuevo/page.tsx — Página del wizard

2. src/components/contracts/wizard-form.tsx — Orquestador:
   - 4 pasos con state management
   - Framer Motion transitions entre pasos (slide horizontal)
   - Validación Zod por paso ANTES de avanzar

3. src/components/contracts/step-indicator.tsx — Indicador visual de progreso

4. src/components/contracts/vehicle-data-form.tsx — Paso 1:
   - Placa (regex ^[A-Z]{3}-\d{3,4}$)
   - Marca, modelo, año (1990 - actual+1)
   - Color, motor, chasis
   - Avalúo comercial (numérico positivo)

5. src/components/contracts/buyer-form.tsx — Paso 2:
   - Cédula (10 dígitos con validación ecuatoriana)
   - Nombres completos, dirección, email, teléfono

6. src/components/contracts/seller-form.tsx — Paso 3:
   - Mismos campos que comprador

7. src/components/contracts/summary-step.tsx — Paso 4:
   - Resumen completo de datos ingresados
   - Costo del contrato ($15-25)
   - Botón "Pagar y Generar" (placeholder)
   - Términos y condiciones checkbox

8. src/lib/validations/contract.ts — Schema Zod COMPLETO para cada paso

9. src/actions/contracts.ts — Server Action createContract:
   - Validar con Zod
   - Verificar auth
   - Insertar en tabla contracts con status DRAFT
   - Registrar en audit_log

React Hook Form + Zod en cada paso. Mobile-first.
```

**Entregable:** Wizard multi-paso funcional que guarda contratos en Supabase.

---

### 🔲 PROMPT 16 — PDF Service + Pasarela de pago

```
Lee el brain.md y el plan definitivo.

1. SERVICIO PDF (para deploy en Railway):
   - services/pdf-generator/main.py — FastAPI con endpoint POST /generate
   - services/pdf-generator/templates/contrato-vehicular.html — Template Jinja2 con formato legal ecuatoriano
   - services/pdf-generator/Dockerfile — Python 3.11 + WeasyPrint
   - services/pdf-generator/requirements.txt — fastapi, uvicorn, jinja2, weasyprint

2. INTEGRACIÓN EN NEXT.JS:
   - Actualiza src/actions/contracts.ts:
     * Después del pago: llamar al PDF service
     * Guardar PDF en Supabase Storage
     * Generar hash SHA-256 del PDF
     * Crear token de descarga de un solo uso (UUID + 24h)
     * Enviar email con Resend (link de descarga)
     * Actualizar contract status a GENERATED

3. PÁGINA DE MIS CONTRATOS:
   - src/app/(dashboard)/contratos/page.tsx
   - Lista de contratos del usuario (con RLS)
   - Estados: DRAFT, PAID, GENERATED, DOWNLOADED
   - Botón descargar (verifica token)

4. PASARELA DE PAGO:
   - Integración PayPal o Stripe (placeholder)
   - Webhook en api/webhooks/payment/route.ts
   - Verificación de secret

Nota: El PDF service se despliega en Railway manualmente. Solo necesito el código listo.
```

**Entregable:** Flujo completo: formulario → pago → PDF → descarga → email.

---

## FASE 6 — Blog + n8n (Semana 7)

### 🔲 PROMPT 17 — Blog con ISR

```
Lee el brain.md.

Implementa el blog:

1. src/app/(marketing)/blog/page.tsx — Listing con ISR
   - Grid de post cards
   - Filtro por categoría
   - Paginación
   - generateMetadata()

2. src/app/(marketing)/blog/[slug]/page.tsx — Post individual
   - Contenido HTML renderizado desde blog_posts.content
   - Table of contents automático
   - Related posts por categoría
   - JSON-LD Article schema
   - Breadcrumbs
   - generateStaticParams() + ISR revalidate: 3600

3. src/components/blog/post-card.tsx — Card con imagen, fecha, título, extracto
4. src/components/blog/post-grid.tsx — Grid responsive
5. src/components/blog/table-of-contents.tsx — Extrae headings del contenido
6. src/components/blog/category-filter.tsx — Filtro horizontal

7. src/actions/blog.ts — Server Actions:
   - getPublishedPosts(page, category)
   - getPostBySlug(slug)

8. src/db/seed.ts — Agrega 3-5 posts de ejemplo sobre temas legales ecuatorianos (contenido real útil para SEO)
```

**Entregable:** Blog funcional con ISR, SEO completo, y contenido inicial.

---

### 🔲 PROMPT 18 — Workflows n8n (configuración)

```
Lee el brain.md.

Crea los archivos de workflow exportables para n8n:

1. n8n/blog-content-pipeline.json
   - Trigger: webhook o schedule
   - AI genera borrador de blog post
   - Webhook a Next.js para guardar como draft
   - Notificación para revisión

2. n8n/post-sale-automation.json
   - Trigger: webhook de pago exitoso
   - Llamar PDF service
   - Guardar en Supabase Storage
   - Enviar email con Resend
   - Actualizar estado del contrato

3. n8n/social-media.json
   - Trigger: nuevo blog post publicado
   - Formatear para LinkedIn
   - Formatear para Instagram/Facebook

4. Webhook receiver en api/webhooks/n8n/route.ts
   - Verificar N8N_WEBHOOK_SECRET
   - Procesar payload según tipo de evento

Estos son JSONs para importar en n8n desplegado en Railway.
```

**Entregable:** 3 workflows listos para importar en n8n.

---

## FASE 7 — SEO + Seguridad + Lanzamiento (Semana 8)

### 🔲 PROMPT 19 — SEO final + OG images

```
Lee el brain.md y el plan definitivo (sección SEO).

1. VERIFICA generateMetadata() en CADA page.tsx — títulos max 60 chars, descriptions max 155 chars

2. ACTUALIZA src/app/sitemap.ts — Incluir todas las páginas públicas + blog posts dinámicos

3. ACTUALIZA src/app/robots.ts — Bloquear /api/, /dashboard/, permitir todo lo demás

4. CREA redirecciones 301 en next.config.ts para TODAS las URLs del sitio legacy

5. VERIFICA JSON-LD en cada página:
   - Home: LegalService
   - Calculadoras: SoftwareApplication
   - Blog: Article
   - FAQ: FAQPage
   - Servicios: Service

6. VERIFICA hreflang es-EC en el root layout

7. CREA componente OG image dinámico (si Next.js lo soporta) o placeholder images para cada sección
```

---

### 🔲 PROMPT 20 — Seguridad final + páginas legales

```
Lee el brain.md y el plan definitivo (sección Seguridad).

1. VERIFICA headers de seguridad en next.config.ts:
   - Content-Security-Policy
   - X-Frame-Options: DENY
   - Strict-Transport-Security
   - X-Content-Type-Options: nosniff

2. VERIFICA rate limiting en middleware.ts:
   - Auth endpoints: 5/min
   - Contratos: 20/min
   - Calculadoras: 100/min

3. VERIFICA RLS policies:
   - Test: usuario A no puede ver contratos de usuario B
   - Test: anónimo no puede leer profiles

4. CREA páginas legales:
   - src/app/(marketing)/legal/privacidad/page.tsx — Política de privacidad (LOPDP Ecuador)
   - src/app/(marketing)/legal/terminos/page.tsx — Términos y condiciones

5. VERIFICA que SUPABASE_SERVICE_ROLE_KEY NO aparece en ningún archivo client-side

6. EJECUTA npm run build — CERO errores

7. EJECUTA Lighthouse/PageSpeed — Verificar Core Web Vitals
```

**Entregable:** Sitio seguro, legal, y listo para producción.

---

## ⚠️ Tareas Manuales (tú, Jose Luis)

Estas tareas NO las hace Claude Code — las haces tú en dashboards web:

| Cuándo | Tarea | Dónde |
|--------|-------|-------|
| Fase 1 | Crear proyecto Supabase | supabase.com |
| Fase 1 | Crear .env.local con claves | Tu editor |
| Fase 1 | Subir repo a GitHub | Terminal |
| Fase 1 | Importar proyecto en Vercel | vercel.com |
| Fase 1 | Configurar env vars en Vercel | vercel.com |
| Fase 1 | Configurar DNS en Cloudflare | cloudflare.com |
| Fase 4 | Habilitar Google OAuth en Supabase | supabase.com → Auth → Providers |
| Fase 4 | Configurar redirect URLs en Supabase | supabase.com → Auth → URL Config |
| Fase 5 | Deploy PDF service en Railway | railway.app |
| Fase 5 | Configurar pasarela de pago (PayPal/Stripe) | stripe.com o paypal.com |
| Fase 6 | Deploy n8n en Railway | railway.app |
| Fase 6 | Importar workflows en n8n | n8n UI |
| Fase 7 | Google Search Console: verificar dominio | search.google.com/search-console |
| Fase 7 | Google Analytics 4: crear propiedad | analytics.google.com |
| Fase 7 | Actualizar Google Business Profile | business.google.com |

---

## 📊 Resumen de Prompts

| # | Prompt | Fase | Semana |
|---|--------|------|--------|
| 01 | ✅ Inicializar proyecto | 1 | 1 |
| 02 | ✅ Conectar Supabase + migraciones | 1 | 1 |
| 03 | ✅ Preparar deploy Vercel | 1 | 1 |
| 04 | ✅ Design system + componentes UI | 2 | 2 |
| 05 | ✅ Header, Footer, layout marketing | 2 | 2 |
| 06 | ✅ Landing: Hero + Servicios + Calculadoras | 2 | 2-3 |
| 07 | ✅ Landing: Stats + Testimonios + FAQ + CTA | 2 | 3 |
| 08 | ✅ Páginas servicios, precios, contacto | 2 | 3 |
| 09 | ✅ Fórmulas puras + tests Vitest | 3 | 4 |
| 10 | ✅ Componentes calculadora + hooks | 3 | 4 |
| 11 | ✅ Presupuestador Inmobiliario completo | 3 | 4 |
| 12 | ✅ Calculadoras Municipal + Registro + Hub | 3 | 4 |
| 13 | ✅ Sistema de autenticación | 4 | 5 |
| 14 | ✅ Dashboard: layout + perfil + suscripción | 4 | 5 |
| 15 | ✅ Wizard contrato vehicular | 5 | 6 |
| 16 | 🔲 PDF service + pagos | 5 | 6 |
| 17 | 🔲 Blog con ISR | 6 | 7 |
| 18 | 🔲 Workflows n8n | 6 | 7 |
| 19 | 🔲 SEO final + OG images | 7 | 8 |
| 20 | 🔲 Seguridad + páginas legales + go-live | 7 | 8 |

---

> **💡 Tip:** Después de cada prompt, verifica que `npm run build` compila limpio antes de pasar al siguiente. Si algo se rompe, dale a Claude Code el error exacto y pídele que lo corrija antes de continuar.
