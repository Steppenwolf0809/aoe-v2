'use server'

import { parseCuvText, type CuvData } from '@/lib/parsers/cuv-parser'

type ParseCuvResult =
  | { success: true; data: CuvData }
  | { success: false; error: string }

export async function parseCuvPdf(formData: FormData): Promise<ParseCuvResult> {
  try {
    const fileEntry = formData.get('cuv')

    if (!fileEntry) {
      return { success: false, error: 'No se recibio el archivo.' }
    }

    if (typeof fileEntry === 'string') {
      return {
        success: false,
        error: 'No se pudo leer el archivo enviado. Intente seleccionar el PDF nuevamente.',
      }
    }

    const file = fileEntry

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'El archivo debe ser un PDF.' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'El archivo no debe superar 5 MB.' }
    }

    if (typeof file.arrayBuffer !== 'function') {
      return {
        success: false,
        error: 'No se pudo leer el PDF enviado. Intente nuevamente.',
      }
    }

    const { PDFParse } = await import('pdf-parse')
    const data = new Uint8Array(await file.arrayBuffer())
    const parser = new PDFParse({ data, verbosity: 0 })

    let result: { text?: string } = {}
    try {
      result = await parser.getText()
    } finally {
      // Do not fail the request if parser cleanup fails after extracting text.
      await parser.destroy().catch((destroyError) => {
        console.warn('[parseCuvPdf] parser.destroy failed', destroyError)
      })
    }

    if (!result.text || result.text.trim().length === 0) {
      return {
        success: false,
        error:
          'No se pudo extraer texto del PDF. Asegurese de subir el CUV original (no una foto o escaneo).',
      }
    }

    const cuvData = parseCuvText(result.text)

    if (!cuvData.placa && !cuvData.vin) {
      return {
        success: false,
        error:
          'No se encontraron datos del vehiculo. Verifique que el archivo sea un Certificado Unico Vehicular (CUV) de la ANT.',
      }
    }

    return { success: true, data: cuvData }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[parseCuvPdf]', message, error)

    if (/password|encrypted|encriptado/i.test(message)) {
      return {
        success: false,
        error: 'El PDF esta protegido o encriptado y no se puede procesar.',
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return {
        success: false,
        error: `Error al procesar el PDF: ${message}`,
      }
    }

    return {
      success: false,
      error: 'Error al procesar el PDF. Intente nuevamente.',
    }
  }
}
