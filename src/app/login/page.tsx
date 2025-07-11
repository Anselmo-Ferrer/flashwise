'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { SiFacebook } from 'react-icons/si'
import desktopImage from '@/app/assets/Desktop.png'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  // Carrega a preferência de "remember me"
  useEffect(() => {
    const saved = localStorage.getItem('rememberMe')
    if (saved !== null) {
      setRememberMe(saved === 'true')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Salva a preferência no localStorage
    localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false')

    // Define storage com base na preferência
    const storageType = rememberMe ? localStorage : sessionStorage

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: storageType,
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    )

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert('Erro ao fazer login: ' + error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="bg-white flex w-full h-screen">
      <div className="w-1/2 lg:w-1/3 h-screen p-10">
        <Link href='/' className="text-4xl cursor-pointer font-bold bg-gradient-to-r from-[#FFCD71] via-[#734A00] to-[#734A00] text-transparent bg-clip-text">
          Flashwise
        </Link>
        <div className="px-5 py-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl text-black font-bold">Entrar</h1>
            <div className="flex gap-1 items-center mt-3 mb-5">
              <p className="text-[#718096]">Não tem uma conta?</p>
              <a href="/signup" className="border-b-1 cursor-pointer text-[#000]">
                Crie agora
              </a>
            </div>
          </div>
          <form onSubmit={handleLogin} className="w-full mt-5">
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
            <div className="w-full flex justify-between mt-7 mb-5">
              <label className="flex items-center gap-2 text-[#718096]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#FFCD71] w-4 h-4"
                />
                Lembrar de mim
              </label>
              <p className="border-b-1 cursor-pointer text-black">esqueceu a senha?</p>
            </div>
            <button className="w-full cursor-pointer bg-[#FFCD71] text-black py-3 rounded-xl my-5">
              Entrar
            </button>
          </form>
          <div className="flex items-center gap-4 mt-5 mb-10">
            <div className="flex-grow border-t border-gray-300"></div>
            <p className="text-gray-500">OU</p>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex flex-col gap-5">
            <button className="w-full cursor-pointer border flex items-center justify-center rounded-xl py-2 text-[#718096] border-[#718096] gap-3">
              <FcGoogle />
              Continue com Google
            </button>
            <button className="w-full cursor-pointer border flex items-center justify-center rounded-xl py-2 text-[#718096] border-[#718096] gap-3">
              <SiFacebook color="#3b5998" />
              Continue com Facebook
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-1/2 lg:w-2/3 h-screen bg-[#FFCD71] flex flex-col justify-center items-center">
        <div className='absolute right-[-300px] top-[-300px] bg-[#FFF7E8] w-[800px] h-[800px] rounded-full z-1'></div>
        <Image src={desktopImage} alt="desktop image" className='z-2 w-[700px]'/>
       <h2 className="text-6xl text-[#734A00] font-bold mb-5">
        Novos recursos introduzidos
      </h2>
      <p className="text-black text-center">
        O Flashwise agora gera resumos ainda mais precisos, flashcards interativos e quizzes dinâmicos<br />
        com base no seu ritmo de aprendizagem. Tudo com o apoio da inteligência artificial.
      </p>
      </div>
    </main>
  )
}