# 📄 Catálogo de Documentos Legales — AOE v2

> **Fecha:** 2026-02-07  
> **Estado:** Planificación inicial  
> **Owner:** Jose Luis — Abogados Online Ecuador, Quito

---

## 🎯 Visión General

AOE v2 generará documentos legales automatizados para el mercado ecuatoriano. Este documento cataloga todos los tipos de documentos planificados, sus campos, validaciones y flujos de generación.

---

## 📊 Categorías de Documentos

### Taxonomía Principal

```
DOCUMENTOS AOE v2
├── 🚗 VEHICULARES
│   ├── Compra-Venta de Vehículo
│   ├── Reserva de Dominio
│   ├── Autorización de Uso
│   └── Traspaso de Placa
│
├── 🏠 INMOBILIARIOS
│   ├── Promesa de Compra-Venta
│   ├── Contrato de Arrendamiento
│   └── Cesión de Derechos
│
├── ✍️ PODERES
│   ├── Poder General
│   ├── Poder Especial
│   ├── Poder para Vehículos
│   ├── Poder para Trámites Bancarios
│   └── Poder para Representación Legal
│
├── 👪 FAMILIA
│   ├── Divorcio por Mutuo Consentimiento
│   ├── Unión de Hecho
│   ├── Capitulaciones Matrimoniales
│   └── Autorización de Viaje (menores)
│
├── 💼 EMPRESARIALES
│   ├── Constitución de Compañía
│   ├── Acta de Junta
│   ├── Poder a Representante Legal
│   └── NDA / Confidencialidad
│
└── 📝 DECLARACIONES
    ├── Declaración Juramentada
    ├── Acta de Finiquito
    └── Reconocimiento de Deuda
```

---

## 🚗 1. DOCUMENTOS VEHICULARES

### 1.1 Contrato de Compra-Venta de Vehículo

**Prioridad:** 🔴 ALTA (MVP - Producto principal)  
**Precio Base:** $9.99  
**Complejidad Promedio:** Media

#### Campos del Formulario (Wizard)

```
PASO 1: VENDEDOR
├── tipoPersona: enum('natural', 'juridica')
├── cedula/ruc: string (10-13 dígitos)
├── nombres: string
├── apellidos: string (si natural)
├── razonSocial: string (si juridica)
├── representanteLegal: string (si juridica)
├── direccion: string
├── telefono: string
├── email: string
├── estadoCivil: enum('soltero', 'casado', 'divorciado', 'viudo', 'union_libre')
└── conyugue?: { nombres, cedula } (si casado)

PASO 2: COMPRADOR
├── [mismos campos que vendedor]
└── financiamiento: boolean

PASO 3: VEHÍCULO
├── tipo: enum('auto', 'moto', 'camioneta', 'camion', 'bus')
├── marca: string
├── modelo: string
├── anio: number (1990-2027)
├── color: string
├── placa: string (formato ABC-1234)
├── chasis: string
├── motor: string
├── cilindraje: number (cc)
├── combustible: enum('gasolina', 'diesel', 'electrico', 'hibrido')
├── numPuertas: number
├── numPasajeros: number
├── matriculaVigente: boolean
└── restricciones: string[] (gravámenes, multas)

PASO 4: CONDICIONES ECONÓMICAS
├── precioVenta: number (USD)
├── formaPago: enum('contado', 'financiado', 'mixto')
├── If financiado/mixto:
│   ├── cuotaInicial: number
│   ├── saldoPendiente: number
│   ├── numeroCuotas: number
│   ├── valorCuota: number
│   ├── fechaPrimeraCuota: date
│   └── reservaDominio: boolean
└── incluyeEntrega: boolean

PASO 5: CLÁUSULAS ADICIONALES (Add-ons)
├── clausulaGarantia: boolean (+$2)
├── clausulaArbitraje: boolean (+$3)
├── clausulaServicioPostventa: boolean (+$2)
├── clausulaCondicionesEspeciales: string
└── clausulaPersonalizada: string (+$5)

PASO 6: REVISIÓN Y PAGO
├── resumenContrato: preview
├── addOns: selected[]
├── totalPagar: calculated
└── aceptaTerminos: boolean
```

#### Validaciones Zod

