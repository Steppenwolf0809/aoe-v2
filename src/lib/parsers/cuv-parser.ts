// ---------------------------------------------------------------------------
// CUV (Certificado Único Vehicular) text parser
// ---------------------------------------------------------------------------
// The ANT CUV PDF has a two-column table layout. When extracted as text,
// labels and values get interleaved across columns. We cannot rely on
// simple "Label: Value" patterns for vehicle data. Instead we use:
//   1. Unique pattern matching (VIN=17 chars, Placa=ABC1234, Cédula=CED-xxx)
//   2. Known value lists (car brands, colors)
//   3. Labeled sections that remain intact (Gravámenes, Bloqueos)
// ---------------------------------------------------------------------------

export interface CuvWarning {
  tiene: boolean
  detalle: string
}

export interface CuvInfracciones {
  tiene: boolean
  cantidad: number
  total: number
}

export interface CuvData {
  // Vehicle
  placa: string | null
  vin: string | null
  marca: string | null
  modelo: string | null
  anio: number | null
  color: string | null
  motor: string | null
  // Owner (propietario actual = vendedor)
  cedulaPropietario: string | null
  nombresPropietario: string | null
  // Legal warnings
  gravamenes: CuvWarning
  bloqueos: CuvWarning
  infracciones: CuvInfracciones
}

// ---------------------------------------------------------------------------
// Known values for pattern matching
// ---------------------------------------------------------------------------

const CAR_BRANDS = [
  'CHEVROLET', 'TOYOTA', 'KIA', 'HYUNDAI', 'NISSAN', 'MAZDA', 'FORD',
  'VOLKSWAGEN', 'RENAULT', 'SUZUKI', 'MITSUBISHI', 'HONDA', 'SUBARU',
  'PEUGEOT', 'CITROEN', 'FIAT', 'JEEP', 'DODGE', 'CHRYSLER', 'RAM',
  'BMW', 'MERCEDES-BENZ', 'MERCEDES BENZ', 'AUDI', 'VOLVO', 'CHERY',
  'GREAT WALL', 'HAVAL', 'JAC', 'BYD', 'GEELY', 'CHANGAN', 'DFSK',
  'SHINERAY', 'FOTON', 'HINO', 'ISUZU', 'DAIHATSU', 'SSANGYONG',
  'LAND ROVER', 'MINI', 'PORSCHE', 'LEXUS', 'INFINITI', 'ACURA',
  'SKODA', 'SEAT', 'OPEL', 'DAEWOO', 'LADA', 'GAZ', 'ZX AUTO',
  'CHANGHE', 'HAFEI', 'ZOTYE', 'LIFAN', 'WULING', 'MAXUS', 'MG',
]

