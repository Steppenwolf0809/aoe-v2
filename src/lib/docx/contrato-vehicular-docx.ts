import {
    Document as DocxDocument,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    Table,
    TableRow,
    TableCell,
    WidthType,
    Packer,
} from 'docx'
import type { ContratoVehicular } from '@/lib/validations/contract'
import {
    requiresConyuge,
    compradorIncludesConyuge,
    resolverGenero,
    resolverEstadoCivil,
    buildTextoDocumento,
    getFormaPagoTexto,
} from '@/lib/validations/contract'

const BLANK = '_______________'

// --- Helpers ---

function toUpper(s: string | undefined): string {
    return (s ?? BLANK).toUpperCase()
}

function orBlank(s: string | undefined): string {
    return s?.trim() ? s : BLANK
}

const DIAS_LETRAS: Record<number, string> = {
    1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
    6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
    11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
    16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve',
    20: 'veinte', 21: 'veintiuno', 22: 'veintidós', 23: 'veintitrés',
    24: 'veinticuatro', 25: 'veinticinco', 26: 'veintiséis', 27: 'veintisiete',
    28: 'veintiocho', 29: 'veintinueve', 30: 'treinta', 31: 'treinta y uno',
}
const ANIOS_LETRAS: Record<number, string> = {
    2024: 'dos mil veinticuatro', 2025: 'dos mil veinticinco',
    2026: 'dos mil veintiséis', 2027: 'dos mil veintisiete', 2028: 'dos mil veintiocho',
}
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatDate() {
    const now = new Date()
    const dia = now.getDate()
    const mes = MESES[now.getMonth()]
    const anio = now.getFullYear()
    return `${DIAS_LETRAS[dia] ?? dia} (${dia}) días del mes de ${mes} del año ${ANIOS_LETRAS[anio] ?? anio} (${anio})`
}

function numeroALetras(n: number): string {
    const letras = ANIOS_LETRAS[n]
    if (letras) return letras
    // Fallback for years / numbers not in map
    return String(n)
}

function formatPrecioLetras(valor: number): string {
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
        'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve']
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
    const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
        'seiscientos', 'setecientos', 'ochocientos', 'novecientos']

    function tresDigitos(n: number): string {
        if (n === 0) return ''
        if (n === 100) return 'cien'
        const c = Math.floor(n / 100)
        const resto = n % 100
        const cStr = c > 0 ? (c === 1 && resto > 0 ? 'ciento' : centenas[c]) : ''
        if (resto === 0) return cStr
        if (resto < 20) return [cStr, unidades[resto]].filter(Boolean).join(' ')
        const d = Math.floor(resto / 10)
        const u = resto % 10
        // 21-29 go as one word
        if (d === 2 && u > 0) {
            const veinti = ['', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro',
                'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve']
            return [cStr, veinti[u]].filter(Boolean).join(' ')
        }
        return [cStr, decenas[d], u > 0 ? `y ${unidades[u]}` : ''].filter(Boolean).join(' ')
    }

    const entero = Math.floor(valor)
    let texto = ''
    if (entero >= 1000) {
        const miles = Math.floor(entero / 1000)
        const resto = entero % 1000
        texto = miles === 1 ? 'mil' : `${tresDigitos(miles)} mil`
        if (resto > 0) texto += ` ${tresDigitos(resto)}`
    } else {
        texto = tresDigitos(entero)
    }
    const centavos = Math.round((valor - entero) * 100)
    const centStr = centavos > 0 ? ` con ${centavos}/100` : ''
    const precioFormato = valor.toLocaleString('es-EC', { minimumFractionDigits: 2 })
    return `${texto.toUpperCase()}${centStr} DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA (USD$ ${precioFormato})`
}

