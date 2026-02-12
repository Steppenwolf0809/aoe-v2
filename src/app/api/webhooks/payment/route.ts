import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { payphoneWebhookSchema, isPaymentApproved } from '@/lib/validations/payment'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[PayPhone Webhook] Received:', body)

    const validated = payphoneWebhookSchema.safeParse(body)
    if (!validated.success) {
      console.error('[PayPhone Webhook] Invalid payload:', validated.error)
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }

    const payload = validated.data
    const supabase = createAdminClient()

    // Look up contract by clientTransactionId stored in payment_id
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('*')
      .eq('payment_id', payload.clientTransactionId)
      .single()

    if (fetchError || !contract) {
      // Fallback: try splitting the old format (contractId-timestamp)
      const legacyContractId = payload.clientTransactionId.split('-')[0]
      if (legacyContractId) {
        const { data: legacyContract } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', legacyContractId)
          .single()

        if (legacyContract && isPaymentApproved(payload.statusCode) &&
            (legacyContract.status === 'DRAFT' || legacyContract.status === 'PENDING_PAYMENT')) {
          await supabase
            .from('contracts')
            .update({
              status: 'PAID',
              payment_id: payload.id,
              amount: PRECIO_CONTRATO_BASICO,
            })
            .eq('id', legacyContractId)

          return NextResponse.json({ success: true, message: 'Payment processed (legacy)' })
        }
      }

      console.error('[PayPhone Webhook] Contract not found for txId:', payload.clientTransactionId)
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      )
    }

    if (
      isPaymentApproved(payload.statusCode) &&
      (contract.status === 'DRAFT' || contract.status === 'PENDING_PAYMENT')
    ) {
      console.log('[PayPhone Webhook] Processing payment for contract:', contract.id)
      await supabase
        .from('contracts')
        .update({
          status: 'PAID',
          payment_id: payload.id,
          amount: PRECIO_CONTRATO_BASICO,
        })
        .eq('id', contract.id)

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
      })
    }

    console.log('[PayPhone Webhook] Payment status:', payload.status, 'Contract status:', contract.status)
    return NextResponse.json({
      success: true,
      message: 'Webhook received',
    })
  } catch (error) {
    console.error('[PayPhone Webhook] Error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
