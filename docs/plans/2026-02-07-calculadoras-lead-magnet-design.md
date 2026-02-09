# Diseño: Calculadoras como Lead Magnet (No Herramienta para Competencia)

> **Fecha:** 2026-02-07  
> **Estado:** ✅ Aprobado  
> **Objetivo:** Convertir calculadoras de "herramienta técnica" a "máquina de ventas"

---

## Resumen Ejecutivo

Las calculadoras NO deben ser herramientas técnicas que los abogados usen para cotizar a sus clientes. Deben ser **soluciones centradas en el usuario final** que capturen leads cualificados.

### Principio Central: "Job to be Done"

El usuario no quiere calcular tasas. El usuario quiere saber:
- *"¿Cuánto dinero extra necesito para comprar mi casa?"*
- *"¿Cuánto me cuesta divorciarme rápido?"*
- *"¿Cuánto vale el papel de mi carro?"*

---

## Arquitectura Aprobada

### Los "Big Two" — Con Lead Magnets Completos

| Producto | Flujo | Precio Producto | Lead Capture |
|----------|-------|-----------------|--------------|
| 🏠 **Presupuestador Inmobiliario** | Wizard: Comprar/Vender → Monto → Fechas → **TOTAL** | **$500** (Honorarios gestión) | Email para desglose + PDF |
| 🚗 **Cotizador Vehicular** | Valor → Firmas → **TOTAL** | **$9.99** (Contrato SaaS) | Email para contrato o CTA WhatsApp |

### Servicios Menores — Con CTA Directo

| Servicio | Flujo | Precio Fijo | Lead Capture |
|----------|-------|-------------|--------------|
| 📋 Poderes | Mini-wizard → Precio fijo | **$50** | Trackeo anónimo |
| 📋 Divorcios | Mini-wizard → Precio fijo | **$50** | Trackeo anónimo |
| 📋 Salidas del País | Mini-wizard → Precio fijo | **$40** | Trackeo anónimo |


---

## Estrategia de "Muro de Valor" (Gating)

### Decisión: **Opción B — Post-resultado**

```
Usuario completa wizard
    ↓
Ve el TOTAL estimado (sin desglose técnico)
    ↓
"¿Quieres el desglose completo + checklist?"
    ├── 📧 Ingresa tu email → Recibe PDF
    ├── 📋 Descarga checklist de documentos
    └── 💬 Agenda asesoría gratuita (WhatsApp)
```

### Por qué esta estrategia:
1. **Genera confianza primero** — El usuario ya vio que la herramienta funciona
2. **Filtra abogados** — Sin desglose técnico (rangos, SBU, fojas), no pueden replicar
3. **Mayor conversión** — El lead ya sabe que eres útil antes de darte su email

---

## Lead Magnets a Crear

### 1. Checklist de Documentos para Escriturar
- Lista de requisitos por tipo de trámite
- Formato PDF descargable
- Captura: Email

### 2. Guía: "5 Errores que Encarecen tu Escritura"
- **Contenido clave:**
  - Por qué NO debes subdeclarar el valor de compraventa
  - Cómo evitar pagar de más en alcabalas
  - Cuándo conviene esperar para vender (rebaja por tiempo)
  - Documentos que debes tener actualizados
  - Cómo elegir notaría
- Formato PDF
- Captura: Email + Teléfono (opcional)

### 3. Presupuesto Formal en PDF
- Documento con logo de Abogados Online Ecuador
- Personalizado con datos del usuario
- Incluye desglose completo
- Captura: Email + Nombre

---

## Fricción Selectiva Anti-Abogados

### Lo que NO mostramos:
- Tablas de rangos del Consejo de la Judicatura
- Fórmulas de cálculo (SBU, excedentes)
- Desglose técnico (fojas, actos)

### Lo que SÍ mostramos:
- Total estimado en lenguaje simple
- Conceptos generales: "Notaría", "Municipio", "Registro"
- CTAs hacia nuestros servicios

### Mensaje clave en UI:
> *"Estos valores son referenciales para Quito. Para un presupuesto exacto personalizado, agenda tu cita con nosotros."*

---

## Cambios Requeridos en el Plan Maestro

### Fase 3 — Calculadoras (Semana 4)

1. **Renombrar:**
   - ~~"Calculadora Notarial"~~ → "Presupuestador de Compra de Vivienda"
   - ~~"Calculadora Municipal"~~ → (integrada en el presupuestador)
   - ~~"Calculadora Registro"~~ → (integrada en el presupuestador)

2. **Nuevo flujo:**
   - PROMPT 09: Mantener lógica de fórmulas (backend)
   - PROMPT 10: Agregar componentes de lead capture
   - PROMPT 11: Presupuestador Inmobiliario con gating
   - PROMPT 12: Cotizador Vehicular + Hub con servicios menores

3. **Nuevos entregables:**
   - `src/components/lead-capture/email-gate.tsx`
   - `src/components/lead-capture/checklist-download.tsx`
   - `src/actions/leads.ts` — Server Action para guardar leads
   - PDFs en `public/downloads/` o generados dinámicamente

---

## Métricas de Éxito

| Métrica | Objetivo |
|---------|----------|
| Tasa de completar wizard | > 60% |
| Tasa de captura email (post-resultado) | > 20% |
| Leads de inmuebles/mes | > 50 |
| Conversión lead → cita | > 10% |

---

## Próximos Pasos

1. ✅ Aprobar este diseño
2. Actualizar `AOE-v2-PLAN-MAESTRO-PASO-A-PASO.md` con nuevos prompts
3. Crear PDFs de lead magnets (contenido)
4. Implementar según plan actualizado
