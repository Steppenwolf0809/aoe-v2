export const debtAnswerLabels = {
  si: 'Sí',
  no: 'No',
  no_estoy_seguro: 'No estoy seguro',
} as const

export type DebtAnswerValue = keyof typeof debtAnswerLabels

export interface DebtEvaluatorQuestion {
  id: string
  question: string
  detail: string
  category: string
  riskWhen: 'si' | 'no'
  weight: number
  severe?: boolean
}

export interface DebtDiagnosis {
  level: 'inicial' | 'moderado' | 'alto'
  label: string
  score: number
  range: string
  summary: string
  options: string[]
  nextSteps: string[]
}

export const debtEvaluatorQuestions: DebtEvaluatorQuestion[] = [
  {
    id: 'mora',
    question: '¿Tu deuda está en mora?',
    detail: 'La mora define urgencia, presión de cobro y margen de negociación.',
    category: 'Mora',
    riskWhen: 'si',
    weight: 2,
  },
  {
    id: 'mora_60_dias',
    question: '¿La mora supera los 60 días?',
    detail: 'Mientras más tiempo pasa, menor suele ser el margen para negociar sin estrategia.',
    category: 'Mora',
    riskWhen: 'si',
    weight: 2,
  },
  {
    id: 'llamadas_cobro',
    question: '¿Recibiste llamadas frecuentes de cobranza?',
    detail: 'La intensidad de contacto ayuda a medir presión y posible escalamiento.',
    category: 'Cobranza',
    riskWhen: 'si',
    weight: 1,
  },
  {
    id: 'cartas_cobro',
    question: '¿Recibiste cartas, correos o notificaciones de cobro?',
    detail: 'Los documentos escritos sirven para ordenar fechas y argumentos.',
    category: 'Cobranza',
    riskWhen: 'si',
    weight: 2,
  },
  {
    id: 'demanda',
    question: '¿Ya existe demanda o citación judicial?',
    detail: 'Si hay proceso judicial, la negociación debe coordinarse con defensa y plazos.',
    category: 'Judicial',
    riskWhen: 'si',
    weight: 5,
    severe: true,
  },
  {
    id: 'embargo',
    question: '¿Te hablaron de embargo, retención o medidas cautelares?',
    detail: 'Esta señal exige revisar si es advertencia de cobranza o riesgo procesal real.',
    category: 'Judicial',
    riskWhen: 'si',
    weight: 4,
    severe: true,
  },
  {
    id: 'ingresos',
    question: '¿Tienes ingresos actuales para proponer un acuerdo?',
    detail: 'La capacidad de pago ayuda a definir una propuesta defendible.',
    category: 'Capacidad',
    riskWhen: 'no',
    weight: 2,
  },
  {
    id: 'propuesta_previa',
    question: '¿Ya hiciste una propuesta formal de pago?',
    detail: 'Una propuesta previa permite revisar si conviene insistir, corregir o cambiar de ruta.',
    category: 'Negociación',
    riskWhen: 'no',
    weight: 1,
  },
  {
    id: 'documentos',
    question: '¿Tienes contrato, estados de cuenta o comprobantes?',
    detail: 'Sin documentos, el primer paso es reconstruir evidencia antes de negociar.',
    category: 'Documentos',
    riskWhen: 'no',
    weight: 2,
  },
  {
    id: 'varias_deudas',
    question: '¿Tienes más de una deuda activa?',
    detail: 'Varias obligaciones requieren priorizar riesgo, monto y acreedor.',
    category: 'Capacidad',
    riskWhen: 'si',
    weight: 2,
  },
  {
    id: 'garante',
    question: '¿Hay garante, codeudor o bien prendado involucrado?',
    detail: 'Los terceros o garantias cambian el alcance de la estrategia.',
    category: 'Garantias',
    riskWhen: 'si',
    weight: 2,
  },
  {
    id: 'descuento_ofrecido',
    question: '¿El acreedor ya ofreció descuento o refinanciamiento?',
    detail: 'Una oferta puede ser oportunidad, pero debe revisarse antes de aceptarla.',
    category: 'Negociación',
    riskWhen: 'no',
    weight: 1,
  },
  {
    id: 'acoso',
    question: '¿Sientes presión excesiva o trato intimidante de cobranza?',
    detail: 'La forma de cobro tambien se documenta para ordenar la respuesta.',
    category: 'Cobranza',
    riskWhen: 'si',
    weight: 2,
  },
  {
    id: 'fecha_limite',
    question: '¿Te dieron una fecha límite para pagar o responder?',
    detail: 'Las fechas límite ayudan a priorizar acciones y comunicaciones.',
    category: 'Urgencia',
    riskWhen: 'si',
    weight: 2,
  },
  {
    id: 'asesoria_previa',
    question: '¿Un abogado ya revisó tu caso?',
    detail: 'Si nadie lo revisó, el pre-diagnóstico ayuda a preparar la primera llamada.',
    category: 'Estrategia',
    riskWhen: 'no',
    weight: 1,
  },
]

