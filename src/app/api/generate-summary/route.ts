import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { texto } = await req.json()

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Flashwise',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-8b-instruct:free',
      messages: [
        {
          role: 'user',
          content: `Resuma em português claro e didático o seguinte conteúdo:\n\n${texto}`,
        },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: data.error || 'Erro ao gerar resumo' }, { status: 500 })
  }

  const resumo = data.choices?.[0]?.message?.content || 'Sem resposta.'

  return NextResponse.json({ resumo })
}