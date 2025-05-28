'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import FlashcardFlip from '@/components/FlashcardFlip'

type Flashcard = {
  id: string
  pergunta: string
  resposta: string
  nivel: string
}

export default function FlashcardsPage() {
  const { id } = useParams()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || typeof id !== 'string') return

    const fetchFlashcards = async () => {
      try {
        const res = await fetch(`/api/flashcards?resumoId=${id}`)
        if (!res.ok) throw new Error('Erro ao buscar flashcards')

        const data = await res.json()
        setFlashcards(data.flashcards || [])
      } catch (err) {
        setError('Erro ao buscar flashcards.')
      } finally {
        setLoading(false)
      }
    }

    fetchFlashcards()
  }, [id])

  if (loading) return <p className='p-8'>Carregando...</p>
  if (error) return <p className='p-8 text-red-600'>{error}</p>
  if (!flashcards.length) return <p className='p-8'>Nenhum flashcard encontrado.</p>

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((card) => (
        <FlashcardFlip
          key={card.id}
          front={card.pergunta}
          back={card.resposta}
        />
      ))}
    </div>
  )
}