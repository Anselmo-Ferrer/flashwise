'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function FlashcardsPage() {
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlashcards = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log(session)
      const userId = session?.user?.id

      if (!userId) return

      const res = await fetch(`/api/flashcards?userId=${userId}`)
      console.log(res)
      const data = await res.json()
      console.log(data)
      setFlashcards(data.resumos || [])
      setLoading(false)
    }

    fetchFlashcards()
  }, [])

  if (loading) return <p className="p-8 text-black">Carregando...</p>

  return (
    <div className="p-8 space-y-8">
      {flashcards.map((resumo) => (
        (resumo.flashcards.length > 1 && 
          <div className="bg-white" key={resumo.id} onClick={() => router.push(`/dashboard/flashcards/${resumo.id}`)}>
            <h2 className="text-xl font-bold mb-3 text-black">{resumo.titulo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            </div>
          </div>
        )
      ))}
    </div>
  )
}