function formatCilindraje(cc: number): string {
    // Simple number-to-words for common cilindrajes
    const miles = Math.floor(cc / 1000)
    const resto = cc % 1000
    if (cc === 0) return BLANK
    let texto = ''
    if (miles > 0) {
        const milesStr = miles === 1 ? 'mil' : `${['', 'dos', 'tres', 'cuatro', 'cinco'][miles] ?? miles} mil`
        texto = milesStr
    }
    if (resto > 0) {
        const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos']
        texto += ` ${centenas[Math.floor(resto / 100)] ?? resto}`
    }
    return texto.trim()
}

function formatPasajerosLetras(n: number): string {
    const nums = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
        'once', 'doce', 'trece', 'catorce', 'quince']
    return nums[n] ?? String(n)
}

// --- Paragraph builders ---

function boldText(text: string) {
    return new TextRun({ text, bold: true, font: 'Calibri', size: 22 })
}

function normalText(text: string) {
    return new TextRun({ text, font: 'Calibri', size: 22 })
}

function makeParagraph(runs: TextRun[], spacing = 240): Paragraph {
    return new Paragraph({
        children: runs,
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: spacing },
    })
}

function clauseTitle(text: string): Paragraph {
    return new Paragraph({
        children: [boldText(text)],
        alignment: AlignmentType.LEFT,
        spacing: { before: 280, after: 120 },
    })
}

function subClause(text: string): Paragraph {
    return makeParagraph([normalText(text)], 160)
}

function centeredBold(text: string): Paragraph {
    return new Paragraph({
        children: [boldText(text)],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
    })
}

function centeredNormal(text: string, spacing = 100): Paragraph {
    return new Paragraph({
        children: [normalText(text)],
        alignment: AlignmentType.CENTER,
        spacing: { after: spacing },
    })
}

function blankLine(spacing = 200): Paragraph {
    return new Paragraph({ children: [normalText('')], spacing: { after: spacing } })
}

function bulletItem(label: string, value: string): Paragraph {
    return new Paragraph({
        children: [boldText(`${label}: `), normalText(value)],
        alignment: AlignmentType.LEFT,
        spacing: { after: 60 },
        indent: { left: 360 },
    })
}

// --- Main function ---

