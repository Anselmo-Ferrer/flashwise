type Pergunta = {
  pergunta: string
  alternativas: string[]
  respostaCorreta: string
}

export async function generateQuiz( texto: object, nivel: string = 'Intermediario', quantidade: number = 5 ): Promise<Pergunta[] | null> {
  const res = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto: JSON.stringify(texto), nivel, quantidade }),
  })

  const data = await res.json()
  return res.ok ? data.perguntas : null
}

export async function saveQuiz( resumoId: string, quiz: Pergunta[] ): Promise<boolean> {
  const res = await fetch('/api/save-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumoId, quiz }),
  })

  return res.ok
}