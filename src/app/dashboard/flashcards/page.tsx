'use client'

import FlashcardFlip from "@/components/FlashcardFlip"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function FlashcardsPage() {
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
        <div key={resumo.id}>
          <h2 className="text-xl font-bold mb-3 text-black">{resumo.titulo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumo.flashcards.map((card: any) => (
              <FlashcardFlip key={card.id} front={card.pergunta} back={card.resposta} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}