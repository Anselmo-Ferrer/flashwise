'use client'

import Link from "next/link";
import { LuLayoutDashboard, LuNewspaper, LuLogOut } from 'react-icons/lu'
import { PiCards } from "react-icons/pi"
import { MdOutlineQuiz } from "react-icons/md"
import { usePathname } from "next/navigation";
import { TbSettings2 } from "react-icons/tb";
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LuLayoutDashboard },
  { name: 'Summary', href: '/dashboard/summary', icon: LuNewspaper },
  { name: 'Flashcards', href: '/dashboard/flashcards', icon: PiCards },
  { name: 'Quiz', href: '/dashboard/quiz', icon: MdOutlineQuiz },
];


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="bg-white py-10 pr-5 pl-1 w-64 z-100 rounded-xl">
      <div className="flex justify-center">
        <h1 className="text-black font-semibold text-[25px]">Flashwise</h1>
      </div>
      <div className=" h-full flex flex-col justify-between py-4">
        <nav className="flex flex-col gap-2 mt-4">
            {links.map((item, i) => {
              const LinkIcon = item.icon;
              return (
                <Link 
                  key={i} 
                  href={item.href} 
                  className={clsx(
                    "flex items-center gap-3 px-5 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 ease-in-out", 
                    {
                      'bg-gray-100 text-blue-600': pathname === item.href,
                    }
                  )}>
                  <LinkIcon size={18} style={{ color: 'var(--primary)' }} />
                  <span className="text-black text-[14px]">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        <div>
          <Link 
            href="/settings"
            className="flex items-center gap-3 px-5 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 ease-in-out">
            <TbSettings2 size={18} style={{ color: 'var(--primary)' }} />
            <span className="text-black text-[14px]">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 rounded-lg hover:bg-gray-100 w-full hover:cursor-pointer transition-colors duration-200 ease-in-out">
            <LuLogOut size={18} color="#B01212" />
            <span className="text-[#B01212] text-[14px]">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}