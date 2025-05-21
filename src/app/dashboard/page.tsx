'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PDFuploader from '@/components/PDFUploader'
import SummaryGenerator from '@/components/SummaryGenerator'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  const [textoExtraido, setTextoExtraido] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
      } else {
        setUserEmail(session.user.email || '')
        setLoading(false)
      }
    }
    checkSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p className="p-8">Verificando autenticação...</p>

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
    console.log(data)
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Welcome to your dashboard!</h1>
      <p>Você está logado como: {userEmail}</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Sair
      </button>
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">Upload de PDF</h1>
        <PDFuploader onFileSelect={handlePDF} />
      </div>
      {textoExtraido && <SummaryGenerator texto={textoExtraido} />}
    </div>
  )
}