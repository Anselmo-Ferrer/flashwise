'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function QuizPage() {
  const { id } = useParams()
  const [perguntas, setPerguntas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [respostasSelecionadas, setRespostasSelecionadas] = useState<Record<number, string>>({})
  const [respostasVerificadas, setRespostasVerificadas] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return
      const res = await fetch(`/api/quiz/${id}`)
      const data = await res.json()
      setPerguntas(data.perguntas || [])
      setLoading(false)
    }

    fetchQuiz()
  }, [])

  const handleSelecionar = (index: number, alternativa: string) => {
    if (respostasVerificadas[index]) return
    setRespostasSelecionadas(prev => ({ ...prev, [index]: alternativa }))
  }

  const handleResponder = (index: number) => {
    if (!respostasSelecionadas[index]) return
    setRespostasVerificadas(prev => ({ ...prev, [index]: true }))
  }

  const handleTentarNovamente = (index: number) => {
    setRespostasSelecionadas(prev => {
      const novo = { ...prev }
      delete novo[index]
      return novo
    })
    setRespostasVerificadas(prev => {
      const novo = { ...prev }
      delete novo[index]
      return novo
    })
  }

  const getCor = (index: number, letra: string, correta: string) => {
    const selecionada = respostasSelecionadas[index]
    const verificada = respostasVerificadas[index]

    if (verificada) {
      if (letra === correta) return 'bg-green-100 border border-green-500'
      if (letra === selecionada) return 'bg-red-100 border border-red-500'
      return 'bg-[#FFF7E8]'
    } else {
      if (letra === selecionada) return 'bg-[#FFE0A7]'
      return 'bg-[#FFF7E8] hover:bg-[#FFE0A7]'
    }
  }

  if (loading) return <p className="p-8">Carregando...</p>

  return (
    <div className="p-8 space-y-8">
      {perguntas.map((pergunta: any, index: number) => (
        <div key={index} className="bg-white rounded-xl shadow p-4">
          <p className="text-black font-semibold">{index + 1}. {pergunta.enunciado}</p>
          <ul className="mt-2 text-sm space-y-2">
            {['A', 'B', 'C', 'D'].map((letra) => (
              <li
                key={letra}
                onClick={() => handleSelecionar(index, letra)}
                className={`text-[14px] cursor-pointer transition-all px-4 py-3 rounded-md text-[#734A00] ${getCor(index, letra, pergunta.correta)}`}
              >
                {letra}. {pergunta[`alternativa${letra}`]}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-3 flex-wrap">
            {!respostasVerificadas[index] ? (
              <button
                onClick={() => handleResponder(index)}
                className='bg-[#734A00] cursor-pointer text-[14px] text-[#FFE0A7] px-4 py-2 rounded-xl hover:brightness-110'
              >
                Responder
              </button>
            ) : (
              <>
                <div className="mt-3 text-sm text-[#734A00] bg-[#FFF7E8] p-3 rounded-md w-full">
                  <p><strong>Resposta correta:</strong> {pergunta.correta}</p>
                  <p className="mt-1"><strong>Explicação:</strong> {pergunta.explicacao}</p>
                </div>
                <button
                  onClick={() => handleTentarNovamente(index)}
                  className="bg-gray-200 text-sm cursor-pointer px-4 py-2 rounded-xl text-[#734A00] hover:bg-gray-300"
                >
                  Responder novamente
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}