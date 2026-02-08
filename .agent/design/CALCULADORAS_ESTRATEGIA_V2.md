# Estrategia de Calculadoras AOE v2 - Análisis y Recomendaciones

**Fecha:** 7 de febrero de 2026  
**Objetivo:** Transformar calculadoras en herramientas de captación de leads calificados y generación de ingresos

---

## 1. El Problema Identificado

### Situación Actual
Las calculadoras notariales tradicionales sufren de:
- **Demasiados trámites** → Confusión para el usuario
- **Público equivocado** → Abogados usan las herramientas, no generan clientes
- **Sin monetización** → Recursos gratuitos sin retorno de inversión
- **Falta de foco** → Intentan servir a todos, no convierten a nadie

### Insight Clave
> **El usuario no quiere "calcular", quiere "resolver su problema"**

---

## 2. Estrategia 80/20: Enfoque por Intención de Compra

### Principio 80/20 Aplicado
| Segmento | % Tráfico | Valor para Negocio | Decisión |
|----------|-----------|-------------------|----------|
| Abogados/Profesionales | ~30% | Bajo (solo consultan) | **Ignorar** |
| Clientes potenciales reales | ~70% | Alto (pagan por servicios) | **Enfocarse** |

### Servicios Priorizados por Potencial

| # | Servicio | Volumen | Ticket | Urgencia | Modelo | Prioridad |
|---|----------|---------|--------|----------|--------|-----------|
| 1 | **Compraventa Inmuebles** | Alto | $2,000-$15,000 | Media | Lead Gen | ⭐⭐⭐⭐⭐ |
| 2 | **Divorcio Notarial** | Alto | $350-$550 | **Alta** | Lead Gen | ⭐⭐⭐⭐⭐ |
| 3 | **Contrato Vehicular** | Alto | $50-$80 | Alta | **Auto-servicio** | ⭐⭐⭐⭐ |
| 4 | **Autorización Viaje Menores** | Medio | $100-$200 | MUY Alta | Lead Gen | ⭐⭐⭐⭐ |

---

## 3. Arquitectura de Producto por Servicio

### 3.1 Calculadora Inmobiliaria (Lead Generation)

**Target:** Personas comprando/vendiendo inmuebles en Quito

**Flujo del Wizard:**
```
Paso 1: ¿Qué vas a hacer?
├── Voy a COMPRAR un inmueble
└── Voy a VENDER un inmueble

Paso 2: Datos del inmueble
├── Valor de compraventa: $___________
├── Avalúo catastral: $___________ 
│   └── [ℹ️ Link: "¿No lo tienes? Descárgalo aquí"]
│   └── (Si no lo sabe, usar mismo valor de compraventa)

Paso 3: (Solo si vende) Datos de adquisición
├── ¿Cuándo compró el inmueble? [Fecha]
└── ¿Cuánto pagó? $___________

Paso 4: RESULTADOS + CTA
```

**Resultados Mostrados:**
```
┌────────────────────────────────────────────┐
│  💰 COSTOS PARA EL COMPRADOR               │
│  ├── Notaría (escritura): $XXX.XX          │
│  ├── Alcabalas: $XXX.XX                    │
│  └── Registro de Propiedad: $XXX.XX        │
│  TOTAL COMPRADOR: $X,XXX.XX                │
├────────────────────────────────────────────┤
│  💸 COSTOS PARA EL VENDEDOR                │
│  └── Plusvalía: $XXX.XX                    │
│  TOTAL VENDEDOR: $X,XXX.XX                 │
├────────────────────────────────────────────┤
│  📍 Cálculos válidos para QUITO            │
│  Tarifas vigentes al [fecha actual]        │
└────────────────────────────────────────────┘

[📅 AGENDAR CONSULTA GRATUITA]
[📥 DESCARGAR GUÍA "10 errores al comprar casa"]
```

**Lead Magnets:**
- Checklist: "Documentos necesarios para escriturar"
- Guía PDF: "Comprar casa en Quito: Guía completa 2026"
- Comparador: "Compraventa vs. Promesa de compraventa"

---

### 3.2 Calculadora de Divorcio Notarial (Lead Generation)

**Target:** Parejas buscando divorcio por mutuo acuerdo

