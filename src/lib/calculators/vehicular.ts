import { SBU_VIGENTE } from '@/lib/calculators/constants';

export const PRECIO_SAAS_VEHICULAR = 9.99;

export function calcularCostoVehicular(valorVehiculo: number, numFirmas: number = 2) {
    // CORRECCIÓN: El costo notarial NO es por cuantía (valor vehículo).
    // Es exclusivamente por RECONOCIMIENTO DE FIRMAS.
    // Base legal: El contrato de compraventa de vehículo es un documento privado con reconocimiento de firmas.

    const tarifaPorFirma = SBU_VIGENTE * 0.03; // Aprox 3% SBU por firma
    const costoNotarial = numFirmas * tarifaPorFirma;

    // Impuesto Fiscal (1% Transferencia de Dominio - SRI/Prefectura)
    // Este costo es externo a la notaría pero parte del trámite.
    // Se mantiene para informar al cliente el costo REAL total del traspaso.
    const impuestoTransferencia = valorVehiculo * 0.01;

    const totalExternos = costoNotarial + impuestoTransferencia;

    return {
        precioServicioAOE: PRECIO_SAAS_VEHICULAR,
        gastosExternos: {
            notaria: costoNotarial, // Solo firmas
            impuestos: impuestoTransferencia, // 1% Avalúo
            total: totalExternos
        },
        totalEstimado: PRECIO_SAAS_VEHICULAR + totalExternos
    };
}
