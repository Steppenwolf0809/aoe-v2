import { describe, it, expect } from 'vitest'
import {
  vehiculoSchema,
  personaSchema,
  contratoVehicularSchema,
  requiresConyuge,
  compradorIncludesConyuge,
  countFirmas,
  resolverGenero,
  resolverEstadoCivil,
  buildTextoDocumento,
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
    valorContrato: 14500,
    tipo: 'Automóvil',
    cilindraje: 1500,
    carroceria: 'Metálica',
    clase: 'Automóvil',
    pais: 'Japón',
    combustible: 'Gasolina',
    pasajeros: 5,
    servicio: 'USO PARTICULAR',
    tonelaje: '',
  }
}

function validPersona() {
  return {
    cedula: '1712345678',
    nombres: 'Juan Carlos Perez Lopez',
    direccion: 'Av. Amazonas N24-123, Quito',
    telefono: '0991234567',
    email: 'juan@email.com',
    sexo: 'M' as const,
    nacionalidad: 'ecuatoriana',
    tipoDocumento: 'cedula' as const,
    estadoCivil: 'soltero' as const,
    comparecencia: 'propios_derechos' as const,
  }
}

function validPersonaCasada() {
  return {
    ...validPersona(),
    estadoCivil: 'casado' as const,
    conyuge: {
      nombres: 'Maria Elena Garcia',
      cedula: '1798765432',
    },
  }
}

function validPersonaApoderado() {
  return {
    ...validPersona(),
    comparecencia: 'apoderado' as const,
    apoderado: {
      nombres: 'Pedro Apoderado Lopez',
      cedula: '1711111111',
      notariaPoder: 'Notaria Decima Octava de Quito',
      fechaPoder: '15 de enero de 2026',
    },
  }
}

