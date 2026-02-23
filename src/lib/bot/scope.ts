/**
 * Bot scope rules: what the bot CAN and CANNOT help with.
 * Used by the n8n AI node as context to decide how to respond.
 */

export interface ScopeRule {
  category: string
  keywords: string[]
  message: string
  suggestion: string
  phone?: string
}

export const OUT_OF_SCOPE_RULES: ScopeRule[] = [
  {
    category: 'penal',
    keywords: ['penal', 'delito', 'cárcel', 'prisión', 'robo', 'estafa', 'asesinato', 'homicidio', 'drogas', 'narcotráfico', 'fiscalía', 'denuncia penal'],
    message: 'No manejamos casos penales. Nos especializamos en trámites notariales y documentos legales.',
    suggestion: 'Te recomendamos contactar al Colegio de Abogados de Pichincha: (02) 252-7742',
    phone: '022527742',
  },
  {
    category: 'laboral',
    keywords: ['laboral', 'despido', 'liquidación', 'visto bueno', 'desahucio laboral', 'acta de finiquito', 'ministerio de trabajo', 'sueldo', 'horas extras'],
    message: 'Los temas laborales requieren un abogado especialista en derecho laboral.',
    suggestion: 'Contacta el Ministerio de Trabajo: 1800-000-468 o acude a la Inspectoría del Trabajo de tu ciudad.',
    phone: '1800000468',
  },
  {
    category: 'familia',
    keywords: ['custodia', 'pensión alimenticia', 'alimentos', 'tenencia', 'visitas', 'patria potestad', 'adopción', 'violencia intrafamiliar'],
    message: 'Algunos temas de derecho de familia requieren un abogado especializado.',
    suggestion: 'Puedes acudir al Consejo de la Judicatura o buscar un abogado de familia. Línea de violencia: 1800-000-111. Nota: SÍ tramitamos divorcios por mutuo consentimiento ante notario.',
    phone: '1800000111',
  },
  {
    category: 'tributario',
    keywords: ['impuestos', 'SRI', 'declaración de impuestos', 'IVA', 'impuesto a la renta', 'RUC', 'RISE', 'retención', 'tributario'],
    message: 'Los temas tributarios los maneja el SRI directamente.',
    suggestion: 'Contacta al SRI: 1700-774-774 o visita sri.gob.ec',
    phone: '1700774774',
  },
  {
    category: 'migracion',
    keywords: ['visa', 'migración', 'deportación', 'residencia', 'permiso de trabajo', 'refugio', 'asilo', 'pasaporte', 'cédula extranjero'],
    message: 'Los temas migratorios requieren un abogado especializado en migración.',
    suggestion: 'Contacta la Cancillería: (02) 299-3200 o el Ministerio de Gobierno para trámites migratorios.',
    phone: '022993200',
  },
  {
    category: 'transito',
    keywords: ['multa de tránsito', 'infracción', 'licencia', 'matriculación', 'ANT', 'accidente de tránsito', 'CITV', 'revisión vehicular'],
    message: 'Las infracciones y trámites de tránsito los maneja la ANT.',
    suggestion: 'Contacta la ANT: (02) 398-4700 o visita ant.gob.ec. Para matriculación, acude a los centros de revisión.',
    phone: '023984700',
  },
]

export const IN_SCOPE_SERVICES = [
  'Escrituras de compraventa de inmuebles',
  'Contratos de compraventa vehicular',
  'Poderes especiales y generales',
  'Poderes telemáticos desde el exterior',
  'Declaraciones juramentadas',
  'Autorizaciones de salida del país para menores',
  'Reconocimiento de firmas',
  'Promesas de compraventa',
  'Posesiones efectivas',
  'Cesión de derechos',
  'Calculadora de gastos notariales, alcabalas, registro y consejo provincial',
  'Presupuestador de compra/venta de inmuebles',
  'Cotizador de contrato vehicular',
  'Divorcio por mutuo consentimiento ante notario',
]

export const BOT_SYSTEM_CONTEXT = `Eres el asistente virtual de Abogados Online Ecuador, una plataforma legal tecnológica en Quito, Ecuador.

SERVICIOS QUE OFRECES:
${IN_SCOPE_SERVICES.map((s) => `- ${s}`).join('\n')}

REGLAS:
1. Solo respondes sobre servicios notariales y trámites legales que ofrece la plataforma.
2. Si te preguntan sobre temas fuera de alcance (penal, laboral, tributario, migración, tránsito), indica amablemente que no manejas esos temas y sugiere dónde acudir. EXCEPCIÓN: SÍ tramitamos divorcios por mutuo consentimiento ante notario.
3. Siempre ofrece calcular costos o agendar una cita cuando sea relevante.
4. Usa lenguaje profesional pero accesible. Tutea al usuario.
5. El SBU vigente es $482 (2026).
6. Nunca inventes datos. Si no sabes algo, sugiere contactar directamente.
7. Siempre cierra con un CTA: calcular costos, agendar cita, o enviar más información.

CONTACTO:
- WhatsApp: +593 979317579
- Email: info@abogadosonlineecuador.com
- Dirección: Azuay E2-231 y Av Amazonas, Quito
- Web: abogadosonlineecuador.com`

export function detectOutOfScope(text: string): ScopeRule | null {
  const lower = text.toLowerCase()
  for (const rule of OUT_OF_SCOPE_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule
    }
  }
  return null
}
