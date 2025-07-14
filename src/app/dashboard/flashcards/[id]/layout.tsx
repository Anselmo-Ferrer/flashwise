'use client'

import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <main className="w-full fit flex flex-col">
      <div className="w-full p-3 bg-white rounded-2xl">
        <button
          onClick={() => router.back()}
          className='bg-[#FFF7E8] text-[14px] cursor-pointer transition-colors duration-200 ease-in-out hover:bg-[#FFE0A7] w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[#734A00]'
        >
          <IoMdArrowBack size={24} color='#FFA500'/>
          Voltar
        </button>
      </div>
      {children}
    </main>
  )
}