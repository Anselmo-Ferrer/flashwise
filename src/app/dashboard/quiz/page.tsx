'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function QuizPage() {
  const router = useRouter()
  const [resumos, setResumos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      if (!userId) return

      const res = await fetch(`/api/quiz?userId=${userId}`)
      const data = await res.json()
      console.log(data)
      setResumos(data.resumos || [])
      setLoading(false)
    }

    fetchQuiz()
  }, [])

  if (loading) return <p className="p-8">Carregando...</p>

  return (
    <div className="p-8 space-y-8">
      {resumos.map((resumo) => (
        (resumo.perguntas.length > 1 && 
        <div className="bg-white" key={resumo.id} onClick={() => router.push(`/dashboard/quiz/${resumo.id}`)}>
          <h2 className="text-xl font-bold mb-3">{resumo.titulo}</h2>
        </div>
        )
      ))}
    </div>
  )
}