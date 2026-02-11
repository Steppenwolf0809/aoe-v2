import { describe, it, expect } from 'vitest'
import { parseCuvText, type CuvData } from './cuv-parser'

// ---------------------------------------------------------------------------
// Sample text extracted from a real CUV PDF via pdf-parse v2
// (Labels and values interleaved due to two-column PDF layout)
// ---------------------------------------------------------------------------
const SAMPLE_CUV_TEXT = `Fecha de Emisión:
Lugar / Canal Emisión:
17 de Diciembre de 2025 11:43
Agencia Nacional De Transito,
Quito
Valor del Servicio:
Solicitud:
95275366
$ 8,00
Vigencia:
Hasta que la Información sea
Modificada
17006833
Comprobante de Pago:
CERTIFICADO ÚNICO VEHICULAR
N°. CUV-2025-00972772
El Registro Único Nacional de Tránsito certifica los siguientes datos del vehículo:
CHEVROLET
,75
2009
Pasajeros:
PLATEADO
Modelo:
Número de Motor:
RANV / CPN:
Tipo:
LUV D-MAX 2.4L CD TM 4X2
Año de Modelo:
NO REGISTRADO
Disco:
Cilindraje (cc):
Marca:
VIN:
Servicio:
8LBETF3D690001679\tBBJ0014
5
Carrocería:
USO PARTICULAR
METALICA
CAMIONETA
NO REGISTRADO
Operadora:
Combustible:
NO REGISTRADO\tNúm. de Ruedas:
Núm. de Ejes:
ECUADOR
Color:
NO REGISTRADO
Placas:
2400
Clase:
Tonelaje (t):
C24SE31030958
B0183667
País de Origen:
DOBLE CABINA
GASOLINA
Ortopédico: NO REGISTRADO
Tipo de Peso: LIVIANO (MENOR IGUAL 3,5 T)
DATOS DEL PROPIETARIO:
CED - 0200055671\tDocumento de Identidad: 11-12-2008
AIDA MARIA VASCONEZ ESPINOZA
Propietario Desde:
Nombres:
DATOS DE MATRICULACIÓN:
Última Matrícula:
Mes de Matriculación: Estado:
SOAT Vigencia Hasta:
NO REGISTRADO
MAYO
NO REGISTRADO
Información de Gravámenes Vigentes: NO TIENE REGISTRADOS.
Información de Bloqueos Vigentes: NO TIENE REGISTRADOS.
Historia de Revisión Técnica Vehicular: NO TIENE REGISTRADOS.
.:Infracciones Pendientes de Pago:.
CANTIDAD DE INFRACCIONES: TOTAL:\tINTERÉS:\tVALOR: $ 1.488,60\t$ 1.488,60 $ 2.977,20\t13
Página 1 de 3`

