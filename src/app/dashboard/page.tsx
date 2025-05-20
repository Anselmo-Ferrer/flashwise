'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

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
    </div>
  )
}