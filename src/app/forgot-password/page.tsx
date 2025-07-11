'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import desktopImage from '@/app/assets/Desktop.png'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')
  const [timer, setTimer] = useState(0)

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    setErro('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password'
    })

    if (error) {
      setErro(error.message)
    } else {
      setEnviado(true)
      setTimer(60)
    }
  }

  useEffect(() => {
    if (timer === 0) return

    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timer])

  return (
    <main className="bg-white flex w-full h-screen">
      <div className="w-1/2 lg:w-1/3 h-screen p-10">
        <Link href='/' className="text-4xl cursor-pointer font-bold bg-gradient-to-r from-[#FFCD71] via-[#734A00] to-[#734A00] text-transparent bg-clip-text">
          Flashwise
        </Link>
        
        {!enviado ? (
          <div className="px-5 py-10">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl text-black font-bold">Esqueceu a senha</h1>
              <div className="flex gap-1 items-center mt-3 mb-5">
                <p className="text-[#718096]">Já tem uma conta?</p>
                <Link href="/login" className="border-b-1 cursor-pointer text-[#000]">
                  Entre agora
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full mt-5">
              <p className="text-[#718096] text-md">E-mail</p>
              <input
                className="w-full p-2 border border-gray-300 rounded text-[#718096] placeholder-[#718096] mt-2 rounded-xl"
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
              <button type="submit" className="w-full cursor-pointer bg-[#FFCD71] text-black py-3 rounded-xl my-5">
                Recuperar senha
              </button>
            </form>
          </div>
        ) : (
          <div className="px-5 py-10">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl text-black font-bold">Esqueceu a senha</h1>
              <div className="flex gap-1 items-center mt-3 mb-5">
                <p className="text-[#718096]">Já tem uma conta?</p>
                <a href="/signup" className="border-b-1 cursor-pointer text-[#000]">
                  Entre agora
                </a>
              </div>
            </div>
            <p className="text-green-600 mb-4">Email de recuperação enviado com sucesso.</p>

            <button
              onClick={handleSubmit}
              disabled={timer > 0}
              className={`w-full py-3 rounded-xl text-black ${
                timer > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FFCD71] cursor-pointer'
              }`}
            >
              {timer > 0 ? `Reenviar em ${timer}s` : 'Reenviar e-mail'}
            </button>
          </div>
        )}
        
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