// CUV (Certificado Unico Vehicular) parser.
//
// ANT CUV PDFs use a two-column table layout. Text extraction interleaves labels
// and values, so simple "Label: Value" regexes are unreliable. This parser uses:
// - section-based parsing (vehicle, owner, legal warnings)
// - known value dictionaries (brand, color, fuel, class, etc.)
// - positional heuristics for fields that are consistently shifted

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
  tipo: string | null
  cilindraje: number | null
  carroceria: string | null
  clase: string | null
  pais: string | null
  combustible: string | null
  pasajeros: number | null
  servicio: string | null
  tonelaje: string | null
  cuvNumero: string | null
  cuvFecha: string | null
  // Owner
  tipoDocumentoPropietario: 'CED' | 'RUC' | null
  documentoPropietario: string | null
  propietarioEsEmpresa: boolean
  cedulaPropietario: string | null
  nombresPropietario: string | null
  // Legal warnings
  gravamenes: CuvWarning
  bloqueos: CuvWarning
  infracciones: CuvInfracciones
}

interface ParsedLine {
  raw: string
  norm: string
}

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
] as const

const VEHICLE_COLORS = [
  'PLATEADO', 'BLANCO', 'NEGRO', 'ROJO', 'AZUL', 'GRIS', 'VERDE',
  'AMARILLO', 'DORADO', 'CAFE', 'NARANJA', 'BEIGE', 'CREMA', 'CELESTE',
  'PLOMO', 'VINO', 'MARRON', 'ROSADO', 'TOMATE', 'BRONCE', 'CHAMPAGNE',
  'PLATA', 'GRAFITO', 'TURQUESA', 'MORADO', 'PURPURA', 'LILA',
  'ARENA', 'HUESO', 'PERLA', 'OCRE',
] as const

const VEHICLE_TYPES = [
  'DOBLE CABINA', 'CABINA SIMPLE', 'CABINA DOBLE', 'SEDAN', 'HATCHBACK',
  'STATION WAGON', 'COUPE', 'CONVERTIBLE', 'SUV', 'FURGONETA', 'PANEL',
  'TANQUERO', 'VOLQUETA', 'PLATAFORMA', 'CHASIS', 'BUS', 'MINIBUS',
] as const

const BODY_TYPES = ['METALICA', 'METALICA', 'FIBRA', 'MIXTA', 'MADERA'] as const

const FUEL_TYPES = ['GASOLINA', 'DIESEL', 'DIESEL', 'GAS', 'ELECTRICO', 'ELECTRICO', 'HIBRIDO', 'HIBRIDO', 'GLP', 'GNV'] as const

const VEHICLE_CLASSES = [
  'CAMIONETA', 'AUTOMOVIL', 'AUTOMOVIL', 'JEEP', 'CAMION', 'CAMION',
  'BUS', 'MOTOCICLETA', 'FURGONETA', 'TODO TERRENO', 'TANQUERO',
  'VOLQUETA', 'TRACTOCAMION', 'TRACTOCAMION', 'TRAILER', 'TRAILER',
] as const

const SERVICE_TYPES = [
  'USO PARTICULAR', 'PARTICULAR', 'PUBLICO', 'PUBLICO', 'ESTATAL',
  'OFICIAL', 'COMERCIAL', 'ALQUILER',
] as const

const COUNTRY_HINTS = [
  'ECUADOR', 'COLOMBIA', 'PERU', 'CHILE', 'ARGENTINA', 'BRASIL',
  'MEXICO', 'JAPON', 'JAPON', 'CHINA', 'COREA', 'ESTADOS UNIDOS',
  'CANADA', 'ALEMANIA', 'ESPANA', 'ITALIA', 'FRANCIA', 'INDIA',
] as const

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function normalizePlaca(raw: string): string {
  const clean = raw.replace(/[-\s]/g, '').toUpperCase()
  const match = clean.match(/^([A-Z]{2,3})(\d{3,4})$/)
  if (!match) return raw.toUpperCase()
  return `${match[1]}-${match[2]}`
}

function normalizeForMatch(value: string): string {
  return value
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function linesFromText(text: string): ParsedLine[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      raw: line,
      norm: normalizeForMatch(line),
    }))
}

