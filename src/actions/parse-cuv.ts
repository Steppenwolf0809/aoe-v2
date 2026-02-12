'use server'

import { parseCuvText, type CuvData } from '@/lib/parsers/cuv-parser'

type ParseCuvResult =
  | { success: true; data: CuvData }
  | { success: false; error: string }

type MatrixLike = Pick<DOMMatrix, 'a' | 'b' | 'c' | 'd' | 'e' | 'f'>

function ensurePdfJsPolyfills(): void {
  // Vercel serverless may not provide @napi-rs/canvas, so pdfjs cannot
  // polyfill DOM APIs on its own. We only need minimal matrix/path/image
  // implementations for text extraction.
  if (typeof globalThis.DOMMatrix === 'undefined') {
    class MinimalDOMMatrix implements MatrixLike {
      a = 1
      b = 0
      c = 0
      d = 1
      e = 0
      f = 0

      constructor(init?: ArrayLike<number>) {
        if (!init) {
          return
        }

        const values = Array.from(init)
        if (values.length >= 6) {
          if (values.length >= 16) {
            this.a = values[0] ?? 1
            this.b = values[1] ?? 0
            this.c = values[4] ?? 0
            this.d = values[5] ?? 1
            this.e = values[12] ?? 0
            this.f = values[13] ?? 0
            return
          }
          this.a = values[0] ?? 1
          this.b = values[1] ?? 0
          this.c = values[2] ?? 0
          this.d = values[3] ?? 1
          this.e = values[4] ?? 0
          this.f = values[5] ?? 0
        }
      }

      private setFrom(other: MatrixLike): this {
        this.a = other.a
        this.b = other.b
        this.c = other.c
        this.d = other.d
        this.e = other.e
        this.f = other.f
        return this
      }

      private multiply(left: MatrixLike, right: MatrixLike): MatrixLike {
        return {
          a: left.a * right.a + left.c * right.b,
          b: left.b * right.a + left.d * right.b,
          c: left.a * right.c + left.c * right.d,
          d: left.b * right.c + left.d * right.d,
          e: left.a * right.e + left.c * right.f + left.e,
          f: left.b * right.e + left.d * right.f + left.f,
        }
      }

      multiplySelf(other: MatrixLike): this {
        return this.setFrom(this.multiply(this, other))
      }

      preMultiplySelf(other: MatrixLike): this {
        return this.setFrom(this.multiply(other, this))
      }

      invertSelf(): this {
        const det = this.a * this.d - this.b * this.c
        if (det === 0) {
          return this
        }

        const inverse = {
          a: this.d / det,
          b: -this.b / det,
          c: -this.c / det,
          d: this.a / det,
          e: (this.c * this.f - this.d * this.e) / det,
          f: (this.b * this.e - this.a * this.f) / det,
        }

        return this.setFrom(inverse)
      }

      translate(tx = 0, ty = 0): this {
        return this.multiplySelf({ a: 1, b: 0, c: 0, d: 1, e: tx, f: ty })
      }

      scale(scaleX = 1, scaleY = scaleX): this {
        return this.multiplySelf({ a: scaleX, b: 0, c: 0, d: scaleY, e: 0, f: 0 })
      }
    }

    globalThis.DOMMatrix = MinimalDOMMatrix as unknown as typeof DOMMatrix
  }

  if (typeof globalThis.Path2D === 'undefined') {
    class MinimalPath2D {
      addPath(): void {}
      moveTo(): void {}
      lineTo(): void {}
      rect(): void {}
      closePath(): void {}
    }

    globalThis.Path2D = MinimalPath2D as unknown as typeof Path2D
  }

  if (typeof globalThis.ImageData === 'undefined') {
    class MinimalImageData {
      data: Uint8ClampedArray
      width: number
      height: number

      constructor(
        dataOrWidth: Uint8ClampedArray | number,
        widthOrHeight?: number,
        maybeHeight?: number
      ) {
        if (typeof dataOrWidth === 'number') {
          this.width = dataOrWidth
          this.height = widthOrHeight ?? 0
          this.data = new Uint8ClampedArray(this.width * this.height * 4)
          return
        }

        this.data = dataOrWidth
        this.width = widthOrHeight ?? 0
        this.height = maybeHeight ?? 0
      }
    }

    globalThis.ImageData = MinimalImageData as unknown as typeof ImageData
  }
}

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

    ensurePdfJsPolyfills()
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
