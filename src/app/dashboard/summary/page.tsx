'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PDFuploader from "@/components/PDFUploader";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";


export default function SummaryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [textoExtraido, setTextoExtraido] = useState('')
  const [resumo, setResumo] = useState('')
  const [resumoId, setResumoId] = useState('')

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
  
          setLoading(false)
        }
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
    if (!textoExtraido || !userId) return
    setLoading(true)

    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: textoExtraido }),
      })

      const data = await res.json()
      const resumoGerado = data.resumo
      setResumo(resumoGerado)

      const saveRes = await fetch('/api/save-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Resumo do PDF',
          texto: resumoGerado,
          userId: userId,
        }),
      })

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
    <div className="bg-white w-[500px] h-[500px] rounded-xl p-5 flex flex-col justify-between items-end">
      <div className='w-full'>
        <div className="flex items-center gap-5 w-full">
          <div className="flex items-center justify-center rounded-full border-1 border-[#CBD0DC] p-1 bg-transparent w-10 h-10">
            <IoCloudUploadOutline size={24} color="black"/>
          </div>
          <div className="flex flex-col">
            <span className="text-black font-medium text-[20px]">Upload files</span>
            <span className="text-[#A9ACB4] text-[14px]">Select and upload the files of your choice</span>
          </div>
        </div>
        <div className="w-full bg-[#CBD0DC] border-1 my-5"></div>

        <PDFuploader onFileSelect={handlePDF}/>
      </div>

      <button
        onClick={handleGenerateSummary}
        className='bg-[#FFF7E8] cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#FFE0A7] w-[200px] flex items-center gap-2 mt-5 py-3 px-4 rounded-xl text-[#734A00]'
      >
        <CiSquarePlus size={24} color='#FFA500'/>
        Create summary
      </button>
      
    </div>
  )
}