**Flujo del Wizard:**
```
Paso 1: ¿Tienen hijos menores de edad?
├── Sí → [Requiere acuerdos de custodia]
└── No → Continuar

Paso 2: ¿Tienen bienes en común?
├── Sí → [Requiere división de bienes]
└── No → Continuar

Paso 3: ¿Ambos están de acuerdo en divorciarse?
├── Sí → [Elegible para divorcio notarial]
└── No → [Redirigir a información de divorcio judicial]

Paso 4: RESULTADOS + CTA
```

**Resultados Mostrados:**
```
┌────────────────────────────────────────────┐
│  💔 DIVORCIO NOTARIAL - ESTIMADO           │
│                                            │
│  Gastos Notariales:                        │
│  ├── Tasa notarial: $187.98                │
│  ├── IVA (15%): $28.20                     │
│  └── Registro Civil: $12.00                │
│  SUBTOTAL: $228.18                         │
│                                            │
│  💼 Honorarios Abogado (recomendado):      │
│  └── $150 - $300                           │
│                                            │
│  📊 TOTAL ESTIMADO: $378 - $528            │
│                                            │
│  ⏱️ Tiempo estimado: 1-2 semanas           │
└────────────────────────────────────────────┘

[📅 AGENDAR CONSULTA GRATUITA]
[📥 DESCARGAR GUÍA "Divorcio notarial paso a paso"]
[💬 HABLAR POR WHATSAPP]
```

**Lead Magnets:**
- Guía PDF: "Divorcio notarial: Todo lo que necesitas saber"
- Template: "Acuerdo de custodia compartida"
- Checklist: "Documentos para divorcio notarial"

---

### 3.3 Generador de Contrato Vehicular (Auto-Servicio)

**Target:** Personas comprando/vendiendo vehículos entre particulares

**Modelo de Negocio:** SaaS - Pago por documento generado

**Flujo del Wizard:**
```
Paso 1: ¿Eres COMPRADOR o VENDEDOR?
├── Comprador
└── Vendedor

Paso 2: Datos del vehículo
├── Placa: _______
├── Marca/Modelo: _______
├── Año: _______
├── Color: _______
├── Chasis: _______
└── Motor: _______

Paso 3: Datos de la transacción
├── Valor de venta: $_______
├── Forma de pago: [Contado] [Crédito] [Mixto]
└── Fecha de transferencia: _______

Paso 4: Datos de las partes
├── Vendedor: Nombre, Cédula, Dirección, Teléfono
└── Comprador: Nombre, Cédula, Dirección, Teléfono

Paso 5: Revisión y pago
├── [Vista previa del contrato]
├── Precio: $XX.XX (incluye IVA)
└── [PAGAR Y GENERAR CONTRATO]
```

**Entregables:**
- Contrato de compraventa en PDF (formato notarial)
- Checklist de requisitos para el trámite ANT
- Guía de próximos pasos

**Pricing Sugerido:**
| Plan | Precio | Incluye |
|------|--------|---------|
| **Básico** | $15 | Contrato PDF + Checklist |
| **Completo** | $35 | Contrato + Revisión básica + Guía ANT |
| **Express** | $60 | Todo lo anterior + 1 hora de consulta |

**Ventaja Competitiva:**
- Las notarías cobran $50-$80 solo por la escritura
- Nosotros ofrecemos: Contrato + Guía + Soporte a menor precio
- Sin necesidad de ir a notaría para el contrato privado

---

### 3.4 Estimador de Autorización de Viaje (Lead Generation)

**Target:** Padres/madres que necesitan permiso para viaje de menores

**Flujo del Wizard:**
```
Paso 1: ¿Quién viaja?
├── Un menor
└── Varios menores

Paso 2: Datos del viaje
├── Destino: _______
├── Fecha de salida: _______
├── Fecha de retorno: _______
├── Aerolínea: _______
└── Acompañante: [Padre] [Tercero]

Paso 3: Situación de los padres
├── Ambos padres disponibles
├── Un padre fallecido
├── Custodia única
└── Un padre no localizable

Paso 4: RESULTADOS + CTA
```

**Resultados Mostrados:**
```
┌────────────────────────────────────────────┐
│  ✈️ AUTORIZACIÓN DE VIAJE - REQUISITOS     │
│                                            │
│  📋 Documentos necesarios:                 │
│  ├── Cédula del padre/madre solicitante    │
│  ├── Certificado de votación               │
│  ├── Partida de nacimiento del menor       │
│  └── [Otros según situación específica]    │
│                                            │
│  💰 Costo estimado: $100 - $200            │
│  ⏱️ Tiempo de trámite: 1-2 días hábiles    │
│                                            │
│  ⚠️ URGENTE: Si tu viaje es en menos de    │
│     5 días, contáctanos para servicio      │
│     express.                               │
└────────────────────────────────────────────┘

[📅 AGENDAR CITA URGENTE]
[📞 LLAMAR AHORA]
[💬 CONSULTAR POR WHATSAPP]
```

