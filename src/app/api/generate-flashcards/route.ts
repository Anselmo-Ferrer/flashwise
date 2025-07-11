import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { texto, nivel, quantidade } = await req.json()

  if (!texto || !nivel || !quantidade) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const prompt = `
    Gere exatamente ${quantidade} flashcards baseados no seguinte conteúdo:

    """${texto}"""

    Cada flashcard deve ser um objeto com os campos: "pergunta", "resposta" e "nivel" (como string, usando o valor "${nivel}").
    Retorne a resposta como um array JSON puro, sem nenhuma explicação antes ou depois.
    Exemplo de formato esperado:
    [
      {
        "pergunta": "O que é uma árvore binária?",
        "resposta": "É uma estrutura de dados onde cada nó tem no máximo dois filhos.",
        "nivel": "fácil"
      }
    ]
    `

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Flashwise',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: 'user',
          content: prompt
        },
      ],
    }),
  })

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''
  const match = content.match(/\[\s*{[\s\S]*?}\s*]/)

  if (!match) {
    return NextResponse.json({ error: 'Erro ao analisar resposta da IA' }, { status: 500 })
  }

  try {
    const flashcards = JSON.parse(match[0])
    return NextResponse.json({ flashcards })
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao fazer parse do JSON gerado' }, { status: 500 })
  }
}