export function evaluateDebtAnswers(answers: Record<string, DebtAnswerValue>): DebtDiagnosis {
  let score = 0
  let hasSevereSignal = false

  for (const question of debtEvaluatorQuestions) {
    const answer = answers[question.id]

    if (!answer) {
      continue
    }

    if (answer === question.riskWhen) {
      score += question.weight
      hasSevereSignal = hasSevereSignal || Boolean(question.severe)
      continue
    }

    if (answer === 'no_estoy_seguro') {
      score += Math.max(1, Math.ceil(question.weight / 2))
    }
  }

  if (hasSevereSignal || score >= 14) {
    return {
      level: 'alto',
      label: 'Riesgo alto',
      score,
      range: 'Prioridad: blindaje judicial y negociación documentada.',
      summary:
        'Hay señales que pueden requerir respuesta rápida. Conviene revisar documentos, fechas y riesgos antes de negociar.',
      options: [
        'Negociación Extrajudicial con Blindaje Judicial.',
        'Revisión de demanda, citación o documentos de cobro.',
        'Plan de respuesta para evitar decisiones precipitadas.',
      ],
      nextSteps: [
        'Reunir citaciones, cartas, contratos y estados de cuenta.',
        'No reconocer montos ni firmar acuerdos sin revision previa.',
        'Agendar una llamada para ordenar defensa y propuesta.',
      ],
    }
  }

  if (score >= 7) {
    return {
      level: 'moderado',
      label: 'Riesgo moderado',
      score,
      range: 'Margen de negociación: medio, con buena preparación documental.',
      summary:
        'Existen señales de presión financiera. Una propuesta ordenada puede mejorar tu margen y reducir improvisación.',
      options: [
        'Diagnostico de monto, acreedor y capacidad real de pago.',
        'Propuesta extrajudicial con soporte documental.',
        'Preparación para responder si el caso escala.',
      ],
      nextSteps: [
        'Organizar ingresos, gastos y documentos de la deuda.',
        'Definir una propuesta que puedas sostener.',
        'Registrar comunicaciones de cobranza relevantes.',
      ],
    }
  }

  return {
    level: 'inicial',
    label: 'Riesgo inicial',
    score,
    range: 'Margen de acuerdo temprano: alto si actuas con orden.',
    summary:
      'Todavia parece haber espacio para preparar estrategia antes de que el conflicto escale.',
    options: [
      'Orden documental de la deuda.',
      'Propuesta temprana de negociación.',
      'Monitoreo de señales de cobranza o riesgo judicial.',
    ],
    nextSteps: [
      'Confirmar monto, acreedor y fechas clave.',
      'Evitar acuerdos verbales sin respaldo escrito.',
      'Preparar una estrategia antes de nuevas llamadas o cartas.',
    ],
  }
}
