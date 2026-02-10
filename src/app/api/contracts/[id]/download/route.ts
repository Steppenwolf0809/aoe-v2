import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getContractSignedUrl } from '@/lib/storage'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get contract and validate token
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .eq('download_token', token)
      .single()

    if (error || !contract) {
      return NextResponse.json(
        { error: 'Contrato no encontrado o token inválido' },
        { status: 404 }
      )
    }

    // Verify token not expired
    const expiresAt = new Date(contract.download_token_expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Token de descarga expirado' },
        { status: 410 }
      )
    }

    // Get signed URL
    const signedUrl = await getContractSignedUrl(id)

    // Update status to DOWNLOADED if not already
    if (contract.status === 'GENERATED') {
      await supabase
        .from('contracts')
        .update({ status: 'DOWNLOADED' })
        .eq('id', id)
    }

    // Redirect to signed URL
    return NextResponse.redirect(signedUrl)
  } catch (error) {
    console.error('[Contract Download API]', error)
    return NextResponse.json(
      { error: 'Error al descargar el contrato' },
      { status: 500 }
    )
  }
}
