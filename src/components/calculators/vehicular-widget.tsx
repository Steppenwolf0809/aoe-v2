'use client'

import { useState } from 'react'
import { Calculator, Car, AlertCircle, FileText, Plus, Trash2, Copy, FileSignature } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { calcularCotizacionVehicular } from '@/lib/formulas/vehicular'
import { ResultadoVehicular } from '@/lib/formulas/vehicular'
import { AnimatedCounter } from './animated-counter'

export function VehicularCalculatorWidget() {
  const [valorVehiculo, setValorVehiculo] = useState(15000)
  const [numFirmas, setNumFirmas] = useState(2)
  const [itemsAdicionales, setItemsAdicionales] = useState<Array<{
    id: string
    tipo: 'copia_certificada' | 'materializacion_vehicular'
    descripcion: string
    cantidad: number
    valorUnitario: number
    subtotal: number
  }>>([])
  const [mostrarAgregarItem, setMostrarAgregarItem] = useState(false)
  const [nuevoItemTipo, setNuevoItemTipo] = useState<'copia_certificada' | 'materializacion_vehicular'>('copia_certificada')
  const [nuevoItemCantidad, setNuevoItemCantidad] = useState(1)
  const [resultado, setResultado] = useState<ResultadoVehicular | null>(null)

  const handleCalcular = () => {
    const res = calcularCotizacionVehicular({
      valorVehiculo,
      numFirmas,
    })
    setResultado(res)
  }

  const calcularSubtotalItem = (tipo: 'copia_certificada' | 'materializacion_vehicular', cantidad: number): number => {
    if (tipo === 'copia_certificada') {
      return 1.79 * cantidad
    } else if (tipo === 'materializacion_vehicular') {
      return 3.58 * cantidad // 1.79 × 2
    }
    return 0
  }

  const handleAgregarItem = () => {
    const subtotal = calcularSubtotalItem(nuevoItemTipo, nuevoItemCantidad)
    const descripcion = nuevoItemTipo === 'copia_certificada'
      ? `Copia Certificada (${nuevoItemCantidad} fojas)`
      : `Materialización Certificado Único Vehicular (${nuevoItemCantidad})`

    const valorUnitario = nuevoItemTipo === 'copia_certificada' ? 1.79 : 3.58

    const item = {
      id: `${nuevoItemTipo}-${Date.now()}`,
      tipo: nuevoItemTipo,
      descripcion,
      cantidad: nuevoItemCantidad,
      valorUnitario,
      subtotal: Math.round(subtotal * 100) / 100,
    }

    setItemsAdicionales([...itemsAdicionales, item])
    setMostrarAgregarItem(false)
    setNuevoItemCantidad(1)
  }

  const handleEliminarItem = (id: string) => {
    setItemsAdicionales(itemsAdicionales.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Valor del Vehículo */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary flex items-center gap-2">
          <Car className="w-4 h-4" />
          Valor del Vehículo
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
          <input
            type="number"
            value={valorVehiculo}
            onChange={(e) => setValorVehiculo(Number(e.target.value))}
            min={0}
            step={100}
            className="w-full pl-8 pr-4 py-3 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            placeholder="0.00"
          />
        </div>
        <Slider
          value={[valorVehiculo]}
          onValueChange={(value) => setValorVehiculo(value[0])}
          min={0}
          max={50000}
          step={500}
        />
        <p className="text-xs text-[var(--text-secondary)]">
          Valor comercial del vehículo según avalúo o acuerdo entre partes
        </p>
      </div>

      {/* Número de Firmas */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">Número de Firmas a Reconocer</label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={numFirmas}
            onChange={(e) => setNumFirmas(Math.max(1, Math.min(10, Number(e.target.value))))}
            min={1}
            max={10}
            className="w-24 px-3 py-2 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary text-center font-semibold text-lg"
          />
          <Slider
            value={[numFirmas]}
            onValueChange={(value) => setNumFirmas(value[0])}
            min={1}
            max={10}
            step={1}
            className="flex-1"
          />
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Comprador, vendedor, cónyuges, herederos, etc. • 3% SBU = $14.46 por firma
        </p>
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
                    {item.tipo === 'copia_certificada' ? <Copy className="w-4 h-4" /> : <FileSignature className="w-4 h-4" />}
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
                setNuevoItemTipo(e.target.value as 'copia_certificada' | 'materializacion_vehicular')
              }}
              className="w-full px-3 py-2 bg-white border border-[var(--glass-border)] rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            >
              <option value="copia_certificada">Copia Certificada - $1.79/foja</option>
              <option value="materializacion_vehicular">Materialización Certificado Único Vehicular - $3.58</option>
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
                {nuevoItemTipo === 'copia_certificada' ? 'fojas' : 'unidades'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-[var(--text-secondary)]">
                Subtotal:{' '}
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
        Calcular Cotización
      </Button>

      {/* Resultados */}
      {resultado && (() => {
        const totalItemsAdicionales = itemsAdicionales.reduce((sum, item) => sum + item.subtotal, 0)
        const granTotal = resultado.totalEstimado + totalItemsAdicionales

        return (
          <Card className="p-6 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border-[var(--accent-primary)]/30">
            <div className="space-y-6">
              {/* Total */}
              <div className="text-center">
                <p className="text-sm text-text-secondary mb-2">Costo Total Estimado</p>
                <div className="text-5xl font-bold text-text-primary">
                  $<AnimatedCounter value={granTotal} duration={0.8} />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {itemsAdicionales.length > 0
                    ? `Incluye ${itemsAdicionales.length} ítem(s) adicional(es)`
                    : 'Incluye reconocimiento de firmas + impuesto fiscal + servicio AOE'}
                </p>
              </div>

            {/* Detalles */}
            <div className="space-y-3 pt-4 border-t border-[var(--glass-border)] text-sm">
              <div className="space-y-2 mb-3">
                <h4 className="font-semibold text-text-primary">Gastos Notariales</h4>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">
                    Reconocimiento de firmas ({resultado.numFirmas} × $
                    {resultado.tarifaPorFirma.toFixed(2)})
                  </span>
                  <span className="text-text-primary">${resultado.costoNotarial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">IVA (15%)</span>
                  <span className="text-text-primary">${resultado.ivaNotarial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-text-primary">Subtotal Notarial</span>
                  <span className="text-text-primary">${resultado.totalNotarial.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--glass-border)]">
                <h4 className="font-semibold text-text-primary">Impuestos Fiscales</h4>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">
                    Transferencia de dominio (1%)
                  </span>
                  <span className="text-text-primary">
                    ${resultado.impuestoTransferencia.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--glass-border)]">
                <h4 className="font-semibold text-text-primary">Servicio AOE</h4>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Contrato generado</span>
                  <span className="text-text-primary">${resultado.precioContrato.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t-2 border-[var(--glass-border)]">
                <span className="font-bold text-text-primary">Total Gastos Notariales + Fiscales</span>
                <span className="font-bold text-[var(--accent-primary)] text-lg">
                  ${resultado.totalEstimado.toFixed(2)}
                </span>
              </div>
            </div>

              {/* Ítems adicionales */}
              {itemsAdicionales.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
                  <h4 className="text-sm font-medium text-text-primary">Ítems Adicionales</h4>
                  {itemsAdicionales.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">
                        {item.descripcion}
                      </span>
                      <span className="text-text-primary">${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 border-t border-[var(--glass-border)]">
                    <span className="font-medium text-text-primary">Total Ítems Adicionales</span>
                    <span className="font-semibold text-text-primary">
                      ${totalItemsAdicionales.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Gran Total Final */}
              {itemsAdicionales.length > 0 && (
                <div className="flex justify-between pt-4 border-t-2 border-[var(--accent-primary)]/30">
                  <span className="font-bold text-text-primary text-lg">GRAN TOTAL</span>
                  <span className="font-bold text-[var(--accent-primary)] text-xl">
                    ${granTotal.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Info adicional */}
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300">
                  <strong>Nota:</strong> Los trámites en la ANT (Agencia Nacional de Tránsito) son
                  adicionales y se realizan después de la firma del contrato. Este presupuesto solo
                  incluye el contrato de compraventa con reconocimiento de firmas.
                </p>
              </div>
            </div>
          </Card>
        )
      })()}
    </div>
  )
}
