# Notion Dashboard Design - AOE v2 Project Hub

**Fecha:** 2026-02-09
**Tipo:** Dashboard Híbrido (Overview + Databases)
**Propósito:** Trackear progreso técnico, roadmap y métricas de negocio del proyecto AOE v2
**Actualización:** Principalmente automática (Claude actualiza), consulta ocasional (Jose Luis)

---

## 📋 Estructura General

### Arquitectura: Dashboard Híbrido

**Página Principal:** "AOE v2 - Project Hub"
- Resumen ejecutivo con métricas clave
- Overview instantáneo del estado del proyecto
- Links a databases detalladas en sub-páginas

**Sub-páginas:** Databases completas
- Features & Prompts
- Issues & Tech Debt
- Deploys
- Métricas & KPIs
- Ideas & Brainstorming

---

## 🏠 Página Principal - "AOE v2 - Project Hub"

### Hero Section

```
🎯 AOE v2 - Abogados Online Ecuador
Stack: Next.js 16 + React 19 + Tailwind v4 + Supabase

[Badge: 🟢 En desarrollo activo]
```

### Métricas Clave (4 Cards)

| Card | Contenido | Fuente |
|------|-----------|--------|
| **Progreso General** | `12/20 Prompts completados (60%)` | Auto (count Features completadas) |
| **Features Live** | `8 features en producción` | Auto (count Features desplegadas) |
| **Issues Abiertos** | `3 bugs │ 2 tech debt` | Auto (count Issues por tipo) |
| **Último Deploy** | `Feb 9, 2026 - PROMPT 13 (Auth)` | Auto (último deploy exitoso) |

### Próximos Pasos

Linked Database mostrando **top 5 tareas prioritarias**:
- Filtro: Estado = "Pendiente" OR "En progreso"
- Orden: Prioridad (P0 → P3), luego por Fase
- Campos: Checkbox │ Título │ Fase │ Prioridad

### Issues Críticos (Callout)

Lista de issues P0 y notas importantes:

```
⚠️ ISSUES CRÍTICOS
• 🔍 Revisar Resend + Dashboard de clientes (lógica inconsistente)
• [Otros issues P0 se agregan automáticamente]
```

### Quick Links

```
[📋 Ver todas las features →] [🚀 Ver deploys →] [💡 Ver ideas →] [📈 Ver métricas →]
```

---

## 📂 Database 1: Features & Prompts

### Propiedades

| Propiedad | Tipo | Valores | Uso |
|-----------|------|---------|-----|
| **Nombre** | Título | Texto libre | Ej. "PROMPT 14 - Dashboard de Usuario" |
| **Estado** | Select | 🟢 Completado │ 🟡 En progreso │ ⚪ Pendiente │ 🔴 Bloqueado | Claude actualiza |
| **Fase** | Select | Fase 1-7 | Según plan maestro |
| **Prioridad** | Select | P0 │ P1 │ P2 │ P3 | Manual o Claude sugiere |
| **Fecha completado** | Date | Auto | Claude llena al marcar completado |
| **Deploy** | Relation → Deploys | Link | Vincula con deploy que incluyó esta feature |
| **Notas** | Text | Texto largo | Decisiones técnicas, links a PRs, observaciones |

### Vistas

1. **Por Fase** (Default)
   - Agrupada por: Fase
   - Orden: Fase ascendente, luego Prioridad
   - Muestra: Todas las features

2. **Completados**
   - Filtro: Estado = 🟢 Completado
   - Orden: Fecha completado (más reciente primero)
   - Muestra: Historial de prompts completados

3. **Backlog**
   - Filtro: Estado = ⚪ Pendiente
   - Orden: Prioridad, luego Fase
   - Muestra: Tareas pendientes priorizadas

4. **En Sprint**
   - Filtro: Estado = 🟡 En progreso
   - Orden: Prioridad
   - Muestra: Features en desarrollo esta semana

---

## 🐛 Database 2: Issues & Tech Debt

### Propiedades