```typescript
// lib/validations/contrato-vehicular.ts
import { z } from 'zod';

const cedulaEcuadorSchema = z.string()
  .length(10, 'Cédula debe tener 10 dígitos')
  .regex(/^\d+$/, 'Solo números')
  .refine(validarCedulaEcuador, 'Cédula inválida');

const placaSchema = z.string()
  .regex(/^[A-Z]{3}-\d{3,4}$/, 'Formato: ABC-1234');

export const contratoVehicularSchema = z.object({
  vendedor: z.object({
    tipoPersona: z.enum(['natural', 'juridica']),
    identificacion: z.string().min(10).max(13),
    nombres: z.string().min(2),
    // ... resto de campos
  }),
  comprador: z.object({
    // ... similar a vendedor
  }),
  vehiculo: z.object({
    tipo: z.enum(['auto', 'moto', 'camioneta', 'camion', 'bus']),
    placa: placaSchema,
    anio: z.number().min(1990).max(new Date().getFullYear() + 1),
    // ... resto de campos
  }),
  condiciones: z.object({
    precioVenta: z.number().positive(),
    formaPago: z.enum(['contado', 'financiado', 'mixto']),
    // ... condicionales según forma de pago
  }),
  clausulas: z.object({
    garantia: z.boolean().default(false),
    arbitraje: z.boolean().default(false),
    personalizadas: z.string().optional(),
  }),
});
```

#### Plantilla del Documento

```
┌─────────────────────────────────────────────────────────────────┐
│                    REPÚBLICA DEL ECUADOR                        │
│                                                                 │
│              CONTRATO DE COMPRA-VENTA DE VEHÍCULO               │
├─────────────────────────────────────────────────────────────────┤
│ En la ciudad de _______, a los ___ días del mes de ___ de 2026  │
├─────────────────────────────────────────────────────────────────┤
│ PRIMERA: COMPARECIENTES                                         │
│ Por una parte, {vendedor.nombres} con CI {vendedor.cedula}...   │
│ Por otra parte, {comprador.nombres} con CI {comprador.cedula}...│
├─────────────────────────────────────────────────────────────────┤
│ SEGUNDA: ANTECEDENTES                                           │
│ El VENDEDOR declara ser legítimo propietario del vehículo...    │
├─────────────────────────────────────────────────────────────────┤
│ TERCERA: OBJETO DEL CONTRATO                                    │
│ Vehículo: {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}    │
│ Placa: {vehiculo.placa}                                         │
│ Chasis: {vehiculo.chasis}                                       │
│ Motor: {vehiculo.motor}                                         │
├─────────────────────────────────────────────────────────────────┤
│ CUARTA: PRECIO Y FORMA DE PAGO                                  │
│ El precio convenido es de USD ${condiciones.precioVenta}...     │
├─────────────────────────────────────────────────────────────────┤
│ QUINTA: OBLIGACIONES DEL VENDEDOR                               │
│ - Entregar el vehículo en las condiciones pactadas...           │
├─────────────────────────────────────────────────────────────────┤
│ SEXTA: OBLIGACIONES DEL COMPRADOR                               │
│ - Pagar el precio en la forma convenida...                      │
├─────────────────────────────────────────────────────────────────┤
│ {if clausulas.garantia}                                         │
│ SÉPTIMA: GARANTÍA                                               │
│ El vendedor garantiza el buen funcionamiento por 30 días...     │
│ {/if}                                                           │
├─────────────────────────────────────────────────────────────────┤
│ CLÁUSULA PENAL: En caso de incumplimiento...                    │
├─────────────────────────────────────────────────────────────────┤
│         VENDEDOR                    COMPRADOR                   │
│                                                                 │
│     _____________              _____________                    │
│     {vendedor.nombres}         {comprador.nombres}              │
│     CI: {vendedor.cedula}      CI: {comprador.cedula}           │
└─────────────────────────────────────────────────────────────────┘
```

#### Add-Ons Disponibles

