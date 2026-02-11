'use server'

import { PDFParse } from 'pdf-parse'
import { parseCuvText, type CuvData } from '@/lib/parsers/cuv-parser'

type ParseCuvResult =
  | { success: true; data: CuvData }
  | { success: false; error: string }

export async function parseCuvPdf(formData: FormData): Promise<ParseCuvResult> {
  try {
    const file = formData.get('cuv') as File | null

    if (!file) {
      return { success: false, error: 'No se recibió el archivo.' }
    }

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'El archivo debe ser un PDF.' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'El archivo no debe superar 5 MB.' }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const parser = new PDFParse({ data: buffer, verbosity: 0 })
    const result = await parser.getText()
    await parser.destroy()

    if (!result.text || result.text.trim().length === 0) {
      return {
        success: false,
        error:
          'No se pudo extraer texto del PDF. Asegúrese de subir el CUV original (no una foto o escaneo).',
      }
    }

    const cuvData = parseCuvText(result.text)

    // Validate that at least some vehicle data was found
    if (!cuvData.placa && !cuvData.vin) {
      return {
        success: false,
        error:
          'No se encontraron datos del vehículo. Verifique que el archivo sea un Certificado Único Vehicular (CUV) de la ANT.',
      }
    }

    return { success: true, data: cuvData }
  } catch (error) {
    console.error('[parseCuvPdf]', error)
    return {
      success: false,
      error: 'Error al procesar el PDF. Intente nuevamente.',
    }
  }
}
