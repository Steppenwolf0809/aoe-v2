'use client'

import { useState, useRef, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  ShieldAlert,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseCuvPdf } from '@/actions/parse-cuv'
import type { ContratoVehicular } from '@/lib/validations/contract'
import type { CuvData } from '@/lib/parsers/cuv-parser'

type UploadStatus = 'idle' | 'dragging' | 'uploading' | 'success' | 'error'

interface CuvUploadProps {
  onCuvParsed?: (data: CuvData) => void
}

export function CuvUpload({ onCuvParsed }: CuvUploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<CuvData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  const { setValue } = useFormContext<ContratoVehicular>()

  // Count how many fields were auto-filled
  function countFilledFields(data: CuvData): number {
    let count = 0
    if (data.placa) count++
    if (data.vin) count++
    if (data.marca) count++
    if (data.modelo) count++
    if (data.anio) count++
    if (data.color) count++
    if (data.motor) count++
    if (data.cedulaPropietario) count++
    if (data.nombresPropietario) count++
    return count
  }

  function autoFillForm(data: CuvData) {
    if (data.placa) setValue('vehiculo.placa', data.placa, { shouldValidate: true })
    if (data.marca) setValue('vehiculo.marca', data.marca, { shouldValidate: true })
    if (data.modelo) setValue('vehiculo.modelo', data.modelo, { shouldValidate: true })
    if (data.anio) setValue('vehiculo.anio', data.anio, { shouldValidate: true })
    if (data.color) setValue('vehiculo.color', data.color, { shouldValidate: true })
    if (data.motor) setValue('vehiculo.motor', data.motor, { shouldValidate: true })
    if (data.vin) setValue('vehiculo.chasis', data.vin, { shouldValidate: true })
    // Owner → Seller
    if (data.cedulaPropietario)
      setValue('vendedor.cedula', data.cedulaPropietario, { shouldValidate: true })
    if (data.nombresPropietario)
      setValue('vendedor.nombres', data.nombresPropietario, { shouldValidate: true })
  }

  const processFile = useCallback(
    async (file: File) => {
      setStatus('uploading')
      setError(null)
      setFileName(file.name)

      const formData = new FormData()
      formData.append('cuv', file)
      try {
        const result = await parseCuvPdf(formData)

        if (result.success) {
          setParsedData(result.data)
          autoFillForm(result.data)
          onCuvParsed?.(result.data)
          setStatus('success')
        } else {
          setError(result.error)
          setStatus('error')
        }
      } catch (uploadError) {
        console.error('[CuvUpload] parseCuvPdf failed', uploadError)
        setError('No se pudo procesar el archivo. Intente nuevamente.')
        setStatus('error')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue, onCuvParsed],
  )

  function handleReset() {
    setStatus('idle')
    setError(null)
    setFileName(null)
    setParsedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.items?.length) {
      setStatus('dragging')
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setStatus('idle')
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current = 0
      const files = e.dataTransfer.files
      if (files?.length) {
        processFile(files[0])
      }
    },
    [processFile],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files?.length) {
        processFile(files[0])
      }
    },
    [processFile],
  )

  const handleClick = useCallback(() => {
    if (status === 'idle' || status === 'error') {
      fileInputRef.current?.click()
    }
  }, [status])

  const hasWarnings =
    parsedData &&
    (parsedData.gravamenes.tiene ||
      parsedData.bloqueos.tiene ||
      parsedData.infracciones.tiene)

  return (
    <div className="space-y-3">
      <motion.div
        className={cn(
          'relative rounded-xl border-2 border-dashed p-5 text-center transition-colors cursor-pointer',
          status === 'idle' &&
          'border-[var(--glass-border)] hover:border-accent-primary/40 hover:bg-accent-primary/5',
          status === 'dragging' && 'border-accent-primary bg-accent-primary/10',
          status === 'uploading' && 'border-accent-primary/30 bg-accent-primary/5 cursor-wait',
          status === 'success' && 'border-accent-success/30 bg-accent-success/5 cursor-default',
          status === 'error' && 'border-accent-error/30 bg-accent-error/5',
        )}
        whileHover={status === 'idle' ? { scale: 1.005 } : undefined}
        whileTap={status === 'idle' ? { scale: 0.995 } : undefined}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {/* IDLE */}
            {status === 'idle' && (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Sube el Certificado Unico Vehicular (CUV)
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Arrastra el PDF aqui o haz clic para seleccionar
                  </p>
                </div>
              </div>
            )}

            {/* DRAGGING */}
            {status === 'dragging' && (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-accent-primary animate-bounce" />
                <p className="text-sm font-medium text-accent-primary">
                  Suelta el archivo aqui
                </p>
              </div>
            )}

            {/* UPLOADING */}
            {status === 'uploading' && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
                <p className="text-sm font-medium text-text-primary">
                  Procesando CUV...
                </p>
                {fileName && (
                  <p className="text-xs text-text-muted">{fileName}</p>
                )}
              </div>
            )}

            {/* SUCCESS */}
            {status === 'success' && parsedData && (
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-6 h-6 text-accent-success shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {countFilledFields(parsedData)} datos extraidos del CUV
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="w-3.5 h-3.5 text-text-muted" />
                    <p className="text-xs text-text-muted truncate">
                      {fileName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReset()
                  }}
                  className="p-1 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text-primary transition-colors"
                  title="Subir otro archivo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ERROR */}
            {status === 'error' && (
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="w-6 h-6 text-accent-error shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-accent-error">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReset()
                    }}
                    className="text-xs text-accent-primary hover:underline mt-1"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ANT Link — always visible */}
      <p className="text-xs text-text-muted text-center mt-3">
        ¿No tienes tu CUV?{' '}
        <a
          href="https://consultaweb.ant.gob.ec/SVT/paginas/portal/svf_solicitar_servicio.jsp?ps_param_tip_serv=CER"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-primary hover:underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          Descárgalo en la ANT →
        </a>
      </p>

      {/* CUV Warnings */}
      <AnimatePresence>
        {status === 'success' && hasWarnings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-accent-warning">
              <ShieldAlert className="w-4 h-4" />
              <span>Alertas del CUV</span>
            </div>

            {parsedData!.gravamenes.tiene && (
              <WarningCard
                type="error"
                title="Gravamenes vigentes"
                detail={parsedData!.gravamenes.detalle}
              />
            )}

            {parsedData!.bloqueos.tiene && (
              <WarningCard
                type="error"
                title="Bloqueos vigentes"
                detail={parsedData!.bloqueos.detalle}
              />
            )}

            {parsedData!.infracciones.tiene && (
              <WarningCard
                type="warning"
                title={`${parsedData!.infracciones.cantidad} infracciones pendientes`}
                detail={`Total adeudado: $${parsedData!.infracciones.total.toFixed(2)}`}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function WarningCard({
  type,
  title,
  detail,
}: {
  type: 'warning' | 'error'
  title: string
  detail: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl px-3 py-2.5 border text-sm',
        type === 'error'
          ? 'border-accent-error/30 bg-accent-error/5'
          : 'border-accent-warning/30 bg-accent-warning/5',
      )}
    >
      <p
        className={cn(
          'font-medium',
          type === 'error' ? 'text-accent-error' : 'text-accent-warning',
        )}
      >
        {title}
      </p>
      {detail && (
        <p className="text-text-secondary text-xs mt-0.5">{detail}</p>
      )}
    </div>
  )
}
