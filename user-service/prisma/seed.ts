import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@gmail.com';

  const existing = await prisma.user.findUnique({ where: { email } });

  const hashedPassword = await bcrypt.hash('admin@123', 10);

  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: { role: Role.ADMIN, isActive: true, password: hashedPassword },
    });
    console.log(`Admin user updated: ${updated.email} | role: ${updated.role}`);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log(`Admin user created: ${admin.email} | role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
