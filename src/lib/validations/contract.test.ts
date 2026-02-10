import { describe, it, expect } from 'vitest'
import {
  vehiculoSchema,
  personaSchema,
  contratoVehicularSchema,
} from './contract'

// ============================================
// Helper: valid data factories
// ============================================
function validVehiculo() {
  return {
    placa: 'ABC-1234',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2024,
    color: 'Blanco',
    motor: '2NR-FKE1234567',
    chasis: '9BR53ZEC2L1234567',
    avaluo: 15000,
  }
}

function validPersona() {
  return {
    cedula: '1712345678',
    nombres: 'Juan Carlos Perez Lopez',
    direccion: 'Av. Amazonas N24-123, Quito',
    telefono: '0991234567',
    email: 'juan@email.com',
  }
}

// ============================================
// vehiculoSchema
// ============================================
describe('vehiculoSchema', () => {
  it('accepts valid vehicle data', () => {
    const result = vehiculoSchema.safeParse(validVehiculo())
    expect(result.success).toBe(true)
  })

  // --- Placa ---
  it('accepts 3-letter + 3-digit plate (ABC-123)', () => {
    const data = { ...validVehiculo(), placa: 'PBA-123' }
    expect(vehiculoSchema.safeParse(data).success).toBe(true)
  })

  it('accepts 3-letter + 4-digit plate (ABC-1234)', () => {
    const data = { ...validVehiculo(), placa: 'PBA-1234' }
    expect(vehiculoSchema.safeParse(data).success).toBe(true)
  })

  it('rejects lowercase plate', () => {
    const data = { ...validVehiculo(), placa: 'abc-1234' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('rejects plate without dash', () => {
    const data = { ...validVehiculo(), placa: 'ABC1234' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('rejects plate with 2 letters', () => {
    const data = { ...validVehiculo(), placa: 'AB-1234' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('rejects plate with 5 digits', () => {
    const data = { ...validVehiculo(), placa: 'ABC-12345' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('rejects empty plate', () => {
    const data = { ...validVehiculo(), placa: '' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  // --- Marca ---
  it('rejects marca with less than 2 chars', () => {
    const data = { ...validVehiculo(), marca: 'A' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('accepts marca with 2+ chars', () => {
    const data = { ...validVehiculo(), marca: 'KIA' }
    expect(vehiculoSchema.safeParse(data).success).toBe(true)
  })

  // --- Modelo ---
  it('rejects empty modelo', () => {
    const data = { ...validVehiculo(), modelo: '' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  // --- Ano ---
  it('rejects year before 1990', () => {
    const data = { ...validVehiculo(), anio: 1989 }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('accepts year 1990', () => {
    const data = { ...validVehiculo(), anio: 1990 }
    expect(vehiculoSchema.safeParse(data).success).toBe(true)
  })

  it('accepts current year', () => {
    const data = { ...validVehiculo(), anio: new Date().getFullYear() }
    expect(vehiculoSchema.safeParse(data).success).toBe(true)
  })

  it('accepts next year (new models)', () => {
    const data = { ...validVehiculo(), anio: new Date().getFullYear() + 1 }
    expect(vehiculoSchema.safeParse(data).success).toBe(true)
  })

  it('rejects year 2 years from now', () => {
    const data = { ...validVehiculo(), anio: new Date().getFullYear() + 2 }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  // --- Color ---
  it('rejects color with less than 2 chars', () => {
    const data = { ...validVehiculo(), color: 'R' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  // --- Motor ---
  it('rejects motor with less than 3 chars', () => {
    const data = { ...validVehiculo(), motor: 'AB' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  // --- Chasis ---
  it('rejects chasis with less than 3 chars', () => {
    const data = { ...validVehiculo(), chasis: 'AB' }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  // --- Avaluo ---
  it('rejects avaluo of 0', () => {
    const data = { ...validVehiculo(), avaluo: 0 }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('rejects negative avaluo', () => {
    const data = { ...validVehiculo(), avaluo: -5000 }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('accepts small positive avaluo', () => {
    const data = { ...validVehiculo(), avaluo: 0.01 }
    expect(vehiculoSchema.safeParse(data).success).toBe(true)
  })
})

// ============================================
// personaSchema
// ============================================
describe('personaSchema', () => {
  it('accepts valid persona data', () => {
    const result = personaSchema.safeParse(validPersona())
    expect(result.success).toBe(true)
  })

  // --- Cedula ---
  it('rejects cedula with 9 digits', () => {
    const data = { ...validPersona(), cedula: '171234567' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('rejects cedula with 11 digits', () => {
    const data = { ...validPersona(), cedula: '17123456789' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('accepts cedula with exactly 10 digits', () => {
    const data = { ...validPersona(), cedula: '0102030405' }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  it('rejects empty cedula', () => {
    const data = { ...validPersona(), cedula: '' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  // --- Nombres ---
  it('rejects nombres with less than 3 chars', () => {
    const data = { ...validPersona(), nombres: 'AB' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('accepts nombres with 3+ chars', () => {
    const data = { ...validPersona(), nombres: 'Ana' }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  // --- Direccion ---
  it('rejects direccion with less than 5 chars', () => {
    const data = { ...validPersona(), direccion: 'Av.' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('accepts direccion with 5+ chars', () => {
    const data = { ...validPersona(), direccion: 'Av. 6' }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  // --- Telefono ---
  it('rejects telefono with less than 7 chars', () => {
    const data = { ...validPersona(), telefono: '099123' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('accepts telefono with 7+ chars', () => {
    const data = { ...validPersona(), telefono: '0991234' }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  it('accepts 10-digit mobile number', () => {
    const data = { ...validPersona(), telefono: '0991234567' }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  // --- Email ---
  it('rejects invalid email', () => {
    const data = { ...validPersona(), email: 'not-an-email' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('rejects email without domain', () => {
    const data = { ...validPersona(), email: 'user@' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('accepts valid email', () => {
    const data = { ...validPersona(), email: 'maria@empresa.com.ec' }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })
})

// ============================================
// contratoVehicularSchema (full contract)
// ============================================
describe('contratoVehicularSchema', () => {
  function validContrato() {
    return {
      vehiculo: validVehiculo(),
      comprador: validPersona(),
      vendedor: validPersona(),
    }
  }

  it('accepts a complete valid contract', () => {
    const result = contratoVehicularSchema.safeParse(validContrato())
    expect(result.success).toBe(true)
  })

  it('rejects contract missing vehiculo', () => {
    const { vehiculo, ...rest } = validContrato()
    expect(contratoVehicularSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects contract missing comprador', () => {
    const { comprador, ...rest } = validContrato()
    expect(contratoVehicularSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects contract missing vendedor', () => {
    const { vendedor, ...rest } = validContrato()
    expect(contratoVehicularSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects contract with invalid vehiculo field', () => {
    const data = validContrato()
    data.vehiculo.placa = 'invalid'
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })

  it('rejects contract with invalid comprador field', () => {
    const data = validContrato()
    data.comprador.cedula = '123' // too short
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })

  it('rejects contract with invalid vendedor field', () => {
    const data = validContrato()
    data.vendedor.email = 'not-email'
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })

  it('allows different buyer and seller', () => {
    const data = validContrato()
    data.comprador.cedula = '1712345678'
    data.vendedor.cedula = '0912345678'
    const result = contratoVehicularSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('returns parsed data on success', () => {
    const input = validContrato()
    const result = contratoVehicularSchema.safeParse(input)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.vehiculo.placa).toBe('ABC-1234')
      expect(result.data.comprador.nombres).toBe('Juan Carlos Perez Lopez')
      expect(result.data.vendedor.email).toBe('juan@email.com')
    }
  })

  it('rejects completely empty object', () => {
    expect(contratoVehicularSchema.safeParse({}).success).toBe(false)
  })

  it('rejects null', () => {
    expect(contratoVehicularSchema.safeParse(null).success).toBe(false)
  })
})
