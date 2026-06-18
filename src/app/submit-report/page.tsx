import prisma from '@/lib/prisma'
import ReportForm from '@/components/ReportForm'

export const metadata = {
  title: 'Form Pelaporan Aset | AHM-SYS',
}

export default async function SubmitReportPage() {
  // Tarik data langsung secara paralel biar ngebut
  const [assets, users] = await Promise.all([
    prisma.asset.findMany({
      select: { id: true, category: true, branchName: true },
      orderBy: { id: 'asc' }
    }),
    prisma.user.findMany({
      select: { id: true, name: true, initial: true },
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <main className="min-h-screen bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1120] to-black text-white p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
            Form Inspeksi Aset
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Portal pelaporan pemeliharaan rutin cabang.
          </p>
        </header>
        
        {/* Render Form dengan data dari database */}
        <ReportForm assets={assets} users={users} />
      </div>
    </main>
  )
}