'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import imageCompression from 'browser-image-compression'
import { submitMaintenanceReport } from '@/actions/report'
import toast from 'react-hot-toast' // <-- Mesin notifikasi premium

export default function ReportForm({ assets, users }: { assets: any[], users: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // State untuk fitur upload
  const [isUploading, setIsUploading] = useState(false)
  const [proofUrl, setProofUrl] = useState('')

  // Fungsi kompresi dan upload otomatis ke API lokal
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading('Mengompres & mengunggah foto...') // <-- Loading notif

    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true }
      const compressedFile = await imageCompression(file, options)
      
      const uploadData = new FormData()
      uploadData.append('file', compressedFile)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      })
      
      const data = await res.json()
      
      if (data.success && data.url) {
        setProofUrl(data.url)
        toast.success('Foto berhasil siap dikirim!', { id: toastId }) // <-- Sukses notif
      } else {
        toast.error("Gagal mengunggah file ke cloud.", { id: toastId })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan saat mengunggah file.", { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    // Munculin loading toast pas tombol submit dipencet
    const toastId = toast.loading('Mengirim laporan ke server...')
    
    // Sisipkan URL gambar ke formData sebelum dikirim ke server action
    formData.append('proofImgUrl', proofUrl)
    
    const result = await submitMaintenanceReport(formData)
    
    if (result.success) {
      toast.success('Laporan berhasil dikirim ke pusat!', { id: toastId })
      formRef.current?.reset()
      setProofUrl('') // Kosongkan preview gambar
    } else {
      toast.error('Gagal mengirim laporan: ' + result.error, { id: toastId })
    }
    
    setIsSubmitting(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl"
    >
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
        
        {/* Pilih PIC */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">PIC Bertugas</label>
          <select name="userId" required defaultValue="" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none transition-all">
            <option value="" disabled className="text-black">-- Pilih Nama Lo --</option>
            {users.map(u => (
              <option key={u.id} value={u.id} className="text-black">{u.name} ({u.initial})</option>
            ))}
          </select>
        </div>

        {/* Pilih Aset */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aset yang Dicek</label>
          <select name="assetId" required defaultValue="" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none transition-all">
            <option value="" disabled className="text-black">-- Pilih ID Aset --</option>
            {assets.map(a => (
              <option key={a.id} value={a.id} className="text-black">
                {a.id} - {a.category} ({a.branchName})
              </option>
            ))}
          </select>
        </div>

        {/* Kondisi Terakhir */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Kondisi</label>
          <select name="lastCondition" required defaultValue="BAIK" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none transition-all">
            <option value="BAIK" className="text-black">🟢 Normal / Baik</option>
            <option value="SERVIS" className="text-black">🟡 Butuh Servis / Perawatan</option>
            <option value="RUSAK" className="text-black">🔴 Rusak Berat</option>
          </select>
        </div>

        {/* Catatan Temuan */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catatan Temuan</label>
          <textarea name="notes" rows={3} required placeholder="Contoh: Oli sudah diganti, filter AC bersih..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none" />
        </div>

        {/* Interaktif Upload Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Foto Bukti Fisik</label>
          
          {!proofUrl ? (
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" id="upload-proof" />
              <label htmlFor="upload-proof" className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${isUploading ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/20 hover:border-emerald-400 hover:bg-white/5'}`}>
                {isUploading ? (
                  <span className="text-emerald-400 font-bold text-sm animate-pulse">Mengompres & Mengunggah...</span>
                ) : (
                  <span className="text-slate-400 font-semibold text-sm">Klik untuk Unggah Foto Bukti</span>
                )}
              </label>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-sm w-full h-48 group">
              <img src={proofUrl} alt="Bukti Fisik" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button type="button" onClick={() => setProofUrl('')} className="px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors">
                  Hapus Foto
                </button>
              </div>
            </div>
          )}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting || isUploading}
          type="submit" 
          className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-black tracking-wide py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Laporan Inspeksi'}
        </motion.button>

      </form>
    </motion.div>
  )
}