| Add-On | Precio | Descripción |
|--------|--------|-------------|
| Cláusula de Garantía | +$2 | Garantía 30 días motor y transmisión |
| Cláusula de Arbitraje | +$3 | Resolución en Centro de Arbitraje |
| Cláusulas Personalizadas | +$5 | Hasta 3 cláusulas adicionales |
| Formato Notaría | +$8 | Listo para elevar a escritura |
| Revisión Abogado | +$15 | Revisión profesional |
| Código QR Verificación | +$3 | Verificación de autenticidad |

---

### 1.2 Reserva de Dominio

**Prioridad:** 🟡 MEDIA  
**Precio Base:** $14.99  
**Descripción:** Cuando hay financiamiento, el vendedor mantiene la propiedad hasta pago total.

#### Campos Adicionales (además de compra-venta)

```
├── entidadFinanciera?: string
├── montoFinanciado: number
├── plazoMeses: number
├── tasaInteres: number
├── clausulaVencimientoAnticipado: boolean
└── garantiaAdicional?: string
```

---

### 1.3 Autorización de Uso de Vehículo

**Prioridad:** 🟢 BAJA  
**Precio Base:** $5.99  
**Descripción:** Autoriza a tercero a usar el vehículo temporalmente.

#### Campos

```
├── propietario: PersonaSchema
├── autorizado: PersonaSchema
├── vehiculo: VehiculoSchema
├── vigencia: { desde: date, hasta: date }
├── motivo: string
├── alcance: enum('nacional', 'fronterizo')
└── restricciones: string[]
```

---

## ✍️ 2. PODERES

### 2.1 Poder General

**Prioridad:** 🔴 ALTA  
**Precio Base:** $12.99  
**Descripción:** Facultades amplias de representación.

#### Campos del Formulario

```
PASO 1: PODERDANTE (quien otorga)
├── tipoPersona: enum('natural', 'juridica')
├── cedula: string
├── nombres: string
├── direccion: string
├── estadoCivil: string
└── telefono: string

PASO 2: APODERADO (quien recibe)
├── cedula: string
├── nombres: string
├── direccion: string
├── parentesco?: string
└── telefono: string

PASO 3: FACULTADES
├── tipoPoader: enum('general', 'especial')
├── facultades[]: 
│   ├── 'administrar_bienes'
│   ├── 'representar_juicios'
│   ├── 'cobrar_deudas'
│   ├── 'firmar_contratos'
│   ├── 'abrir_cuentas_bancarias'
│   ├── 'tramites_notariales'
│   ├── 'tramites_municipales'
│   ├── 'tramites_sri'
│   ├── 'tramites_iess'
│   └── 'otros' (texto libre)
├── exclusiones[]: string[]
└── montoMaximo?: number (limite para transacciones)

PASO 4: VIGENCIA
├── tipoVigencia: enum('indefinido', 'temporal', 'acto_especifico')
├── fechaInicio?: date
├── fechaFin?: date
├── actoEspecifico?: string
└── revocable: boolean (default: true)

PASO 5: OPCIONES ADICIONALES
├── sustituible: boolean (puede delegar a otro)
├── mancomunado: boolean (requiere firma conjunta)
├── notificacionRevocacion: boolean
└── jurisdiccion: string (provincia)
```

#### Tipos de Poderes Específicos

| Tipo | Precio | Facultades Incluidas |
|------|--------|----------------------|
| **Poder General Amplio** | $12.99 | Todas las facultades |
| **Poder para Vehículos** | $9.99 | Venta, traspaso, matrícula |
| **Poder Bancario** | $9.99 | Cuentas, transferencias, créditos |
| **Poder Judicial** | $14.99 | Representación en procesos |
| **Poder para Trámites** | $7.99 | SRI, IESS, Municipio |
| **Poder para Inmuebles** | $14.99 | Venta, arriendo, hipoteca |

---

### 2.2 Poder Especial para Vehículos

**Prioridad:** 🔴 ALTA (complementa compra-venta)  
**Precio Base:** $9.99  

#### Campos Específicos

```
├── vehiculo: VehiculoSchema
├── facultades[]:
│   ├── 'venta_vehiculo'
│   ├── 'traspaso_dominio'
│   ├── 'matriculacion'
│   ├── 'revision_vehicular'
│   ├── 'levantamiento_gravamenes'
│   └── 'tramites_ant'
├── precioMinimo?: number (si es para venta)
└── vigenciaTransaccion: date
```

