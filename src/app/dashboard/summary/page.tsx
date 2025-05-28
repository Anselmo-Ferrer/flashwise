'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LuSearch } from "react-icons/lu";
import { CiSquarePlus } from "react-icons/ci";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { AiOutlineMore } from "react-icons/ai";
import { BiSubdirectoryRight } from "react-icons/bi";

type Summary = {
  id: string
  titulo: string
  texto: string
}

export default function SummaryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [summaries, setSummaries] = useState<Summary[]>([])

  // ✅ Função para buscar os resumos do usuário
  const handleGetSummary = async (userId: string) => {
  try {
    const res = await fetch(`/api/summary?userId=${userId}`)
    if (!res.ok) throw new Error('Erro ao buscar summaries')

    const data = await res.json()
    console.log('Resposta da API:', data)

    // Usa "summary" como no retorno real
    setSummaries(Array.isArray(data.summary) ? data.summary : [])
  } catch (error) {
    console.error('Erro ao buscar summaries:', error)
    setSummaries([]) // fallback seguro
  }
}

const handleClickSummary = async (summaryId: string) => {
  router.push(`/dashboard/summary/${summaryId}`)
}

const handleDeleteSummary = async (summaryId: string) => {
  const confirmDelete = confirm('Tem certeza que deseja deletar este resumo?')
  if (!confirmDelete) return

  try {
    const res = await fetch(`/api/summary/${summaryId}`, {
      method: 'DELETE'
    })

    if (!res.ok) {
      throw new Error('Erro ao deletar resumo')
    }

    // Remove o resumo da lista localmente
    setSummaries(prev => prev.filter(item => item.id !== summaryId))
  } catch (error) {
    console.error('Erro ao deletar resumo:', error)
    alert('Erro ao deletar resumo')
  }
}

  // ✅ Checa sessão e busca summaries
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
      } else {
        const { id, email } = session.user
        setUserEmail(email || '')
        setUserId(id || '')

        // Sincroniza o usuário no banco
        await fetch('/api/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, email, name: '', password: '' })
        })

        await handleGetSummary(id)
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  return (
    <div className="w-full">
      <div className='w-full flex bg-white items-center justify-between p-6 rounded-2xl mb-10'>
        <h1 className='text-black font-semibold text-[20px]'>Summmaries</h1>
        <div className='flex items-center gap-3'>
          <div className='border-2 border-[#F1F1F1] rounded-2xl flex items-center gap-5 w-[350px] h-[48px] px-4 py-3'>
            <LuSearch color='#7D7D7D' size={20} />
            <input type="text" placeholder='Search summary' className='placeholder-[#7D7D7D] text-[#7D7D7D] placeholder:text-sm  focus:outline-none'/>
          </div>
          <div className='flex items-center gap-1'>
            <p className='text-[#7D7D7D] text-[10px]'>sort by</p>
            <p className='text-[#454545] text-[12px]'>Newest</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/summary/create-summary')}
            className='bg-[#FFF7E8] text-[14px] cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#FFE0A7] w-[200px] flex items-center gap-2 py-3 px-4 rounded-xl text-[#734A00]'
          >
            <CiSquarePlus size={24} color='#FFA500'/>
            Create summary
          </button>
        </div>
      </div>

      {loading ? (
        <div className='w-full h-[500px] flex items-center justify-center flex-col'>
          <LoadingSpinner />
          {/* <h1 className='text-black text-[20px]'>Loading summaries</h1> */}
        </div>
      ) : summaries.length === 0 ? (
        <p className="text-gray-500">Nenhum resumo encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((item) => (
            <li
              onClick={() => handleClickSummary(item.id)}
              key={item.id}
              className="bg-white cursor-pointer shadow-md p-4 rounded-xl border border-gray-200 hover:shadow-lg transition"
            >
              <div className='flex items-center justify-between w-full'>
                <h2 className="text-lg text-black text-[20px] font-semibold mb-2">{item.titulo || 'Resumo sem título'}</h2>
                <button onClick={(e) => {
                  e.stopPropagation() // Evita navegar para a página de detalhes
                  handleDeleteSummary(item.id)
                }}>
                  <AiOutlineMore color='#000' size={20} />
                </button>
              </div>
              <p className="text-gray-700 text-sm line-clamp-1 my-4">{item.texto}</p>
              <div className='flex w-full items-center justify-end gap-1'>
                <p className='text-[#734A00] text-[14px]'>see content</p>
                <BiSubdirectoryRight color='#734A00' size={16} className='mt-1'/>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}