describe('parseCuvText', () => {
  describe('full CUV extraction', () => {
    let result: CuvData

    it('parses without errors', () => {
      result = parseCuvText(SAMPLE_CUV_TEXT)
      expect(result).toBeDefined()
    })

    it('extracts placa (normalized with dash)', () => {
      expect(result.placa).toBe('BBJ-0014')
    })

    it('extracts VIN', () => {
      expect(result.vin).toBe('8LBETF3D690001679')
    })

    it('extracts marca', () => {
      expect(result.marca).toBe('CHEVROLET')
    })

    it('extracts modelo', () => {
      expect(result.modelo).toBe('LUV D-MAX 2.4L CD TM 4X2')
    })

    it('extracts año de modelo (not header date)', () => {
      expect(result.anio).toBe(2009)
    })

    it('extracts color', () => {
      expect(result.color).toBe('PLATEADO')
    })

    it('extracts número de motor', () => {
      expect(result.motor).toBe('C24SE31030958')
    })

    it('extracts cédula del propietario (10 digits)', () => {
      expect(result.cedulaPropietario).toBe('0200055671')
    })

    it('extracts nombres del propietario (Title Case)', () => {
      expect(result.nombresPropietario).toBe('Aida Maria Vasconez Espinoza')
    })

    it('detects no gravámenes', () => {
      expect(result.gravamenes.tiene).toBe(false)
      expect(result.gravamenes.detalle).toContain('NO TIENE REGISTRADOS')
    })

    it('detects no bloqueos', () => {
      expect(result.bloqueos.tiene).toBe(false)
      expect(result.bloqueos.detalle).toContain('NO TIENE REGISTRADOS')
    })

    it('detects infracciones pendientes', () => {
      expect(result.infracciones.tiene).toBe(true)
      expect(result.infracciones.cantidad).toBe(13)
      expect(result.infracciones.total).toBe(2977.2)
    })
  })

  describe('gravámenes positivos', () => {
    it('detects when gravámenes exist', () => {
      const text = SAMPLE_CUV_TEXT.replace(
        'Información de Gravámenes Vigentes: NO TIENE REGISTRADOS.',
        'Información de Gravámenes Vigentes: PRENDA INDUSTRIAL A FAVOR DE BANCO PICHINCHA',
      )
      const result = parseCuvText(text)
      expect(result.gravamenes.tiene).toBe(true)
      expect(result.gravamenes.detalle).toContain('PRENDA INDUSTRIAL')
    })
  })

  describe('bloqueos positivos', () => {
    it('detects when bloqueos exist', () => {
      const text = SAMPLE_CUV_TEXT.replace(
        'Información de Bloqueos Vigentes: NO TIENE REGISTRADOS.',
        'Información de Bloqueos Vigentes: BLOQUEO JUDICIAL POR ORDEN DE JUEZ',
      )
      const result = parseCuvText(text)
      expect(result.bloqueos.tiene).toBe(true)
      expect(result.bloqueos.detalle).toContain('BLOQUEO JUDICIAL')
    })
  })

  describe('sin infracciones', () => {
    it('handles zero infracciones', () => {
      const text = SAMPLE_CUV_TEXT.replace(
        /CANTIDAD DE INFRACCIONES:.*/i,
        '',
      )
      const result = parseCuvText(text)
      expect(result.infracciones.tiene).toBe(false)
      expect(result.infracciones.cantidad).toBe(0)
      expect(result.infracciones.total).toBe(0)
    })
  })

  describe('empty text', () => {
    it('returns all nulls for empty input', () => {
      const result = parseCuvText('')
      expect(result.placa).toBeNull()
      expect(result.vin).toBeNull()
      expect(result.marca).toBeNull()
      expect(result.modelo).toBeNull()
      expect(result.anio).toBeNull()
      expect(result.color).toBeNull()
      expect(result.motor).toBeNull()
      expect(result.cedulaPropietario).toBeNull()
      expect(result.nombresPropietario).toBeNull()
      expect(result.gravamenes.tiene).toBe(false)
      expect(result.bloqueos.tiene).toBe(false)
      expect(result.infracciones.tiene).toBe(false)
    })
  })

  describe('non-CUV text', () => {
    it('returns nulls for random text', () => {
      const result = parseCuvText('This is not a CUV document at all. Just some random text.')
      expect(result.placa).toBeNull()
      expect(result.vin).toBeNull()
      expect(result.marca).toBeNull()
    })
  })

  describe('placa normalization', () => {
    it('adds dash if missing (BBJ0014 → BBJ-0014)', () => {
      const text = SAMPLE_CUV_TEXT.replace('BBJ0014', 'ABC1234')
      const result = parseCuvText(text)
      expect(result.placa).toBe('ABC-1234')
    })

    it('keeps dash if already present', () => {
      const text = SAMPLE_CUV_TEXT.replace('BBJ0014', 'PBA-1234')
      const result = parseCuvText(text)
      expect(result.placa).toBe('PBA-1234')
    })
  })

  describe('different brands', () => {
    it('detects TOYOTA', () => {
      const text = SAMPLE_CUV_TEXT.replace('CHEVROLET', 'TOYOTA')
      const result = parseCuvText(text)
      expect(result.marca).toBe('TOYOTA')
    })

    it('detects KIA', () => {
      const text = SAMPLE_CUV_TEXT.replace('CHEVROLET', 'KIA')
      const result = parseCuvText(text)
      expect(result.marca).toBe('KIA')
    })
  })

  describe('different colors', () => {
    it('detects BLANCO', () => {
      const text = SAMPLE_CUV_TEXT.replace('PLATEADO', 'BLANCO')
      const result = parseCuvText(text)
      expect(result.color).toBe('BLANCO')
    })

    it('detects NEGRO', () => {
      const text = SAMPLE_CUV_TEXT.replace('PLATEADO', 'NEGRO')
      const result = parseCuvText(text)
      expect(result.color).toBe('NEGRO')
    })
  })
})
