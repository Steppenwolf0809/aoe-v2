import { describe, it, expect } from 'vitest'
import { generateContratoVehicularDocx } from './contrato-vehicular-docx'
import type { ContratoVehicular } from '@/lib/validations/contract'

function baseVehiculo(): ContratoVehicular['vehiculo'] {
  return {
    placa: 'ABC-1234',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2024,
    color: 'Blanco',
    motor: '2NRFKE1234567',
    chasis: '9BR53ZEC2L1234567',
    avaluo: 15000,
    valorContrato: 14800,
    tipo: 'Automovil',
    cilindraje: 1500,
    carroceria: 'Metalica',
    clase: 'Automovil',
    pais: 'Japon',
    combustible: 'Gasolina',
    pasajeros: 5,
    servicio: 'USO PARTICULAR',
    tonelaje: '',
  }
}

function basePersona(): ContratoVehicular['comprador'] {
  return {
    cedula: '1712345678',
    nombres: 'Juan Carlos Perez Lopez',
    direccion: 'Av. Amazonas N24-123, Quito',
    telefono: '0991234567',
    email: 'juan@email.com',
    sexo: 'M',
    nacionalidad: 'ecuatoriana',
    tipoDocumento: 'cedula',
    estadoCivil: 'soltero',
    comparecencia: 'propios_derechos',
    esPersonaJuridica: false,
    representanteLegal: { nombres: '', cedula: '', tipoDocumento: 'cedula' },
    conyuge: { nombres: '', cedula: '', tipoDocumento: 'cedula' },
    apoderado: { nombres: '', cedula: '', notariaPoder: '', fechaPoder: '' },
  }
}

function baseContrato(): ContratoVehicular {
  return {
    vehiculo: baseVehiculo(),
    comprador: basePersona(),
    vendedor: {
      ...basePersona(),
      cedula: '0912345678',
      nombres: 'Maria Elena Garcia Torres',
      sexo: 'F',
      email: 'maria@email.com',
      telefono: '0987654321',
    },
    tipoAntecedente: 'compraventa',
    cuvNumero: 'CUV-2026-00123456',
    cuvFecha: '21 de mayo de 2025 15:46',
    fechaInscripcion: '2024-02-15',
    matriculaVigencia: '2026-12-31',
    formaPago: 'transferencia',
    fechaPago: '2026-02-20',
    entidadFinancieraPago: 'Banco Pichincha',
    comprobantePago: 'TRX-123456',
    fechaEntrega: '2026-02-24',
    lugarEntrega: 'Quito, Ecuador',
    plazoTransferenciaDias: '30',
    tieneObservaciones: false,
    observacionesTexto: '',
  }
}

async function expectValidDocx(contract: ContratoVehicular): Promise<void> {
  const buffer = await generateContratoVehicularDocx(contract)
  expect(Buffer.isBuffer(buffer)).toBe(true)
  expect(buffer.byteLength).toBeGreaterThan(1000)
  expect(buffer.subarray(0, 2).toString('utf8')).toBe('PK')
}

describe('generateContratoVehicularDocx', () => {
  it('generates DOCX for compraventa', async () => {
    const contrato = baseContrato()
    contrato.tipoAntecedente = 'compraventa'
    await expectValidDocx(contrato)
  })

  it('generates DOCX for herencia', async () => {
    const contrato = baseContrato()
    contrato.tipoAntecedente = 'herencia'
    contrato.herencia = {
      causanteNombre: 'Carlos Guillermo Maldonado',
      causanteFechaFallecimiento: '2024-01-20',
      posEfectivaNotaria: 'Notaria Decima de Quito',
      posEfectivaFecha: '2024-03-15',
      herederosLista: 'Ana Maldonado y Luis Maldonado',
      parentesco: 'hijos',
    }
    await expectValidDocx(contrato)
  })

  it('generates DOCX for donacion', async () => {
    const contrato = baseContrato()
    contrato.tipoAntecedente = 'donacion'
    await expectValidDocx(contrato)
  })

  it('generates DOCX for importacion', async () => {
    const contrato = baseContrato()
    contrato.tipoAntecedente = 'importacion'
    await expectValidDocx(contrato)
  })

  it('generates DOCX when vendedor is persona juridica', async () => {
    const contrato = baseContrato()
    contrato.vendedor = {
      ...basePersona(),
      esPersonaJuridica: true,
      cedula: '1790012345001',
      nombres: 'COMPANIA EJEMPLO S.A.',
      email: 'ventas@compania.com',
      estadoCivil: 'casado',
      representanteLegal: {
        nombres: 'Nayibe Patricia Garcia Cabarcas',
        cedula: '1721690376',
        tipoDocumento: 'cedula',
      },
    }
    await expectValidDocx(contrato)
  })
})
