import { NextRequest, NextResponse } from 'next/server'
import { generateContractDocx } from '@/actions/docx'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const token = request.nextUrl.searchParams.get('token')

        if (!token) {
            return NextResponse.json({ error: 'Token es requerido' }, { status: 400 })
        }

        const result = await generateContractDocx(id, token)

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 })
        }

        const { base64, filename } = result.data
        const buffer = Buffer.from(base64, 'base64')

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error('[DownloadDocxAPI]', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
