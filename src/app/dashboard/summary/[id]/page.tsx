'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TbPencilStar } from "react-icons/tb";

type Summary = {
  id: string
  titulo: string
  texto: string
  createdAt: string
}

export default function SummaryDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || typeof id !== 'string') return

    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/summary/${id}`)
        if (!res.ok) {
          const { error } = await res.json()
          setError(error || 'Erro ao carregar resumo')
          return
        }

        const data = await res.json()
        setSummary(data)
      } catch (err) {
        setError('Erro de conexão com o servidor.')
      }
    }

    fetchSummary()
  }, [id])

  if (error) return <p className="p-8 text-red-600">{error}</p>
  if (!summary) return <p className="p-8">Carregando...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black">{summary.titulo}</h1>
      <p className="mt-4 whitespace-pre-wrap text-black">{summary.texto}</p>
    </div>
  )
}