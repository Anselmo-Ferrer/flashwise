'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateQuizPage() {
  const { id } = useParams()
  const router = useRouter()
  const [texto, setTexto] = useState('')

  useEffect(() => {
    const fetchResumo = async () => {
      const res = await fetch(`/api/summary/${id}`)
      const data = await res.json()
      setTexto(data.texto)
    }

    fetchResumo()
  }, [id])


  const handleCreateQuiz = async () => {

    const res = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: JSON.stringify(texto),
        nivel: 'Intermediario',
        quantidade: 5
      })
    })

    const data = await res.json()

    if (!res.ok || !data.perguntas) {
      alert('Erro ao gerar quiz')
      return
    }

    const saveRes = await fetch('/api/save-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumoId: id,
        quiz: data.perguntas
      })
    })

    if (saveRes.ok) {
      router.push(`/dashboard/summary/quiz/${id}`)
    } else {
      alert('Erro ao salvar flashcards no banco')
    }
    
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black mb-4">Gerar quiz</h1>
      <p className="mb-6 text-gray-600">quiz serão criados a partir do documento enviado</p>
      <button
        onClick={handleCreateQuiz}
        className='bg-[#734A00] text-white px-6 py-3 rounded-xl hover:bg-[#5a3700]'
      >
        Confirmar criação
      </button>
    </div>
  )
}