'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import desktopImage from '@/app/assets/Desktop.png'

const traduzirErro = (mensagem: string) => {
  const erros: { [key: string]: string } = {
    'New password should be different from the old password.': 'A nova senha deve ser diferente da antiga.',
    'Invalid login credentials': 'Credenciais de login inválidas.',
    'User already registered': 'Usuário já registrado.',
    'Email not confirmed': 'E-mail não confirmado. Verifique sua caixa de entrada.',
    'User not found': 'Usuário não encontrado.',
    'Email is not registered': 'E-mail não registrado.',
    'Invalid email or password': 'E-mail ou senha inválidos.',
    'Token has expired or is invalid': 'O link expirou ou é inválido.',
  }

  return erros[mensagem] || 'Ocorreu um erro. Tente novamente.'
}

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenDetected, setTokenDetected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setTokenDetected(true)
        }
      }
    )

    // Cleanup do listener
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setError(traduzirErro(error.message))
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000) // redireciona após 3 segundos
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
            <h1 className="text-4xl text-black font-bold">Redefinir sua senha</h1>
          </div>

          {!tokenDetected && (
            <p className="text-gray-500 mb-4">
              Aguardando validação do token de redefinição...
            </p>
          )}

          {tokenDetected && !success && (
            <form onSubmit={handleResetPassword} className="w-full mt-5">
              <p className="text-[#718096] text-md">Nova senha</p>
              <input
                className="w-full p-2 border border-gray-300 rounded text-[#718096] placeholder-[#718096] mt-2 rounded-xl"
                type="password"
                placeholder="$#*%1"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <p className="text-[#718096] text-md mt-5">Confirme a nova senha</p>
              <input
                className="w-full p-2 border border-gray-300 rounded text-[#718096] placeholder-[#718096] mt-2 rounded-xl"
                type="password"
                placeholder="$#*%1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
              <button type="submit" className="w-full cursor-pointer bg-[#FFCD71] text-black py-3 rounded-xl my-5">
                Redefinir senha
              </button>
            </form>
          )}
          

        </div>

        {success && (
          <div className="text-green-600 pl-5">
            Senha redefinida com sucesso! Redirecionando para login...
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