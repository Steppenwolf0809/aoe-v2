import { SBU_VIGENTE } from '@/lib/calculators/constants';

export const PRECIOS_SERVICIOS = {
    poder: 50,
    divorcio: 50,
    salidaPais: 40
};

export function obtenerPrecioServicio(tipo: keyof typeof PRECIOS_SERVICIOS) {
    const precioAOE = PRECIOS_SERVICIOS[tipo];

    // Estimación gastos notariales para mostrar transparencia (opcional)
    let gastoNotarialEstimado = 0;

    switch (tipo) {
        case 'poder':
            gastoNotarialEstimado = SBU_VIGENTE * 0.12; // ~$58
            break;
        case 'divorcio':
            gastoNotarialEstimado = SBU_VIGENTE * 0.80; // ~$385
            break;
        case 'salidaPais':
            gastoNotarialEstimado = SBU_VIGENTE * 0.04; // ~$19 por menor aprox
            break;
    }

    return {
        precioAOE,
        gastoNotarialEstimado,
        totalEstimado: precioAOE + gastoNotarialEstimado
    }
}
