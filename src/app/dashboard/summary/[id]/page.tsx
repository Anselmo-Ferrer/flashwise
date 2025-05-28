'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TbPencilStar } from "react-icons/tb";
import { CiSquarePlus } from "react-icons/ci";
import { BsArrowReturnLeft } from "react-icons/bs";
import clsx from 'clsx';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ScrollView from '@/components/ui/ScrollView';

type Summary = {
  id: string
  titulo: string
  texto: string
  createdAt: string
}

type Estructure = {
  titulo: string
  subtitulo: string
  topicos: {
    titulo: string
    subtitulo: string
    subtopicos: {
      titulo: string
      formato: 'texto' | 'bullets' | 'numerada'
      texto: string | string[]
    }[]
  }[]
}

export default function SummaryDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [estructure, setEstructure] = useState<Estructure | null>(null)
  const [error, setError] = useState('')

  const [expandedTopics, setExpandedTopics] = useState<number[]>([])

  const toggleTopic = (index: number) => {
    if (expandedTopics.includes(index)) {
      setExpandedTopics(expandedTopics.filter(i => i !== index))
    } else {
      setExpandedTopics([...expandedTopics, index])
    }
  }

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
        console.log(data.estrutura)
        setEstructure(data.estrutura)
        setSummary(data)
      } catch (err) {
        setError('Erro de conexão com o servidor.')
      }
    }

    fetchSummary()
  }, [id])

  if (error) return <p className="p-8 text-red-600">{error}</p>
  if (!summary) return <div className='w-full h-[600px] flex items-center justify-center'><LoadingSpinner /></div>

  return (
    <div className="px-8">
      <div className='w-full flex bg-white items-center justify-between p-6 rounded-2xl mb-10'>
        <div className='flex flex-col justify-center'>
          <h2 className='text-black text-[18px] font-semibold'>{estructure?.titulo}</h2>
          <h3 className='text-[#7D7D7D] text-[14px]'>{estructure?.subtitulo}</h3>
        </div>
        <div className='flex items-center gap-3'>
          <div className='border-2 border-[#F1F1F1] rounded-2xl flex items-center gap-5 w-[350px] h-[48px] px-4 py-3'>
            <TbPencilStar color='#7D7D7D' size={20} />
            <input type="text" placeholder='Aks to ai' className='placeholder-[#7D7D7D] w-full text-[#7D7D7D] placeholder:text-sm  focus:outline-none'/>
          </div>
          <button
            onClick={() => router.push(`/dashboard/summary/${id}/create-flashcards`)}
            className='bg-[#FFF7E8] text-[14px] cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#FFE0A7] w-[200px] flex items-center gap-2 py-3 px-4 rounded-xl text-[#734A00]'
          >
            <CiSquarePlus size={24} color='#FFA500'/>
            Create Flashcards
          </button>
          <button
            onClick={() => router.push(`/dashboard/summary/${id}/create-quiz/`)}
            className='bg-[#FFF7E8] text-[14px] cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#FFE0A7] w-[200px] flex items-center gap-2 py-3 px-4 rounded-xl text-[#734A00]'
          >
            <CiSquarePlus size={24} color='#FFA500'/>
            Create Quiz
          </button>
        </div>
      </div>
      
      <ScrollView className='h-fit'>
      {estructure?.topicos.map((item, index) => (
        <div
          key={index}
          onClick={() => toggleTopic(index)}
          className={clsx(
            "mt-6 bg-white p-3 rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between",
            expandedTopics.includes(index) ? "h-fit" : "h-[100px] overflow-hidden"
          )}
        >
          <h2 className="text-[18px] text-black font-semibold">{item.titulo}</h2>
          <div className={clsx(
            'w-full flex items-end',
            expandedTopics.includes(index) ? "flex-col items-start mt-2" : "flex-row"
          )}>
            <h3 className='text-black text-[12px] w-[50%]'>{item.subtitulo}</h3>
            {expandedTopics.includes(index) && (
              <ul className="mt-4 gap-10 w-full space-y-2 border-t-1 py-4">
                {item.subtopicos.map((sub, subIndex) => (
                  <li key={subIndex} className='mb-6'>
                    <p className="font-semibold text-black text-[14px] mb-1">{sub.titulo}</p>
                    {(() => {
                      if (sub.formato === 'texto' && typeof sub.texto === 'string') {
                        return <p className="text-[#7D7D7D] text-[12px]">{sub.texto}</p>
                      }

                      if (
                        (sub.formato === 'bullets' || sub.formato === 'numerada') &&
                        Array.isArray(sub.texto)
                      ) {
                        return (
                          <ul
                            className={clsx(
                              "pl-4 text-[#7D7D7D] text-[12px] space-y-1",
                              {
                                "list-disc": sub.formato === 'bullets',
                                "list-decimal": sub.formato === 'numerada',
                              }
                            )}
                          >
                            {sub.texto.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )
                      }

                      return <p className="text-red-500 text-[12px]">Formato desconhecido</p>
                    })()}
                  </li>
                ))}
              </ul>
            )}
            <div className='flex w-full items-center justify-end gap-1'>
              <p className='text-[#734A00] text-[14px]'>{expandedTopics.includes(index) ? 'hide content' : 'see content'}</p>
              <BsArrowReturnLeft color='#734A00' size={16} className={clsx(
                'mt-1 transition-transform duration-300',
                expandedTopics.includes(index) ? 'rotate-90 scale-y-[-1]' : 'rotate-270'
              )}/>
            </div>
          </div>

        </div>
      ))}
      </ScrollView>
    </div>
  )
}