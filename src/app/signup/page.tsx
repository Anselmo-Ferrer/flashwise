'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
    } else {
      alert('Cadastro realizado! Verifique seu e-mail.')
      router.push('/login')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSignup} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border border-gray-300 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-purple-600 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </main>
  )
}