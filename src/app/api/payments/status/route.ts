import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkTransactionStatus, confirmPayment } from '@/lib/payphone'
import { isPaymentApproved } from '@/lib/validations/payment'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { prepareContractDocxDeliveryAdmin } from '@/actions/docx'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contractId')

    if (!contractId) {
        return NextResponse.json({ error: 'Missing contractId' }, { status: 400 })
    }

    try {
        const adminSupabase = createAdminClient()

        // 1. Obtener contrato
        const { data: contract, error: fetchError } = await adminSupabase
            .from('contracts')
            .select('id, status, payment_id, download_token')
            .eq('id', contractId)
            .single()

        if (fetchError || !contract) {
            return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
        }

        // 2. Si ya fue procesado, devolver redirect
        if (contract.status === 'GENERATED' || contract.status === 'DOWNLOADED') {
            return NextResponse.json({
                success: true,
                status: contract.status,
                redirectUrl: `/contratos/pago/exito?token=${contract.download_token}`
            })
        }

        if (contract.status === 'PAID') {
            // Intentar preparar DOCX y token de descarga
            const docxResult = await prepareContractDocxDeliveryAdmin(contractId)
            if (docxResult.success) {
                return NextResponse.json({
                    success: true,
                    status: 'GENERATED',
                    redirectUrl: `/contratos/pago/exito?token=${docxResult.data.downloadToken}`
                })
            }
            return NextResponse.json({
                success: true,
                status: 'PAID',
                redirectUrl: `/contratos/pago/exito?contractId=${contractId}&pending=true`
            })
        }

        // 3. Si sigue PENDING_PAYMENT y tiene payment_id (cliente tx id),
        // consultamos el webhook payphone-sale a traves de checkTransactionStatus
        if (contract.status === 'PENDING_PAYMENT' && contract.payment_id) {
            try {
                const statusResponse = await checkTransactionStatus(contract.payment_id)

                // Verificamos si Payphone dice "Approved"
                if (isPaymentApproved(statusResponse.statusCode)) {
                    // Confirmar el pago
                    await confirmPayment({
                        id: statusResponse.transactionId,
                        clientTxId: contract.payment_id,
                    })

                    // Actualizar BD
                    await adminSupabase
                        .from('contracts')
                        .update({
                            status: 'PAID',
                            payment_id: statusResponse.transactionId, // Actualizar al ID real
                            amount: PRECIO_CONTRATO_BASICO,
                        })
                        .eq('id', contract.id)

                    // Preparar DOCX y token de descarga
                    const docxResult = await prepareContractDocxDeliveryAdmin(contractId)
                    if (docxResult.success) {
                        return NextResponse.json({
                            success: true,
                            status: 'GENERATED',
                            redirectUrl: `/contratos/pago/exito?token=${docxResult.data.downloadToken}`
                        })
                    } else {
                        return NextResponse.json({
                            success: true,
                            status: 'PAID',
                            redirectUrl: `/contratos/pago/exito?contractId=${contractId}&pending=true`
                        })
                    }
                }
            } catch (e) {
                // Ignoramos errores de checkTransactionStatus para que el polling continue
                console.error('[Polling API] checkTransactionStatus error:', e)
            }
        }

        // 4. Aún no se paga o no ha cambiado
        return NextResponse.json({
            success: false,
            status: contract.status,
            pending: true
        })

    } catch (error) {
        console.error('[Polling API Error]:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
