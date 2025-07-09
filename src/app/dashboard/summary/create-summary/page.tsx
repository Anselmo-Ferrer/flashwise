'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PDFuploader from "@/components/PDFUploader";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SummaryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [textoExtraido, setTextoExtraido] = useState('')
  const [resumoId, setResumoId] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      const { id, email } = session.user
      setUserId(id || '')

      const syncRes = await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email, name: '', password: '' })
      })

      const data = await syncRes.json()
      console.log(data)
      setUserId(data.user.id)

      if (!syncRes.ok) {
        console.error('Erro ao sincronizar usuário')
        alert('Erro ao sincronizar usuário.')
      }

      setLoading(false)
    }

    checkSession()
  }, [router])

  const handlePDF = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('Erro na API:', errorText)
      alert('Falha ao processar PDF')
      return
    }

    const data = await res.json()
    setTextoExtraido(data.text)
  }

  const handleGenerateSummary = async () => {
    if (!textoExtraido || !userId) {
      alert('Usuário ou texto inválido.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: textoExtraido }),
      })

      const data = await res.json()

      if (!data.estrutura) {
        alert('Erro ao gerar a estrutura do resumo.')
        setLoading(false)
        return
      }

      const estrutura = data.estrutura

      const saveRes = await fetch('/api/save-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: estrutura.titulo,
          subtitulo: estrutura.subtitulo,
          texto: textoExtraido,
          estrutura: estrutura,
          userId: userId,
        }),
      })

      if (!saveRes.ok) {
        const err = await saveRes.json()
        console.error('Erro ao salvar resumo:', err)
        alert('Erro ao salvar resumo')
        setLoading(false)
        return
      }

      const { summary } = await saveRes.json()
      const resumoIdGerado = summary.id
      setResumoId(resumoIdGerado)

      router.push(`/dashboard/summary/${resumoIdGerado}`)
    } catch (error) {
      console.error('Erro ao gerar ou salvar o resumo:', error)
      alert('Erro ao gerar ou salvar o resumo.')
    }

    setLoading(false)
  }

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className="bg-white w-[500px] h-[500px] rounded-xl p-5 flex flex-col justify-between items-end">
        <div className='w-full'>
          <div className="flex items-center gap-5 w-full">
            <div className="flex items-center justify-center rounded-full border-1 border-[#CBD0DC] p-1 bg-transparent w-10 h-10">
              <IoCloudUploadOutline size={24} color="black" />
            </div>
            <div className="flex flex-col">
              <span className="text-black font-medium text-[20px]">Upload files</span>
              <span className="text-[#A9ACB4] text-[14px]">Select and upload the files of your choice</span>
            </div>
          </div>
          <div className="w-full bg-[#CBD0DC] border-1 my-5"></div>
          <PDFuploader onFileSelect={handlePDF} />
        </div>

        <button
          onClick={handleGenerateSummary}
          className='bg-[#FFF7E8] text-[14px] cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#FFE0A7] w-[200px] flex items-center gap-2 mt-5 py-3 px-4 rounded-xl text-[#734A00]'
        >
          <CiSquarePlus size={24} color='#FFA500' />
          Create summary
        </button>

        {loading && (
          <div>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  )
}