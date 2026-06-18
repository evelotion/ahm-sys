'use server'

import prisma from '@/lib/prisma'

export async function getDashboardStats() {
  try {
    // Tarik semua aset untuk dihitung statistik kesehatannya
    const assets = await prisma.asset.findMany()
    
    const totalAssets = assets.length
    const goodCondition = assets.filter(a => a.healthStatus === 'BAIK').length
    const needService = assets.filter(a => a.healthStatus === 'SERVIS').length
    const brokenCondition = assets.filter(a => a.healthStatus === 'RUSAK').length

    // Tarik 5 laporan pemeliharaan terakhir untuk activity feed
    const recentLogs = await prisma.maintenanceLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        asset: { select: { category: true, branchName: true } },
        pic: { select: { name: true } }
      }
    })

    return {
      success: true,
      stats: { totalAssets, goodCondition, needService, brokenCondition },
      recentLogs
    }
  } catch (error) {
    return { success: false, error: 'Gagal menarik data dashboard.' }
  }
}