| Propiedad | Tipo | Valores | Uso |
|-----------|------|---------|-----|
| **Título** | Título | Texto libre | Descripción breve del issue |
| **Tipo** | Select | 🐛 Bug │ 🔧 Tech Debt │ 💡 Improvement │ ❓ Question | Categorización |
| **Prioridad** | Select | P0 │ P1 │ P2 │ P3 | Urgencia |
| **Estado** | Select | 🔴 Abierto │ 🟡 Investigando │ 🟢 Resuelto │ ⚪ Cerrado | Ciclo de vida |
| **Relacionado con** | Relation → Features | Links | Features afectadas por este issue |
| **Notas** | Text | Texto largo | Detalles, reproducción, solución propuesta |

### Vistas

1. **Críticos**
   - Filtro: Prioridad = P0 OR P1, Estado ≠ Cerrado
   - Orden: Prioridad, luego Estado
   - Muestra: Issues que requieren atención inmediata

2. **Por Tipo**
   - Agrupada por: Tipo
   - Orden: Prioridad dentro de cada grupo
   - Muestra: Todos los issues

3. **Resueltos**
   - Filtro: Estado = 🟢 Resuelto OR ⚪ Cerrado
   - Orden: Fecha de cierre (más reciente primero)
   - Muestra: Historial de issues resueltos

---

## 🚀 Database 3: Deploys

### Propiedades

| Propiedad | Tipo | Valores | Uso |
|-----------|------|---------|-----|
| **Versión** | Título | Texto libre | Ej. "v0.13.0 - Auth System" |
| **Fecha** | Date | Fecha | Cuándo se desplegó a producción |
| **Estado** | Select | ✅ Success │ ❌ Failed │ 🔄 Rollback | Resultado del deploy |
| **Features incluidas** | Relation → Features | Links | Qué prompts/features se desplegaron |
| **Changelog** | Text | Texto largo | Resumen user-facing de cambios |
| **Vercel URL** | URL | Link | Link al deployment en Vercel |
| **Git Commit** | Text | Hash corto | Ej. "abc1234" |

### Vistas

1. **Timeline** (Default)
   - Orden: Fecha descendente (más reciente primero)
   - Muestra: Todos los deploys

2. **Exitosos**
   - Filtro: Estado = ✅ Success
   - Orden: Fecha descendente
   - Muestra: Solo deploys exitosos

3. **Por mes**
   - Agrupada por: Fecha (mes)
   - Orden: Mes descendente
   - Muestra: Frecuencia de releases por mes

---

## 📈 Database 4: Métricas & KPIs

### Propiedades

| Propiedad | Tipo | Valores | Uso |
|-----------|------|---------|-----|
| **Métrica** | Título | Texto libre | Nombre de la métrica |
| **Categoría** | Select | 🎯 SEO │ 💰 Conversión │ 👥 Usuarios │ ⚡ Performance | Tipo de métrica |
| **Valor actual** | Number | Número | Valor medido |
| **Última actualización** | Date | Fecha | Cuándo se midió |
| **Objetivo** | Number | Número (opcional) | Meta a alcanzar |
| **Fuente** | Select | Google Analytics │ Supabase │ Vercel │ Manual | Origen del dato |
| **Notas** | Text | Texto largo | Interpretación, contexto, acciones |

### Vistas

1. **Dashboard view** (Default)
   - Vista: Tabla
   - Campos visibles: Métrica │ Categoría │ Valor actual │ Objetivo │ Última actualización
   - Orden: Categoría, luego nombre

2. **Por categoría**
   - Agrupada por: Categoría
   - Muestra: Métricas organizadas por tipo

3. **KPIs principales**
   - Filtro: Categoría = SEO OR Conversión (las más importantes)
   - Orden: Categoría
   - Muestra: Solo métricas críticas para el negocio

### Métricas Iniciales Sugeridas