const VEHICLE_COLORS = [
  'PLATEADO', 'BLANCO', 'NEGRO', 'ROJO', 'AZUL', 'GRIS', 'VERDE',
  'AMARILLO', 'DORADO', 'CAFE', 'NARANJA', 'BEIGE', 'CREMA', 'CELESTE',
  'PLOMO', 'VINO', 'MARRON', 'ROSADO', 'TOMATE', 'BRONCE', 'CHAMPAGNE',
  'PLATA', 'GRAFITO', 'TURQUESA', 'MORADO', 'PURPURA', 'LILA',
  'ARENA', 'HUESO', 'PERLA', 'OCRE',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function normalizePlaca(raw: string): string {
  const clean = raw.replace(/[-\s]/g, '').toUpperCase()
  const m = clean.match(/^([A-Z]{2,3})(\d{3,4})$/)
  if (m) return `${m[1]}-${m[2]}`
  return raw.toUpperCase()
}

function normalizeBrand(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
}

function isLikelyBrandCandidate(line: string): boolean {
  const value = normalizeBrand(line)

  if (!value || value.length < 2 || value.length > 40) return false
  if (!/[A-Z]/.test(value)) return false
  if (/\d/.test(value)) return false
  if (value.endsWith(':')) return false
  if (!/^[A-Z .&-]+$/.test(value)) return false
  if (value === 'NO REGISTRADO') return false
  if (VEHICLE_COLORS.includes(value)) return false
  if (/^(VIN|MODELO|MARCA|PASAJEROS|SERVICIO|CARROCERIA|COLOR|PLACAS|CLASE|TIPO|CILINDRAJE|RANV)\b/.test(value)) return false
  if (/CERTIFICADO|CUV-|AGENCIA|TRANSITO|REGISTRO|INFORMACION|DATOS DEL/i.test(value)) return false

  return true
}

function extractBrandNearLabel(vehicleSection: string): string | null {
  const lines = vehicleSection
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  // Case 1: "Marca: TOYOTA"
  for (const line of lines) {
    const inlineMatch = line.match(/^\s*Marca\s*:\s*(.+)$/i)
    if (inlineMatch && isLikelyBrandCandidate(inlineMatch[1])) {
      return normalizeBrand(inlineMatch[1])
    }
  }

  // Case 2: standalone "Marca:" with value in nearby lines due two-column extraction
  const marcaIndexes: number[] = []
  lines.forEach((line, idx) => {
    if (/^\s*Marca\s*:?\s*$/i.test(line)) marcaIndexes.push(idx)
  })

  for (const idx of marcaIndexes) {
    const candidateIndexes: number[] = []

    // In ANT CUV two-column extraction, the brand may appear many lines above "Marca:"
    for (let i = idx - 1; i >= Math.max(0, idx - 20); i--) {
      candidateIndexes.push(i)
    }
    for (let i = idx + 1; i <= Math.min(lines.length - 1, idx + 6); i++) {
      candidateIndexes.push(i)
    }

    for (const ci of candidateIndexes) {
      if (ci < 0 || ci >= lines.length) continue
      if (isLikelyBrandCandidate(lines[ci])) {
        return normalizeBrand(lines[ci])
      }
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseCuvText(rawText: string): CuvData {
  const text = rawText

  // ── 1. VIN (17-char alphanumeric, standard VIN characters) ──────────
  const vinMatch = text.match(/\b([0-9A-HJ-NPR-Z]{17})\b/)
    || text.match(/\b([A-Z0-9]{17})\b/)
  const vin = vinMatch?.[1] ?? null

  // ── 2. PLACA ────────────────────────────────────────────────────────
  // Often on the same line as VIN (tab-separated: "VIN\tPLACA")
  let placa: string | null = null

  if (vin) {
    const vinLineMatch = text.match(
      new RegExp(`${vin}[\\t ]+([A-Z]{2,3}-?\\d{3,4})`, 'i'),
    )
    if (vinLineMatch) {
      placa = normalizePlaca(vinLineMatch[1])
    }
  }

  // Fallback: any plate pattern NOT inside the VIN
  if (!placa) {
    const placaPatterns = text.match(/\b([A-Z]{3}-?\d{3,4})\b/g)
    if (placaPatterns) {
      const candidates = placaPatterns.filter(
        (p) => !vin || !vin.includes(p),
      )
      if (candidates.length > 0) {
        placa = normalizePlaca(candidates[0])
      }
    }
  }

  // ── 3. MARCA (known car brand) ──────────────────────────────────────
  // Narrow to the vehicle data area (after "certifica" header, before owner data)
  const afterCertifica = text.split(/certifica los siguientes datos/i)[1] || text
  const vehicleSection = afterCertifica.split(/DATOS\s+DEL\s+PROPIETARIO/i)[0] || afterCertifica
  let marca: string | null = null

  for (const brand of CAR_BRANDS) {
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const brandRegex = new RegExp(`\\b${escaped}\\b`, 'i')
    if (brandRegex.test(vehicleSection)) {
      marca = brand
      break
    }
  }

  // Fallback when the brand is not in our known list or appears scrambled around "Marca:"
  if (!marca) {
    marca = extractBrandNearLabel(vehicleSection)
  }

  // ── 4. MODELO ───────────────────────────────────────────────────────
  // Model lines are descriptive (e.g. "LUV D-MAX 2.4L CD TM 4X2"),
  // contain both letters and numbers, and have spaces or dashes.
  let modelo: string | null = null
  const vsLines = vehicleSection.split('\n').map((l) => l.trim()).filter(Boolean)

  for (const line of vsLines) {
    if (line.endsWith(':')) continue
    if (line.length < 5) continue
    if (/^\d{4}$/.test(line)) continue
    if (/^[\d.,]+$/.test(line)) continue
    if (CAR_BRANDS.some((b) => line.toUpperCase() === b)) continue
    if (VEHICLE_COLORS.some((c) => line.toUpperCase() === c)) continue
    if (/^NO REGISTRADO$/i.test(line)) continue
    if (/^(CED|USO\s|METALICA|CAMIONETA|DOBLE|GASOLINA|DIESEL|ECUADOR|LIVIANO)/i.test(line)) continue
    if (/certifica|Registro|Nacional|Agencia/i.test(line)) continue
    if (/Fecha|Lugar|Vigencia|Solicitud|Comprobante|Valor del Servicio/i.test(line)) continue
    if (/Modificada|Emisión|Información|Historia/i.test(line)) continue
    if (/CERTIFICADO|CUV-/i.test(line)) continue
    if (/^Pasajeros:?/i.test(line)) continue
    if (vin && line.includes(vin)) continue
    // Filter out date-like lines ("17 de Diciembre de 2025 11:43")
    if (/\b(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)\b/i.test(line)) continue
    if (/^\d{1,2}\s+de\s+/i.test(line)) continue
    // Filter out legal/document text
    if (/Ortop[eé]dico|Tipo de Peso/i.test(line)) continue

    // Model lines have both letters and numbers, with spaces or dashes
    if (/[A-Z]/.test(line) && /\d/.test(line) && (line.includes(' ') || line.includes('-'))) {
      modelo = line
      break
    }
  }

  // ── 5. AÑO ──────────────────────────────────────────────────────────
  // Look for standalone 4-digit years in the vehicle section.
  // Skip years embedded in dates (preceded by "de", "-", "/") or in the header.
  let anio: number | null = null
  const yearRegex = /\b(19\d{2}|20[0-3]\d)\b/g
  let ym: RegExpExecArray | null
  while ((ym = yearRegex.exec(vehicleSection)) !== null) {
    const year = parseInt(ym[1], 10)
    if (year < 1990 || year > new Date().getFullYear() + 1) continue
    const idx = ym.index
    const before3 = vehicleSection.slice(Math.max(0, idx - 4), idx)
    // Skip if preceded by " de " (date context like "17 de Diciembre de 2025")
    if (/de\s$/i.test(before3)) continue
    // Skip if preceded by "-" or "/" (date like 11-12-2008)
    const charBefore = vehicleSection[idx - 1]
    if (charBefore === '-' || charBefore === '/') continue
    anio = year
    break
  }

  // ── 6. COLOR ────────────────────────────────────────────────────────
  let color: string | null = null
  for (const c of VEHICLE_COLORS) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(vehicleSection)) {
      color = c
      break
    }
  }

  // ── 7. MOTOR (Número de Motor) ──────────────────────────────────────
  // Alphanumeric code, 8-16 chars, has both letters and digits, NOT the VIN.
  let motor: string | null = null
  const alphanumCodes = vehicleSection.match(/\b([A-Z]\d{2}[A-Z0-9]{5,12})\b/g)
    || vehicleSection.match(/\b([A-Z0-9]{8,16})\b/g)

  if (alphanumCodes) {
    for (const code of alphanumCodes) {
      if (code.length === 17) continue // VIN
      if (code.length < 8) continue
      if (placa && code === placa.replace('-', '')) continue
      if (/[A-Z]/.test(code) && /\d/.test(code)) {
        motor = code
        break
      }
    }
  }

  // ── 8. CEDULA del propietario ───────────────────────────────────────
  const cedulaMatch = text.match(/CED\s*-?\s*(\d{10,13})/i)
  const cedulaPropietario = cedulaMatch ? cedulaMatch[1].slice(0, 10) : null

  // ── 9. NOMBRES del propietario ──────────────────────────────────────
  let nombresPropietario: string | null = null
  const propSection = text.split(/DATOS\s+DEL\s+PROPIETARIO/i)[1]
  if (propSection) {
    const propLines = propSection
      .split(/DATOS\s+DE\s+MATRICULACI[OÓ]N/i)[0]
      ?.split('\n')
      .map((l) => l.trim())
      .filter(Boolean) || []

    for (const line of propLines) {
      if (line.endsWith(':')) continue
      if (/^(CED|Documento|Propietario|Nombres)/i.test(line)) continue
      if (/^\d/.test(line)) continue
      if (/NO REGISTRADO/i.test(line)) continue
      // Full name: 2+ words, all uppercase letters (including accented)
      if (/^[A-ZÁÉÍÓÚÑ\s]{6,}$/.test(line) && line.includes(' ')) {
        nombresPropietario = toTitleCase(line)
        break
      }
    }
  }

  // ── 10. GRAVÁMENES ──────────────────────────────────────────────────
  const gravamenesMatch = text.match(
    /Informaci[oó]n\s+de\s+Grav[aá]menes\s+Vigentes:\s*([\s\S]+?)(?=Informaci[oó]n\s+de\s+Bloqueos|$)/i,
  )
  const gravamenesText = gravamenesMatch?.[1]?.trim() ?? ''
  const gravamenesTiene =
    !!gravamenesText && !gravamenesText.toUpperCase().includes('NO TIENE REGISTRADOS')

  // ── 11. BLOQUEOS ────────────────────────────────────────────────────
  const bloqueosMatch = text.match(
    /Informaci[oó]n\s+de\s+Bloqueos\s+Vigentes:\s*([\s\S]+?)(?=Historia|Infracciones|$)/i,
  )
  const bloqueosText = bloqueosMatch?.[1]?.trim() ?? ''
  const bloqueosTiene =
    !!bloqueosText && !bloqueosText.toUpperCase().includes('NO TIENE REGISTRADOS')

  // ── 12. INFRACCIONES ────────────────────────────────────────────────
  // pdf-parse may scramble the infracciones line, e.g.:
  // "CANTIDAD DE INFRACCIONES: TOTAL:\tINTERÉS:\tVALOR: $ 1.488,60\t$ 1.488,60 $ 2.977,20\t13"
  const infLine = text.match(/CANTIDAD\s+DE\s+INFRACCIONES:.*/i)?.[0] ?? ''
  const cantidadMatch = infLine.match(/\b(\d{1,4})\s*$/)
    || infLine.match(/INFRACCIONES:\s*(\d+)/i)
  const infCantidad = cantidadMatch ? parseInt(cantidadMatch[1], 10) : 0

  // Extract all dollar amounts and take the largest as TOTAL
  let infTotal = 0
  const amountRegex = /\$\s*([\d.,]+)/g
  const amounts: number[] = []
  let amountMatch: RegExpExecArray | null
  while ((amountMatch = amountRegex.exec(infLine)) !== null) {
    amounts.push(parseFloat(amountMatch[1].replace(/\./g, '').replace(',', '.')))
  }
  if (amounts.length > 0) {
    infTotal = Math.max(...amounts)
  }

  return {
    placa,
    vin,
    marca,
    modelo,
    anio,
    color,
    motor,
    cedulaPropietario,
    nombresPropietario,
    gravamenes: {
      tiene: gravamenesTiene,
      detalle: gravamenesText.replace(/\s+/g, ' ').trim(),
    },
    bloqueos: {
      tiene: bloqueosTiene,
      detalle: bloqueosText.replace(/\s+/g, ' ').trim(),
    },
    infracciones: {
      tiene: infCantidad > 0,
      cantidad: infCantidad,
      total: infTotal,
    },
  }
}
