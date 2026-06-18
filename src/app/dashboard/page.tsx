import { getDashboardStats } from '@/actions/dashboard'
import DashboardView from '@/components/DashboardView'

export const metadata = {
  title: 'Dashboard Overview | AHM-SYS',
}

export default async function DashboardPage() {
  const response = await getDashboardStats()
  
  // Kasih fallback object kosong kalau gagal narik data stats
  const stats = response.success && response.stats 
    ? response.stats 
    : { totalAssets: 0, goodCondition: 0, needService: 0, brokenCondition: 0 }
    
  // Kasih fallback array kosong [] buat ngatasin error TypeScript
  const recentLogs = response.success && response.recentLogs 
    ? response.recentLogs 
    : []

  return (
    <main className="min-h-screen bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1120] to-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Pantauan *real-time* kondisi aset di seluruh cabang.
          </p>
        </header>
        
        {/* Render UI Dashboard dengan data yang udah pasti aman dari undefined */}
        <DashboardView stats={stats} recentLogs={recentLogs} />
      </div>
    </main>
  )
}