export async function generateContratoVehicularDocx(contrato: ContratoVehicular): Promise<Buffer> {
    const { vendedor, comprador, vehiculo } = contrato
    const precio = vehiculo.valorContrato > 0 ? vehiculo.valorContrato : vehiculo.avaluo
    const precioLetras = formatPrecioLetras(precio)
    const precioFormato = precio.toLocaleString('es-EC', { minimumFractionDigits: 2 })
    const fechaTexto = formatDate()

    const compradorConConyuge = compradorIncludesConyuge(comprador)
    const vendedorConConyuge = requiresConyuge(vendedor.estadoCivil) && !!vendedor.conyuge?.nombres

    // Gender resolution
    const gVend = resolverGenero(vendedor.sexo)
    const gComp = resolverGenero(comprador.sexo)
    const denomVend = gVend.denominacionVendedor
    const denomComp = gComp.denominacionComprador

    // Build compareciente texts
    function buildCompareciente(
        persona: typeof vendedor,
        num: string,
        denominacion: string,
        inclConyuge: boolean,
    ): Paragraph {
        const prefix = num === '1' ? '1. Por una parte,' : '2. Por otra parte,'
        const g = resolverGenero(persona.sexo)
        const estadoCivilLabel = resolverEstadoCivil(persona.estadoCivil, persona.sexo)
        const textoDoc = buildTextoDocumento(persona.tipoDocumento, persona.cedula)

        const runs: TextRun[] = [
            normalText(`${prefix} ${g.articulo} `),
            boldText(toUpper(persona.nombres)),
            normalText(`, de nacionalidad ${persona.nacionalidad}, ${g.portador} de la ${textoDoc}, de estado civil ${estadoCivilLabel}`),
        ]

        if (inclConyuge && persona.conyuge?.nombres) {
            const gConyuge = resolverGenero(persona.conyuge.sexo ?? (persona.sexo === 'M' ? 'F' : 'M'))
            const textoDocConyuge = buildTextoDocumento(
                persona.conyuge.tipoDocumento ?? 'cedula',
                persona.conyuge.cedula,
            )
            runs.push(
                normalText(`, ${g.casado} con ${gConyuge.articulo} `),
                boldText(toUpper(persona.conyuge.nombres)),
                normalText(`, ${gConyuge.portador} de la ${textoDocConyuge}`),
                normalText(`, quienes comparecen por sus propios y personales derechos, así como por los que representan dentro de la sociedad conyugal`),
            )
        } else if (persona.comparecencia === 'apoderado' && persona.apoderado) {
            runs.push(
                normalText(`, debidamente representado por `),
                boldText(toUpper(persona.apoderado.nombres)),
                normalText(`, portador de la cédula No. `),
                boldText(persona.apoderado.cedula),
                normalText(`, según poder especial otorgado ante la ${persona.apoderado.notariaPoder} el ${persona.apoderado.fechaPoder}`),
            )
        } else {
            // Solo comparece por propios derechos (no conyuge)
            runs.push(normalText(`, por sus propios y personales derechos`))
        }

        runs.push(
            normalText(`, ${g.domiciliado} en ${orBlank(persona.direccion)}, quien(es) en adelante se denominará(n) `),
            boldText(`"${denominacion}"`),
            normalText(num === '1' ? '; y,' : '.'),
        )

        return makeParagraph(runs, 200)
    }

    // --- Build PRIMERA: ANTECEDENTES ---
    function buildAntecedentes(): Paragraph[] {
        const paragraphs: Paragraph[] = [clauseTitle('PRIMERA: ANTECEDENTES.-')]

        const hasCuv = contrato.cuvNumero && contrato.cuvNumero.trim().length > 0

        if (contrato.tipoAntecedente === 'compraventa') {
            if (hasCuv) {
                paragraphs.push(subClause(
                    `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, según consta en el Certificado Único Vehicular No. ${contrato.cuvNumero}, emitido por la Agencia Nacional de Tránsito el ${orBlank(contrato.cuvFecha)}, habiendo adquirido la propiedad del mismo mediante transferencia de dominio inscrita el ${orBlank(contrato.fechaInscripcion)}.`,
                ))
            } else {
                // Opción B: antecedente genérico sin CUV
                paragraphs.push(subClause(
                    `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, según consta en los registros de la Agencia Nacional de Tránsito, documento que será anexo al presente contrato.`,
                ))
            }
        } else if (contrato.tipoAntecedente === 'herencia') {
            const h = contrato.herencia
            if (h) {
                const cuvText = hasCuv
                    ? `, según el Certificado Único Vehicular No. ${contrato.cuvNumero} emitido por la Agencia Nacional de Tránsito el ${orBlank(contrato.cuvFecha)}`
                    : `, según consta en los registros de la Agencia Nacional de Tránsito`
                paragraphs.push(subClause(
                    `1.1.- ${denomVend} declara(n) que mediante Acta Notarial de Posesión Efectiva otorgada ante la ${h.posEfectivaNotaria} con fecha ${h.posEfectivaFecha}, se concedió la posesión efectiva proindiviso de los bienes dejados por ${h.causanteNombre}, quien falleció el ${h.causanteFechaFallecimiento}, a favor de ${h.herederosLista} en calidad de ${h.parentesco}. Entre los bienes del causante se encuentra el vehículo descrito en este contrato${cuvText}.`,
                ))
            } else {
                paragraphs.push(subClause(
                    `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, habiéndolo adquirido mediante posesión efectiva, según consta en los registros de la Agencia Nacional de Tránsito, documento que será anexo al presente contrato.`,
                ))
            }
        } else if (contrato.tipoAntecedente === 'donacion') {
            const cuvText = hasCuv
                ? `, según consta en el Certificado Único Vehicular No. ${contrato.cuvNumero}, emitido por la Agencia Nacional de Tránsito el ${orBlank(contrato.cuvFecha)}`
                : `, según consta en los registros de la Agencia Nacional de Tránsito, documento que será anexo al presente contrato`
            paragraphs.push(subClause(
                `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, habiéndolo adquirido mediante escritura pública de donación${cuvText}.`,
            ))
        } else if (contrato.tipoAntecedente === 'importacion') {
            const cuvText = hasCuv
                ? `, según consta en el Certificado Único Vehicular No. ${contrato.cuvNumero}, emitido por la Agencia Nacional de Tránsito el ${orBlank(contrato.cuvFecha)}`
                : `, según consta en los registros de la Agencia Nacional de Tránsito, documento que será anexo al presente contrato`
            paragraphs.push(subClause(
                `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, habiéndolo adquirido mediante importación directa debidamente nacionalizada${cuvText}.`,
            ))
        }

        // 1.2 — Libre de gravámenes
        if (hasCuv) {
            paragraphs.push(subClause(
                `1.2.- Según el referido Certificado Único Vehicular, el vehículo objeto de la presente compraventa se encuentra libre de gravámenes, embargos y prohibiciones de enajenar, encontrándose en perfecto estado legal para su transferencia de dominio.`,
            ))
        } else {
            paragraphs.push(subClause(
                `1.2.- ${denomVend} declara que el vehículo objeto de la presente compraventa se encuentra libre de gravámenes, embargos y prohibiciones de enajenar, encontrándose en perfecto estado legal para su transferencia de dominio.`,
            ))
        }

        // 1.3 — Matrícula vigente
        if (contrato.matriculaVigencia && contrato.matriculaVigencia.trim()) {
            paragraphs.push(subClause(
                `1.3.- ${denomVend} declara que el vehículo se encuentra con su matrícula vigente hasta el ${contrato.matriculaVigencia}, según los registros de la Agencia Nacional de Tránsito.`,
            ))
        } else {
            paragraphs.push(subClause(
                `1.3.- ${denomVend} declara que el vehículo se encuentra con su matrícula en regla, conforme los registros de la Agencia Nacional de Tránsito del Ecuador.`,
            ))
        }

        return paragraphs
    }

    // --- Dynamic clause numbering ---
    const hasObservaciones = contrato.tieneObservaciones && contrato.observacionesTexto?.trim()
    const clauseNames = hasObservaciones
        ? { observaciones: 'SÉPTIMA', aceptacion: 'OCTAVA', cuantia: 'NOVENA' }
        : { aceptacion: 'SÉPTIMA', cuantia: 'OCTAVA' }

    // --- Build vehicle description items ---
    const vehicleItems: Paragraph[] = [
        bulletItem('PLACA', vehiculo.placa),
        bulletItem('MARCA', vehiculo.marca),
        bulletItem('MODELO', vehiculo.modelo),
        bulletItem('TIPO', orBlank(vehiculo.tipo)),
        bulletItem('AÑO DE MODELO', `${numeroALetras(vehiculo.anio)} (${vehiculo.anio})`),
        bulletItem('NÚMERO DE MOTOR', vehiculo.motor),
        bulletItem('NÚMERO DE CHASIS/VIN', vehiculo.chasis),
        bulletItem('COLOR', vehiculo.color),
    ]
    if (vehiculo.cilindraje && vehiculo.cilindraje > 0) {
        vehicleItems.push(bulletItem('CILINDRAJE', `${formatCilindraje(vehiculo.cilindraje)} (${vehiculo.cilindraje}) cc`))
    }
    if (vehiculo.carroceria) vehicleItems.push(bulletItem('CARROCERÍA', vehiculo.carroceria))
    if (vehiculo.clase) vehicleItems.push(bulletItem('CLASE', vehiculo.clase))
    if (vehiculo.pais) vehicleItems.push(bulletItem('PAÍS DE ORIGEN', vehiculo.pais))
    if (vehiculo.combustible) vehicleItems.push(bulletItem('COMBUSTIBLE', vehiculo.combustible))
    if (vehiculo.pasajeros && vehiculo.pasajeros > 0) {
        vehicleItems.push(bulletItem('NÚMERO DE PASAJEROS', `${formatPasajerosLetras(vehiculo.pasajeros)} (${vehiculo.pasajeros})`))
    }
    vehicleItems.push(bulletItem('SERVICIO', orBlank(vehiculo.servicio)))
    if (vehiculo.tonelaje && vehiculo.tonelaje.trim()) vehicleItems.push(bulletItem('TONELAJE', vehiculo.tonelaje))
    if (vehiculo.ramv && vehiculo.ramv.trim()) vehicleItems.push(bulletItem('RAMV/CPN', vehiculo.ramv))

    // Build forma de pago text
    const formaPagoTexto = getFormaPagoTexto(contrato.formaPago)

    const children: Paragraph[] = [
        // Title block
        centeredBold('ABOGADOS ONLINE ECUADOR'),
        centeredNormal('Servicio legal digital independiente | Quito, Ecuador'),
        blankLine(160),
        centeredBold('CONTRATO DE COMPRAVENTA DE VEHÍCULO'),
        centeredBold(`CUANTÍA: USD$ ${precioFormato}`),
        blankLine(100),

        // Intro
        makeParagraph([
            normalText(`En la ciudad de San Francisco de Quito, Distrito Metropolitano, capital de la República del Ecuador, a los `),
            boldText(fechaTexto),
            normalText(`, comparecen a la celebración del presente contrato de compraventa:`),
        ], 200),

        // Comparecientes
        buildCompareciente(vendedor, '1', denomVend, vendedorConConyuge),
        buildCompareciente(comprador, '2', denomComp, compradorConConyuge),

        makeParagraph([normalText('Los comparecientes, mayores de edad, hábiles y capaces para contratar y obligarse, libre y voluntariamente convienen en celebrar el presente contrato de compraventa de vehículo automotor al tenor de las siguientes cláusulas:')]),

        // PRIMERA — ANTECEDENTES
        ...buildAntecedentes(),

        // SEGUNDA — OBJETO
        clauseTitle('SEGUNDA: OBJETO.-'),
        subClause(`Por el presente contrato, ${denomVend} transfiere en favor de ${denomComp}, a título de venta, el dominio, posesión y todos los derechos que le(s) corresponde(n) sobre el siguiente vehículo automotor:`),
        ...vehicleItems,
        blankLine(100),

        // TERCERA — PRECIO Y FORMA DE PAGO
        clauseTitle('TERCERA: PRECIO Y FORMA DE PAGO.-'),
        subClause(`3.1.- El precio de la presente compraventa es la suma de ${precioLetras}, cantidad que ${denomVend} declara haber recibido a su entera satisfacción mediante ${formaPagoTexto} realizada por ${denomComp}, otorgando el más amplio y eficaz finiquito de pago.`),
        subClause(`3.2.- Con el pago del precio señalado, ${denomVend} se da por ${gVend.cancelado} y ${gVend.satisfecho} de la obligación contraída por ${denomComp}.`),

        // CUARTA — ESTADO DEL VEHÍCULO Y GARANTÍAS
        clauseTitle('CUARTA: ESTADO DEL VEHÍCULO Y GARANTÍAS.-'),
        subClause(`4.1.- ${denomVend} declara expresamente que el vehículo objeto de la presente compraventa se encuentra completamente libre de todo gravamen, hipoteca, prenda, embargo, prohibición de enajenar o cualquier otra limitación de dominio, según se acredita con el Certificado Único Vehicular antes mencionado.`),
        subClause(`4.2.- ${denomVend} garantiza a ${denomComp} el saneamiento por evicción del bien vendido, comprometiéndose a responder por cualquier reclamo de terceros sobre la propiedad del vehículo.`),
        subClause(`4.3.- ${denomComp} declara conocer perfectamente el estado físico y mecánico del vehículo, manifestando su total conformidad con el mismo y renunciando expresamente a todo reclamo por vicios redhibitorios o defectos ocultos que pudiera presentar el automotor.`),

        // QUINTA — GASTOS
        clauseTitle('QUINTA: GASTOS.-'),
        makeParagraph([normalText(`Todos los gastos que origine la transferencia de dominio del vehículo, tales como derechos de matrícula, especies valoradas, impuestos y demás tributos establecidos por la ley, serán cubiertos por ${denomComp}.`)]),

        // SEXTA — JURISDICCIÓN
        clauseTitle('SEXTA: JURISDICCIÓN Y COMPETENCIA.-'),
        makeParagraph([normalText(`Para todos los efectos legales derivados del presente contrato, las partes se someten a los jueces competentes de la ciudad de Quito, renunciando expresamente a fuero especial que pudieren tener.`)]),
    ]

    // SÉPTIMA — OBSERVACIONES (condicional)
    if (hasObservaciones) {
        children.push(
            clauseTitle(`${clauseNames.observaciones}: OBSERVACIONES.-`),
            makeParagraph([normalText(contrato.observacionesTexto!)]),
        )
    }

    // ACEPTACIÓN
    const aceptacionNum = hasObservaciones ? clauseNames.aceptacion : clauseNames.aceptacion
    children.push(
        clauseTitle(`${aceptacionNum}: ACEPTACIÓN Y RATIFICACIÓN.-`),
        makeParagraph([normalText(`Las partes aceptan íntegramente las cláusulas del presente contrato, declarando que han sido redactadas de común acuerdo y que las mismas son expresión fiel de su voluntad. El presente contrato se extiende en dos (2) ejemplares de igual tenor y valor, uno para cada una de las partes.`)]),
    )

    // CUANTÍA
    const cuantiaNum = hasObservaciones ? clauseNames.cuantia : clauseNames.cuantia
    children.push(
        clauseTitle(`${cuantiaNum}: CUANTÍA.-`),
        makeParagraph([normalText(`La cuantía de la presente compraventa asciende a la suma de ${precioLetras}.`)]),
    )

    // Cierre
    children.push(
        makeParagraph([normalText('En fe de lo cual, firman las partes en el lugar y fecha indicados en el encabezamiento del presente contrato.')], 400),
        new Paragraph({ children: [], spacing: { after: 0 } }),
    )

    // Build signature rows using a table for side-by-side layout
    function sigCell(nombre: string, cedula: string, rol: string): TableCell {
        return new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 6, color: '1e293b' },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
            },
            children: [
                new Paragraph({
                    children: [boldText(nombre.toUpperCase())],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 60, after: 40 },
                }),
                new Paragraph({
                    children: [normalText(`C.I. ${cedula}`)],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 40 },
                }),
                new Paragraph({
                    children: [normalText(rol)],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 80 },
                }),
            ],
        })
    }

    function emptyCell(): TableCell {
        return new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [new Paragraph({ children: [] })],
        })
    }

    const sigRow1Cells = [
        sigCell(vendedor.nombres, vendedor.cedula, denomVend),
        vendedorConConyuge
            ? sigCell(vendedor.conyuge!.nombres, orBlank(vendedor.conyuge!.cedula), `CÓNYUGE DE ${denomVend}`)
            : emptyCell(),
    ]

    const sigRow2Cells = [
        sigCell(comprador.nombres, comprador.cedula, denomComp),
        compradorConConyuge && comprador.conyuge?.nombres
            ? sigCell(comprador.conyuge!.nombres, orBlank(comprador.conyuge!.cedula), `CÓNYUGE DE ${denomComp}`)
            : emptyCell(),
    ]

    const sigTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({ children: sigRow1Cells }),
            new TableRow({ children: sigRow2Cells }),
        ],
    })

    const doc = new DocxDocument({
        sections: [{
            properties: {
                page: {
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch margins
                },
            },
            children: [
                ...children,
                // @ts-ignore — docx Table is also a valid section child
                sigTable,
                blankLine(240),
                centeredNormal('Documento generado por Abogados Online Ecuador • www.abogadosonlineecuador.com'),
            ],
        }],
    })

    const buffer = await Packer.toBuffer(doc)
    return buffer
}