| Métrica | Categoría | Fuente | Frecuencia actualización |
|---------|-----------|--------|--------------------------|
| Tráfico mensual | 👥 Usuarios | Google Analytics | Semanal |
| Leads - Calculadora Notarial | 💰 Conversión | Supabase | Diaria |
| Leads - Calculadora Registro | 💰 Conversión | Supabase | Diaria |
| Leads - Presupuestador Inmobiliario | 💰 Conversión | Supabase | Diaria |
| Tasa conversión email gate (%) | 💰 Conversión | Supabase | Semanal |
| Tiempo carga promedio (ms) | ⚡ Performance | Vercel Analytics | Semanal |
| Posición "calculadora notarial" | 🎯 SEO | Manual (Google) | Quincenal |
| Core Web Vitals - LCP | ⚡ Performance | Vercel Analytics | Semanal |

---

## 💡 Database 5: Ideas & Brainstorming

### Propiedades

| Propiedad | Tipo | Valores | Uso |
|-----------|------|---------|-----|
| **Idea** | Título | Texto libre | Descripción breve |
| **Categoría** | Select | 🎨 UX/UI │ ⚡ Feature │ 📈 SEO/Marketing │ 🔧 Tech │ 💰 Monetización | Clasificación |
| **Origen** | Select | 💬 Sesión Claude │ 👤 Jose Luis │ 📊 Análisis datos │ 🔍 Competencia | De dónde surgió |
| **Estado** | Select | 💭 Idea nueva │ 🤔 Evaluando │ ✅ Aprobada → Feature │ ❌ Descartada │ 🧊 En hielo | Ciclo de vida |
| **Impacto estimado** | Select | 🔥 Alto │ 🔸 Medio │ 🔹 Bajo | Potencial valor de negocio |
| **Esfuerzo estimado** | Select | 🟢 Bajo (<1d) │ 🟡 Medio (1-3d) │ 🔴 Alto (>3d) | Tiempo de implementación |
| **Feature relacionada** | Relation → Features | Link | Si se convirtió en feature |
| **Notas** | Text | Texto largo | Detalles, trade-offs, bocetos |

### Vistas

1. **Inbox** (Default)
   - Filtro: Estado = 💭 Idea nueva
   - Orden: Impacto descendente (Alto primero)
   - Muestra: Ideas pendientes de evaluar

2. **Aprobadas**
   - Filtro: Estado = ✅ Aprobada → Feature
   - Orden: Impacto descendente
   - Muestra: Ideas que se convertirán en features

3. **Quick Wins**
   - Filtro: Esfuerzo = 🟢 Bajo, Impacto = 🔥 Alto
   - Orden: Impacto
   - Muestra: Ideas de alto valor y bajo esfuerzo

4. **Por categoría**
   - Agrupada por: Categoría
   - Filtro: Estado ≠ Descartada
   - Muestra: Ideas activas por tipo

5. **Archivo**
   - Filtro: Estado = ❌ Descartada OR 🧊 En hielo
   - Orden: Categoría
   - Muestra: Ideas descartadas o pospuestas

---

## 🤖 Automatización y Workflows

### Responsabilidades de Claude

**Después de cada sesión de trabajo:**

1. **Features & Prompts:**
   - ✅ Marcar prompts completados → Estado = 🟢
   - ✅ Llenar fecha de completado automáticamente
   - ✅ Actualizar estado de features en progreso → 🟡
   - ✅ Agregar nuevas features descubiertas → Estado = ⚪

2. **Issues:**
   - ✅ Crear issues para bugs encontrados
   - ✅ Documentar tech debt identificado
   - ✅ Actualizar issues resueltos → Estado = 🟢

3. **Deploys:**
   - ✅ Crear entrada cuando se hace deploy a producción
   - ✅ Listar features incluidas en Changelog
   - ✅ Vincular features desplegadas (Relations)
   - ✅ Agregar link a Vercel y commit hash

4. **Ideas:**
   - ✅ Capturar ideas surgidas en brainstorming
   - ✅ Marcar origen = 💬 Sesión Claude
   - ✅ Sugerir Impacto y Esfuerzo estimado

5. **Métricas de la Home:**
   - ✅ Recalcular "Progreso General" (count completados)
   - ✅ Contar features live en producción
   - ✅ Actualizar issues abiertos (por tipo)
   - ✅ Registrar último deploy

