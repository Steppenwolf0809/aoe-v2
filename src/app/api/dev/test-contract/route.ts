import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateContractStatus } from '@/actions/contracts'
import { generateContractPdf } from '@/actions/pdf'

/**
 * DEV ONLY: Test contract PDF generation without payment
 *
 * Usage:
 * POST /api/dev/test-contract
 * Body: { "contractId": "uuid-here" }
 *
 * This bypasses PayPhone and generates the PDF directly
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    const { contractId } = await request.json()

    if (!contractId) {
      return NextResponse.json(
        { error: 'contractId is required' },
        { status: 400 }
      )
    }

    // Verify user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get contract to verify ownership
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !contract) {
      return NextResponse.json(
        { error: 'Contract not found or access denied' },
        { status: 404 }
      )
    }

    // Mark as paid (dev mode)
    const updateResult = await updateContractStatus(contractId, {
      status: 'PAID',
      payment_id: `DEV-${Date.now()}`,
      amount: 11.99,
    })

    if (!updateResult.success) {
      return NextResponse.json(
        { error: updateResult.error },
        { status: 500 }
      )
    }

    // Generate PDF
    const pdfResult = await generateContractPdf(contractId)

    if (!pdfResult.success) {
      return NextResponse.json(
        { error: pdfResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contract PDF generated successfully (DEV MODE)',
      data: {
        contractId,
        pdfUrl: pdfResult.data.pdfUrl,
        downloadToken: pdfResult.data.downloadToken,
        downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/contracts/${contractId}/download?token=${pdfResult.data.downloadToken}`,
      },
    })
  } catch (error) {
    console.error('[Dev Test Contract]', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check if dev mode is enabled
 */
export async function GET() {
  return NextResponse.json({
    devMode: process.env.NODE_ENV !== 'production',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Dev endpoints are disabled in production'
        : 'Dev endpoints are enabled',
  })
}