function isNoRegistrado(value: string): boolean {
  return /NO\s+REGISTRADO/.test(normalizeForMatch(value))
}

function isLikelyLabel(line: ParsedLine): boolean {
  if (line.raw.includes(':')) return true
  if (/^(DATOS|CERTIFICADO|PAGINA|HISTORIA|INFRACCIONES)\b/i.test(line.raw)) {
    return true
  }
  return false
}

function getSection(text: string, start: RegExp, end: RegExp): string {
  const startMatch = text.match(start)
  if (!startMatch || startMatch.index === undefined) return ''
  const fromStart = text.slice(startMatch.index + startMatch[0].length)
  const endMatch = fromStart.match(end)
  if (!endMatch || endMatch.index === undefined) return fromStart
  return fromStart.slice(0, endMatch.index)
}

function findLineIndex(lines: ParsedLine[], pattern: RegExp): number {
  return lines.findIndex((line) => pattern.test(line.raw) || pattern.test(line.norm))
}

function findNextLine(
  lines: ParsedLine[],
  startIndex: number,
  maxDistance: number,
  predicate: (line: ParsedLine) => boolean,
): ParsedLine | null {
  if (startIndex < 0) return null
  const end = Math.min(lines.length - 1, startIndex + maxDistance)
  for (let index = startIndex + 1; index <= end; index += 1) {
    const line = lines[index]
    if (predicate(line)) return line
  }
  return null
}

function findInlineValue(text: string, label: string): string | null {
  const regex = new RegExp(`${label}\\s*:\\s*(.+?)(?:\\t|\\n|$)`, 'i')
  const match = text.match(regex)
  if (!match) return null
  const value = match[1].trim()
  if (!value) return null
  return value
}

function parseCurrency(value: string): number {
  const normalized = value.replace(/\./g, '').replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed)) return 0
  return parsed
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values))
}

function pickKnownValue(
  lines: ParsedLine[],
  tokens: readonly string[],
  options?: { skipNoRegistrado?: boolean },
): string | null {
  const normalizedTokens = tokens.map((token) => ({
    token,
    norm: normalizeForMatch(token),
  }))

  for (const line of lines) {
    if (options?.skipNoRegistrado && isNoRegistrado(line.raw)) continue
    for (const token of normalizedTokens) {
      if (line.norm === token.norm) return token.token
      if (line.norm.includes(` ${token.norm} `)) return token.token
      if (line.norm.startsWith(`${token.norm} `)) return token.token
      if (line.norm.endsWith(` ${token.norm}`)) return token.token
    }
  }
  return null
}

function isLikelyBrandCandidate(line: ParsedLine): boolean {
  if (!line.norm) return false
  if (line.norm.length < 2 || line.norm.length > 40) return false
  if (isLikelyLabel(line)) return false
  if (isNoRegistrado(line.raw)) return false
  if (/\d/.test(line.norm)) return false
  if (pickKnownValue([line], VEHICLE_COLORS)) return false
  if (pickKnownValue([line], VEHICLE_TYPES)) return false
  if (pickKnownValue([line], BODY_TYPES)) return false
  if (pickKnownValue([line], FUEL_TYPES)) return false
  if (pickKnownValue([line], VEHICLE_CLASSES)) return false
  if (pickKnownValue([line], SERVICE_TYPES)) return false
  if (/CERTIFICADO|AGENCIA|TRANSITO|REGISTRO|INFORMACION|DATOS/.test(line.norm)) return false
  return /^[A-Z\s.&-]+$/.test(line.norm)
}

function extractBrand(lines: ParsedLine[]): string | null {
  const inline = lines
    .map((line) => line.raw.match(/^\s*Marca\s*:\s*(.+)$/i)?.[1]?.trim() ?? null)
    .find((value) => Boolean(value) && !isNoRegistrado(value!))
  if (inline && /[A-Za-z]/.test(inline)) {
    return normalizeForMatch(inline)
  }

  const known = pickKnownValue(lines, CAR_BRANDS)
  if (known) return known

  const marcaLabelIndex = findLineIndex(lines, /^MARCA\s*:?\s*$/i)
  if (marcaLabelIndex >= 0) {
    const min = Math.max(0, marcaLabelIndex - 20)
    const max = Math.min(lines.length - 1, marcaLabelIndex + 8)
    for (let index = min; index <= max; index += 1) {
      if (index === marcaLabelIndex) continue
      const line = lines[index]
      if (isLikelyBrandCandidate(line)) return line.norm
    }
  }

  for (const line of lines) {
    if (isLikelyBrandCandidate(line)) return line.norm
  }
  return null
}

