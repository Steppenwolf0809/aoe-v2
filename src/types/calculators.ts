
export interface Rango {
    min: number;
    max: number;
    tarifa: number;
}

export interface FormulaExcedente {
    base: number; // Porcentaje del SBU (ej: 20 SBU)
    porcentajeExcedente: number;
}

export interface Excedente {
    limite: number;
    formula: FormulaExcedente;
}

export interface TablaNotarial {
    rangos: Rango[];
    excedente?: Excedente;
}

export interface TarifasNotariales {
    remuneracionBasica: number;
    iva: number;
    tablas: Record<string, TablaNotarial>;
    actosIndeterminados: Record<string, number>; // Tarifa base
}

// -- Municipal --

export interface MunicipalInput {
    fechaAdquisicion: string;
    fechaTransferencia: string;
    valorTransferencia: number;
    valorAdquisicion: number;
    avaluoCatastral: number;
    tipoTransferencia: 'Compraventa' | 'Donación' | 'Dación en pago';
    tipoTransferente: 'Natural' | 'Inmobiliaria';
    mejoras?: number;
    contribucionMejoras?: number;
}

export interface ResultadoMunicipal {
    impuestoUtilidad: number;
    impuestoAlcabala: number;
    total: number;
    detalles: {
        utilidad: {
            baseImponible: number;
            utilidadBruta: number;
            deduccionTiempo: number;
            tarifaAplicada: number;
        };
        alcabala: {
            baseImponible: number;
            rebaja: number;
        };
    };
}

// -- Registro --

export interface RangoRegistro {
    min: number;
    max: number;
    arancel: number;
}

export interface RegistroInput {
    valorContrato: number;
    esTerceraEdad?: boolean;
    esDiscapacidad?: boolean; // Asumimos similar a tercera edad o exento? Por ahora no especficiado, dejamos fuera.
}

export interface ResultadoRegistro {
    arancelBase: number;
    descuentos: number;
    arancelFinal: number;
    excedeMaximo: boolean;
}

// -- General Result Wrapper --

export interface CalculoDetallado {
    notaria: {
        subtotal: number;
        iva: number;
        total: number;
        detalles?: any;
    };
    registro?: {
        total: number;
        detalles?: any;
    };
    municipal?: {
        impuestoUtilidad: number;
        impuestoAlcabala: number;
        total: number;
        detalles?: any;
    };
    otrosGastos?: number; // Gastos administrativos, copias, etc.
    totalEstimado: number;
}