---

## 👪 3. DOCUMENTOS DE FAMILIA

### 3.1 Divorcio por Mutuo Consentimiento (Notarial)

**Prioridad:** 🟡 MEDIA  
**Precio Base:** $49.99  
**Requisitos:** Sin hijos menores, sin bienes que liquidar

#### Campos del Formulario

```
PASO 1: DATOS DEL MATRIMONIO
├── fechaMatrimonio: date
├── lugarMatrimonio: string
├── actaMatrimonial: { tomo, pagina, acta }
├── registroCivil: string
└── tiempoConvivencia: string

PASO 2: CÓNYUGE 1
├── cedula: string
├── nombres: string
├── nacionalidad: string
├── profesion: string
├── direccionActual: string
└── telefono: string

PASO 3: CÓNYUGE 2
├── [mismos campos]

PASO 4: VERIFICACIONES
├── tieneHijosMenores: boolean (debe ser false)
├── tieneBienesLiquidar: boolean (debe ser false)
├── tieneDeudas: boolean
│   └── if true: detalleDeudas: string
├── hayAcuerdoPensiones: boolean
│   └── if true: montoMensual: number
└── hayOtrosAcuerdos: string

PASO 5: CAUSALES Y ACUERDOS
├── causalDivorcio: 'mutuo_consentimiento'
├── fechaSeparacionFisica: date
├── acuerdoVoluntario: boolean (required: true)
├── asesoriaLegal: boolean (confirma entender consecuencias)
└── firmaDigital: boolean
```

#### Notas Importantes

```
⚠️ LIMITACIONES DEL DIVORCIO NOTARIAL:
   - NO aplica si hay hijos menores de edad
   - NO aplica si hay bienes inmuebles que liquidar
   - REQUIERE que ambos comparezcan personalmente ante notario
   - El documento generado es una SOLICITUD, no el acta final
   
✅ El servicio AOE genera:
   - Solicitud de divorcio por mutuo consentimiento
   - Acuerdo de voluntades
   - Formulario de liquidación (si aplica)
   
❌ El servicio AOE NO reemplaza:
   - La comparecencia ante notario
   - El acta notarial de divorcio
   - La inscripción en Registro Civil
```

---

### 3.2 Autorización de Viaje para Menores

**Prioridad:** 🟡 MEDIA  
**Precio Base:** $7.99  

#### Campos

```
├── menor: {
│   nombres, cedula/pasaporte, fechaNacimiento, nacionalidad
│ }
├── padreAutorizante: {
│   nombres, cedula, parentesco
│ }
├── padreNoAutoriza?: {
│   nombres, cedula, motivoNoFirma
│ }
├── acompanante: {
│   nombres, cedula, parentesco/relacion
│ }
├── viaje: {
│   destino: string,
│   fechaSalida: date,
│   fechaRetorno: date,
│   motivo: string,
│   medioTransporte: string
│ }
└── restricciones?: string
```

---

## 📝 4. DECLARACIONES

### 4.1 Declaración Juramentada

**Prioridad:** 🟡 MEDIA  
**Precio Base:** $6.99  

#### Campos

```
├── declarante: PersonaSchema
├── tipoDeclaracion: enum(
│   'ingresos',
│   'bienes',
│   'estado_civil',
│   'residencia',
│   'laboral',
│   'otro'
│ )
├── contenidoDeclaracion: string (texto guiado según tipo)
├── proposito: string
├── destinatario: string (para quién es la declaración)
├── advertenciaFalsedad: boolean (acepta consecuencias)
└── lugarFecha: { ciudad, fecha }
```

---

### 4.2 Reconocimiento de Deuda

**Prioridad:** 🟢 BAJA  
**Precio Base:** $8.99  

#### Campos

```
├── deudor: PersonaSchema
├── acreedor: PersonaSchema
├── deuda: {
│   montoOriginal: number,
│   montoActual: number,
│   moneda: 'USD',
│   origeneDeuda: string,
│   fechaOrigen: date
│ }
├── planPago: {
│   formaPago: enum('contado', 'cuotas'),
│   numeroCuotas?: number,
│   valorCuota?: number,
│   fechaInicioCuotas?: date,
│   fechaPagoTotal?: date
│ }
├── garantias?: string
└── clausulaPenal?: {
│   existe: boolean,
│   porcentaje?: number
│ }
```