function isLikelyModelLine(line: ParsedLine): boolean {
  if (!line.raw) return false
  if (isLikelyLabel(line)) return false
  if (isNoRegistrado(line.raw)) return false
  if (/^\d{1,4}$/.test(line.norm)) return false
  if (/^[\d.,]+$/.test(line.raw)) return false
  if (/^(CED|VIN|PLACAS|COLOR|CLASE|SERVICIO|COMBUSTIBLE)\b/.test(line.norm)) return false
  if (pickKnownValue([line], CAR_BRANDS)) return false
  if (pickKnownValue([line], VEHICLE_COLORS)) return false
  if (pickKnownValue([line], VEHICLE_TYPES)) return false
  if (pickKnownValue([line], FUEL_TYPES)) return false
  if (pickKnownValue([line], VEHICLE_CLASSES)) return false
  if (pickKnownValue([line], SERVICE_TYPES)) return false
  if (!/[A-Z]/.test(line.norm)) return false

  // Most model values include either digits or separators.
  if (!/\d/.test(line.raw) && !/[/-]/.test(line.raw)) return false
  return line.raw.length >= 5 && line.raw.length <= 80
}

function extractModelo(lines: ParsedLine[]): string | null {
  const tipoLabelIndex = findLineIndex(lines, /^TIPO\s*:?\s*$/i)
  const fromTipo = findNextLine(lines, tipoLabelIndex, 8, isLikelyModelLine)
  if (fromTipo) return fromTipo.raw

  const modeloLabelIndex = findLineIndex(lines, /^MODELO\s*:?\s*$/i)
  const fromModelo = findNextLine(lines, modeloLabelIndex, 8, isLikelyModelLine)
  if (fromModelo) return fromModelo.raw

  for (const line of lines) {
    if (isLikelyModelLine(line)) return line.raw
  }
  return null
}

function extractAnio(lines: ParsedLine[]): number | null {
  const currentYear = new Date().getFullYear() + 1
  for (const line of lines) {
    if (!/^\d{4}$/.test(line.norm)) continue
    const year = Number.parseInt(line.norm, 10)
    if (year >= 1950 && year <= currentYear) return year
  }
  return null
}

function extractColor(lines: ParsedLine[]): string | null {
  const knownColor = pickKnownValue(lines, VEHICLE_COLORS, { skipNoRegistrado: true })
  if (knownColor) return knownColor

  const colorLabelIndex = findLineIndex(lines, /^COLOR\s*:?\s*$/i)
  const afterLabel = findNextLine(
    lines,
    colorLabelIndex,
    4,
    (line) => !isLikelyLabel(line),
  )
  if (afterLabel && isNoRegistrado(afterLabel.raw)) return 'NO REGISTRADO'
  return null
}

function normalizeAlnumCode(value: string): string {
  return value.replace(/[^A-Z0-9]/gi, '').toUpperCase()
}

function extractCodes(line: ParsedLine): string[] {
  const matches = line.raw.toUpperCase().match(/\b[A-Z0-9]{7,18}\b/g) ?? []
  return unique(matches.map((code) => normalizeAlnumCode(code)))
}

function isMotorCandidate(code: string, vin: string | null, placa: string | null): boolean {
  if (!code) return false
  if (code.length < 8 || code.length > 16) return false
  if (vin && code === vin) return false
  if (placa && code === placa.replace('-', '')) return false
  if (/^\d+$/.test(code)) return false
  if (!/[A-Z]/.test(code) || !/\d/.test(code)) return false
  if (/^Q\d{9,}$/.test(code)) return false
  return true
}

