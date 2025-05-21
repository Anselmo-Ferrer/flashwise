export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Arquivo PDF inválido ou ausente.' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    const data = await pdfParse(buffer)

    return NextResponse.json({
      text: data.text,
      numpages: data.numpages,
      info: data.info,
    })
  } catch (error) {
    console.error('Erro ao processar PDF:', error)
    return NextResponse.json({ error: 'Erro ao processar PDF' }, { status: 500 })
  }
}