---

## 4. Estructura de Navegación Propuesta

```
/calculadoras (Hub Principal)
│
├── 🏠 Compraventa de Inmuebles (/calculadoras/inmuebles)
│   └── Wizard de gastos
│   └── Lead magnet: Guía de compra/venta
│   └── CTA: Consulta gratuita
│
├── 💔 Divorcio Notarial (/calculadoras/divorcio)
│   └── Wizard de elegibilidad
│   └── Lead magnet: Guía de divorcio
│   └── CTA: Consulta gratuita
│
├── 🚗 Contrato de Vehículo (/contrato-vehiculo) ← Producto separado
│   └── Wizard de generación
│   └── Pago en línea
│   └── Descarga inmediata de contrato
│
└── ✈️ Autorización de Viaje (/calculadoras/viaje-menores)
    └── Wizard de requisitos
    └── Lead magnet: Checklist de documentos
    └── CTA: Servicio express
```

---

## 5. Tabla de Tarifas (Información, NO Calculadora)

Para servicios menores sin calculadora dedicada:

```
┌─────────────────────────────────────────────────────────────┐
│  TARIFAS NOTARIALES - SERVICIOS COMUNES                     │
├─────────────────────────────────────────────────────────────┤
│  Servicio                    │ Persona Natural │ Jurídica   │
│  ─────────────────────────────────────────────────────────  │
│  Poder general               │ $56.40 + IVA    │ $235 + IVA │
│  Declaración juramentada     │ $XX.XX + IVA    │ $XX + IVA  │
│  Autorización salida país    │ $XX.XX/menor    │ N/A        │
│  Reconocimiento de firma     │ $XX.XX/firma    │ N/A        │
│  Testamento abierto          │ $XXX.XX + IVA   │ N/A        │
│  ...                         │                 │            │
├─────────────────────────────────────────────────────────────┤
│  * Los precios incluyen IVA del 15%                         │
│  * Precios referenciales, pueden variar según complejidad   │
│  * ¿Necesitas ayuda? Agenda una consulta gratuita           │
└─────────────────────────────────────────────┘
```

**Nota:** Esta tabla es informativa. El CTA principal es "Agendar consulta" no calcular.

---

## 6. Sistema de Captación de Leads

### 6.1 Funnel de Conversión

```
VISITA ORGÁNICA
      ↓
[LANDING PAGE DE CALCULADORA]
      ↓
USO DE CALCULADORA (sin registro)
      ↓
RESULTADOS PERSONALIZADOS
      ↓
    ┌─────────────┬─────────────┬─────────────┐
    ↓             ↓             ↓             ↓
[Lead Magnet]  [CTA Directo]  [Chat]      [Salir]
    ↓             ↓             ↓
Email +        Calendly      WhatsApp
Teléfono       integrado     Business
    ↓             ↓             ↓
NURTURING      CITA          CONVERSIÓN
(Email/SMS)    AGENDADA      INMEDIATA
    ↓             ↓             ↓
CONVERSIÓN     SEGUIMIENTO   CIERRE
               POST-CITA
```

### 6.2 Lead Magnets por Servicio

| Servicio | Lead Magnet | Formato | Valor Percibido |
|----------|-------------|---------|-----------------|
| Inmuebles | "10 errores al comprar casa en Quito" | PDF | Alto |
| Inmuebles | "Checklist: Documentos para escriturar" | PDF | Alto |
| Divorcio | "Guía completa: Divorcio notarial" | PDF | Alto |
| Divorcio | "Template: Acuerdo de custodia" | DOCX | Muy Alto |
| Viaje Menores | "Checklist: Documentos para viaje" | PDF | Medio |
| Viaje Menores | "Guía: Viaje con menores al extranjero" | PDF | Medio |

### 6.3 Secuencia de Nurturing (Email)

**Día 0:** Entrega del lead magnet + Introducción
**Día 2:** Contenido de valor (artículo relacionado)
**Día 4:** Caso de éxito/testimonio
**Día 7:** Oferta de consulta gratuita
**Día 14:** Último recordatorio + Descuento especial

