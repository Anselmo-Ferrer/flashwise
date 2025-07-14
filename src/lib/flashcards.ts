type Flashcard = {
  pergunta: string
  resposta: string
}

export async function generateFlashcards( texto: object, nivel: string = 'fácil', quantidade: number = 5 ): Promise<Flashcard[] | null> {
  const res = await fetch('/api/generate-flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto: JSON.stringify(texto), nivel, quantidade }),
  })

  const data = await res.json()
  return res.ok ? data.flashcards : null
}

export async function saveFlashcards( resumoId: string, flashcards: Flashcard[] ): Promise<boolean> {
  const res = await fetch('/api/save-flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumoId, flashcards }),
  })

  return res.ok
}