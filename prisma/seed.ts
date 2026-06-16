import { PrismaClient, AssetCategory, AssetStatus, Quarter, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Membersihkan data lama...')
  // Hapus data dari bawah ke atas biar relasinya gak error
  await prisma.maintenanceLog.deleteMany()
  await prisma.maintenanceSchedule.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.user.deleteMany()

  console.log('👥 Mulai seeding database user...')
  const usersData = [
    { initial: 'ADM', name: 'ADMIN', phone: '6285179677792', email: 'admin_logistik@bcasyariah.co.id', role: Role.OPERATOR },
    { initial: 'IND', name: 'Indra Dwi Ananda', phone: '6285179677792', email: 'indra_dwi@bcasyariah.co.id', role: Role.PIC_LOGISTIK },
    { initial: 'FER', name: 'Dian Ferdian', phone: '628567076858', email: 'dian_ferdian@bcasyariah.co.id', role: Role.PIC_LOGISTIK },
  ];

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  })

  // Ambil user ID untuk testing relasi
  const dbUsers = await prisma.user.findMany();
  const picIND = dbUsers.find(u => u.initial === 'IND')?.id;

  console.log('⚙️ Mulai seeding database Master Aset...')
  const assetsData = [
    { id: 'GEN-DPK-001', category: AssetCategory.GENSET, branchName: 'KCP DEPOK', purchaseYear: 2020, healthStatus: AssetStatus.BAIK },
    { id: 'AC-JAT-001', category: AssetCategory.AC, branchName: 'KCP JATINEGARA', purchaseYear: 2022, healthStatus: AssetStatus.SERVIS },
    { id: 'MSN-BGR-002', category: AssetCategory.MESIN, branchName: 'KCP BOGOR', purchaseYear: 2021, healthStatus: AssetStatus.BAIK },
  ];

  await prisma.asset.createMany({
    data: assetsData,
    skipDuplicates: true,
  })

  console.log('📅 Mulai seeding database Jadwal (Schedule)...')
  const now = new Date()
  const nextMonth = new Date()
  nextMonth.setMonth(now.getMonth() + 1)

  await prisma.maintenanceSchedule.createMany({
    data: [
      { assetId: 'GEN-DPK-001', quarter: Quarter.Q1, slaDeadline: nextMonth },
      { assetId: 'AC-JAT-001', quarter: Quarter.Q1, slaDeadline: nextMonth },
    ],
    skipDuplicates: true,
  })

  if (picIND) {
    console.log('📝 Memasukkan dummy log pemeliharaan...')
    await prisma.maintenanceLog.create({
      data: {
        assetId: 'GEN-DPK-001',
        userId: picIND,
        notes: 'Pengecekan rutin Q1. Oli genset sudah diganti, tegangan normal.',
        lastCondition: AssetStatus.BAIK
      }
    })
  }

  console.log('✅ Seeding selesai!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })