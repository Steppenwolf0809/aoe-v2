'use client'

import { useState } from 'react'
import { Calculator, Info, Plus, Trash2, FileText, PenTool, Stamp, Copy, FileSignature } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  calcularTramiteNotarial,
  getActosCuantiaIndeterminada,
  getTramitesPorCategoria,
  SBU_2026,
  TARIFAS_ITEMS_ADICIONALES,
} from '@/lib/formulas/notarial'
import { TipoServicioNotarial, ItemAdicional } from '@/lib/formulas/types'
import { AnimatedCounter } from './animated-counter'
import { CalculatorLeadCTA } from './calculator-lead-cta'

const ICONOS_ITEMS: Record<string, React.ReactNode> = {
  copia_certificada: <Copy className="w-4 h-4" />,
  declaracion_juramentada: <FileText className="w-4 h-4" />,
  declaracion_juramentada_pj: <FileText className="w-4 h-4" />,
  poder: <PenTool className="w-4 h-4" />,
  cancelacion_hipoteca: <Trash2 className="w-4 h-4" />,
  reconocimiento_firma: <Stamp className="w-4 h-4" />,
  autenticacion_firma: <Stamp className="w-4 h-4" />,
  materializacion: <FileSignature className="w-4 h-4" />,
  protocolizacion: <FileText className="w-4 h-4" />,
  marginacion: <FileText className="w-4 h-4" />,
}

export function NotarialCalculatorWidget() {
  const actosIndeterminados = getActosCuantiaIndeterminada()

  const [tipoServicio, setTipoServicio] = useState<TipoServicioNotarial>('TRANSFERENCIA_DOMINIO')
  const [cuantia, setCuantia] = useState(50000)
  const [tiempoMeses, setTiempoMeses] = useState(12)
  const [cantidadMenores, setCantidadMenores] = useState(1)
  const [actoIndeterminadoId, setActoIndeterminadoId] = useState(actosIndeterminados[0]?.id ?? '')
  const [cantidadActoIndeterminado, setCantidadActoIndeterminado] = useState(1)
  const [esViviendaSocial, setEsViviendaSocial] = useState(false)
  const [esTerceraEdad, setEsTerceraEdad] = useState(false)
  const [numeroOtorgantes, setNumeroOtorgantes] = useState(1)
  const [numeroFirmas, setNumeroFirmas] = useState(1)

  // Items adicionales
  const [itemsAdicionales, setItemsAdicionales] = useState<ItemAdicional[]>([])
  const [mostrarAgregarItem, setMostrarAgregarItem] = useState(false)
  const [nuevoItemTipo, setNuevoItemTipo] = useState<ItemAdicional['tipo']>('copia_certificada')
  const [nuevoItemCantidad, setNuevoItemCantidad] = useState(1)

  const [resultado, setResultado] = useState<ReturnType<typeof calcularTramiteNotarial> | null>(null)

  const tramites = getTramitesPorCategoria()

  const handleCalcular = () => {
    const opciones: {
      cantidadMenores?: number
      esViviendaSocial?: boolean
      esTerceraEdad?: boolean
      tiempoMeses?: number
      itemsAdicionales?: ItemAdicional[]
      actoIndeterminadoId?: string
      cantidadActoIndeterminado?: number
      numeroOtorgantes?: number
    } = {
      itemsAdicionales,
    }

    if (tipoServicio === 'SALIDA_PAIS') {
      opciones.cantidadMenores = cantidadMenores
    }

    if (tipoServicio === 'PODER_GENERAL_PN' || tipoServicio === 'DECLARACION_JURAMENTADA' || tipoServicio === 'DECLARACION_JURAMENTADA_PJ') {
      opciones.numeroOtorgantes = numeroOtorgantes
    }

    if (tipoServicio === 'RECONOCIMIENTO_FIRMA') {
      opciones.numeroFirmas = numeroFirmas
    }

    if (tipoServicio === 'TRANSFERENCIA_DOMINIO') {
      opciones.esViviendaSocial = esViviendaSocial
    }

    if (
      [
        'TESTAMENTO_ABIERTO',
        'TESTAMENTO_CERRADO',
        'POSESION_EFECTIVA',
        'DECLARACION_JURAMENTADA',
        'CANCELACION_HIPOTECA',
      ].includes(tipoServicio)
    ) {
      opciones.esTerceraEdad = esTerceraEdad
    }

    if (
      tipoServicio === 'CONTRATO_ARRIENDO_ESCRITURA' ||
      tipoServicio === 'INSCRIPCION_ARRENDAMIENTO'
    ) {
      opciones.tiempoMeses = tiempoMeses
    }

    if (tipoServicio === 'ACTO_CUANTIA_INDETERMINADA') {
      opciones.actoIndeterminadoId = actoIndeterminadoId
      opciones.cantidadActoIndeterminado = cantidadActoIndeterminado
    }

    const res = calcularTramiteNotarial(tipoServicio, cuantia, opciones)
    setResultado(res)
  }

  // Función para calcular subtotal en tiempo real
  const calcularSubtotalItem = (tipo: ItemAdicional['tipo'], cantidad: number): number => {
    const tiposConAdicional: ItemAdicional['tipo'][] = ['poder', 'declaracion_juramentada', 'declaracion_juramentada_pj']
    if (tiposConAdicional.includes(tipo)) {
      const tarifa = TARIFAS_ITEMS_ADICIONALES[tipo]
      const primerOtorgante = tarifa.valorUnitario
      if (cantidad === 1) return primerOtorgante
      const adicionales = (cantidad - 1) * (SBU_2026 * 0.03)
      return primerOtorgante + adicionales
    } else if (tipo === 'copia_certificada') {
      return 1.79 * cantidad
    } else if (tipo === 'reconocimiento_firma') {
      return (SBU_2026 * 0.03) * cantidad
    } else if (tipo === 'autenticacion_firma') {
      return (SBU_2026 * 0.04) * cantidad
    } else {
      return TARIFAS_ITEMS_ADICIONALES[tipo].valorUnitario * cantidad
    }
  }

  const handleAgregarItem = () => {
    const tarifa = TARIFAS_ITEMS_ADICIONALES[nuevoItemTipo]

    // Calcular subtotal según el tipo
    let subtotal = 0
    let descripcion = tarifa.nombre

    const tiposConAdicional: ItemAdicional['tipo'][] = ['poder', 'declaracion_juramentada', 'declaracion_juramentada_pj']
    if (tiposConAdicional.includes(nuevoItemTipo)) {
      const tarifaItem = TARIFAS_ITEMS_ADICIONALES[nuevoItemTipo]
      const primerOtorgante = tarifaItem.valorUnitario
      if (nuevoItemCantidad === 1) {
        subtotal = primerOtorgante
        descripcion = `${tarifaItem.nombre} (1 otorgante)`
      } else {
        const adicionales = (nuevoItemCantidad - 1) * (SBU_2026 * 0.03)
        subtotal = primerOtorgante + adicionales
        descripcion = `${tarifaItem.nombre} (${nuevoItemCantidad} otorgantes)`
      }
    } else if (nuevoItemTipo === 'copia_certificada') {
      subtotal = 1.79 * nuevoItemCantidad
      descripcion = `Copia Certificada (${nuevoItemCantidad} fojas)`
    } else if (nuevoItemTipo === 'reconocimiento_firma') {
      subtotal = (SBU_2026 * 0.03) * nuevoItemCantidad
      descripcion = `Reconocimiento de Firma (${nuevoItemCantidad} firmas)`
    } else if (nuevoItemTipo === 'autenticacion_firma') {
      subtotal = (SBU_2026 * 0.04) * nuevoItemCantidad
      descripcion = `Autenticación de Firma (${nuevoItemCantidad} firmas)`
    } else {
      subtotal = tarifa.valorUnitario * nuevoItemCantidad
      descripcion = `${tarifa.nombre} (${nuevoItemCantidad} ${tarifa.unidad})`
    }

    const item: ItemAdicional = {
      id: `${nuevoItemTipo}-${Date.now()}`,
      tipo: nuevoItemTipo,
      descripcion,
      cantidad: nuevoItemCantidad,
      valorUnitario: nuevoItemTipo === 'copia_certificada' ? 1.79 : tarifa.valorUnitario,
      subtotal: Math.round(subtotal * 100) / 100,
    }

    setItemsAdicionales([...itemsAdicionales, item])
    setMostrarAgregarItem(false)
    setNuevoItemCantidad(1)
  }

  const handleEliminarItem = (id: string) => {
    setItemsAdicionales(itemsAdicionales.filter((item) => item.id !== id))
  }

  const requiereCuantia = ![
    'PODER_GENERAL_PN',
    'PODER_GENERAL_PJ',
    'ACTO_CUANTIA_INDETERMINADA',
    'CAPITULACIONES_MATRIMONIALES',
    'TESTAMENTO_ABIERTO',
    'TESTAMENTO_CERRADO',
    'UNION_HECHO',
    'DIVORCIO',
    'TERMINACION_UNION_HECHO',
    'POSESION_EFECTIVA',
    'CANCELACION_HIPOTECA',
    'RECONOCIMIENTO_FIRMA',
    'DECLARACION_JURAMENTADA',
    'DECLARACION_JURAMENTADA_PJ',
    'SALIDA_PAIS',
  ].includes(tipoServicio)

  const esSalidaPais = tipoServicio === 'SALIDA_PAIS'
  const esArrendamiento =
    tipoServicio === 'CONTRATO_ARRIENDO_ESCRITURA' ||
    tipoServicio === 'INSCRIPCION_ARRENDAMIENTO'
  const esCuantiaIndeterminada = tipoServicio === 'ACTO_CUANTIA_INDETERMINADA'
  const esTransferencia = tipoServicio === 'TRANSFERENCIA_DOMINIO'
  const esPoderGeneral = tipoServicio === 'PODER_GENERAL_PN'
  const esReconocimientoFirma = tipoServicio === 'RECONOCIMIENTO_FIRMA'
  const esDeclaracionJuramentada = tipoServicio === 'DECLARACION_JURAMENTADA' || tipoServicio === 'DECLARACION_JURAMENTADA_PJ'

  // UX: Canon mensual suele ser un monto pequeno; el slider general (step=1000) termina "saltando" a 0.
  const cuantiaInputStep = esArrendamiento ? 1 : 100
  const cuantiaSliderMax = esArrendamiento ? 10000 : 500000
  const cuantiaSliderStep = esArrendamiento ? 1 : 1000

  return (
    <div className="space-y-6">
      {/* Selector de Tipo de Servicio */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">Tipo de Servicio Principal</label>
        <select
          value={tipoServicio}
          onChange={(e) => {
            const nuevoTipo = e.target.value as TipoServicioNotarial
            setTipoServicio(nuevoTipo)
            if (nuevoTipo === 'ACTO_CUANTIA_INDETERMINADA' && !actoIndeterminadoId) {
              setActoIndeterminadoId(actosIndeterminados[0]?.id ?? '')
            }
            setResultado(null)
          }}
          className="w-full px-4 py-3 bg-white border border-[var(--glass-border)] rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
        >
          <optgroup label="Servicios con Cuantía">
            {tramites.conCuantia.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Arrendamientos">
            {tramites.arrendamientos.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Servicios con Tarifa Fija">
            {tramites.sinCuantia.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Input de Cuantía (si aplica) */}
      {requiereCuantia && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">
            {esArrendamiento ? 'Canon Mensual ($)' : 'Cuantía / Valor del Acto ($)'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
            <input
              type="number"
              value={cuantia}
              onChange={(e) => setCuantia(Number(e.target.value))}
              min={0}
              step={cuantiaInputStep}
              className="w-full pl-8 pr-4 py-3 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <Slider
            value={[cuantia]}
            onValueChange={(value) => setCuantia(value[0])}
            min={0}
            max={cuantiaSliderMax}
            step={cuantiaSliderStep}
          />
        </div>
      )}

      {esCuantiaIndeterminada && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Acto de Cuantia Indeterminada</label>
          <select
            value={actoIndeterminadoId}
            onChange={(e) => {
              setActoIndeterminadoId(e.target.value)
              setResultado(null)
            }}
            className="w-full px-4 py-3 bg-white border border-[var(--glass-border)] rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
          >
            {actosIndeterminados.map((acto) => (
              <option key={acto.id} value={acto.id}>
                {acto.concepto} - $
                {acto.valorReferencial.toFixed(2)}
                {acto.tipo === 'porcentaje_sbu' ? ' (referencial)' : ''}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <label className="text-sm text-[var(--text-secondary)]">Cantidad</label>
            <input
              type="number"
              value={cantidadActoIndeterminado}
              onChange={(e) => setCantidadActoIndeterminado(Math.max(1, Number(e.target.value) || 1))}
              min={1}
              className="w-24 px-3 py-2 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary text-center"
            />
          </div>
        </div>
      )}

      {/* Tiempo para arrendamientos */}
      {esArrendamiento && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Duración (meses)</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={tiempoMeses}
              onChange={(e) => setTiempoMeses(Number(e.target.value))}
              min={1}
              max={120}
              className="w-24 px-3 py-2 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary text-center"
            />
            <Slider
              value={[tiempoMeses]}
              onValueChange={(value) => setTiempoMeses(value[0])}
              min={1}
              max={60}
              step={1}
              className="flex-1"
            />
          </div>
          {tipoServicio === 'CONTRATO_ARRIENDO_ESCRITURA' && (
            <p className="text-xs text-[var(--text-secondary)]">
              Art. 40: Calcula sobre el valor total del contrato (canon x meses) = $
              {(cuantia * tiempoMeses).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Cantidad de menores para salida del país */}
      {esSalidaPais && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Número de Menores</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={cantidadMenores}
              onChange={(e) => setCantidadMenores(Number(e.target.value))}
              min={1}
              max={10}
              className="w-24 px-3 py-2 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary text-center"
            />
            <Slider
              value={[cantidadMenores]}
              onValueChange={(value) => setCantidadMenores(value[0])}
              min={1}
              max={5}
              step={1}
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* Número de Otorgantes para Poder General / Declaración Juramentada */}
      {(esPoderGeneral || esDeclaracionJuramentada) && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Número de Otorgantes</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={numeroOtorgantes}
              onChange={(e) => setNumeroOtorgantes(Math.max(1, Number(e.target.value)))}
              min={1}
              max={20}
              className="w-24 px-3 py-2 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary text-center"
            />
            <Slider
              value={[numeroOtorgantes]}
              onValueChange={(value) => setNumeroOtorgantes(value[0])}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            El costo aumenta en un 3% del SBU por cada otorgante adicional.
          </p>
        </div>
      )}

      {/* Número de Firmas para Reconocimiento de Firma */}
      {esReconocimientoFirma && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Número de Firmas</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={numeroFirmas}
              onChange={(e) => setNumeroFirmas(Math.max(1, Number(e.target.value)))}
              min={1}
              max={20}
              className="w-24 px-3 py-2 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary text-center"
            />
            <Slider
              value={[numeroFirmas]}
              onValueChange={(value) => setNumeroFirmas(value[0])}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Cada firma cuesta 3% del SBU = ${(SBU_2026 * 0.03).toFixed(2)}
          </p>
        </div>
      )}

      {/* Checkboxes de opciones */}
      <div className="space-y-3">
        {esTransferencia && (
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={esViviendaSocial}
              onChange={(e) => setEsViviendaSocial(e.target.checked)}
              className="w-5 h-5 rounded border-[var(--glass-border)] bg-white text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
            />
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              Vivienda de Interés Social (hasta $60,000) - Descuento 25%
            </span>
          </label>
        )}

        {[
          'TESTAMENTO_ABIERTO',
          'TESTAMENTO_CERRADO',
          'POSESION_EFECTIVA',
          'DECLARACION_JURAMENTADA',
          'CANCELACION_HIPOTECA',
        ].includes(tipoServicio) && (
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={esTerceraEdad}
                onChange={(e) => setEsTerceraEdad(e.target.checked)}
                className="w-5 h-5 rounded border-[var(--glass-border)] bg-white text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {['TESTAMENTO_ABIERTO', 'TESTAMENTO_CERRADO', 'DECLARACION_JURAMENTADA'].includes(tipoServicio)
                  ? 'Adulto Mayor - Exoneración Total (100%)'
                  : 'Adulto Mayor (acto unilateral) - Descuento 50%'}
              </span>
            </label>
          )}
      </div>

      {/* ÍTEMS ADICIONALES */}
      <div className="pt-4 border-t border-[var(--glass-border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Ítems Adicionales
          </h3>
          <button
            onClick={() => setMostrarAgregarItem(!mostrarAgregarItem)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar ítem
          </button>
        </div>

        {/* Lista de items adicionales */}
        {itemsAdicionales.length > 0 && (
          <div className="space-y-2 mb-4">
            {itemsAdicionales.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[var(--accent-primary)]">
                    {ICONOS_ITEMS[item.tipo]}
                  </span>
                  <div>
                    <p className="text-sm text-text-primary">{item.descripcion}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {item.cantidad} x ${item.valorUnitario.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-primary">
                    ${item.subtotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleEliminarItem(item.id)}
                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulario para agregar item */}
        {mostrarAgregarItem && (
          <div className="p-4 bg-bg-secondary rounded-lg space-y-3">
            <select
              value={nuevoItemTipo}
              onChange={(e) => {
                setNuevoItemTipo(e.target.value as ItemAdicional['tipo'])
              }}
              className="w-full px-3 py-2 bg-white border border-[var(--glass-border)] rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            >
              <optgroup label="Certificaciones (por foja)">
                <option value="copia_certificada">Copia Certificada - $1.79/foja</option>
              </optgroup>

              <optgroup label="Declaraciones (base + 3% por otorgante adicional)">
                <option value="declaracion_juramentada">DJ Persona Natural - ${(SBU_2026 * 0.05).toFixed(2)}</option>
                <option value="declaracion_juramentada_pj">DJ Persona Jurídica - ${(SBU_2026 * 0.12).toFixed(2)}</option>
              </optgroup>

              <optgroup label="Poderes (12% base + 3% por otorgante adicional)">
                <option value="poder">Poder General/Especial/Procuración</option>
              </optgroup>

              <optgroup label="Hipotecas">
                <option value="cancelacion_hipoteca">Cancelación de Hipoteca - ${(SBU_2026 * 0.20).toFixed(2)}</option>
              </optgroup>

              <optgroup label="Firmas (por firma)">
                <option value="reconocimiento_firma">Reconocimiento de Firma - ${(SBU_2026 * 0.03).toFixed(2)}/firma</option>
                <option value="autenticacion_firma">Autenticación de Firma - ${(SBU_2026 * 0.04).toFixed(2)}/firma</option>
              </optgroup>

              <optgroup label="Documentos Especiales">
                <option value="materializacion">Materialización - ${(1.79 * 2).toFixed(2)}</option>
                <option value="protocolizacion">Protocolización - ${(SBU_2026 * 0.05).toFixed(2)}</option>
              </optgroup>

              <optgroup label="Servicios Complementarios">
                <option value="marginacion">Marginación/Razón - $3.00</option>
              </optgroup>
            </select>

            <div className="flex items-center gap-4">
              <label className="text-sm text-[var(--text-secondary)]">Cantidad:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNuevoItemCantidad(Math.max(1, nuevoItemCantidad - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-bg-tertiary hover:bg-bg-tertiary/80 rounded-lg text-text-primary transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={nuevoItemCantidad}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    setNuevoItemCantidad(Math.max(1, val))
                  }}
                  min={1}
                  className="w-16 px-2 py-2 bg-white border border-[var(--glass-border)] rounded-lg text-text-primary text-center"
                />
                <button
                  onClick={() => setNuevoItemCantidad(nuevoItemCantidad + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white hover:bg-white/80 rounded-lg text-text-primary transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                {nuevoItemTipo === 'copia_certificada' ? 'fojas' :
                  nuevoItemTipo === 'reconocimiento_firma' || nuevoItemTipo === 'autenticacion_firma' ? 'firmas' :
                    nuevoItemTipo === 'poder' || nuevoItemTipo === 'declaracion_juramentada' || nuevoItemTipo === 'declaracion_juramentada_pj' ? 'otorgantes' : 'unidades'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-[var(--text-secondary)]">
                Subtotal: {' '}
                <span className="text-text-primary font-medium">
                  ${calcularSubtotalItem(nuevoItemTipo, nuevoItemCantidad).toFixed(2)}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMostrarAgregarItem(false)}
                  className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-text-primary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAgregarItem}
                  className="px-4 py-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botón Calcular */}
      <Button
        onClick={handleCalcular}
        className="w-full py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-semibold text-lg"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calcular Costo Total
      </Button>

      {/* Resultados */}
      {resultado && (
        <Card className="p-6 mt-6 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent border-[var(--accent-primary)]/30">
          <div className="space-y-6">
            {/* Gran Total */}
            <div className="text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-2">Total a Pagar</p>
              <div className="text-4xl font-bold text-text-primary">
                $<AnimatedCounter value={resultado.granTotal} duration={0.8} />
              </div>
              {resultado.itemsAdicionales.length > 0 && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Incluye {resultado.itemsAdicionales.length} ítem(s) adicional(es)
                </p>
              )}
            </div>

            {/* Desglose del trámite principal */}
            <div className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
              <h4 className="text-sm font-medium text-text-primary">Trámite Principal</h4>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Subtotal</span>
                <span className="text-text-primary font-medium">${resultado.subtotal.toFixed(2)}</span>
              </div>

              {resultado.descuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">{resultado.razonDescuento}</span>
                  <span className="text-green-400 font-medium">
                    -${resultado.descuento.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">IVA (15%)</span>
                <span className="text-text-primary font-medium">${resultado.iva.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-[var(--glass-border)]">
                <span className="font-medium text-text-primary">Total Trámite Principal</span>
                <span className="font-semibold text-text-primary">${resultado.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Ítems adicionales */}
            {resultado.itemsAdicionales.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
                <h4 className="text-sm font-medium text-text-primary">Ítems Adicionales</h4>
                {resultado.itemsAdicionales.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">
                      {item.descripcion} ({item.cantidad})
                    </span>
                    <span className="text-text-primary">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t border-[var(--glass-border)]">
                  <span className="font-medium text-text-primary">Total Ítems Adicionales</span>
                  <span className="font-semibold text-text-primary">
                    ${resultado.totalItemsAdicionales.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Detalles legales */}
            <div className="pt-4 border-t border-[var(--glass-border)]">
              <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {resultado.detalles.slice(0, 3).map((detalle, i) => (
                    <p key={i}>{detalle}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lead Capture CTA */}
      {resultado && (
        <CalculatorLeadCTA
          source="calc_notarial"
          calculatorLabel="Notarial"
        />
      )}

      {/* Nota legal */}
      <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-bg-secondary p-3 rounded-lg">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Los valores calculados son referenciales y pueden variar según la notaría. SBU 2026: $
          {SBU_2026.toFixed(2)}. Este cálculo está basado en el Reglamento del Sistema Notarial Integral de la Función Judicial del Ecuador. Las rebajas y exoneraciones pueden variar según el número de comparecientes, su calidad de intervención y otras cláusulas particulares del acto.
        </p>
      </div>
    </div>
  )
}