function extractMotor(lines: ParsedLine[], vin: string | null, placa: string | null): string | null {
  const tonelajeLabelIndex = findLineIndex(lines, /^TONELAJE/i)
  if (tonelajeLabelIndex >= 0) {
    const fromTonelaje = findNextLine(lines, tonelajeLabelIndex, 4, (line) => {
      const code = extractCodes(line).find((item) => isMotorCandidate(item, vin, placa))
      return Boolean(code)
    })
    if (fromTonelaje) {
      const code = extractCodes(fromTonelaje).find((item) => isMotorCandidate(item, vin, placa))
      if (code) return code
    }
  }

  const allCandidates = unique(
    lines
      .flatMap((line) => extractCodes(line))
      .filter((code) => isMotorCandidate(code, vin, placa)),
  )

  if (allCandidates.length === 0) return null
  return allCandidates.sort((left, right) => right.length - left.length)[0]
}

function extractCilindraje(lines: ParsedLine[], sectionText: string): number | null {
  const placasLabelIndex = findLineIndex(lines, /^PLACAS\s*:?\s*$/i)
  const nearPlacas = findNextLine(lines, placasLabelIndex, 4, (line) => /^\d{2,5}$/.test(line.norm))
  if (nearPlacas) {
    const value = Number.parseInt(nearPlacas.norm, 10)
    if (value >= 50 && value <= 12000) return value
  }

  const inline = findInlineValue(sectionText, 'Cilindraje\\s*(?:\\(cc\\))?')
  if (inline) {
    const numeric = Number.parseFloat(inline.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'))
    if (Number.isFinite(numeric) && numeric > 0) return Math.round(numeric)
  }

  return null
}

function extractPasajeros(lines: ParsedLine[], vin: string | null): number | null {
  const parsePassengerLine = (line: ParsedLine): number | null => {
    if (!/^\d{1,2}$/.test(line.norm)) return null
    const value = Number.parseInt(line.norm, 10)
    if (value < 1 || value > 80) return null
    return value
  }

  if (vin) {
    const vinLineIndex = lines.findIndex((line) => line.raw.includes(vin))
    if (vinLineIndex >= 0) {
      const end = Math.min(lines.length - 1, vinLineIndex + 3)
      for (let index = vinLineIndex + 1; index <= end; index += 1) {
        const value = parsePassengerLine(lines[index])
        if (value !== null) return value
      }
    }
  }

  const pasajerosLabelIndex = findLineIndex(lines, /^PASAJEROS\s*:?\s*$/i)
  if (pasajerosLabelIndex >= 0) {
    const end = Math.min(lines.length - 1, pasajerosLabelIndex + 20)
    for (let index = pasajerosLabelIndex + 1; index <= end; index += 1) {
      const value = parsePassengerLine(lines[index])
      if (value !== null) return value
    }
  }

  return null
}

function extractTonelaje(lines: ParsedLine[], sectionText: string): string | null {
  const inline = findInlineValue(sectionText, 'Tonelaje\\s*(?:\\(t\\))?')
  if (inline) {
    const parsed = Number.parseFloat(
      inline
        .replace(/[^\d.,]/g, '')
        .replace(/\./g, '')
        .replace(',', '.'),
    )
    if (Number.isFinite(parsed) && parsed > 0 && parsed < 100) {
      return parsed.toString()
    }
  }

  for (const line of lines.slice(0, 20)) {
    const normalized = line.raw.replace(/\s/g, '')
    if (!/^(?:[.,]\d{1,2}|\d{1,2}[.,]\d{1,2})$/.test(normalized)) continue
    const candidate = normalized.replace(',', '.').replace(/^[.,]/, '0.')
    const parsed = Number.parseFloat(candidate)
    if (Number.isFinite(parsed) && parsed > 0 && parsed < 100) {
      return parsed.toString()
    }
  }

  return null
}

function extractPais(lines: ParsedLine[]): string | null {
  const fromList = pickKnownValue(lines, COUNTRY_HINTS)
  if (fromList) return fromList

  const paisLabelIndex = findLineIndex(lines, /^PAIS(?:\s+DE\s+ORIGEN)?\s*:?\s*$/i)
  const nearLabel = findNextLine(lines, paisLabelIndex, 6, (line) => {
    if (isLikelyLabel(line)) return false
    if (isNoRegistrado(line.raw)) return false
    if (pickKnownValue([line], VEHICLE_TYPES)) return false
    if (pickKnownValue([line], VEHICLE_CLASSES)) return false
    if (pickKnownValue([line], FUEL_TYPES)) return false
    if (pickKnownValue([line], SERVICE_TYPES)) return false
    return /^[A-Z\s]{3,30}$/.test(line.norm)
  })

  return nearLabel?.norm ?? null
}

function extractInfracciones(text: string, lines: ParsedLine[]): CuvInfracciones {
  let cantidad = 0
  let total = 0

  const summaryLine =
    lines.find((line) => /CANTIDAD\s+DE\s+INFRACCIONES/i.test(line.raw))?.raw ?? ''

  if (summaryLine) {
    const countFromEnd = summaryLine.match(/(\d{1,4})\s*$/)
    const countInline = summaryLine.match(/INFRACCIONES\s*:\s*(\d+)/i)
    const parsedCount = countFromEnd?.[1] ?? countInline?.[1] ?? null
    if (parsedCount) {
      cantidad = Number.parseInt(parsedCount, 10)
    }

    const amountMatches = summaryLine.match(/\$\s*[\d.,]+/g) ?? []
    const amounts = amountMatches.map((item) => parseCurrency(item.replace(/^\$\s*/, '')))
    if (amounts.length > 0) {
      total = Math.max(...amounts)
    }
  }

  if (cantidad === 0) {
    const ids = new Set(text.match(/\bQ\d{9,}\b/g) ?? [])
    cantidad = ids.size
  }

  if (total === 0 && cantidad > 0) {
    // Fallback: sum "TOTAL" values from row lines when summary line is absent.
    const rowTotals: number[] = []
    for (const line of lines) {
      if (!/\$\s*[\d.,]+/.test(line.raw)) continue
      const values = line.raw.match(/\$\s*[\d.,]+/g) ?? []
      if (values.length < 3) continue
      const maybeTotal = parseCurrency(values[values.length - 1].replace(/^\$\s*/, ''))
      if (maybeTotal > 0) rowTotals.push(maybeTotal)
    }
    if (rowTotals.length > 0) {
      total = Number.parseFloat(rowTotals.reduce((acc, value) => acc + value, 0).toFixed(2))
    }
  }

  return {
    tiene: cantidad > 0,
    cantidad,
    total,
  }
}

export function parseCuvText(rawText: string): CuvData {
  const text = rawText ?? ''
  const allLines = linesFromText(text)

  const vehicleSection = getSection(
    text,
    /certifica\s+los\s+siguientes\s+datos/i,
    /DATOS\s+DEL\s+PROPIETARIO/i,
  )
  const vehicleLines = linesFromText(vehicleSection)

  const ownerSection = getSection(
    text,
    /DATOS\s+DEL\s+PROPIETARIO/i,
    /DATOS\s+DE\s+MATRICULA(?:CION)?/i,
  )
  const ownerLines = linesFromText(ownerSection)

  const vinAndPlateMatch =
    vehicleSection.match(/\b([0-9A-HJ-NPR-Z]{17})\s+([A-Z]{2,3}-?\d{3,4})\b/i)
    ?? text.match(/\b([0-9A-HJ-NPR-Z]{17})\s+([A-Z]{2,3}-?\d{3,4})\b/i)

  const vin =
    vinAndPlateMatch?.[1]
    ?? vehicleSection.match(/\b([0-9A-HJ-NPR-Z]{17})\b/i)?.[1]
    ?? text.match(/\b([0-9A-HJ-NPR-Z]{17})\b/i)?.[1]
    ?? null

  let placa: string | null = null
  if (vinAndPlateMatch?.[2]) {
    placa = normalizePlaca(vinAndPlateMatch[2])
  } else {
    const plateMatch = (vehicleSection.match(/\b([A-Z]{2,3}-?\d{3,4})\b/g) ?? [])
      .find((candidate) => !vin || !vin.includes(candidate))
    placa = plateMatch ? normalizePlaca(plateMatch) : null
  }

  const marca = extractBrand(vehicleLines)
  const modelo = extractModelo(vehicleLines)
  const anio = extractAnio(vehicleLines)
  const color = extractColor(vehicleLines)
  const tipo = pickKnownValue(vehicleLines, VEHICLE_TYPES)
  const servicio = pickKnownValue(vehicleLines, SERVICE_TYPES)
  const carroceria = pickKnownValue(vehicleLines, BODY_TYPES)
  const clase = pickKnownValue(vehicleLines, VEHICLE_CLASSES)
  const combustible = pickKnownValue(vehicleLines, FUEL_TYPES)
  const pais = extractPais(vehicleLines)
  const cilindraje = extractCilindraje(vehicleLines, vehicleSection)
  const pasajeros = extractPasajeros(vehicleLines, vin)
  const tonelaje = extractTonelaje(vehicleLines, vehicleSection)
  const motor = extractMotor(vehicleLines, vin, placa)

  const cuvNumero = text.match(/\bCUV-\d{4}-\d+\b/i)?.[0]?.toUpperCase() ?? null
  const cuvFecha =
    text.match(/\b\d{1,2}\s+de\s+[A-Za-z\u00C0-\u00FF]+\s+de\s+\d{4}(?:\s+\d{2}:\d{2})?\b/i)?.[0]
    ?? null

  const documentoMatch = text.match(/\b(CED|RUC)\s*-\s*(\d{10,13})\b/i)
  const tipoDocumentoPropietario = documentoMatch?.[1]?.toUpperCase() as 'CED' | 'RUC' | undefined
  const documentoPropietario = documentoMatch?.[2] ?? null
  const propietarioEsEmpresa = tipoDocumentoPropietario === 'RUC'
  const cedulaPropietario =
    tipoDocumentoPropietario === 'CED'
      ? documentoPropietario?.slice(0, 10) ?? null
      : null

  let nombresPropietario: string | null = null
  for (const line of ownerLines) {
    if (line.raw.endsWith(':')) continue
    if (/^(CED|RUC|DOCUMENTO|PROPIETARIO|NOMBRES)\b/i.test(line.raw)) continue
    if (/^\d/.test(line.raw)) continue
    if (isNoRegistrado(line.raw)) continue
    if (/^[A-Z\u00C0-\u00FF\s.&-]{6,}$/.test(line.raw) && line.raw.includes(' ')) {
      nombresPropietario = toTitleCase(line.raw)
      break
    }
  }

  const gravamenesMatch = text.match(
    /Informaci[oó]n\s+de\s+Grav[aá]menes\s+Vigentes:\s*([\s\S]+?)(?=Informaci[oó]n\s+de\s+Bloqueos|$)/i,
  )
  const gravamenesDetalle = gravamenesMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? ''

  const bloqueosMatch = text.match(
    /Informaci[oó]n\s+de\s+Bloqueos\s+Vigentes:\s*([\s\S]+?)(?=Historia|Infracciones|$)/i,
  )
  const bloqueosDetalle = bloqueosMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? ''

  const infracciones = extractInfracciones(text, allLines)

  return {
    placa,
    vin,
    marca: marca ? marca.toUpperCase() : null,
    modelo,
    anio,
    color: color ? color.toUpperCase() : null,
    motor,
    tipo: tipo ? tipo.toUpperCase() : null,
    cilindraje,
    carroceria: carroceria ? toTitleCase(carroceria) : null,
    clase: clase ? toTitleCase(clase) : null,
    pais: pais ? toTitleCase(pais) : null,
    combustible: combustible ? toTitleCase(combustible) : null,
    pasajeros,
    servicio: servicio ? servicio.toUpperCase() : null,
    tonelaje,
    cuvNumero,
    cuvFecha,
    tipoDocumentoPropietario: tipoDocumentoPropietario ?? null,
    documentoPropietario,
    propietarioEsEmpresa,
    cedulaPropietario,
    nombresPropietario,
    gravamenes: {
      tiene: Boolean(gravamenesDetalle) && !/NO\s+TIENE\s+REGISTRADOS/i.test(gravamenesDetalle),
      detalle: gravamenesDetalle,
    },
    bloqueos: {
      tiene: Boolean(bloqueosDetalle) && !/NO\s+TIENE\s+REGISTRADOS/i.test(bloqueosDetalle),
      detalle: bloqueosDetalle,
    },
    infracciones,
  }
}
