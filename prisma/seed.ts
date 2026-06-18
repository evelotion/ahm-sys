// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

// Pakai standard client menyesuaikan package.json ahm-sys saat ini
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Membersihkan data lama...')
  
  // Hapus dari tabel child dulu baru parent (karena relasi)
  await prisma.maintenanceLog.deleteMany()
  await prisma.maintenanceSchedule.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.user.deleteMany()

  console.log('⏳ Mulai seeding database user...')

  const usersData = [
    { initial: 'ABC', name: 'Andreanne B Christie', phone: '62818415996', email: 'andreanne_soetarman@bcasyariah.co.id', role: 'OPERATOR' },
    { initial: 'FER', name: 'Dian Ferdian', phone: '628567076858', email: 'dian_ferdian@bcasyariah.co.id', role: 'PIC_LOGISTIK' },
    { initial: 'NOV', name: 'Novianti Siswandi', phone: '6281385270839', email: 'novianti_siswandi@bcasyariah.co.id', role: 'PIC_LOGISTIK' },
    { initial: 'MAU', name: 'Maulina Ayu Arini', phone: '6285692876080', email: 'maulina_ayu@bcasyariah.co.id', role: 'PIC_LOGISTIK' },
    { initial: 'ASM', name: 'Anisa Salsabila M', phone: '6287726120957', email: 'anisa_salsabila@bcasyariah.co.id', role: 'PIC_LOGISTIK' },
    { initial: 'MLK', name: 'Malik Alfazari', phone: '6281226840858', email: 'malik_alfazari@bcasyariah.co.id', role: 'PIC_LOGISTIK' },
    { initial: 'IND', name: 'Indra Dwi Ananda', phone: '6285179677792', email: 'indra_dwi@bcasyariah.co.id', role: 'PIC_LOGISTIK' },
    { initial: 'IBL', name: 'Ikbal Kurnia', phone: '6281586048214', email: 'ikbal_kurnia@bcasyariah.co.id', role: 'PIC_LOGISTIK' },
    { initial: 'SEM', name: 'Semuel Robert Lontoh', phone: '6285750337669', email: 'semuel_robert@bcasyariah.co.id', role: 'PIC_LOGISTIK' },
    { initial: 'ADM', name: 'ADMIN', phone: '6285179677792', email: 'admin_logistik@bcasyariah.co.id', role: 'OPERATOR' },
  ];

  await prisma.user.createMany({
    data: usersData as any,
    skipDuplicates: true,
  })

  console.log(`✅ ${usersData.length} user telah ditambahkan.`)
  
  console.log('⏳ Mulai seeding database aset (Data Awal)...')
  
  // Data aset awal biar tabel di frontend ada isinya
  await prisma.asset.createMany({
    data: [
      { id: 'GEN-DPK-001', category: 'GENSET', branchName: 'KCP DEPOK', purchaseYear: 2024, healthStatus: 'BAIK' },
      { id: 'AC-JKT-001', category: 'AC', branchName: 'KANTOR PUSAT', purchaseYear: 2022, healthStatus: 'SERVIS' },
      { id: 'MSN-BKS-001', category: 'MESIN', branchName: 'KCP BEKASI', purchaseYear: 2023, healthStatus: 'BAIK' }
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seeding selesai! Database bersih dan siap digunakan.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })