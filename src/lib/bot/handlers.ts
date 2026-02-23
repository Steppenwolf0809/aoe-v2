/**
 * Bot query handlers — maps query types to formula functions and data sources.
 */

import { calcularPresupuestoInmobiliario } from '@/lib/formulas/inmobiliario'
import type { InputInmobiliario } from '@/lib/formulas/inmobiliario'
import { calcularCotizacionVehicular } from '@/lib/formulas/vehicular'
import { calcularTramiteNotarial } from '@/lib/formulas/notarial'
import type { TipoTramite } from '@/lib/formulas/notarial'
import { calcularAlcabala } from '@/lib/formulas/municipal'
import { calcularArancelRegistro } from '@/lib/formulas/registro'
import { calcularAlcabalaYConsejoProvincial } from '@/lib/formulas/consejo-provincial'
import { getPublishedPosts } from '@/actions/blog'
import { SITE_NAME, SITE_URL, SOCIAL_LINKS, DOCUMENT_TYPES } from '@/lib/constants'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  BOT_SYSTEM_CONTEXT,
  IN_SCOPE_SERVICES,
  OUT_OF_SCOPE_RULES,
  detectOutOfScope,
} from './scope'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QueryType =
  | 'calculate.inmobiliario'
  | 'calculate.vehicular'
  | 'calculate.notarial'
  | 'calculate.alcabala'
  | 'calculate.registro'
  | 'calculate.consejo_provincial'
  | 'search.blog'
  | 'get.services'
  | 'get.contact'
  | 'get.requirements'
  | 'get.scope'
  | 'check.contract'
  | 'check.scope'

export interface BotQueryRequest {
  type: QueryType
  data?: Record<string, unknown>
}

export interface BotQueryResponse {
  success: boolean
  type: string
  result: unknown
  error?: string
}

// ---------------------------------------------------------------------------
// Handler map
// ---------------------------------------------------------------------------

type Handler = (data: Record<string, unknown>) => Promise<BotQueryResponse>

const handlers: Record<QueryType, Handler> = {
  'calculate.inmobiliario': handleCalculateInmobiliario,
  'calculate.vehicular': handleCalculateVehicular,
  'calculate.notarial': handleCalculateNotarial,
  'calculate.alcabala': handleCalculateAlcabala,
  'calculate.registro': handleCalculateRegistro,
  'calculate.consejo_provincial': handleCalculateConsejoProvincial,
  'search.blog': handleSearchBlog,
  'get.services': handleGetServices,
  'get.contact': handleGetContact,
  'get.requirements': handleGetRequirements,
  'get.scope': handleGetScope,
  'check.contract': handleCheckContract,
  'check.scope': handleCheckScope,
}

export async function handleBotQuery(request: BotQueryRequest): Promise<BotQueryResponse> {
  const handler = handlers[request.type]
  if (!handler) {
    return {
      success: false,
      type: request.type,
      result: null,
      error: `Tipo de consulta no soportado: ${request.type}`,
    }
  }

  return handler(request.data ?? {})
}

// ---------------------------------------------------------------------------
// Calculadoras
// ---------------------------------------------------------------------------

async function handleCalculateInmobiliario(data: Record<string, unknown>): Promise<BotQueryResponse> {
  try {
    const valorTransferencia = Number(data.valorTransferencia ?? data.valor ?? data.valorInmueble ?? 0)
    const avaluoCatastral = Number(data.avaluoCatastral ?? data.avaluo ?? valorTransferencia)

    if (valorTransferencia <= 0) {
      return { success: false, type: 'calculate.inmobiliario', result: null, error: 'valor/valorTransferencia es requerido y debe ser > 0' }
    }

    const today = new Date().toISOString().split('T')[0]

    const input: InputInmobiliario = {
      valorTransferencia,
      avaluoCatastral,
      valorAdquisicion: Number(data.valorAdquisicion ?? valorTransferencia * 0.8),
      fechaAdquisicion: String(data.fechaAdquisicion ?? '2020-01-01'),
      fechaTransferencia: String(data.fechaTransferencia ?? today),
      tipoTransferencia: (data.tipoTransferencia as InputInmobiliario['tipoTransferencia']) ?? 'Compraventa',
      tipoTransferente: (data.tipoTransferente as InputInmobiliario['tipoTransferente']) ?? 'Natural',
      mejoras: data.mejoras ? Number(data.mejoras) : undefined,
      contribucionMejoras: data.contribucionMejoras ? Number(data.contribucionMejoras) : undefined,
      esViviendaSocial: Boolean(data.esViviendaSocial ?? false),
      esTerceraEdad: Boolean(data.esTerceraEdad ?? false),
      esDiscapacitado: Boolean(data.esDiscapacitado ?? false),
    }

    const resultado = calcularPresupuestoInmobiliario(input)
    return { success: true, type: 'calculate.inmobiliario', result: resultado }
  } catch (error) {
    return { success: false, type: 'calculate.inmobiliario', result: null, error: (error as Error).message }
  }
}

async function handleCalculateVehicular(data: Record<string, unknown>): Promise<BotQueryResponse> {
  try {
    const resultado = calcularCotizacionVehicular({
      valorVehiculo: Number(data.valorVehiculo ?? data.valor ?? 0),
      numFirmas: Number(data.numFirmas ?? data.firmas ?? 2),
    })
    return { success: true, type: 'calculate.vehicular', result: resultado }
  } catch (error) {
    return { success: false, type: 'calculate.vehicular', result: null, error: (error as Error).message }
  }
}

async function handleCalculateNotarial(data: Record<string, unknown>): Promise<BotQueryResponse> {
  try {
    const tipoTramite = String(data.tipoTramite ?? data.tipo ?? 'transferencia_dominio') as TipoTramite
    const valor = Number(data.valor ?? data.monto ?? 0)
    const opciones = (data.opciones as Record<string, unknown>) ?? {}

    const resultado = calcularTramiteNotarial(tipoTramite, valor, opciones)
    return { success: true, type: 'calculate.notarial', result: resultado }
  } catch (error) {
    return { success: false, type: 'calculate.notarial', result: null, error: (error as Error).message }
  }
}

async function handleCalculateAlcabala(data: Record<string, unknown>): Promise<BotQueryResponse> {
  try {
    const valorTransferencia = Number(data.valorTransferencia ?? data.valor ?? 0)
    const today = new Date().toISOString().split('T')[0]
    const resultado = calcularAlcabala({
      valorTransferencia,
      avaluoCatastral: Number(data.avaluoCatastral ?? data.avaluo ?? valorTransferencia),
      valorAdquisicion: Number(data.valorAdquisicion ?? valorTransferencia * 0.8),
      fechaAdquisicion: String(data.fechaAdquisicion ?? '2020-01-01'),
      fechaTransferencia: String(data.fechaTransferencia ?? today),
      tipoTransferencia: (data.tipoTransferencia as 'Compraventa' | 'Donación' | 'Dación en pago') ?? 'Compraventa',
      tipoTransferente: (data.tipoTransferente as 'Natural' | 'Inmobiliaria') ?? 'Natural',
    })
    return { success: true, type: 'calculate.alcabala', result: resultado }
  } catch (error) {
    return { success: false, type: 'calculate.alcabala', result: null, error: (error as Error).message }
  }
}

async function handleCalculateRegistro(data: Record<string, unknown>): Promise<BotQueryResponse> {
  try {
    const resultado = calcularArancelRegistro(
      Number(data.valor ?? data.valorTransferencia ?? 0),
      Boolean(data.terceraEdad ?? false),
      Boolean(data.discapacidad ?? false),
    )
    return { success: true, type: 'calculate.registro', result: resultado }
  } catch (error) {
    return { success: false, type: 'calculate.registro', result: null, error: (error as Error).message }
  }
}

