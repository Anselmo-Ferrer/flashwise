import Image from "next/image";
import desktopImage from '@/app/assets/Desktop.png'
import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="relative w-full h-fit bg-[#F6F6F3] flex justify-center pt-20 z-0">

        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#5a3700] to-transparent blur-3xl opacity-30 z-[-1]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[400px] bg-gradient-to-br from-[#5a3700] to-transparent blur-3xl opacity-30 z-[-1]" />

        <div className="flex flex-col items-center gap-5">
          <h1 className="text-[#734A00] text-6xl font-bold">Resumos, quizzes e flashcards com IA</h1>
          <h3 className="text-black text-md text-center">O Flashwise transforma seus estudos com resumos automáticos, quizzes inteligentes <br/> e flashcards personalizados — tudo criado com inteligência artificial.</h3>
          <div className="flex items-center gap-3 my-5">
            <Link href='/login' className="border px-6 py-3 rounded-xl bg-white text-black w-[120px] cursor-pointer text-center">Entrar</Link>
            <Link href='/signup' className='bg-[#734A00] text-white px-6 py-3 rounded-xl w-[120px] hover:bg-[#5a3700] cursor-pointer text-center'>Iniciar</Link>
          </div>
          <Image src={desktopImage} alt="desktop image" />
        </div>

      </div>
    </div>
  );
}
