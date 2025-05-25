import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { texto, nivel, quantidade } = await req.json();

  if (!texto || !nivel || !quantidade) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const prompt = `
    Gere exatamente ${quantidade} perguntas de múltipla escolha com base no seguinte conteúdo:

    """${texto}"""

    Cada pergunta deve ser um objeto JSON contendo os seguintes campos:
    - "enunciado": o texto da pergunta.
    - "alternativaA", "alternativaB", "alternativaC", "alternativaD": quatro opções de resposta.
    - "correta": a letra correspondente à alternativa correta (ex: "A", "B", "C" ou "D").
    - "explicacao": uma explicação clara sobre a resposta correta.
    - "nivel": defina como "${nivel}".

    Retorne apenas o array JSON, sem nenhum comentário, explicação ou texto fora do JSON.

    Formato de exemplo:
    [
      {
        "enunciado": "O que é uma árvore binária?",
        "alternativaA": "Uma estrutura com três filhos por nó",
        "alternativaB": "Uma estrutura de dados sem hierarquia",
        "alternativaC": "Uma estrutura onde cada nó tem no máximo dois filhos",
        "alternativaD": "Um tipo de gráfico",
        "correta": "C",
        "explicacao": "Na árvore binária, cada nó pode ter no máximo dois filhos, denominados filho esquerdo e direito.",
        "nivel": "fácil"
      }
    ]
  `;

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
          content: prompt,
        },
      ],
    }),
  });

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '[]';

  try {
    const perguntas = JSON.parse(raw);
    return NextResponse.json({ perguntas });
  } catch (error) {
    console.error('Erro ao fazer parse do JSON:', error);
    return NextResponse.json({ error: 'Erro ao fazer parse do JSON gerado' }, { status: 500 });
  }
}