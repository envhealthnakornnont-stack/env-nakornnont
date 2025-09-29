import { PrismaClient, Role } from '@prisma/client'
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // -------------------------
  // 1) Seed User (SUPERUSER)
  // -------------------------
  const rawPassword = 'Nakornnont025890500.1202@'
  const passwordHash = await bcrypt.hash(rawPassword, 12)

  await prisma.user.upsert({
    where: { email: 'env.health.nakornnont@gmail.com' },
    update: {
      firstname: 'Env',
      lastname: 'Nakornnont',
      department: 'ผู้ดูแลระบบสูงสุด',
      role: Role.SUPERUSER,
      password: passwordHash,
      avatar: null,
    },
    create: {
      firstname: 'Env',
      lastname: 'Nakornnont',
      email: 'env.health.nakornnont@gmail.com',
      password: passwordHash,
      department: 'ผู้ดูแลระบบสูงสุด',
      role: Role.SUPERUSER,
      avatar: null,
    },
  })

  console.log('✅ SuperUser seeded.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
