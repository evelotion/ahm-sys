'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function DashboardView({ stats, recentLogs }: { stats: any, recentLogs: any[] }) {
  // Setup data buat grafik Recharts
  const chartData = [
    { name: 'Normal / Baik', value: stats.goodCondition, color: '#10B981' }, // Emerald
    { name: 'Butuh Servis', value: stats.needService, color: '#EAB308' },    // Yellow
    { name: 'Rusak Berat', value: stats.brokenCondition, color: '#EF4444' }   // Red
  ]

  // Animasi standar biar smooth
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="space-y-8">
      {/* Baris 1: Kartu Angka Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Aset</h3>
          <p className="text-4xl font-black text-white mt-2">{stats.totalAssets}</p>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 p-6 rounded-2xl shadow-xl">
          <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider">Kondisi Baik</h3>
          <p className="text-4xl font-black text-emerald-400 mt-2">{stats.goodCondition}</p>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 p-6 rounded-2xl shadow-xl">
          <h3 className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Butuh Servis</h3>
          <p className="text-4xl font-black text-yellow-400 mt-2">{stats.needService}</p>
        </motion.div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl border border-red-500/20 p-6 rounded-2xl shadow-xl">
          <h3 className="text-red-400 text-sm font-bold uppercase tracking-wider">Rusak Berat</h3>
          <p className="text-4xl font-black text-red-400 mt-2">{stats.brokenCondition}</p>
        </motion.div>
      </div>

      {/* Baris 2: Grafik & Feed Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Grafik Donut */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="col-span-1 lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl h-96 flex flex-col">
          <h2 className="text-lg font-bold text-slate-300 mb-4">Rasio Kesehatan Aset</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Kolom Kanan: Log Aktivitas Terbaru */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="col-span-1 lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold text-slate-300 mb-6">Log Pemeliharaan Terbaru</h2>
          <div className="space-y-4">
            {recentLogs.length > 0 ? recentLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-3 hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-white font-semibold">{log.asset.category} - {log.asset.branchName}</p>
                  <p className="text-sm text-slate-400 mt-1">Dicek oleh: <span className="text-blue-400">{log.pic.name}</span></p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    log.lastCondition === 'BAIK' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    log.lastCondition === 'SERVIS' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {log.lastCondition}
                  </span>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 py-8">Belum ada data pemeliharaan.</p>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}