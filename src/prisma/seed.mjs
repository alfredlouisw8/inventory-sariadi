// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Parse command-line arguments
// use yarn prisma:seed "email" "password" "name" "role"
const args = process.argv.slice(2)
const username = args[0]
const password = args[1]
const name = args[2]
const role = args[3]

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      username,
      name,
      password: bcrypt.hashSync(password, 10),
      role,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
