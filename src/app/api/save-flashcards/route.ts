import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { resumoId, flashcards } = await req.json()

    if (!resumoId || !flashcards || !Array.isArray(flashcards)) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    const created = await prisma.flashcard.createMany({
      data: flashcards.map((card: any) => ({
        pergunta: card.pergunta,
        resposta: card.resposta,
        nivel: card.nivel,
        resumoId: resumoId,
      }))
    })

    return NextResponse.json({ created }, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar flashcards:', error)
    return NextResponse.json({ error: 'Erro interno ao salvar flashcards' }, { status: 500 })
  }
}