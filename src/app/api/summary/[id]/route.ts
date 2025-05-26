import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Função com estrutura correta para acessar `params` no App Router (API route)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: 'Missing summary ID' }, { status: 400 })
  }

  try {
    const summary = await prisma.resumo.findUnique({
      where: { id },
      select: {
        id: true,
        titulo: true,
        texto: true,
        createdAt: true,
      },
    })

    if (!summary) {
      return NextResponse.json({ error: 'Resumo não encontrado' }, { status: 404 })
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Erro ao buscar resumo por ID:', error)
    return NextResponse.json({ error: 'Erro interno ao buscar resumo' }, { status: 500 })
  }
}