### Responsabilidades de Jose Luis (Manual)

**Ocasionalmente (1 vez/semana):**

1. **Métricas de negocio:**
   - Actualizar métricas de Google Analytics
   - Revisar datos de Supabase (leads)
   - Actualizar posiciones SEO

2. **Priorización:**
   - Re-priorizar features según objetivos de negocio
   - Evaluar ideas nuevas en el inbox
   - Aprobar ideas para convertirlas en features

3. **Issues:**
   - Revisar issues resueltos
   - Cerrar issues confirmados como resueltos

### Workflow Típico de Claude

**Al inicio de sesión:**
```
1. Leer dashboard → conocer estado actual
2. Revisar issues P0/P1 → identificar bloqueantes
3. Consultar "Próximos pasos" → qué trabajar hoy
```

**Durante la sesión:**
```
1. Marcar feature como 🟡 En progreso
2. Documentar decisiones en Notas
3. Crear issues si se encuentran problemas
4. Capturar ideas en Ideas & Brainstorming
```

**Al finalizar sesión:**
```
1. Actualizar estado de features trabajadas
2. Marcar 🟢 Completado si aplica
3. Crear entrada de Deploy si se hizo release
4. Actualizar resumen de home page
5. Agregar issue crítico si se detectó
```

---

## 📐 Principios de Diseño

### YAGNI Ruthlessly

- ❌ No agregar databases "por si acaso"
- ❌ No crear propiedades que no se usarán
- ✅ Solo lo necesario para trackear progreso y tomar decisiones

### Automatización First

- Claude mantiene el dashboard actualizado
- Jose Luis solo interviene para decisiones de negocio
- Métricas calculadas automáticamente cuando sea posible

### Overview → Detail

- Home page = overview instantáneo
- Databases = detalle completo cuando se necesite
- Navegación clara con links directos

---

## 🎯 Criterios de Éxito

**El dashboard es exitoso si:**

1. ✅ Jose Luis puede ver progreso del proyecto en < 30 segundos
2. ✅ Issues críticos son visibles inmediatamente
3. ✅ Próximos pasos están claros sin ambigüedad
4. ✅ Historial de deploys y features está documentado
5. ✅ Ideas capturadas para no perderlas
6. ✅ Claude puede actualizar automáticamente sin intervención manual
7. ✅ Métricas de negocio y técnicas están balanceadas

---

## 📝 Notas de Implementación

### Issue Inicial a Documentar

```
🔍 Revisar Resend + Dashboard de clientes
Tipo: ❓ Question
Prioridad: P1
Estado: 🔴 Abierto
Notas: Verificar que la lógica del dashboard de clientes esté siguiendo el patrón correcto según PROMPT 13. Revisar integración de Resend para emails.
```

### Datos Iniciales para Popular

**Features & Prompts - Completados:**
- PROMPT 01: Inicializar proyecto ✅
- PROMPT 02: Conectar Supabase ✅
- PROMPT 03: Deploy inicial Vercel ✅
- PROMPT 04: Design system + UI ✅
- PROMPT 05: Header, Footer, Layout ✅
- PROMPT 06: Landing Hero + Servicios + Calculadoras ✅
- PROMPT 07: Landing Stats + Testimonios + FAQ ✅
- PROMPT 08: Páginas Servicios, Precios, Contacto ✅
- PROMPT 09: Fórmulas puras + tests ✅
- PROMPT 10: Componentes UI calculadoras ✅
- PROMPT 11: Presupuestador Inmobiliario ✅
- PROMPT 12.5: Lead Magnets (PDFs + Emails) ✅
- PROMPT 13: Sistema Autenticación ✅

**Features & Prompts - Pendientes:**
- PROMPT 14: Dashboard de Usuario (Fase 4) ⚪
- Calculadora Notarial Individual (Fase 3) ⚪
- Calculadora Municipal Individual (Fase 3) ⚪
- Calculadora Registro Individual (Fase 3) ⚪
- Calculadora Consejo Provincial Individual (Fase 3) ⚪

---

**Documento validado:** 2026-02-09
**Listo para implementación:** ✅
