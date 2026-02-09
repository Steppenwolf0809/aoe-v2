# Prompt: Crear Dashboard de Notion para AOE v2

**Contexto:** Proyecto AOE v2 - Abogados Online Ecuador (abogadosonlineecuador.com)
**Stack:** Next.js 16 + React 19 + Tailwind v4 + Supabase + Framer Motion
**Objetivo:** Crear dashboard de Notion para trackear progreso del proyecto

---

## 📋 Instrucciones

Lee el documento de diseño completo en:
`d:\aoe-v2\docs\plans\2026-02-09-notion-dashboard-design.md`

Luego, usando el MCP de Notion, crea el dashboard completo siguiendo estas especificaciones:

---

## 1️⃣ Crear Página Principal: "AOE v2 - Project Hub"

**Estructura:**

```
🎯 AOE v2 - Abogados Online Ecuador
Stack: Next.js 16 + React 19 + Tailwind v4 + Supabase

[Badge: 🟢 En desarrollo activo]

---

📊 MÉTRICAS CLAVE

Progreso General: 13/20 Prompts (65%)
Features Live: 8 en producción
Issues Abiertos: 1 question
Último Deploy: Feb 9, 2026 - PROMPT 13 (Auth)

---

🚀 PRÓXIMOS PASOS
[Linked Database → Features, filtro: Top 5 prioritarias]

---

⚠️ ISSUES CRÍTICOS
• 🔍 Revisar Resend + Dashboard de clientes (lógica inconsistente)

---

QUICK LINKS
📋 Ver todas las features
🐛 Ver issues
🚀 Ver deploys
📈 Ver métricas
💡 Ver ideas
```

---

## 2️⃣ Crear Database: "Features & Prompts"

**Propiedades:**
- Nombre (Title)
- Estado (Select): 🟢 Completado | 🟡 En progreso | ⚪ Pendiente | 🔴 Bloqueado
- Fase (Select): Fase 1 | Fase 2 | Fase 3 | Fase 4 | Fase 5 | Fase 6 | Fase 7
- Prioridad (Select): P0 | P1 | P2 | P3
- Fecha completado (Date)
- Deploy (Relation → Deploys)
- Notas (Text)

**Vistas:**
1. Por Fase (default) - Agrupada por Fase
2. Completados - Filtro: Estado = 🟢
3. Backlog - Filtro: Estado = ⚪, Orden: Prioridad
4. En Sprint - Filtro: Estado = 🟡

**Popular con estos datos iniciales:**

| Nombre | Estado | Fase | Prioridad |
|--------|--------|------|-----------|
| PROMPT 01: Inicializar proyecto | 🟢 | Fase 1 | P0 |
| PROMPT 02: Conectar Supabase | 🟢 | Fase 1 | P0 |
| PROMPT 03: Deploy inicial Vercel | 🟢 | Fase 1 | P0 |
| PROMPT 04: Design system + UI | 🟢 | Fase 2 | P0 |
| PROMPT 05: Header, Footer, Layout | 🟢 | Fase 2 | P0 |
| PROMPT 06: Landing Hero + Servicios | 🟢 | Fase 2 | P0 |
| PROMPT 07: Landing Stats + Testimonios | 🟢 | Fase 2 | P0 |
| PROMPT 08: Páginas Servicios, Precios | 🟢 | Fase 2 | P1 |
| PROMPT 09: Fórmulas puras + tests | 🟢 | Fase 3 | P0 |
| PROMPT 10: Componentes UI calculadoras | 🟢 | Fase 3 | P0 |
| PROMPT 11: Presupuestador Inmobiliario | 🟢 | Fase 3 | P0 |
| PROMPT 12.5: Lead Magnets (PDFs + Emails) | 🟢 | Fase 3 | P0 |
| PROMPT 13: Sistema Autenticación | 🟢 | Fase 4 | P0 |
| PROMPT 14: Dashboard de Usuario | ⚪ | Fase 4 | P0 |
| Calculadora Notarial Individual | ⚪ | Fase 3 | P1 |
| Calculadora Municipal Individual | ⚪ | Fase 3 | P1 |
| Calculadora Registro Individual | ⚪ | Fase 3 | P1 |
| Calculadora Consejo Provincial Individual | ⚪ | Fase 3 | P2 |
| Wizard Contratos Vehiculares | ⚪ | Fase 5 | P1 |
| Generador PDF Contratos | ⚪ | Fase 5 | P1 |
| Integración Stripe/PayPal | ⚪ | Fase 5 | P1 |