async function handleCalculateConsejoProvincial(data: Record<string, unknown>): Promise<BotQueryResponse> {
  try {
    const resultado = calcularAlcabalaYConsejoProvincial(
      Number(data.valor ?? data.valorTransferencia ?? 0),
      data.avaluoCatastral ? Number(data.avaluoCatastral) : undefined,
      data.meses ? Number(data.meses) : undefined,
    )
    return { success: true, type: 'calculate.consejo_provincial', result: resultado }
  } catch (error) {
    return { success: false, type: 'calculate.consejo_provincial', result: null, error: (error as Error).message }
  }
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

async function handleSearchBlog(data: Record<string, unknown>): Promise<BotQueryResponse> {
  try {
    const category = data.category ? String(data.category) : null
    const page = Number(data.page ?? 1)
    const result = await getPublishedPosts(page, category)

    const posts = result.posts.map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      url: `${SITE_URL}/blog/${p.slug}`,
      category: p.category,
    }))

    return {
      success: true,
      type: 'search.blog',
      result: {
        posts,
        categories: result.categories,
        total: result.pagination.total,
      },
    }
  } catch (error) {
    return { success: false, type: 'search.blog', result: null, error: (error as Error).message }
  }
}

// ---------------------------------------------------------------------------
// Info estática
// ---------------------------------------------------------------------------

async function handleGetServices(): Promise<BotQueryResponse> {
  return {
    success: true,
    type: 'get.services',
    result: {
      servicios: IN_SCOPE_SERVICES,
      documentTypes: DOCUMENT_TYPES,
      calculadoras: [
        { nombre: 'Presupuestador Inmobiliario', url: `${SITE_URL}/calculadoras/inmuebles`, gratis: true },
        { nombre: 'Cotizador Vehicular', url: `${SITE_URL}/calculadoras/vehiculos`, gratis: true },
        { nombre: 'Calculadora Notarial', url: `${SITE_URL}/calculadoras/notarial`, gratis: true },
        { nombre: 'Calculadora de Alcabalas', url: `${SITE_URL}/calculadoras/alcabalas`, gratis: true },
        { nombre: 'Calculadora Registro de la Propiedad', url: `${SITE_URL}/calculadoras/registro-propiedad`, gratis: true },
        { nombre: 'Calculadora Consejo Provincial', url: `${SITE_URL}/calculadoras/consejo-provincial`, gratis: true },
      ],
    },
  }
}

async function handleGetContact(): Promise<BotQueryResponse> {
  return {
    success: true,
    type: 'get.contact',
    result: {
      nombre: SITE_NAME,
      whatsapp: '+593 979317579',
      whatsappUrl: SOCIAL_LINKS.whatsapp,
      email: 'info@abogadosonlineecuador.com',
      direccion: 'Azuay E2-231 y Av Amazonas, Quito, Ecuador',
      web: SITE_URL,
      facebook: SOCIAL_LINKS.facebook,
      instagram: SOCIAL_LINKS.instagram,
    },
  }
}

async function handleGetRequirements(data: Record<string, unknown>): Promise<BotQueryResponse> {
  const tipo = String(data.tipo ?? data.type ?? 'escritura').toLowerCase()

  const requirements: Record<string, { titulo: string; requisitos: string[] }> = {
    escritura: {
      titulo: 'Requisitos para escriturar un inmueble',
      requisitos: [
        'Cédulas de comprador y vendedor (originales)',
        'Certificado de gravámenes actualizado (Registro de la Propiedad)',
        'Pago de impuesto de alcabala (Municipio)',
        'Pago de impuesto al Consejo Provincial',
        'Certificado de no adeudar al Municipio',
        'Escritura anterior del inmueble',
        'Avalúo catastral actualizado',
        'Comprobante de pago de plusvalía (si aplica, vendedor)',
      ],
    },
    vehicular: {
      titulo: 'Requisitos para contrato de compraventa vehicular',
      requisitos: [
        'Cédulas de comprador y vendedor (originales)',
        'Matrícula del vehículo vigente',
        'CUV - Certificado Único Vehicular (ANT)',
        'SOAT vigente',
        'Revisión vehicular al día',
        'No tener infracciones pendientes',
      ],
    },
    poder: {
      titulo: 'Requisitos para otorgar un poder',
      requisitos: [
        'Cédula del poderdante (quien otorga)',
        'Datos completos del apoderado (quien recibe)',
        'Descripción de facultades específicas',
        'Si es desde el exterior: apostilla + traducción (si aplica)',
        'Poder especial: datos del bien/trámite específico',
      ],
    },
    salida_menor: {
      titulo: 'Requisitos para autorización de salida del país',
      requisitos: [
        'Cédulas de ambos padres',
        'Partida de nacimiento del menor',
        'Datos del acompañante (si no viaja solo)',
        'Itinerario de viaje (fechas, destino)',
        'Si un padre no autoriza: orden judicial',
      ],
    },
  }

  const req = requirements[tipo] ?? requirements.escritura

  return {
    success: true,
    type: 'get.requirements',
    result: req,
  }
}

