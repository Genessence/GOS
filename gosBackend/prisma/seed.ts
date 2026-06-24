import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

dotenv.config();
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  const users = [
    { name: 'Alice Admin', email: 'alice@example.com', role: 'Admin', password: 'Admin123!' },
    { name: 'Mark Manager', email: 'mark@example.com', role: 'Manager', password: 'Manager123!' },
    { name: 'Emily Employee', email: 'emily@example.com', role: 'Employee', password: 'Employee123!' },
    { name: 'Sam User', email: 'sam@example.com', role: 'User', password: 'User123!' },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      console.log('Skipping existing user', u.email);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    await prisma.user.create({ data: { name: u.name, email: u.email, role: u.role, password: hashed } });
    console.log('Created user', u.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