---

## 3️⃣ Crear Database: "Issues & Tech Debt"

**Propiedades:**
- Título (Title)
- Tipo (Select): 🐛 Bug | 🔧 Tech Debt | 💡 Improvement | ❓ Question
- Prioridad (Select): P0 | P1 | P2 | P3
- Estado (Select): 🔴 Abierto | 🟡 Investigando | 🟢 Resuelto | ⚪ Cerrado
- Relacionado con (Relation → Features)
- Notas (Text)

**Vistas:**
1. Críticos (default) - Filtro: Prioridad = P0 or P1, Estado ≠ Cerrado
2. Por Tipo - Agrupada por Tipo
3. Resueltos - Filtro: Estado = Resuelto or Cerrado

**Popular con este issue inicial:**

| Título | Tipo | Prioridad | Estado | Notas |
|--------|------|-----------|--------|-------|
| Revisar Resend + Dashboard de clientes | ❓ Question | P1 | 🔴 Abierto | Verificar que la lógica del dashboard de clientes esté siguiendo el patrón correcto según PROMPT 13. Revisar integración de Resend para emails. |

---

## 4️⃣ Crear Database: "Deploys"

**Propiedades:**
- Versión (Title)
- Fecha (Date)
- Estado (Select): ✅ Success | ❌ Failed | 🔄 Rollback
- Features incluidas (Relation → Features)
- Changelog (Text)
- Vercel URL (URL)
- Git Commit (Text)

**Vistas:**
1. Timeline (default) - Orden: Fecha descendente
2. Exitosos - Filtro: Estado = ✅
3. Por mes - Agrupada por Fecha (mes)

**Popular con este deploy inicial:**

| Versión | Fecha | Estado | Changelog | Git Commit |
|---------|-------|--------|-----------|------------|
| v0.13.0 - Auth System | 2026-02-09 | ✅ | Sistema completo de autenticación con Supabase Auth, login/registro, verificación email, reset password, dashboard protegido | 25da954 |

---

## 5️⃣ Crear Database: "Métricas & KPIs"

**Propiedades:**
- Métrica (Title)
- Categoría (Select): 🎯 SEO | 💰 Conversión | 👥 Usuarios | ⚡ Performance
- Valor actual (Number)
- Última actualización (Date)
- Objetivo (Number)
- Fuente (Select): Google Analytics | Supabase | Vercel | Manual
- Notas (Text)

**Vistas:**
1. Dashboard view (default) - Tabla con todas las métricas
2. Por categoría - Agrupada por Categoría
3. KPIs principales - Filtro: Categoría = SEO or Conversión

**Popular con estas métricas iniciales:**

| Métrica | Categoría | Valor | Objetivo | Fuente |
|---------|-----------|-------|----------|--------|
| Tráfico mensual | 👥 Usuarios | 0 | 5000 | Google Analytics |
| Leads - Calculadora Notarial | 💰 Conversión | 0 | 100 | Supabase |
| Leads - Calculadora Registro | 💰 Conversión | 0 | 50 | Supabase |
| Leads - Presupuestador Inmobiliario | 💰 Conversión | 0 | 200 | Supabase |
| Tasa conversión email gate (%) | 💰 Conversión | 0 | 35 | Supabase |
| Tiempo carga promedio (ms) | ⚡ Performance | 0 | 1500 | Vercel Analytics |
| Posición "calculadora notarial" | 🎯 SEO | 9 | 3 | Manual |

