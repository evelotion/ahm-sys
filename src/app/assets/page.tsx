import { getAssets } from '@/actions/asset'
import AssetView from '@/components/AssetView'

export const metadata = {
  title: 'Manajemen Master Aset | AHM-SYS',
}

export default async function AssetsPage() {
  // Panggil Server Action buat narik data
  const response = await getAssets()
  const assets = response.data || []

  return (
    <main className="min-h-screen bg-[#0B1120] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1120] to-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
            Master Data Aset
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Sistem pengawasan terpusat aset krusial cabang.
          </p>
        </header>
        
        {/* Render komponen Client yang udah dipoles Glassmorphism */}
        <AssetView initialAssets={assets} />
      </div>
    </main>
  )
}