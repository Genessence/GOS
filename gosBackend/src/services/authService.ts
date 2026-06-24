import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

const SALT_ROUNDS = 10;

export const registerUser = async (name: string, email: string, password: string, role: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role }
  });
  return user;
};

export const loginUser = async (email: string, password: string, jwtSecret: string, jwtExpiresIn: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, role: user.role, email: user.email }, jwtSecret, jwtExpiresIn);

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};
