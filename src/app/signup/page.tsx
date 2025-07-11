'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import desktopImage from '@/app/assets/Desktop.png'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
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
    <main className="bg-white flex w-full h-screen">

      <div className="relative w-1/2 lg:w-2/3 h-screen bg-[#FFCD71] flex flex-col justify-center items-center">
        <div className='absolute left-[-300px] top-[-300px] bg-[#FFF7E8] w-[800px] h-[800px] rounded-full z-1'></div>
        <Image src={desktopImage} alt="desktop image" className='z-2 w-[700px]'/>
       <h2 className="text-6xl text-[#734A00] font-bold mb-5">
        Novos recursos introduzidos
      </h2>
      <p className="text-black text-center">
        O Flashwise agora gera resumos ainda mais precisos, flashcards interativos e quizzes dinâmicos<br />
        com base no seu ritmo de aprendizagem. Tudo com o apoio da inteligência artificial.
      </p>
      </div>

      <div className="w-1/2 lg:w-1/3 h-screen p-10">
        <Link href='/' className="text-4xl cursor-pointer font-bold bg-gradient-to-r from-[#FFCD71] via-[#734A00] to-[#734A00] text-transparent bg-clip-text">
          Flashwise
        </Link>
        <div className="px-5 py-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl text-black font-bold">Registrar</h1>
            <div className="flex gap-1 items-center mt-3 mb-5">
              <p className="text-[#718096]">Tem uma conta?</p>
              <a href="/login" className="border-b-1 cursor-pointer text-[#000]">
                Entrar
              </a>
            </div>
          </div>
          <form onSubmit={handleSignup} className="w-full mt-5">
            <p className="text-[#718096] text-md">E-mail</p>
            <input
              className="w-full p-2 border border-gray-300 rounded text-[#718096] placeholder-[#718096] mt-2 rounded-xl"
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-[#718096] text-md mt-5">Senha</p>
            <input
              className="w-full p-2 border border-gray-300 rounded text-[#718096] placeholder-[#718096] mt-2 rounded-xl"
              type="password"
              placeholder="$#*%1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full cursor-pointer bg-[#FFCD71] text-black py-3 rounded-xl my-7">
              Registrar
            </button>
          </form>
        </div>
      </div>

    </main>
  )
}