---

## 🏗️ 5. ARQUITECTURA TÉCNICA

### 5.1 Modelo de Base de Datos

```sql
-- Tabla principal de documentos
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tipo_documento VARCHAR(50) NOT NULL,
  subtipo VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'borrador',
  datos JSONB NOT NULL,
  precio_base DECIMAL(10,2),
  addons_aplicados JSONB,
  precio_total DECIMAL(10,2),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  pagado_at TIMESTAMPTZ,
  generado_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_documentos_user ON documentos(user_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo_documento);
CREATE INDEX idx_documentos_estado ON documentos(estado);

-- RLS
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON documentos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documentos FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 5.2 Catálogo de Tipos de Documento

```typescript
// lib/documents/catalog.ts

export const DOCUMENT_CATALOG = {
  // VEHICULARES
  COMPRAVENTA_VEHICULO: {
    id: 'compraventa_vehiculo',
    nombre: 'Contrato de Compra-Venta de Vehículo',
    categoria: 'vehicular',
    precioBase: 9.99,
    schema: contratoVehicularSchema,
    template: 'compraventa-vehiculo.hbs',
    addOns: ['garantia', 'arbitraje', 'qr', 'notaria', 'revision'],
    campos: contratoVehicularFields,
    pasos: 6,
  },
  
  PODER_GENERAL: {
    id: 'poder_general',
    nombre: 'Poder General',
    categoria: 'poderes',
    precioBase: 12.99,
    schema: poderGeneralSchema,
    template: 'poder-general.hbs',
    addOns: ['notaria', 'revision', 'qr'],
    campos: poderGeneralFields,
    pasos: 5,
  },
  
  PODER_VEHICULOS: {
    id: 'poder_vehiculos',
    nombre: 'Poder Especial para Vehículos',
    categoria: 'poderes',
    precioBase: 9.99,
    schema: poderVehiculosSchema,
    template: 'poder-vehiculos.hbs',
    addOns: ['notaria', 'revision', 'qr'],
    campos: poderVehiculosFields,
    pasos: 4,
  },
  
  DIVORCIO_MUTUO: {
    id: 'divorcio_mutuo',
    nombre: 'Divorcio por Mutuo Consentimiento',
    categoria: 'familia',
    precioBase: 49.99,
    schema: divorcioMutuoSchema,
    template: 'divorcio-mutuo.hbs',
    addOns: ['revision', 'asesoria'],
    campos: divorcioMutuoFields,
    pasos: 5,
    restricciones: ['sin_hijos_menores', 'sin_bienes'],
  },
  
  AUTORIZACION_VIAJE: {
    id: 'autorizacion_viaje',
    nombre: 'Autorización de Viaje para Menores',
    categoria: 'familia',
    precioBase: 7.99,
    schema: autorizacionViajeSchema,
    template: 'autorizacion-viaje.hbs',
    addOns: ['notaria', 'apostilla'],
    campos: autorizacionViajeFields,
    pasos: 4,
  },
  
  DECLARACION_JURAMENTADA: {
    id: 'declaracion_juramentada',
    nombre: 'Declaración Juramentada',
    categoria: 'declaraciones',
    precioBase: 6.99,
    schema: declaracionSchema,
    template: 'declaracion-juramentada.hbs',
    addOns: ['notaria'],
    campos: declaracionFields,
    pasos: 3,
  },
} as const;

export type DocumentType = keyof typeof DOCUMENT_CATALOG;
```

### 5.3 Add-Ons Globales

```typescript
// lib/documents/addons.ts