function validVendedorEmpresa() {
  return {
    ...validPersona(),
    esPersonaJuridica: true,
    cedula: '1790012345001',
    nombres: 'COMPANIA EJEMPLO S.A.',
    // Even if these are present, conyuge must not be required for juridical seller.
    estadoCivil: 'casado' as const,
    representanteLegal: {
      nombres: 'Nayibe Patricia Garcia Cabarcas',
      cedula: '1721690376',
      tipoDocumento: 'cedula' as const,
    },
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

  // --- Valor del contrato ---
  it('rejects valorContrato of 0', () => {
    const data = { ...validVehiculo(), valorContrato: 0 }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('rejects negative valorContrato', () => {
    const data = { ...validVehiculo(), valorContrato: -100 }
    expect(vehiculoSchema.safeParse(data).success).toBe(false)
  })

  it('accepts positive valorContrato', () => {
    const data = { ...validVehiculo(), valorContrato: 1 }
    expect(vehiculoSchema.safeParse(data).success).toBe(true)
  })
})

// ============================================
// personaSchema
// ============================================
describe('personaSchema', () => {
  it('accepts valid persona data (soltero)', () => {
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

  // --- Estado civil ---
  it('rejects missing estadoCivil', () => {
    const { estadoCivil, ...rest } = validPersona()
    expect(personaSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects invalid estadoCivil value', () => {
    const data = { ...validPersona(), estadoCivil: 'separado' }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it.each(['soltero', 'casado', 'divorciado', 'viudo', 'union_de_hecho'] as const)(
    'accepts estadoCivil "%s"',
    (ec) => {
      const data = ec === 'casado' || ec === 'union_de_hecho'
        ? { ...validPersona(), estadoCivil: ec, conyuge: { nombres: 'Conyuge Test', cedula: '1799999999' } }
        : { ...validPersona(), estadoCivil: ec }
      expect(personaSchema.safeParse(data).success).toBe(true)
    },
  )

  // --- Comparecencia ---
  it('rejects missing comparecencia', () => {
    const { comparecencia, ...rest } = validPersona()
    expect(personaSchema.safeParse(rest).success).toBe(false)
  })

  it('accepts comparecencia "propios_derechos"', () => {
    const data = { ...validPersona(), comparecencia: 'propios_derechos' }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  it('accepts comparecencia "apoderado" with apoderado data', () => {
    const result = personaSchema.safeParse(validPersonaApoderado())
    expect(result.success).toBe(true)
  })

  // --- Conyuge conditional ---
  // NOTE: conyuge requirement is now enforced at contract level (vendedor=required, comprador=optional)
  // personaSchema itself does NOT enforce conyuge - it only enforces apoderado.

  it('accepts casado persona without conyuge at personaSchema level (contract-level validates)', () => {
    const data = { ...validPersona(), estadoCivil: 'casado' as const }
    // personaSchema alone does NOT reject missing conyuge — contratoVehicularSchema does for vendedor
    const result = personaSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('accepts casado with valid conyuge data', () => {
    const result = personaSchema.safeParse(validPersonaCasada())
    expect(result.success).toBe(true)
  })

  it('does not require conyuge when soltero', () => {
    const data = validPersona() // soltero, no conyuge
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  it('does not require conyuge when divorciado', () => {
    const data = { ...validPersona(), estadoCivil: 'divorciado' as const }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  it('does not require conyuge when viudo', () => {
    const data = { ...validPersona(), estadoCivil: 'viudo' as const }
    expect(personaSchema.safeParse(data).success).toBe(true)
  })

  // --- Apoderado conditional ---
  it('requires apoderado data when comparecencia is apoderado', () => {
    const data = { ...validPersona(), comparecencia: 'apoderado' as const }
    const result = personaSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects apoderado with missing notariaPoder', () => {
    const data = {
      ...validPersonaApoderado(),
      apoderado: {
        nombres: 'Pedro Lopez',
        cedula: '1711111111',
        notariaPoder: 'AB', // too short
        fechaPoder: '15 de enero de 2026',
      },
    }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('rejects apoderado with missing fechaPoder', () => {
    const data = {
      ...validPersonaApoderado(),
      apoderado: {
        nombres: 'Pedro Lopez',
        cedula: '1711111111',
        notariaPoder: 'Notaria Decima Octava de Quito',
        fechaPoder: '15', // too short
      },
    }
    expect(personaSchema.safeParse(data).success).toBe(false)
  })

  it('does not require apoderado when propios_derechos', () => {
    const data = validPersona() // propios_derechos, no apoderado
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
      tipoAntecedente: 'compraventa' as const,
      cuvNumero: '',
      cuvFecha: '',
      fechaInscripcion: '',
      matriculaVigencia: '',
      formaPago: 'transferencia' as const,
      tieneObservaciones: false,
      observacionesTexto: '',
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

  it('accepts contract with both parties casado', () => {
    const data = {
      ...validContrato(),
      comprador: validPersonaCasada(),
      vendedor: validPersonaCasada(),
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  // --- VENDEDOR conyuge: always required when casado ---
  it('rejects contract when vendedor is casado without conyuge', () => {
    const data = {
      ...validContrato(),
      comprador: validPersona(),
      vendedor: { ...validPersona(), estadoCivil: 'casado' as const }, // no conyuge
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })

  // --- COMPRADOR conyuge: optional (checkbox) ---
  it('accepts contract when comprador is casado WITHOUT incluirConyuge (conyuge not required)', () => {
    const data = {
      ...validContrato(),
      comprador: { ...validPersona(), estadoCivil: 'casado' as const }, // no conyuge, no checkbox
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  it('accepts contract when comprador is casado with incluirConyuge=false (conyuge not required)', () => {
    const data = {
      ...validContrato(),
      comprador: { ...validPersona(), estadoCivil: 'casado' as const, incluirConyuge: false },
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  it('rejects contract when comprador is casado with incluirConyuge=true BUT missing conyuge data', () => {
    const data = {
      ...validContrato(),
      comprador: { ...validPersona(), estadoCivil: 'casado' as const, incluirConyuge: true },
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })

  it('accepts contract when comprador is casado with incluirConyuge=true AND valid conyuge data', () => {
    const data = {
      ...validContrato(),
      comprador: { ...validPersonaCasada(), incluirConyuge: true },
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  it('accepts contract with vendedor as apoderado', () => {
    const data = {
      ...validContrato(),
      vendedor: validPersonaApoderado(),
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  it('accepts contract with vendedor persona juridica without conyuge', () => {
    const data = {
      ...validContrato(),
      vendedor: validVendedorEmpresa(),
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  it('rejects vendedor persona juridica without representante legal', () => {
    const data = {
      ...validContrato(),
      vendedor: {
        ...validVendedorEmpresa(),
        representanteLegal: { nombres: '', cedula: '', tipoDocumento: 'cedula' as const },
      },
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })

  // --- Casos por tipo de antecedente ---
  it('accepts tipoAntecedente compraventa without herencia data', () => {
    const data = {
      ...validContrato(),
      tipoAntecedente: 'compraventa' as const,
      herencia: undefined,
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  it('rejects tipoAntecedente herencia when herencia data is missing', () => {
    const data = {
      ...validContrato(),
      tipoAntecedente: 'herencia' as const,
      herencia: undefined,
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })

  it('accepts tipoAntecedente herencia with valid herencia data', () => {
    const data = {
      ...validContrato(),
      tipoAntecedente: 'herencia' as const,
      herencia: {
        causanteNombre: 'Carlos Maldonado',
        causanteFechaFallecimiento: '2024-01-12',
        posEfectivaNotaria: 'Notaria Octava de Quito',
        posEfectivaFecha: '2024-03-02',
        herederosLista: 'Ana Maldonado y Luis Maldonado',
        parentesco: 'hijos',
      },
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  it('accepts tipoAntecedente donacion without herencia data', () => {
    const data = {
      ...validContrato(),
      tipoAntecedente: 'donacion' as const,
      herencia: undefined,
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  it('accepts tipoAntecedente importacion without herencia data', () => {
    const data = {
      ...validContrato(),
      tipoAntecedente: 'importacion' as const,
      herencia: undefined,
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  // --- Observaciones ---
  it('rejects when tieneObservaciones=true and observacionesTexto is missing', () => {
    const data = {
      ...validContrato(),
      tieneObservaciones: true,
      observacionesTexto: '',
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })

  it('accepts when tieneObservaciones=true and observacionesTexto is valid', () => {
    const data = {
      ...validContrato(),
      tieneObservaciones: true,
      observacionesTexto: 'Vehiculo con rayones leves en puerta posterior.',
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(true)
  })

  // --- Comprador persona juridica (no permitido en este formulario) ---
  it('rejects contract when comprador is persona juridica', () => {
    const data = {
      ...validContrato(),
      comprador: {
        ...validPersona(),
        esPersonaJuridica: true,
      },
    }
    expect(contratoVehicularSchema.safeParse(data).success).toBe(false)
  })
})

// ============================================
// requiresConyuge helper
// ============================================
describe('requiresConyuge', () => {
  it('returns true for casado', () => {
    expect(requiresConyuge('casado')).toBe(true)
  })

  it('returns true for union_de_hecho', () => {
    expect(requiresConyuge('union_de_hecho')).toBe(true)
  })

  it('returns false for soltero', () => {
    expect(requiresConyuge('soltero')).toBe(false)
  })

  it('returns false for divorciado', () => {
    expect(requiresConyuge('divorciado')).toBe(false)
  })

  it('returns false for viudo', () => {
    expect(requiresConyuge('viudo')).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(requiresConyuge(undefined)).toBe(false)
  })
})

// ============================================
// compradorIncludesConyuge helper
// ============================================
describe('compradorIncludesConyuge', () => {
  it('returns false when comprador is soltero', () => {
    const comprador = { ...validPersona(), estadoCivil: 'soltero' as const }
    expect(compradorIncludesConyuge(comprador as any)).toBe(false)
  })

  it('returns false when comprador is casado but incluirConyuge is undefined', () => {
    const comprador = { ...validPersona(), estadoCivil: 'casado' as const }
    expect(compradorIncludesConyuge(comprador as any)).toBe(false)
  })

  it('returns false when comprador is casado but incluirConyuge is false', () => {
    const comprador = { ...validPersona(), estadoCivil: 'casado' as const, incluirConyuge: false }
    expect(compradorIncludesConyuge(comprador as any)).toBe(false)
  })

  it('returns true when comprador is casado and incluirConyuge is true', () => {
    const comprador = { ...validPersona(), estadoCivil: 'casado' as const, incluirConyuge: true }
    expect(compradorIncludesConyuge(comprador as any)).toBe(true)
  })

  it('returns true when comprador is union_de_hecho and incluirConyuge is true', () => {
    const comprador = { ...validPersona(), estadoCivil: 'union_de_hecho' as const, incluirConyuge: true }
    expect(compradorIncludesConyuge(comprador as any)).toBe(true)
  })
})

// ============================================
// countFirmas helper
// ============================================
describe('countFirmas', () => {
  it('returns 3 for both solteros (2 comparecientes + 1 matricula)', () => {
    const data = {
      vehiculo: validVehiculo(),
      comprador: validPersona(),
      vendedor: validPersona(),
    } as any
    expect(countFirmas(data)).toBe(3)
  })

  it('returns 4 when vendedor is casado (3 comparecientes + 1 matricula)', () => {
    const data = {
      vehiculo: validVehiculo(),
      comprador: validPersona(),
      vendedor: validPersonaCasada(), // vendedor casado = conyuge always counts
    } as any
    expect(countFirmas(data)).toBe(4)
  })

  it('returns 4 when comprador casado without incluirConyuge (conyuge does NOT count)', () => {
    const data = {
      vehiculo: validVehiculo(),
      comprador: validPersonaCasada(), // no incluirConyuge — conyuge is optional for buyer
      vendedor: validPersona(),
    } as any
    expect(countFirmas(data)).toBe(3) // comprador + vendedor + matricula only
  })

  it('returns 5 when both parties casado and comprador has incluirConyuge=true (4 comparecientes + 1 matricula)', () => {
    const data = {
      vehiculo: validVehiculo(),
      comprador: { ...validPersonaCasada(), incluirConyuge: true },
      vendedor: validPersonaCasada(),
    } as any
    expect(countFirmas(data)).toBe(5)
  })

  it('returns 3 when apoderado (does not add extra firma)', () => {
    const data = {
      vehiculo: validVehiculo(),
      comprador: validPersonaApoderado(),
      vendedor: validPersona(),
    } as any
    expect(countFirmas(data)).toBe(3)
  })

  it('returns 3 when vendedor is persona juridica (sin conyuge vendedor)', () => {
    const data = {
      vehiculo: validVehiculo(),
      comprador: validPersona(),
      vendedor: validVendedorEmpresa(),
    } as any
    expect(countFirmas(data)).toBe(3)
  })
})
