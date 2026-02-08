# Lógica de las Calculadoras - Documentación Técnica

> **Versión**: 1.0  
> **Fecha**: Febrero 2026  
> **Proyecto**: Abogados Online Ecuador

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Calculadora Notarial](#1-calculadora-notarial)
3. [Calculadora Municipal](#2-calculadora-municipal)
4. [Calculadora de Registro](#3-calculadora-de-registro)
5. [Estructura de Datos](#estructura-de-datos)
6. [Código Reutilizable](#código-reutilizable)
7. [Sugerencias de Mejora](#sugerencias-de-mejora)

---

## Visión General

El sistema cuenta con **3 calculadoras independientes**:

| Calculadora | Archivo Principal | Utilidades | Descripción |
|-------------|-------------------|------------|-------------|
| **Notarial** | `NotarialCalculator.tsx` | `tarifas.json` + `tarifas.ts` | Tasas notariales por servicios |
| **Municipal** | `MunicipalCalculator.tsx` | `municipalCalculations.js` | Impuestos de transferencia (Quito) |
| **Registro** | `RegistryCalculator.tsx` | `registryCalculations.js` | Aranceles de inscripción |

---

## 1. Calculadora Notarial

### 1.1 Lógica de Negocio

La calculadora notarial clasifica los servicios en **dos categorías**:

#### A. Servicios CON Cuantía (requieren monto)
- `transferenciaDominio` - Transferencia de dominio
- `hipotecas` - Hipoteca
- `promesas` - Promesa de compraventa
- `contratos_arriendo` - Contrato de arrendamiento

#### B. Servicios SIN Cuantía (tarifa fija)
- `poderes` - Poderes (natural/jurídica)
- `declaracionesJuramentadas` - Declaraciones juramentadas
- `autorizacionSalidaPais` - Autorización de viaje
- `reconocimientoFirma` - Reconocimiento de firma
- `testamentoAbierto` - Testamento
- `unionHecho` - Unión de hecho
- `disolucionSociedadConyugal` - Divorcio
- `copiaCertificada` - Copias certificadas
- `materializacion` - Materialización
- `posesionEfectiva` - Posesión efectiva
- `protocolizacion` - Protocolización
- `compraventaVehiculos` - Compraventa de vehículos

### 1.2 Fórmulas de Cálculo

#### Servicios CON Cuantía

```typescript
// Fórmula base: Búsqueda en tabla de rangos
const rango = tabla.rangos.find(r => monto >= r.min && monto <= r.max);
const tarifa = rango ? rango.tarifa : 0;

// Fórmula con excedente (para montos > límite)
if (monto > tabla.excedente.limite) {
  const excedente = monto - tabla.excedente.limite;
  const baseSBU = parseInt(tabla.excedente.formula.base) * remuneracionBasica;
  tarifa = baseSBU + (excedente * tabla.excedente.formula.porcentajeExcedente);
}

// IVA (15% en Ecuador)
const iva = subtotal * 0.15;
const total = subtotal + iva;
```

#### Servicios SIN Cuantía

```typescript
// Tarifa base
let subtotal = servicio.tarifa;

// Adicionales según tipo de servicio
if (tipo === 'reconocimientoFirma' || tipo === 'compraventaVehiculos') {
  subtotal = tarifa * numeroFirmas;
} else if (tipo === 'autorizacionSalidaPais') {
  subtotal = tarifa * numeroMenores;
} else if (['copiaCertificada', 'materializacion', 'protocolizacion'].includes(tipo)) {
  subtotal = tarifa * numeroHojas;
} else if (personaNatural && otorganteAdicional) {
  subtotal += otorganteAdicional * (numOtorgantes - 1);
}
```

### 1.3 Estructura de Tarifas (JSON)

```json
{
  "remuneracionBasica": 470.00,
  "iva": 0.15,
  "tablas": {
    "transferenciaDominio": {
      "rangos": [
        {"min": 0, "max": 10000, "tarifa": 94.00},
        {"min": 10001, "max": 30000, "tarifa": 164.50},
        {"min": 30001, "max": 60000, "tarifa": 235.00}
        // ... más rangos hasta 4,000,000
      ],
      "excedente": {
        "limite": 4000000,
        "formula": {
          "base": "20SBU",
          "porcentajeExcedente": 0.001
        }
      }
    }
  },
  "serviciosIndeterminados": {
    "poderes": {
      "personaNatural": {"tarifa": 56.40, "otorganteAdicional": 14.10},
      "personaJuridica": {"tarifa": 235.00}
    }
  }
}
```

### 1.4 Implementación Completa

```typescript
// types/calculator.ts
export interface Rango {
  min: number;
  max: number;
  tarifa: number;
}

export interface Formula {
  base: string;
  porcentajeExcedente: number;
}

export interface Excedente {
  limite: number;
  formula: Formula;
}

export interface TablaServicio {
  rangos: Rango[];
  excedente?: Excedente;
}

export interface Tarifas {
  remuneracionBasica: number;
  iva: number;
  tablas: Record<string, TablaServicio>;
  serviciosIndeterminados: Record<string, any>;
}

// lib/notarialCalculations.ts
import tarifas from '@/data/tarifas.json';

const REMUNERACION_BASICA = tarifas.remuneracionBasica;
const IVA_RATE = tarifas.iva;

/**
 * Calcula la tarifa para servicios CON cuantía
 */
export function calcularTarifaDeterminada(
  monto: number, 
  tipoServicio: string
): number {
  const tabla = tarifas.tablas[tipoServicio];
  if (!tabla) return 0;

  // Para contratos de arriendo, solo buscar en rangos
  if (tipoServicio === 'contratos_arriendo') {
    const rango = tabla.rangos.find(r => monto >= r.min && monto <= r.max);
    return rango ? rango.tarifa : 0;
  }

  // Para montos con excedente
  if (tabla.excedente && monto > tabla.excedente.limite) {
    const excedente = monto - tabla.excedente.limite;
    const baseSBU = parseInt(tabla.excedente.formula.base) * REMUNERACION_BASICA;
    return baseSBU + (excedente * tabla.excedente.formula.porcentajeExcedente);
  }

  // Búsqueda normal en rangos
  const rango = tabla.rangos.find(r => monto >= r.min && monto <= r.max);
  return rango ? rango.tarifa : 0;
}

/**
 * Calcula la tarifa para servicios SIN cuantía
 */
export function calcularTarifaIndeterminada(
  tipoServicio: string,
  opciones: {
    tipoPersona?: 'natural' | 'juridica';
    cantidad?: number;
    otorgantes?: number;
  }
): number {
  const servicio = tarifas.serviciosIndeterminados[tipoServicio];
  if (!servicio) return 0;

  let tarifaBase = 0;
  let adicional = 0;

  // Servicios con variación por tipo de persona
  if (['poderes', 'declaracionesJuramentadas'].includes(tipoServicio)) {
    const persona = opciones.tipoPersona === 'juridica' ? 'personaJuridica' : 'personaNatural';
    tarifaBase = servicio[persona]?.tarifa || 0;
    adicional = servicio[persona]?.otorganteAdicional || 0;
    
    if (adicional && opciones.otorgantes && opciones.otorgantes > 1) {
      tarifaBase += adicional * (opciones.otorgantes - 1);
    }
  } else {
    tarifaBase = servicio.tarifa || 0;
  }

  // Multiplicar por cantidad si aplica
  const cantidad = opciones.cantidad || 1;
  return tarifaBase * cantidad;
}

/**
 * Calcula el total con IVA
 */
export function calcularTotal(subtotal: number): {
  subtotal: number;
  iva: number;
  total: number;
} {
  const iva = subtotal * IVA_RATE;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    iva: Math.round(iva * 100) / 100,
    total: Math.round((subtotal + iva) * 100) / 100
  };
}
```

---

## 2. Calculadora Municipal

### 2.1 Lógica de Negocio

Calcula dos impuestos municipales para la ciudad de **Quito**:

1. **Impuesto a la Utilidad** (paga el vendedor)
2. **Impuesto de Alcabala** (paga el comprador)

### 2.2 Datos Requeridos

| Campo | Descripción | Obligatorio |
|-------|-------------|-------------|
| `fechaAdquisicion` | Fecha de compra original | Sí |
| `fechaTransferencia` | Fecha de venta actual | Sí |
| `valorTransferencia` | Precio de venta | Sí |
| `valorAdquisicion` | Precio de compra original | Sí |
| `avaluoCatastral` | Avalúo municipal | Sí |
| `tipoTransferencia` | Compraventa/Donación/Dación | Sí |
| `tipoTransferente` | Natural/Inmobiliaria | Sí |
| `mejoras` | Valor de mejoras realizadas | No |
| `contribucionMejoras` | Contribución por mejoras | No |

### 2.3 Fórmulas de Cálculo

#### A. Cálculo de Años Transcurridos

```typescript
function calcularAños(fechaAdquisicion: Date, fechaTransferencia: Date): number {
  let años = fechaTransferencia.getFullYear() - fechaAdquisicion.getFullYear();
  
  // Ajustar si no ha completado el año
  if (fechaTransferencia.getMonth() < fechaAdquisicion.getMonth() || 
      (fechaTransferencia.getMonth() === fechaAdquisicion.getMonth() && 
       fechaTransferencia.getDate() < fechaAdquisicion.getDate())) {
    años--;
  }
  
  return Math.min(Math.max(0, años), 20); // Entre 0 y 20 años máximo
}
```

#### B. Impuesto a la Utilidad

```typescript
// 1. Valor base (mayor entre transferencia y avalúo)
const valorBase = Math.max(valorTransferencia, avaluoCatastral);

// 2. Utilidad Bruta
const utilidadBruta = valorBase - (valorAdquisicion + mejoras + contribucionMejoras);

// 3. Deducción por tiempo (5% por año, máximo 20 años = 100%)
const añosTranscurridos = calcularAños(fechaAdquisicion, fechaTransferencia);
const deduccionTiempo = utilidadBruta * 0.05 * añosTranscurridos;

// 4. Base Imponible
const baseImponible = utilidadBruta - deduccionTiempo;

// 5. Tarifa según tipo de transferencia y transferente
let tarifa;
if (tipoTransferencia === 'Donación') {
  tarifa = 0.01; // 1%
} else if (tipoTransferente === 'Inmobiliaria') {
  tarifa = 0.04; // 4%
} else {
  tarifa = 0.10; // 10% persona natural
}

// 6. Impuesto a la Utilidad
const impuestoUtilidad = baseImponible * tarifa;
```

#### C. Impuesto de Alcabala

```typescript
// 1. Base Imponible (mayor valor)
const baseImponible = Math.max(valorTransferencia, avaluoCatastral);

// 2. Tarifa base
const tarifaAlcabala = 0.01; // 1%

// 3. Rebaja por tiempo (primeros 3 años)
function calcularRebajaAlcabala(meses: number): number {
  if (meses <= 12) return 0.40; // 40% primer año
  if (meses <= 24) return 0.30; // 30% segundo año
  if (meses <= 36) return 0.20; // 20% tercer año
  return 0; // Sin rebaja después de 3 años
}

const mesesTranscurridos = calcularMeses(fechaAdquisicion, fechaTransferencia);
const rebajaAlcabala = calcularRebajaAlcabala(mesesTranscurridos);

// 4. Impuesto de Alcabala
const impuestoAlcabala = baseImponible * tarifaAlcabala * (1 - rebajaAlcabala);
```

### 2.4 Implementación Completa

```typescript
// types/municipal.ts
export interface MunicipalFormData {
  fechaAdquisicion: string;
  fechaTransferencia: string;
  valorTransferencia: number;
  valorAdquisicion: number;
  avaluoCatastral: number;
  tipoTransferencia: 'Compraventa' | 'Donación' | 'Dación en pago';
  tipoTransferente: 'Natural' | 'Inmobiliaria';
  mejoras: number;
  contribucionMejoras: number;
}

export interface ResultadoUtilidad {
  utilidadBruta: number;
  añosTranscurridos: number;
  deduccionTiempo: number;
  baseImponible: number;
  tarifa: string;
  impuesto: number;
}

export interface ResultadoAlcabala {
  baseImponible: number;
  rebaja: string;
  impuesto: number;
}

export interface ResultadoMunicipal {
  utilidad: ResultadoUtilidad;
  alcabala: ResultadoAlcabala;
  total: number;
}

// lib/municipalCalculations.ts
export function calcularAños(
  fechaAdquisicion: Date | string, 
  fechaTransferencia: Date | string
): number {
  const adquisicion = new Date(fechaAdquisicion);
  const transferencia = new Date(fechaTransferencia);
  
  let años = transferencia.getFullYear() - adquisicion.getFullYear();
  
  if (transferencia.getMonth() < adquisicion.getMonth() || 
      (transferencia.getMonth() === adquisicion.getMonth() && 
       transferencia.getDate() < adquisicion.getDate())) {
    años--;
  }
  
  return Math.min(Math.max(0, años), 20);
}

export function calcularMeses(
  fechaAdquisicion: Date | string, 
  fechaTransferencia: Date | string
): number {
  const adquisicion = new Date(fechaAdquisicion);
  const transferencia = new Date(fechaTransferencia);
  const diferencia = (transferencia.getTime() - adquisicion.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  return Math.floor(diferencia);
}

export function calcularRebajaAlcabala(
  fechaAdquisicion: Date | string, 
  fechaTransferencia: Date | string
): number {
  const meses = calcularMeses(fechaAdquisicion, fechaTransferencia);
  
  if (meses <= 12) return 0.40;
  if (meses <= 24) return 0.30;
  if (meses <= 36) return 0.20;
  return 0;
}

export function calcularImpuestosMunicipales(
  data: MunicipalFormData
): ResultadoMunicipal {
  // 1. Cálculo de Utilidad
  const valorBase = Math.max(data.valorTransferencia, data.avaluoCatastral);
  const utilidadBruta = valorBase - (
    data.valorAdquisicion + 
    (data.mejoras || 0) + 
    (data.contribucionMejoras || 0)
  );

  const añosTranscurridos = calcularAños(data.fechaAdquisicion, data.fechaTransferencia);
  const deduccionTiempo = utilidadBruta * 0.05 * añosTranscurridos;
  const baseImponibleUtilidad = utilidadBruta - deduccionTiempo;

  // Determinar tarifa de utilidad
  let tarifaUtilidad: number;
  if (data.tipoTransferencia === 'Donación') {
    tarifaUtilidad = 0.01;
  } else if (data.tipoTransferente === 'Inmobiliaria') {
    tarifaUtilidad = 0.04;
  } else {
    tarifaUtilidad = 0.10;
  }

  const impuestoUtilidad = Math.round(baseImponibleUtilidad * tarifaUtilidad * 100) / 100;

  // 2. Cálculo de Alcabala
  const baseImponibleAlcabala = Math.max(data.valorTransferencia, data.avaluoCatastral);
  const tarifaAlcabala = 0.01;
  const rebajaAlcabala = calcularRebajaAlcabala(data.fechaAdquisicion, data.fechaTransferencia);
  const impuestoAlcabala = Math.round(
    baseImponibleAlcabala * tarifaAlcabala * (1 - rebajaAlcabala) * 100
  ) / 100;

  return {
    utilidad: {
      utilidadBruta: Math.round(utilidadBruta * 100) / 100,
      añosTranscurridos,
      deduccionTiempo: Math.round(deduccionTiempo * 100) / 100,
      baseImponible: Math.round(baseImponibleUtilidad * 100) / 100,
      tarifa: `${(tarifaUtilidad * 100).toFixed(0)}%`,
      impuesto: impuestoUtilidad
    },
    alcabala: {
      baseImponible: Math.round(baseImponibleAlcabala * 100) / 100,
      rebaja: `${(rebajaAlcabala * 100).toFixed(0)}%`,
      impuesto: impuestoAlcabala
    },
    total: Math.round((impuestoUtilidad + impuestoAlcabala) * 100) / 100
  };
}
```

---

## 3. Calculadora de Registro

### 3.1 Lógica de Negocio

Calcula los **aranceles de inscripción** en el Registro de la Propiedad del Ecuador.

### 3.2 Tabla de Rangos

| Rango | Desde | Hasta | Arancel |
|-------|-------|-------|---------|
| 1 | $0.01 | $3,000.00 | $22.00 |
| 2 | $3,000.01 | $6,600.00 | $30.00 |
| 3 | $6,600.01 | $10,000.00 | $35.00 |
| 4 | $10,000.01 | $15,000.00 | $40.00 |
| 5 | $15,000.01 | $25,000.00 | $50.00 |
| 6 | $25,000.01 | $30,000.00 | $100.00 |
| 7 | $30,000.01 | $35,000.00 | $160.00 |
| 8 | $35,000.01 | $40,000.00 | $200.00 |
| 9 | $40,000.01 | En adelante | $100 + 0.5% del exceso de $10,000 |

**Límite máximo**: $500.00

### 3.3 Fórmulas de Cálculo

```typescript
// Rango 1-8: Tarifa fija según tabla
if (valorContrato <= 40000) {
  const rango = RANGOS.find(r => valorContrato >= r.min && valorContrato <= r.max);
  arancel = rango.arancel;
}

// Rango 9: Fórmula con excedente
if (valorContrato > 40000) {
  const exceso = valorContrato - 10000;
  arancel = 100 + (exceso * 0.005); // 0.5%
}

// Aplicar límite máximo
arancel = Math.min(arancel, 500);

// Descuento tercera edad (50%)
if (esTerceraEdad) {
  arancel = arancel * 0.5;
}
```

### 3.4 Implementación Completa

```typescript
// types/registry.ts
export interface RangoRegistro {
  min: number;
  max: number;
  arancel: number;
}

export interface ResultadoRegistro {
  valorContrato: number;
  rango: number;
  arancelBase: number;
  exceso?: number;
  descuentos: Array<{
    tipo: string;
    valor: number;
  }>;
  arancelFinal: number;
  excedeMaximo: boolean;
}

// lib/registryCalculations.ts
export const RANGOS: RangoRegistro[] = [
  { min: 0.01, max: 3000.00, arancel: 22.00 },
  { min: 3000.01, max: 6600.00, arancel: 30.00 },
  { min: 6600.01, max: 10000.00, arancel: 35.00 },
  { min: 10000.01, max: 15000.00, arancel: 40.00 },
  { min: 15000.01, max: 25000.00, arancel: 50.00 },
  { min: 25000.01, max: 30000.00, arancel: 100.00 },
  { min: 30000.01, max: 35000.00, arancel: 160.00 },
  { min: 35000.01, max: 40000.00, arancel: 200.00 },
  { min: 40000.01, max: Infinity, arancel: 0 } // Calculado con fórmula
];

const LIMITE_MAXIMO = 500.00;
const DESCUENTO_TERCERA_EDAD = 0.50;

export function calcularArancelBase(valorContrato: number): {
  arancel: number;
  rango: number;
  exceso: number | null;
  excedeMaximo: boolean;
} {
  if (valorContrato <= 0) {
    return { arancel: 0, rango: 0, exceso: null, excedeMaximo: false };
  }

  let arancel: number;
  let rangoAplicado: RangoRegistro;
  let exceso = 0;

  if (valorContrato > 40000) {
    // Rango 9: Fórmula especial
    exceso = valorContrato - 10000;
    arancel = 100 + (exceso * 0.005);
    rangoAplicado = RANGOS[8];
  } else {
    // Rangos 1-8: Búsqueda en tabla
    rangoAplicado = RANGOS.find(r => 
      valorContrato >= r.min && valorContrato <= r.max
    )!;
    arancel = rangoAplicado.arancel;
  }

  const excedeMaximo = arancel > LIMITE_MAXIMO;
  const arancelFinal = Math.min(arancel, LIMITE_MAXIMO);

  return {
    arancel: arancelFinal,
    rango: RANGOS.indexOf(rangoAplicado) + 1,
    exceso: exceso > 0 ? exceso : null,
    excedeMaximo
  };
}

export function aplicarDescuentos(
  arancelBase: number, 
  esTerceraEdad: boolean
): {
  arancelFinal: number;
  descuentos: Array<{ tipo: string; valor: number }>;
} {
  let arancelFinal = arancelBase;
  const descuentos: Array<{ tipo: string; valor: number }> = [];

  if (esTerceraEdad) {
    const descuentoTerceraEdad = arancelFinal * DESCUENTO_TERCERA_EDAD;
    descuentos.push({
      tipo: 'Tercera Edad (50%)',
      valor: descuentoTerceraEdad
    });
    arancelFinal = arancelFinal * (1 - DESCUENTO_TERCERA_EDAD);
  }

  return {
    arancelFinal: Math.round(arancelFinal * 100) / 100,
    descuentos
  };
}

export function calcularArancelRegistro(
  valorContrato: number, 
  esTerceraEdad: boolean
): ResultadoRegistro {
  const calculoBase = calcularArancelBase(valorContrato);
  const { arancelFinal, descuentos } = aplicarDescuentos(
    calculoBase.arancel, 
    esTerceraEdad
  );

  return {
    valorContrato,
    rango: calculoBase.rango,
    arancelBase: calculoBase.arancel,
    exceso: calculoBase.exceso,
    descuentos,
    arancelFinal,
    excedeMaximo: calculoBase.excedeMaximo
  };
}
```

---

## Estructura de Datos

### Árbol de Archivos Recomendado

```
src/
├── lib/
│   ├── calculators/
│   │   ├── index.ts                    # Exportaciones
│   │   ├── notarialCalculations.ts     # Lógica notarial
│   │   ├── municipalCalculations.ts    # Lógica municipal
│   │   └── registryCalculations.ts     # Lógica registro
│   └── utils/
│       └── formatters.ts               # Formateo de moneda/fechas
├── types/
│   └── calculators.ts                  # Tipos compartidos
├── data/
│   ├── tarifas-notariales.json
│   ├── tarifas-municipales.json
│   └── tarifas-registro.json
└── components/
    └── calculators/
        ├── BaseCalculator.tsx          # Componente base
        ├── NotarialCalculator.tsx
        ├── MunicipalCalculator.tsx
        └── RegistryCalculator.tsx
```

---

## Código Reutilizable

### Utilidades Comunes

```typescript
// lib/utils/calculatorUtils.ts

/**
 * Formatea un número como moneda (USD)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-EC', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Valida que un string sea un número válido
 */
export function isValidNumber(value: string): boolean {
  if (value === '' || value === null || value === undefined) return false;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

/**
 * Parsea un valor monetario de string a número
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  // Remover símbolo de moneda y separadores de miles
  const clean = value.replace(/[$,\s]/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/**
 * Busca un rango en una tabla de rangos
 */
export function findRange<T extends { min: number; max: number }>(
  ranges: T[],
  value: number
): T | undefined {
  return ranges.find(r => value >= r.min && value <= r.max);
}

/**
 * Calcula años entre dos fechas
 */
export function calculateYearsBetween(
  startDate: Date | string,
  endDate: Date | string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let years = end.getFullYear() - start.getFullYear();
  
  if (end.getMonth() < start.getMonth() || 
      (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())) {
    years--;
  }
  
  return Math.max(0, years);
}

/**
 * Redondea a 2 decimales
 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
```

### Hook Personalizado para Calculadoras

```typescript
// hooks/useCalculator.ts
import { useState, useCallback } from 'react';

interface UseCalculatorOptions<TInput, TResult> {
  calculateFn: (input: TInput) => TResult;
  validateFn?: (input: TInput) => string | null;
}

interface UseCalculatorReturn<TInput, TResult> {
  input: TInput;
  result: TResult | null;
  error: string | null;
  loading: boolean;
  setInput: (input: Partial<TInput>) => void;
  calculate: () => void;
  reset: () => void;
}

export function useCalculator<TInput, TResult>(
  initialInput: TInput,
  options: UseCalculatorOptions<TInput, TResult>
): UseCalculatorReturn<TInput, TResult> {
  const [input, setInputState] = useState<TInput>(initialInput);
  const [result, setResult] = useState<TResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setInput = useCallback((newInput: Partial<TInput>) => {
    setInputState(prev => ({ ...prev, ...newInput }));
    setError(null);
  }, []);

  const calculate = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      // Validar si existe función de validación
      if (options.validateFn) {
        const validationError = options.validateFn(input);
        if (validationError) {
          setError(validationError);
          setResult(null);
          return;
        }
      }

      const calculatedResult = options.calculateFn(input);
      setResult(calculatedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el cálculo');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [input, options]);

  const reset = useCallback(() => {
    setInputState(initialInput);
    setResult(null);
    setError(null);
  }, [initialInput]);

  return {
    input,
    result,
    error,
    loading,
    setInput,
    calculate,
    reset
  };
}
```

---

## Sugerencias de Mejora

### 1. Arquitectura: Patrón Strategy

```typescript
// lib/calculators/strategies/CalculatorStrategy.ts
export interface CalculatorStrategy<TInput, TResult> {
  readonly name: string;
  readonly description: string;
  calculate(input: TInput): TResult;
  validate(input: TInput): string | null;
}

// lib/calculators/strategies/NotarialStrategy.ts
export class NotarialStrategy implements CalculatorStrategy<NotarialInput, NotarialResult> {
  readonly name = 'notarial';
  readonly description = 'Calculadora de tasas notariales';

  calculate(input: NotarialInput): NotarialResult {
    // Implementación
  }

  validate(input: NotarialInput): string | null {
    // Validaciones
    return null;
  }
}

// Uso
const calculator = new CalculatorFactory().getStrategy('notarial');
const result = calculator.calculate(input);
```

### 2. Testing Unitario

```typescript
// __tests__/calculators/notarial.test.ts
import { calcularTarifaDeterminada } from '@/lib/calculators/notarialCalculations';

describe('Calculadora Notarial', () => {
  test('Calcula transferencia de dominio correctamente', () => {
    const result = calcularTarifaDeterminada(50000, 'transferenciaDominio');
    expect(result).toBe(376.00);
  });

  test('Aplica fórmula de excedente para montos altos', () => {
    const result = calcularTarifaDeterminada(5000000, 'transferenciaDominio');
    // 20 * 470 + (5000000 - 4000000) * 0.001
    expect(result).toBeCloseTo(10400, 0);
  });
});
```

### 3. Manejo de Estado Global (Zustand/Redux)

```typescript
// stores/calculatorStore.ts
import { create } from 'zustand';

interface CalculatorState {
  history: CalculationHistory[];
  addToHistory: (calc: CalculationHistory) => void;
  clearHistory: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  history: [],
  addToHistory: (calc) => set((state) => ({
    history: [calc, ...state.history].slice(0, 10) // últimos 10
  })),
  clearHistory: () => set({ history: [] })
}));
```

### 4. Mejoras de UX/UI

```typescript
// components/calculators/CalculatorForm.tsx
// Formulario genérico reutilizable

interface CalculatorFormProps<T> {
  schema: FormField[];
  onSubmit: (data: T) => void;
  validate?: (data: T) => ValidationError[];
}

// components/calculators/ResultsDisplay.tsx
// Componente de resultados consistente

interface ResultsDisplayProps {
  title: string;
  breakdown: Array<{
    label: string;
    value: number;
    highlight?: boolean;
  }>;
  total: number;
  onPrint?: () => void;
  onShare?: () => void;
}
```

### 5. APIs del Servidor (Next.js API Routes)

```typescript
// app/api/calculators/notarial/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { calcularTotalNotarial } from '@/lib/calculators/notarialCalculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar entrada
    const validation = validateNotarialInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors },
        { status: 400 }
      );
    }

    // Calcular
    const result = calcularTotalNotarial(body);

    // Guardar en historial (opcional)
    await saveCalculation('notarial', body, result);

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
```

### 6. Exportación de Resultados (PDF)

```typescript
// lib/export/pdfExport.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToPDF(
  calculatorType: string,
  input: any,
  result: any
): void {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text(`Cálculo ${calculatorType}`, 14, 22);
  
  // Tabla de entrada
  autoTable(doc, {
    head: [['Campo', 'Valor']],
    body: Object.entries(input).map(([key, value]) => [key, String(value)]),
    startY: 30
  });
  
  // Tabla de resultados
  autoTable(doc, {
    head: [['Concepto', 'Valor']],
    body: Object.entries(result).map(([key, value]) => [key, String(value)]),
    startY: doc.lastAutoTable?.finalY || 50
  });
  
  doc.save(`calculo-${calculatorType}-${Date.now()}.pdf`);
}
```

### 7. Actualización Dinámica de Tarifas

```typescript
// lib/calculators/tariffManager.ts
export class TariffManager {
  private cache: Map<string, TariffData> = new Map();
  private lastUpdate: Date | null = null;

  async getTariffs(type: 'notarial' | 'municipal' | 'registry'): Promise<TariffData> {
    // Verificar cache
    if (this.cache.has(type) && !this.isStale()) {
      return this.cache.get(type)!;
    }

    // Fetch desde CMS/API
    const response = await fetch(`/api/tariffs/${type}`);
    const data = await response.json();
    
    this.cache.set(type, data);
    this.lastUpdate = new Date();
    
    return data;
  }

  private isStale(): boolean {
    if (!this.lastUpdate) return true;
    const hoursSinceUpdate = (Date.now() - this.lastUpdate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate > 24; // Cache de 24 horas
  }
}
```

---

## Checklist de Reestructuración

- [ ] Crear carpeta `lib/calculators/` con módulos separados
- [ ] Extraer lógica de cálculo a funciones puras
- [ ] Crear tipos TypeScript compartidos
- [ ] Implementar validaciones centralizadas
- [ ] Crear componente base `CalculatorForm`
- [ ] Implementar `useCalculator` hook
- [ ] Agregar tests unitarios
- [ ] Implementar exportación a PDF
- [ ] Agregar historial de cálculos
- [ ] Documentar todas las funciones

---

*Documento generado para facilitar el mantenimiento y escalabilidad del sistema de calculadoras.*