export const ADDONS_CATALOG = {
  garantia: {
    id: 'garantia',
    nombre: 'Cláusula de Garantía',
    descripcion: 'Garantía de 30 días para motor y transmisión',
    precio: 2.00,
    aplicaA: ['compraventa_vehiculo'],
  },
  
  arbitraje: {
    id: 'arbitraje',
    nombre: 'Cláusula de Arbitraje',
    descripcion: 'Resolución de conflictos en Centro de Arbitraje',
    precio: 3.00,
    aplicaA: ['compraventa_vehiculo', 'arrendamiento'],
  },
  
  qr: {
    id: 'qr',
    nombre: 'Código QR de Verificación',
    descripcion: 'QR para verificar autenticidad del documento',
    precio: 3.00,
    aplicaA: ['*'], // todos los documentos
  },
  
  notaria: {
    id: 'notaria',
    nombre: 'Formato Notaría',
    descripcion: 'Documento formateado para elevar a escritura pública',
    precio: 8.00,
    aplicaA: ['*'],
  },
  
  revision: {
    id: 'revision',
    nombre: 'Revisión por Abogado',
    descripcion: 'Un abogado revisa el documento antes de entrega',
    precio: 15.00,
    aplicaA: ['*'],
  },
  
  clausulas_personalizadas: {
    id: 'clausulas_personalizadas',
    nombre: 'Cláusulas Personalizadas',
    descripcion: 'Añade hasta 3 cláusulas adicionales',
    precio: 5.00,
    aplicaA: ['compraventa_vehiculo', 'arrendamiento', 'poder_general'],
  },
  
  modificaciones: {
    id: 'modificaciones',
    nombre: '3 Modificaciones',
    descripcion: 'Puedes editar el documento 3 veces después de generado',
    precio: 5.00,
    aplicaA: ['*'],
  },
  
  envio_partes: {
    id: 'envio_partes',
    nombre: 'Envío a las Partes',
    descripcion: 'Envío automático por email a comprador y vendedor',
    precio: 2.00,
    aplicaA: ['compraventa_vehiculo', 'arrendamiento'],
  },
  
  apostilla: {
    id: 'apostilla',
    nombre: 'Formato para Apostilla',
    descripcion: 'Preparado para trámite de apostilla internacional',
    precio: 10.00,
    aplicaA: ['autorizacion_viaje', 'poder_general'],
  },
  
  asesoria: {
    id: 'asesoria',
    nombre: 'Asesoría Legal (15 min)',
    descripcion: 'Videollamada de 15 minutos con abogado',
    precio: 20.00,
    aplicaA: ['divorcio_mutuo', 'constitucion_empresa'],
  },
} as const;
```

---

## 🎯 6. ROADMAP DE IMPLEMENTACIÓN

### Fase 1: MVP (Semanas 1-4)
| Prioridad | Documento | Complejidad |
|-----------|-----------|-------------|
| 🔴 | Compra-Venta Vehículo | Alta |
| 🔴 | Poder General | Media |
| 🔴 | Poder para Vehículos | Baja |

### Fase 2: Expansión (Semanas 5-8)
| Prioridad | Documento | Complejidad |
|-----------|-----------|-------------|
| 🟡 | Declaración Juramentada | Baja |
| 🟡 | Autorización de Viaje | Baja |
| 🟡 | Arrendamiento | Media |

### Fase 3: Especialización (Semanas 9-12)
| Prioridad | Documento | Complejidad |
|-----------|-----------|-------------|
| 🟡 | Divorcio Mutuo | Alta |
| 🟢 | Reconocimiento de Deuda | Baja |
| 🟢 | Reserva de Dominio | Media |

---

## 📝 Notas para Desarrollo

### Validaciones Críticas Ecuador

```typescript
// Validación de cédula ecuatoriana
function validarCedulaEcuador(cedula: string): boolean {
  if (cedula.length !== 10) return false;
  const provincia = parseInt(cedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) return false;
  
  const tercerDigito = parseInt(cedula[2]);
  if (tercerDigito > 5) return false;
  
  // Algoritmo módulo 10
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i]) * coeficientes[i];
    if (valor >= 10) valor -= 9;
    suma += valor;
  }
  
  const verificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
  return verificador === parseInt(cedula[9]);
}

// Validación de placas Ecuador
const PLACA_REGEX = /^[A-Z]{3}-\d{3,4}$/;
const PLACA_PROVINCIAS = {
  'A': 'Azuay', 'B': 'Bolívar', 'C': 'Carchi', /* ... */
};
```

---

> 📝 **Nota:** Este catálogo se irá expandiendo conforme se implementen nuevos tipos de documentos. Cada nuevo documento debe seguir el patrón establecido aquí.
