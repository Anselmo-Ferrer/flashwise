import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { resumoId, quiz } = await req.json()

    if (!resumoId || !quiz || !Array.isArray(quiz)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    const created = await prisma.pergunta.createMany({
      data: quiz.map((card: any) => ({
        enunciado: card.enunciado,
        alternativaA: card.alternativaA,
        alternativaB: card.alternativaB,
        alternativaC: card.alternativaC,
        alternativaD: card.alternativaD,
        correta: card.correta,
        explicacao: card.explicacao,
        nivel: card.nivel,
        resumoId: resumoId,
      }))
    })

    return NextResponse.json({ created }, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar quiz:', error)
    return NextResponse.json({ error: 'Erro interno ao salvar quiz' }, { status: 500 })
  }
}