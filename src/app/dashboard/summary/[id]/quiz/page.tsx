'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Pergunta = {
  id: string
  enunciado: string
  alternativaA: string
  alternativaB: string
  alternativaC: string
  alternativaD: string
  correta: string
  explicacao: string
  nivel: string
}

export default function QuizPage() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState<Pergunta[]>([])
  const [indice, setIndice] = useState(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null)
  const [acertou, setAcertou] = useState<boolean | null>(null)
  const [pontuacao, setPontuacao] = useState(0)

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/quiz?resumoId=${id}`)
      const data = await res.json()

      if (!data?.perguntas?.length) {
        console.warn("Nenhuma pergunta encontrada ou formato inválido:", data)
        return
      }

      setQuiz(data.perguntas)
    }

    fetchQuiz()
  }, [id])

  const handleResposta = (letra: string) => {
    if (respostaSelecionada) return

    setRespostaSelecionada(letra)
    const acertouResposta = letra === quiz[indice].correta
    setAcertou(acertouResposta)
    if (acertouResposta) setPontuacao((p) => p + 1)

    setTimeout(() => {
      setRespostaSelecionada(null)
      setAcertou(null)
      if (indice + 1 < quiz.length) {
        setIndice((i) => i + 1)
      } else {
        alert(`Quiz finalizado! Você acertou ${pontuacao + (acertouResposta ? 1 : 0)} de ${quiz.length}`)
      }
    }, 2000)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {quiz.length > 0 ? (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pergunta {indice + 1} de {quiz.length}</h2>
          <p className="text-gray-800 font-medium mb-6">{quiz[indice].enunciado}</p>
          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((letra) => {
              const texto = quiz[indice][`alternativa${letra}` as 'alternativaA']
              const isSelecionada = respostaSelecionada === letra
              const isCorreta = letra === quiz[indice].correta
              const bg = isSelecionada
                ? isCorreta
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'

              return (
                <button
                  key={letra}
                  className={`w-full text-left px-4 py-3 rounded ${bg} transition text-black`}
                  onClick={() => handleResposta(letra)}
                  disabled={!!respostaSelecionada}
                >
                  <strong>{letra})</strong> {texto}
                </button>
              )
            })}
          </div>
          {respostaSelecionada && (
            <p className="mt-4 text-sm text-gray-600 italic">
              {acertou
                ? 'Resposta correta!'
                : `Errado. Explicação: ${quiz[indice].explicacao}`}
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Carregando perguntas...</p>
      )}
    </div>
  )
}