---

## 6️⃣ Crear Database: "Ideas & Brainstorming"

**Propiedades:**
- Idea (Title)
- Categoría (Select): 🎨 UX/UI | ⚡ Feature | 📈 SEO/Marketing | 🔧 Tech | 💰 Monetización
- Origen (Select): 💬 Sesión Claude | 👤 Jose Luis | 📊 Análisis datos | 🔍 Competencia
- Estado (Select): 💭 Idea nueva | 🤔 Evaluando | ✅ Aprobada | ❌ Descartada | 🧊 En hielo
- Impacto estimado (Select): 🔥 Alto | 🔸 Medio | 🔹 Bajo
- Esfuerzo estimado (Select): 🟢 Bajo (<1d) | 🟡 Medio (1-3d) | 🔴 Alto (>3d)
- Feature relacionada (Relation → Features)
- Notas (Text)

**Vistas:**
1. Inbox (default) - Filtro: Estado = Idea nueva
2. Aprobadas - Filtro: Estado = Aprobada
3. Quick Wins - Filtro: Esfuerzo = Bajo, Impacto = Alto
4. Por categoría - Agrupada por Categoría
5. Archivo - Filtro: Estado = Descartada or En hielo

**Dejar vacía inicialmente** (se llenará durante sesiones de brainstorming)

---

## 7️⃣ Configurar Linked Databases en la Home

En la página principal "AOE v2 - Project Hub":

1. **Sección "Próximos Pasos":**
   - Linked Database de "Features & Prompts"
   - Filtro: Estado = ⚪ Pendiente OR 🟡 En progreso
   - Orden: Prioridad (P0 primero), luego Fase
   - Límite: 5 tareas
   - Campos visibles: Checkbox | Título | Fase | Prioridad

2. **Quick Links al final:**
   - Link a página completa de "Features & Prompts"
   - Link a página completa de "Issues & Tech Debt"
   - Link a página completa de "Deploys"
   - Link a página completa de "Métricas & KPIs"
   - Link a página completa de "Ideas & Brainstorming"

---

## ✅ Checklist de Implementación

Al finalizar, verifica que:

- [ ] Página principal "AOE v2 - Project Hub" está creada
- [ ] Hero section con título, stack y badge de estado
- [ ] 4 cards de métricas clave (con valores calculados)
- [ ] Sección "Próximos Pasos" con linked database (top 5)
- [ ] Callout de "Issues Críticos" con el issue de Resend
- [ ] Quick links a todas las databases
- [ ] Database "Features & Prompts" con 21 features iniciales
- [ ] Database "Issues & Tech Debt" con 1 issue inicial
- [ ] Database "Deploys" con 1 deploy inicial
- [ ] Database "Métricas & KPIs" con 7 métricas iniciales
- [ ] Database "Ideas & Brainstorming" creada (vacía)
- [ ] Todas las vistas configuradas en cada database
- [ ] Relaciones entre databases funcionando (Features ↔ Deploys, Issues ↔ Features)

---

## 🎯 Resultado Esperado

Al terminar, Jose Luis debería poder:
1. Abrir "AOE v2 - Project Hub" y ver el estado del proyecto en 30 segundos
2. Ver las 5 tareas más prioritarias pendientes
3. Revisar el issue crítico de Resend + Dashboard
4. Navegar a databases detalladas con un click
5. Consultar historial de prompts completados
6. Ver métricas de negocio y técnicas

---

## 📝 Notas Importantes

- Usa el MCP de Notion para crear todo automáticamente
- Respeta los nombres exactos de propiedades y valores de Select
- Configura todas las vistas especificadas
- Popula con los datos iniciales proporcionados
- Vincula el issue de Resend con PROMPT 13 en la relación
- Vincula el deploy v0.13.0 con PROMPT 13 en la relación

---

**Una vez creado el dashboard, comparte el link de la página "AOE v2 - Project Hub" para que Jose Luis pueda acceder desde cualquier lugar.**
