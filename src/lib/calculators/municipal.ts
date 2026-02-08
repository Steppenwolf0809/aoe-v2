import { MunicipalInput, ResultadoMunicipal } from '@/types/calculators';

export function calcularImpuestosMunicipales(data: MunicipalInput): ResultadoMunicipal {
    const {
        valorTransferencia,
        valorAdquisicion,
        avaluoCatastral,
        fechaAdquisicion,
        fechaTransferencia
    } = data;

    const baseImponibleMayor = Math.max(valorTransferencia, avaluoCatastral);

    // 1. Alcabala (1% de la base imponible)
    // Rebajas por tiempo: 
    // <1 año: 40%
    // 1-2 años: 30%
    // 2-3 años: 20%
    // >3 años: 0%

    const fechaAdq = new Date(fechaAdquisicion);
    const fechaTrans = new Date(fechaTransferencia);

    // Calcular diferencia en años/meses
    const diffTime = Math.abs(fechaTrans.getTime() - fechaAdq.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);

    let rebajaAlcabala = 0;
    if (diffYears <= 1) rebajaAlcabala = 0.40;
    else if (diffYears <= 2) rebajaAlcabala = 0.30;
    else if (diffYears <= 3) rebajaAlcabala = 0.20;

    const tarifaAlcabala = 0.01;
    const impuestoAlcabalaBase = baseImponibleMayor * tarifaAlcabala;
    const impuestoAlcabalaFinal = impuestoAlcabalaBase * (1 - rebajaAlcabala);

    // 2. Utilidad (Plusvalía)
    // Utilidad = (Venta - Compra - Mejoras) * 10% (Generalmente)
    // Deducción 5% por año transcurrido

    const utilidadBruta = Math.max(0, valorTransferencia - valorAdquisicion - (data.mejoras || 0));

    const deduccionTiempo = Math.min(utilidadBruta * 0.95, utilidadBruta * 0.05 * Math.floor(diffYears));
    // Max deducción? La ley dice 5% anual.

    const baseImponibleUtilidad = Math.max(0, utilidadBruta - deduccionTiempo);
    const tarifaUtilidad = 0.10; // Estandar. Predios urbanos.
    const impuestoUtilidadFinal = baseImponibleUtilidad * tarifaUtilidad;

    // Total
    const total = impuestoAlcabalaFinal + impuestoUtilidadFinal;

    // Gastos administrativos (Consejo Provincial + Seguridad)
    // Suelen ser pequeños (~$50-$100), pero importantes.
    // Los agregamos como parte del 'total' o 'detalles'? 
    // Por ahora retornamos impuesto puro.

    return {
        impuestoAlcabala: impuestoAlcabalaFinal,
        impuestoUtilidad: impuestoUtilidadFinal,
        total,
        detalles: {
            alcabala: {
                baseImponible: baseImponibleMayor,
                rebaja: rebajaAlcabala
            },
            utilidad: {
                baseImponible: baseImponibleUtilidad,
                utilidadBruta,
                deduccionTiempo,
                tarifaAplicada: tarifaUtilidad
            }
        }
    };
}
