'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { AssetCategory, AssetStatus } from '@prisma/client'

// 1. READ: Ambil Semua Data Aset
export async function getAssets() {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: assets }
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data aset dari server.' }
  }
}

// 2. CREATE: Tambah Aset Baru
export async function createAsset(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const category = formData.get('category') as AssetCategory
    const branchName = formData.get('branchName') as string
    const purchaseYear = parseInt(formData.get('purchaseYear') as string)
    const healthStatus = (formData.get('healthStatus') as AssetStatus) || 'BAIK'

    await prisma.asset.create({
      data: { id, category, branchName, purchaseYear, healthStatus }
    })

    // Refresh halaman otomatis setelah data masuk
    revalidatePath('/assets') 
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Gagal menambahkan aset. Pastikan ID unik.' }
  }
}

// 3. DELETE: Hapus Aset
export async function deleteAsset(id: string) {
  try {
    await prisma.asset.delete({
      where: { id }
    })
    
    revalidatePath('/assets')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Gagal menghapus aset.' }
  }
}