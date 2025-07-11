'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Estructure = {
  topicos: {
    titulo: string
    subtopicos: {
      titulo: string
      texto: string | string[]
    }[]
  }[]
}

export default function CreateFlashcardsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [texto, setTexto] = useState<Estructure | null>(null)

  useEffect(() => {
    const fetchResumo = async () => {
      const res = await fetch(`/api/summary/${id}`)
      const data = await res.json()
      console.log(data)
      setTexto(data.texto)
    }

    fetchResumo()
  }, [id])

  const handleCreateFlashcards = async () => {
    if (!texto) return

    // 1. Gera flashcards com IA
    const res = await fetch('/api/generate-flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: JSON.stringify(texto),
        nivel: 'fácil',
        quantidade: 5,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.flashcards) {
      alert('Erro ao gerar flashcards')
      return
    }

    // 2. Salva no banco
    const saveRes = await fetch('/api/save-flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumoId: id,
        flashcards: data.flashcards,
      }),
    })

    if (saveRes.ok) {
      router.push(`/dashboard/summary/flashcards/${id}`)
    } else {
      alert('Erro ao salvar flashcards no banco')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black mb-4">Gerar Flashcards</h1>
      <p className="mb-6 text-gray-600">Flashcards serão criados a partir dos subtópicos do resumo.</p>
      <button
        onClick={handleCreateFlashcards}
        className='bg-[#734A00] text-white px-6 py-3 rounded-xl hover:bg-[#5a3700]'
      >
        Confirmar criação
      </button>
    </div>
  )
}