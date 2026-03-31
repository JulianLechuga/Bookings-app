import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const updateProfile = async (
  userId: string,
  data: { name?: string; businessName?: string; businessType?: string; alias?: string; openTime?: string; closeTime?: string; slotDuration?: number }
) => {
  if (data.alias) {
    const existingAlias = await prisma.user.findUnique({ where: { alias: data.alias } });
    if (existingAlias && existingAlias.id !== userId) {
      throw new Error('Alias already taken');
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, businessName: true, businessType: true, alias: true, openTime: true, closeTime: true, slotDuration: true }
  });
};
