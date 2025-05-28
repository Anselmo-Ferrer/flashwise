import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { texto } = await req.json()

  const prompt = `
  Resuma o conteúdo abaixo de forma didática e organizada no mesmo idioma do documento original.

  Instruções:
  • Destaque conceitos e termos importantes.
  • Não economize no número de tópicos e subtópicos.
  • Varie a estrutura conforme o conteúdo: use listas, textos explicativos e enumerações quando necessário.
  • Retorne os dados no formato JSON abaixo, sem adicionar comentários ou explicações fora do JSON.

  Sobre os campos:
  - "formato": define o tipo de apresentação do conteúdo.
    - "texto": parágrafo explicativo.
    - "bullets": lista com marcadores (•).
    - "numerada": lista numerada (1., 2., 3.).

  - "texto": pode ser:
    - uma string (se "formato" for "texto"),
    - ou uma lista de strings (se "formato" for "bullets" ou "numerada").

  Exemplo de estrutura esperada:

  {
    "titulo": "Ética Profissional",
    "subtitulo": "Fundamentos e aplicação na Computação",
    "topicos": [
      {
        "titulo": "Princípios e Fundamentos da Ética",
        "subtitulo": "Conceitos básicos e campos de estudo",
        "subtopicos": [
          {
            "titulo": "Ética e Moral",
            "formato": "bullets",
            "texto": [
              "Ética: estudo filosófico dos costumes e ações humanas.",
              "Moral: conjunto de valores e normas praticadas em uma sociedade.",
              "A ética estuda e avalia a moral."
            ]
          },
          {
            "titulo": "Etimologia",
            "formato": "bullets",
            "texto": [
              "Éthos (grego): hábito, costume.",
              "Mos (latim): moral, costume."
            ]
          },
          {
            "titulo": "Campos da Ética",
            "formato": "numerada",
            "texto": [
              "Questões gerais (ex: liberdade, valor, bem).",
              "Questões aplicadas (ex: ética profissional, bioética)."
            ]
          },
          {
            "titulo": "Ação Ética",
            "formato": "bullets",
            "texto": [
              "Autonomia, consciência crítica e resistência a pressões sociais.",
              "Orientada ao bem comum.",
              "Não apenas obedecer regras sociais, mas refletir sobre elas."
            ]
          }
        ]
      },
      {
        "titulo": "Dimensões Éticas Profissionais",
        "subtitulo": "Aplicação no campo social e profissional",
        "subtopicos": [
          {
            "titulo": "Princípios Profissionais",
            "formato": "bullets",
            "texto": [
              "Contribuir para o bem-estar coletivo.",
              "Ser honesto, justo e confiável.",
              "Respeitar privacidade, propriedade e contratos."
            ]
          },
          {
            "titulo": "Ética Profissional",
            "formato": "texto",
            "texto": "Relaciona-se à prática ética nas atividades produtivas, com responsabilidade social e respeito à dignidade humana."
          }
        ]
      },
      {
        "titulo": "Ética em Computação",
        "subtitulo": "Desafios e responsabilidades no setor tecnológico",
        "subtopicos": [
          {
            "titulo": "Impacto da Computação",
            "formato": "texto",
            "texto": "Tecnologias computacionais afetam decisões, comportamentos e valores, exigindo consciência ética dos profissionais."
          },
          {
            "titulo": "Questões Éticas em Computação",
            "formato": "numerada",
            "texto": [
              "Desenvolvimento de sistemas: entrega com qualidade, participação do cliente.",
              "Automação de decisões: correta distribuição entre máquina e humano.",
              "Violação da informação: vírus, invasões, privacidade.",
              "Uso da internet: garantir veracidade, segurança e integridade.",
              "Sistemas críticos: erros podem causar morte ou grandes prejuízos."
            ]
          }
        ]
      }
    ]
  }

  Texto original:
  """${texto}"""

  Retorne **apenas** o JSON no formato acima.
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
      model: 'mistralai/devstral-small:free',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  console.log('Resposta do modelo:', content)
  try {
    const match = content?.match(/\{[\s\S]*\}/)
    const estrutura = match ? JSON.parse(match[0]) : {}
    return NextResponse.json({ estrutura })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao parsear JSON' }, { status: 500 })
  }
} 