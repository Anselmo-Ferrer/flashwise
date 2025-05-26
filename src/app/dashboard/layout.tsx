import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen p-2 bg-[#F6F6F3] gap-10">
      <Sidebar />
      <main className="flex-1 py-2 px-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}