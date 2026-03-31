import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const registerUser = async (email: string, password: string, name?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  });

  const token = signToken({ userId: user.id });
  return { user: { id: user.id, email: user.email, name: user.name }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ userId: user.id });
  return { user: { id: user.id, email: user.email, name: user.name }, token };
};
