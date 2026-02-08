# Estrategia de Calculadoras AOE v2

## El Problema

1. **Demasiados trámites** — hay decenas de servicios notariales posibles
2. **Calculadoras rotas** — algunas no mostraban resultados correctos
3. **Confusión del usuario** — no sabe cuál calculadora usar

---

## La Solución: Enfoque 80/20

El **80% de tus clientes** busca una de estas dos cosas:

| Producto | Target | Volumen estimado |
|----------|--------|------------------|
| **🏠 Calculadora Inmobiliaria** | Personas comprando/vendiendo inmuebles | 70% |
| **🚗 Calculadora Vehicular** | Personas comprando/vendiendo vehículos | 20% |
| **📋 Consultor de Tarifas** | Profesionales/curiosos | 10% |

---

## Arquitectura Propuesta

```
/calculadoras (Hub)
│
├── 🏠 Calculadora Inmobiliaria (/calculadoras/inmuebles)
│   └── Wizard: "¿Compras o vendes?" → Monto → Fechas
│   └── Resultado: Notarial + Alcabalas + Plusvalía + Registro + TOTAL
│   └── CTA: "Agenda con nosotros para tu escritura"
│
├── 🚗 Calculadora Vehicular (/calculadoras/vehiculos)
│   └── Input: Valor del vehículo
│   └── Resultado: Tarifa notarial + IVA
│   └── CTA: "Genera tu contrato ahora"
│
└── 📋 Otros Servicios (/calculadoras/tarifas)
    └── Tabla de precios (NO calculadora)
    └── Lista de: Poderes, Declaraciones, Autorizaciones, etc.
    └── Precios fijos mostrados directamente
```

---

## 1. Calculadora Inmobiliaria (PRINCIPAL)

### Flujo del Wizard

> ⚠️ **Enfoque: QUITO** — La calculadora está diseñada específicamente para trámites en Quito.
> Esto debe estar claro en el hero, copy, y disclaimers.

```
Paso 1: ¿Qué vas a hacer?
├── Voy a COMPRAR un inmueble
└── Voy a VENDER un inmueble

Paso 2: Datos del inmueble
├── Valor de compraventa: $___________
├── Avalúo catastral: $___________ 
│   └── [ℹ️ Link: "¿No lo tienes? Descárgalo aquí" → servicios.quito.gob.ec]
│   └── (Si no lo sabe, usar mismo valor de compraventa)

Paso 3: (Solo si vende) Datos de adquisición
├── ¿Cuándo compró el inmueble? [Fecha]
└── ¿Cuánto pagó? $___________

   ⚠️ NOTA: Las mejoras solo aplican si están registradas 
   en la ficha catastral del Municipio. Por simplicidad,
   este campo NO se incluye en el wizard.

Paso 4: RESULTADOS
┌────────────────────────────────────────────┐
│  💰 COSTOS PARA EL COMPRADOR               │
│  ├── Notaría (escritura): $XXX.XX          │
│  ├── Alcabalas: $XXX.XX                    │
│  └── Registro de Propiedad: $XXX.XX        │
│  TOTAL COMPRADOR: $X,XXX.XX                │
├────────────────────────────────────────────┤
│  💸 COSTOS PARA EL VENDEDOR                │
│  └── Plusvalía: $XXX.XX                    │
│  TOTAL VENDEDOR: $XXX.XX                   │
├────────────────────────────────────────────┤
│  📍 Cálculos válidos para QUITO            │
│  Tarifas vigentes al [fecha actual]        │
└────────────────────────────────────────────┘
CTA: "¿Necesitas ayuda? Agenda una cita"
```

### Cálculos a implementar

| Concepto | Fórmula | Paga |
|----------|---------|------|
| **Notarial** | Tabla de rangos + IVA | Comprador |
| **Alcabalas** | 1% del mayor valor (con rebajas por tiempo) | Comprador |
| **Registro** | Tabla de rangos (máx $500) | Comprador |
| **Plusvalía** | (Utilidad - deducciones) × tarifa | Vendedor |

---

## 2. Calculadora Vehicular (SECUNDARIA)

### Flujo Simple

```
Input: Valor del vehículo: $_________
       Número de firmas: [2] [4] [más]

Output:
┌────────────────────────────────────────────┐
│  Honorarios notariales: $XX.XX             │
│  IVA (15%): $X.XX                          │
│  TOTAL: $XX.XX                             │
└────────────────────────────────────────────┘
CTA: "Genera tu contrato de vehículo →"
```

---

## 3. Tabla de Tarifas (NO calculadora)

En lugar de múltiples calculadoras para servicios simples, mostrar una **tabla de precios**:

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
│  Divorcio notarial           │ $XXX.XX + IVA   │ N/A        │
│  ...                         │                 │            │
├─────────────────────────────────────────────────────────────┤
│  * Los precios incluyen IVA del 15%                         │
│  * Precios referenciales, pueden variar según complejidad   │
└─────────────────────────────────────────────────────────────┘
```

**Beneficios:**
- No hay lógica de cálculo que se rompa
- Fácil de mantener (solo actualizar JSON)
- El usuario encuentra la información inmediatamente
- Menor desarrollo, menor riesgo de bugs

---

## Siguiente paso: ¿Qué te parece?

**Opciones:**

1. ✅ **Aprobar esta estrategia** → Implemento las 2 calculadoras + tabla de tarifas
2. 🔄 **Modificar** → Dime qué ajustar
3. ❌ **Descartar** → Proponemos otro enfoque

---

## Notas técnicas

- La remuneración básica actual ($482 según mencionaste) se actualizará en el JSON de tarifas
- Las calculadoras usarán funciones puras (testables con Vitest)
- Los resultados se guardarán en `calculator_sessions` para analytics
