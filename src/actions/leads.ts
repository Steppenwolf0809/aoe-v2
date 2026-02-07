'use server'

import { createClient } from '@/lib/supabase/server'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function saveLead(data: {
  email?: string
  phone?: string
  source: string
  calculatorType?: string
  context?: Record<string, unknown>
}): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        email: data.email,
        phone: data.phone,
        source: data.source,
        calculator_type: data.calculatorType,
        data: data.context,
      })
      .select('id')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: { id: lead.id } }
  } catch (error) {
    console.error('[saveLead]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

export async function trackCalculatorUse(data: {
  type: string
  inputs: Record<string, unknown>
  result: Record<string, unknown>
}): Promise<ActionResult<null>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('calculator_sessions').insert({
      type: data.type,
      inputs: data.inputs,
      result: data.result,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: null }
  } catch (error) {
    console.error('[trackCalculatorUse]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
