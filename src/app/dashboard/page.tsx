'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PDFuploader from '@/components/PDFUploader'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [textoExtraido, setTextoExtraido] = useState('')
  const [resumo, setResumo] = useState('')

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

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

      await fetch('/api/save-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Resumo do PDF',
          texto: resumoGerado,
          userId: userId,
        }),
      })
    } catch (error) {
      console.error('Erro ao gerar ou salvar o resumo:', error)
      alert('Erro ao gerar ou salvar o resumo.')
    }

    setLoading(false)
  }

  if (loading) return <p className="p-8">Verificando autenticação...</p>

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
        <h2 className="text-2xl font-bold">Upload de PDF</h2>
        <PDFuploader onFileSelect={handlePDF} />
      </div>

      {textoExtraido && (
        <div className="space-y-4">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleGenerateSummary}
            disabled={loading}
          >
            {loading ? 'Gerando resumo...' : 'Gerar Resumo'}
          </button>

          {resumo && (
            <div className="p-4 border rounded bg-gray-100 whitespace-pre-wrap">
              <h2 className="font-bold text-lg mb-2">Resumo:</h2>
              <p className="text-black">{resumo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}