// ---------------------------------------------------------------------------
// Scope (sistema de derivación)
// ---------------------------------------------------------------------------

async function handleGetScope(): Promise<BotQueryResponse> {
  return {
    success: true,
    type: 'get.scope',
    result: {
      systemContext: BOT_SYSTEM_CONTEXT,
      inScopeServices: IN_SCOPE_SERVICES,
      outOfScopeRules: OUT_OF_SCOPE_RULES,
    },
  }
}

async function handleCheckScope(data: Record<string, unknown>): Promise<BotQueryResponse> {
  const text = String(data.text ?? data.message ?? '')
  const outOfScope = detectOutOfScope(text)

  if (outOfScope) {
    return {
      success: true,
      type: 'check.scope',
      result: {
        inScope: false,
        category: outOfScope.category,
        message: outOfScope.message,
        suggestion: outOfScope.suggestion,
        phone: outOfScope.phone,
        cta: '¿Hay algo más en lo que te pueda ayudar? Manejamos escrituras, poderes, contratos vehiculares y más.',
      },
    }
  }

  return {
    success: true,
    type: 'check.scope',
    result: { inScope: true },
  }
}

// ---------------------------------------------------------------------------
// Contratos
// ---------------------------------------------------------------------------

async function handleCheckContract(data: Record<string, unknown>): Promise<BotQueryResponse> {
  try {
    const email = data.email ? String(data.email) : null
    const contractId = data.contractId ? String(data.contractId) : null

    if (!email && !contractId) {
      return { success: false, type: 'check.contract', result: null, error: 'Se requiere email o contractId' }
    }

    const supabase = createAdminClient()

    let query = supabase
      .from('contracts')
      .select('id, status, contract_type, created_at, download_token')
      .order('created_at', { ascending: false })
      .limit(5)

    if (contractId) {
      query = query.eq('id', contractId)
    } else if (email) {
      query = query.eq('delivery_email', email)
    }

    const { data: contracts, error } = await query

    if (error) {
      return { success: false, type: 'check.contract', result: null, error: error.message }
    }

    const formatted = (contracts ?? []).map((c) => ({
      id: c.id.substring(0, 8),
      status: c.status,
      type: c.contract_type,
      createdAt: c.created_at,
      downloadUrl: c.download_token
        ? `${SITE_URL}/contratos/pago/exito?token=${c.download_token}`
        : null,
      statusText: ({
        DRAFT: 'Borrador (pendiente de pago)',
        PENDING_PAYMENT: 'Esperando confirmación de pago',
        PAID: 'Pagado, generando documento...',
        GENERATED: 'Listo para descargar',
        DOWNLOADED: 'Ya descargado',
      } as Record<string, string>)[c.status as string] ?? c.status,
    }))

    return {
      success: true,
      type: 'check.contract',
      result: { contracts: formatted, total: formatted.length },
    }
  } catch (error) {
    return { success: false, type: 'check.contract', result: null, error: (error as Error).message }
  }
}
