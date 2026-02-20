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
    HeadingLevel,
    Packer,
} from 'docx'
import type { ContratoVehicular } from '@/lib/validations/contract'
import { requiresConyuge, compradorIncludesConyuge } from '@/lib/validations/contract'

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

// --- Signature block ---

function signatureBlock(nombre: string, cedula: string, rol: string): Paragraph[] {
    return [
        new Paragraph({
            children: [],
            spacing: { before: 1400, after: 0 },
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: '1e293b' } },
        }),
        new Paragraph({
            children: [boldText(nombre.toUpperCase())],
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
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
    ]
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

    // Build compareciente texts
    function buildCompareciente(persona: typeof vendedor, num: string, rol: string, inclConyuge: boolean): Paragraph {
        const prefix = num === '1' ? '1. Por una parte,' : '2. Por otra parte,'
        const estadoCivilLabel = (() => {
            switch (persona.estadoCivil) {
                case 'soltero': return 'soltero'
                case 'casado': return 'casado'
                case 'divorciado': return 'divorciado'
                case 'viudo': return 'viudo'
                case 'union_de_hecho': return 'en unión de hecho'
                default: return persona.estadoCivil
            }
        })()

        const runs: TextRun[] = [
            normalText(`${prefix} el señor `),
            boldText(toUpper(persona.nombres)),
            normalText(`, de nacionalidad ecuatoriana, portador de la cédula de ciudadanía No. `),
            boldText(persona.cedula),
            normalText(`, de estado civil ${estadoCivilLabel}`),
        ]

        if (inclConyuge && persona.conyuge?.nombres) {
            runs.push(
                normalText(`, casado con la señora `),
                boldText(toUpper(persona.conyuge.nombres)),
                normalText(`, portadora de la cédula de ciudadanía No. `),
                boldText(orBlank(persona.conyuge.cedula)),
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
        }

        runs.push(
            normalText(`, domiciliado en ${orBlank(persona.direccion)}, por sus propios y personales derechos, quien en adelante se denominará `),
            boldText(`"${rol}"`),
            normalText(num === '1' ? '; y,' : '.'),
        )

        return makeParagraph(runs, 200)
    }

    const children: Paragraph[] = [
        // Title block
        centeredBold('ABOGADOS ONLINE ECUADOR'),
        centeredNormal('Servicio legal digital independiente | Quito, Ecuador'),
        blankLine(160),
        centeredBold('CONTRATO DE COMPRAVENTA DE VEHÍCULO'),
        centeredBold(`CUANTÍA: USD$ ${precioFormato}`),
        centeredNormal('COPIAS: DOS', 240),

        // Intro
        makeParagraph([
            normalText(`En la ciudad de San Francisco de Quito, Distrito Metropolitano, capital de la República del Ecuador, a los `),
            boldText(fechaTexto),
            normalText(`, comparecen a la celebración del presente contrato de compraventa:`),
        ], 200),

        // Comparecientes
        buildCompareciente(vendedor, '1', 'EL VENDEDOR', vendedorConConyuge),
        buildCompareciente(comprador, '2', 'EL COMPRADOR', compradorConConyuge),

        makeParagraph([normalText('Los comparecientes, mayores de edad, hábiles y capaces para contratar y obligarse, libre y voluntariamente convienen en celebrar el presente contrato de compraventa de vehículo automotor al tenor de las siguientes cláusulas:')]),

        // PRIMERA
        clauseTitle('PRIMERA: ANTECEDENTES.-'),
        subClause(`1.1.- ${toUpper(vendedor.nombres)} declara ser legítimo propietario del vehículo que se describe en el presente contrato, según consta en el Certificado Único Vehicular emitido por la Agencia Nacional de Tránsito, el mismo que se encuentra libre de gravámenes, embargos y prohibiciones de enajenar.`),
        subClause(`1.2.- El referido vehículo se encuentra con su matrícula en regla, conforme los registros de la Agencia Nacional de Tránsito del Ecuador.`),

        // SEGUNDA
        clauseTitle('SEGUNDA: OBJETO.-'),
        subClause(`Por el presente contrato, EL VENDEDOR transfiere en favor de EL COMPRADOR, a título de venta, el dominio, posesión y todos los derechos que le corresponden sobre el siguiente vehículo automotor:`),
        makeParagraph([
            boldText('PLACA: '), normalText(vehiculo.placa + '   '),
            boldText('MARCA: '), normalText(vehiculo.marca + '   '),
            boldText('MODELO: '), normalText(vehiculo.modelo),
        ], 100),
        makeParagraph([
            boldText('AÑO: '), normalText(String(vehiculo.anio) + '   '),
            boldText('COLOR: '), normalText(vehiculo.color + '   '),
            boldText('SERVICIO: '), normalText('USO PARTICULAR'),
        ], 100),
        makeParagraph([
            boldText('NÚM. MOTOR: '), normalText(vehiculo.motor + '   '),
            boldText('CHASIS/VIN: '), normalText(vehiculo.chasis),
        ], 200),

        // TERCERA
        clauseTitle('TERCERA: PRECIO Y FORMA DE PAGO.-'),
        subClause(`3.1.- El precio de la presente compraventa es la suma de ${precioLetras}, valor que EL VENDEDOR declara haber recibido a su entera satisfacción por parte de EL COMPRADOR, otorgando el más completo y eficaz finiquito de pago.`),
        subClause(`3.2.- Con la recepción del precio señalado, EL VENDEDOR se da por satisfecho y cancela toda obligación derivada de la presente compraventa.`),

        // CUARTA
        clauseTitle('CUARTA: ESTADO DEL VEHÍCULO Y GARANTÍAS.-'),
        subClause(`4.1.- EL VENDEDOR declara expresamente que el vehículo se encuentra libre de todo gravamen, hipoteca, prenda, embargo, prohibición de enajenar o cualquier otra limitación de dominio vigente.`),
        subClause(`4.2.- EL VENDEDOR garantiza el saneamiento por evicción del bien vendido, comprometiéndose a responder ante EL COMPRADOR por cualquier reclamo de terceros sobre la propiedad o dominio del vehículo.`),
        subClause(`4.3.- EL COMPRADOR declara conocer el estado físico y mecánico del vehículo y manifiesta su total conformidad, renunciando expresamente a todo reclamo por vicios redhibitorios o defectos ocultos.`),

        // QUINTA
        clauseTitle('QUINTA: GASTOS.-'),
        makeParagraph([normalText(`Todos los gastos que origine la transferencia de dominio del vehículo, incluyendo derechos de matrícula, especies valoradas, impuestos y demás tributos establecidos por la ley, serán cubiertos en su totalidad por EL COMPRADOR.`)]),

        // SEXTA
        clauseTitle('SEXTA: JURISDICCIÓN Y COMPETENCIA.-'),
        makeParagraph([normalText(`Para todos los efectos legales derivados del presente contrato, las partes se someten expresamente a los jueces competentes de la ciudad de Quito, renunciando a fuero especial que pudieren tener o corresponderles.`)]),

        // SÉPTIMA
        clauseTitle('SÉPTIMA: ACEPTACIÓN.-'),
        makeParagraph([normalText(`Las partes libre y voluntariamente aceptan íntegramente el contenido del presente contrato, declarando que sus cláusulas han sido redactadas de común acuerdo y son expresión fiel de su voluntad. El presente instrumento se extiende en dos (2) ejemplares de igual tenor y valor, uno para cada parte.`)]),

        // OCTAVA
        clauseTitle('OCTAVA: CUANTÍA.-'),
        makeParagraph([normalText(`La cuantía de la presente compraventa asciende a la suma de ${precioLetras}.`)]),

        makeParagraph([normalText('En fe de lo cual, firman las partes en el lugar y fecha indicados en el encabezamiento del presente contrato.')], 400),

        // Signatures — row via table
        new Paragraph({ children: [], spacing: { after: 0 } }),
    ]

    // Build signature rows using a table for side-by-side layout
    // Row 1: Vendedor + Cónyuge Vendedor (if any)
    // Row 2: Comprador + Cónyuge Comprador (if any)
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
        sigCell(vendedor.nombres, vendedor.cedula, 'EL VENDEDOR'),
        vendedorConConyuge
            ? sigCell(vendedor.conyuge!.nombres, orBlank(vendedor.conyuge!.cedula), 'CÓNYUGE DEL VENDEDOR')
            : emptyCell(),
    ]

    const sigRow2Cells = [
        sigCell(comprador.nombres, comprador.cedula, 'EL COMPRADOR'),
        compradorConConyuge && comprador.conyuge?.nombres
            ? sigCell(comprador.conyuge!.nombres, orBlank(comprador.conyuge!.cedula), 'CÓNYUGE DEL COMPRADOR')
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
