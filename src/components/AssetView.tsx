'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { createAsset, deleteAsset } from '@/actions/asset'

// Tipe data sederhana menyesuaikan Prisma
type Asset = {
  id: string
  category: string
  branchName: string
  purchaseYear: number
  healthStatus: string
}

export default function AssetView({ initialAssets }: { initialAssets: Asset[] }) {
  const formRef = useRef<HTMLFormElement>(null)

  // Fungsi untuk handle submit Server Action
  const handleAction = async (formData: FormData) => {
    await createAsset(formData)
    formRef.current?.reset() // Kosongin form setelah sukses
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Kolom Kiri: Form Input (Glassmorphism) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl h-fit"
      >
        <h2 className="text-xl font-bold mb-6 text-emerald-400">Tambah Aset Baru</h2>
        <form ref={formRef} action={handleAction} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-300">ID Aset</label>
            <input type="text" name="id" placeholder="Contoh: GEN-DPK-001" required 
              className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Kategori</label>
            <select name="category" className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
              <option value="GENSET" className="text-black">Genset</option>
              <option value="AC" className="text-black">AC</option>
              <option value="MESIN" className="text-black">Mesin</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-300">Cabang</label>
            <input type="text" name="branchName" placeholder="Contoh: KCP DEPOK" required 
              className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Tahun Beli</label>
            <input type="number" name="purchaseYear" placeholder="2024" required 
              className="w-full mt-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
          </div>
          
          <button type="submit" 
            className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95">
            Simpan Aset
          </button>
        </form>
      </motion.div>

      {/* Kolom Kanan: Tabel Data (Glassmorphism) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="col-span-1 lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl overflow-hidden"
      >
        <h2 className="text-xl font-bold mb-6 text-blue-400">Daftar Aset Terdaftar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-sm">
                <th className="pb-3 px-2">ID Aset</th>
                <th className="pb-3 px-2">Kategori</th>
                <th className="pb-3 px-2">Cabang</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {initialAssets.map((asset, index) => (
                <motion.tr 
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-2 font-medium text-white">{asset.id}</td>
                  <td className="py-4 px-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {asset.category}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-slate-300">{asset.branchName}</td>
                  <td className="py-4 px-2 text-emerald-400 font-semibold">{asset.healthStatus}</td>
                  <td className="py-4 px-2">
                    <button 
                      onClick={() => deleteAsset(asset.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors">
                      Hapus
                    </button>
                  </td>
                </motion.tr>
              ))}
              {initialAssets.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">Belum ada aset terdaftar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      
    </div>
  )
}