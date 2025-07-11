import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full flex justify-center bg-[#F6F6F3]">
      <div className="w-[1000px] h-[96px] bg-white p-5 my-4 rounded-xl flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFCD71] via-[#B97A2A] to-[#734A00] text-transparent bg-clip-text">Flashwise</h1>
        <div className="flex items-center gap-3">
          <Link href="/login" className="border px-6 py-3 rounded-xl text-black w-[120px] cursor-pointer text-center">Entrar</Link>
          <Link href="/signup" className='bg-[#734A00] text-white px-6 py-3 rounded-xl w-[120px] hover:bg-[#5a3700] cursor-pointer text-center'>Iniciar</Link>
        </div>
      </div>
    </div>
  )
}