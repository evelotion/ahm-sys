'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { AssetStatus } from '@prisma/client'

// 1. Ambil List Aset buat Dropdown di Form
export async function getAssetsForDropdown() {
  try {
    const assets = await prisma.asset.findMany({
      select: {
        id: true,
        category: true,
        branchName: true,
      },
      orderBy: { id: 'asc' }
    })
    return { success: true, data: assets }
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data aset.' }
  }
}

// 2. Simpan Data Laporan Pemeliharaan (Maintenance Log)
export async function submitMaintenanceReport(formData: FormData) {
  try {
    const assetId = formData.get('assetId') as string
    const userId = formData.get('userId') as string 
    const notes = formData.get('notes') as string
    const lastCondition = formData.get('lastCondition') as AssetStatus
    const proofImgUrl = formData.get('proofImgUrl') as string | null

    // Simpan log ke database
    await prisma.maintenanceLog.create({
      data: {
        assetId,
        userId,
        notes,
        lastCondition,
        proofImgUrl,
      }
    })

    // Update status kesehatan aset terbaru di tabel Master Aset
    await prisma.asset.update({
      where: { id: assetId },
      data: { healthStatus: lastCondition }
    })

    revalidatePath('/assets') // Refresh data di dashboard pusat
    revalidatePath('/submit-report')
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Gagal mengirim laporan pemeliharaan.' }
  }
}