---

## 7. Métricas de Éxito (KPIs)

### Métricas de Tráfico
| Métrica | Meta | Frecuencia |
|---------|------|------------|
| Visitas mensuales | 5,000+ | Mensual |
| Tasa de rebote | <40% | Semanal |
| Tiempo en página | >2 min | Semanal |

### Métricas de Conversión
| Métrica | Meta | Frecuencia |
|---------|------|------------|
| Tasa de uso de calculadora | >30% | Semanal |
| Tasa de descarga lead magnet | >15% | Semanal |
| Tasa de agendamiento | >5% | Semanal |
| Costo de adquisición por lead | <$10 | Mensual |

### Métricas de Negocio
| Métrica | Meta | Frecuencia |
|---------|------|------------|
| Leads calificados/mes | >100 | Mensual |
| Tasa de conversión lead→cliente | >20% | Mensual |
| Ticket promedio | >$500 | Mensual |
| Ingresos atribuidos a calculadoras | >$10,000/mes | Mensual |

### Métricas de Producto (Contrato Vehicular)
| Métrica | Meta | Frecuencia |
|---------|------|------------|
| Tasa de inicio de wizard | >40% | Semanal |
| Tasa de completitud | >20% | Semanal |
| Tasa de conversión a pago | >10% | Semanal |
| Ingresos mensuales | >$1,000 | Mensual |

---

## 8. Roadmap de Implementación

### Fase 1: MVP (Semanas 1-4)
- [ ] Calculadora Inmobiliaria (wizard simplificado)
- [ ] Lead magnet: Checklist documentos inmobiliarios
- [ ] Integración con Calendly
- [ ] Tracking básico de analytics

### Fase 2: Expansión (Semanas 5-8)
- [ ] Calculadora de Divorcio Notarial
- [ ] Lead magnet: Guía de divorcio
- [ ] Sistema de email nurturing
- [ ] Optimización de conversiones

### Fase 3: Monetización (Semanas 9-12)
- [ ] Generador de Contrato Vehicular
- [ ] Sistema de pagos en línea
- [ ] Automatización de documentos
- [ ] Estimador de Autorización de Viaje

### Fase 4: Optimización (Semanas 13+)
- [ ] A/B testing de CTAs
- [ ] Personalización de resultados
- [ ] Integración con CRM
- [ ] Expansión a otras ciudades

---

## 9. Ventajas Competitivas

### vs. Notarías Tradicionales
- **Disponibilidad 24/7** vs. Horario de oficina
- **Transparencia de precios** vs. "Venga y le cotizamos"
- **Experiencia digital** vs. Trámites presenciales
- **Educación al cliente** vs. Proceso opaco

### vs. Otras Calculadoras Online
- **Enfoque en conversión** vs. Solo información
- **Lead magnets de valor** vs. Datos sin contexto
- **Servicio integrado** vs. Herramienta aislada
- **Modelo híbrido** (Lead Gen + SaaS) vs. Solo uno u otro

---

## 10. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Baja conversión de leads | Media | Alto | A/B testing constante, optimización de copy |
| Competencia copia modelo | Alta | Medio | Diferenciación por servicio y atención |
| Cambios en tarifas notariales | Baja | Medio | Sistema de actualización ágil |
| Problemas técnicos en pagos | Baja | Alto | Múltiples gateways de pago |
| Abogados usan sin convertir | Media | Medio | Qualificación de leads, segmentación |

---

## 11. Conclusión

### Resumen de la Estrategia

1. **Eliminar** calculadoras genéricas que atraen al público equivocado
2. **Enfocarse** en 2-3 servicios de alto valor y urgencia
3. **Diferenciar** modelos: Lead Gen (inmuebles/divorcio) vs. SaaS (vehículos)
4. **Capturar** leads con magnets de valor real
5. **Convertir** mediante nurturing y consultas personalizadas
6. **Monetizar** directamente el tráfico de vehículos

### Próximos Pasos Inmediatos

1. ✅ Aprobar esta estrategia
2. 🎨 Diseñar wireframes de calculadoras priorizadas
3. 💻 Desarrollar calculadora inmobiliaria (MVP)
4. 📝 Crear lead magnets
5. 📊 Configurar analytics y tracking
6. 🚀 Lanzar y medir resultados

---

*Documento generado el 7 de febrero de 2026*  
*Basado en investigación de mercado y análisis de competencia*
