import { describe, expect, it } from 'vitest'
import { parseCuvText, type CuvData } from './cuv-parser'

// Sample text extracted from a real ANT CUV with pdf-parse.
const SAMPLE_CUV_TEXT = `Fecha de Emision:
Lugar / Canal Emision:
17 de Diciembre de 2025 11:43
Agencia Nacional De Transito,
Quito
Valor del Servicio:
Solicitud:
95275366
$ 8,00
Vigencia:
Hasta que la Informacion sea
Modificada
17006833
Comprobante de Pago:
CERTIFICADO UNICO VEHICULAR
N°. CUV-2025-00972772
El Registro Unico Nacional de Transito certifica los siguientes datos del vehiculo:
CHEVROLET
,75
2009
Pasajeros:
PLATEADO
Modelo:
Numero de Motor:
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
8LBETF3D690001679	BBJ0014
5
Carroceria:
USO PARTICULAR
METALICA
CAMIONETA
NO REGISTRADO
Operadora:
Combustible:
NO REGISTRADO	Num. de Ruedas:
Num. de Ejes:
ECUADOR
Color:
NO REGISTRADO
Placas:
2400
Clase:
Tonelaje (t):
C24SE31030958
B0183667
Pais de Origen:
DOBLE CABINA
GASOLINA
Ortopedico: NO REGISTRADO
Tipo de Peso: LIVIANO (MENOR IGUAL 3,5 T)
DATOS DEL PROPIETARIO:
CED - 0200055671	Documento de Identidad: 11-12-2008
AIDA MARIA VASCONEZ ESPINOZA
Propietario Desde:
Nombres:
DATOS DE MATRICULACION:
Ultima Matricula:
Mes de Matriculacion: Estado:
SOAT Vigencia Hasta:
NO REGISTRADO
MAYO
NO REGISTRADO
Informacion de Gravamenes Vigentes: NO TIENE REGISTRADOS.
Informacion de Bloqueos Vigentes: NO TIENE REGISTRADOS.
Historia de Revision Tecnica Vehicular: NO TIENE REGISTRADOS.
.:Infracciones Pendientes de Pago:.
CANTIDAD DE INFRACCIONES: TOTAL:	INTERES:	VALOR: $ 1.488,60	$ 1.488,60 $ 2.977,20	13
Pagina 1 de 3`

describe('parseCuvText', () => {
  describe('full CUV extraction', () => {
    let result: CuvData

    it('parses without errors', () => {
      result = parseCuvText(SAMPLE_CUV_TEXT)
      expect(result).toBeDefined()
    })

    it('extracts placa', () => {
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

    it('extracts anio de modelo', () => {
      expect(result.anio).toBe(2009)
    })

    it('extracts color', () => {
      expect(result.color).toBe('PLATEADO')
    })

    it('extracts numero de motor', () => {
      expect(result.motor).toBe('C24SE31030958')
    })

    it('extracts tipo de vehiculo', () => {
      expect(result.tipo).toBe('DOBLE CABINA')
    })

    it('extracts cilindraje', () => {
      expect(result.cilindraje).toBe(2400)
    })

    it('extracts carroceria', () => {
      expect(result.carroceria).toBe('Metalica')
    })

    it('extracts clase', () => {
      expect(result.clase).toBe('Camioneta')
    })

    it('extracts pais', () => {
      expect(result.pais).toBe('Ecuador')
    })

    it('extracts combustible', () => {
      expect(result.combustible).toBe('Gasolina')
    })

    it('extracts pasajeros', () => {
      expect(result.pasajeros).toBe(5)
    })

    it('extracts servicio', () => {
      expect(result.servicio).toBe('USO PARTICULAR')
    })

    it('extracts tonelaje', () => {
      expect(result.tonelaje).toBe('0.75')
    })

    it('extracts RAMV/CPN', () => {
      expect(result.ramv).toBe('B0183667')
    })

    it('extracts CUV metadata', () => {
      expect(result.cuvNumero).toBe('CUV-2025-00972772')
      expect(result.cuvFecha).toBe('17 de Diciembre de 2025 11:43')
    })

    it('extracts cedula del propietario', () => {
      expect(result.cedulaPropietario).toBe('0200055671')
    })

    it('extracts nombres del propietario', () => {
      expect(result.nombresPropietario).toBe('Aida Maria Vasconez Espinoza')
    })

    it('detects no gravamenes', () => {
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

  describe('gravamenes positivos', () => {
    it('detects when gravamenes exist', () => {
      const text = SAMPLE_CUV_TEXT.replace(
        'Informacion de Gravamenes Vigentes: NO TIENE REGISTRADOS.',
        'Informacion de Gravamenes Vigentes: PRENDA INDUSTRIAL A FAVOR DE BANCO PICHINCHA',
      )
      const result = parseCuvText(text)
      expect(result.gravamenes.tiene).toBe(true)
      expect(result.gravamenes.detalle).toContain('PRENDA INDUSTRIAL')
    })
  })

  describe('bloqueos positivos', () => {
    it('detects when bloqueos exist', () => {
      const text = SAMPLE_CUV_TEXT.replace(
        'Informacion de Bloqueos Vigentes: NO TIENE REGISTRADOS.',
        'Informacion de Bloqueos Vigentes: BLOQUEO JUDICIAL POR ORDEN DE JUEZ',
      )
      const result = parseCuvText(text)
      expect(result.bloqueos.tiene).toBe(true)
      expect(result.bloqueos.detalle).toContain('BLOQUEO JUDICIAL')
    })
  })

  describe('sin infracciones', () => {
    it('handles zero infracciones', () => {
      const text = SAMPLE_CUV_TEXT.replace(/CANTIDAD DE INFRACCIONES:.*/i, '')
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
      expect(result.tipo).toBeNull()
      expect(result.cilindraje).toBeNull()
      expect(result.tonelaje).toBeNull()
      expect(result.cuvNumero).toBeNull()
      expect(result.cuvFecha).toBeNull()
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
      expect(result.modelo).toBeNull()
    })
  })

  describe('placa normalization', () => {
    it('adds dash if missing', () => {
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

    it('detects unknown brand near standalone label', () => {
      const text = SAMPLE_CUV_TEXT.replace('CHEVROLET', 'JETOUR')
      const result = parseCuvText(text)
      expect(result.marca).toBe('JETOUR')
    })

    it('detects brand from inline label', () => {
      const text = SAMPLE_CUV_TEXT
        .replace('CHEVROLET\n', '')
        .replace('Marca:', 'Marca: TESLA')
      const result = parseCuvText(text)
      expect(result.marca).toBe('TESLA')
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
