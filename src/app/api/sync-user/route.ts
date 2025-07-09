import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { id, email } = await req.json()

  if (!id || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const user = await prisma.user.upsert({
  where: { email },
  update: {},
  create: {
    id,
    email,
    name: '',       // explicita o campo opcional
    password: ''    // idem
  }
})

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erro ao sincronizar usuário:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}