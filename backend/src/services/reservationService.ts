import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getBusinessByAlias = async (alias: string) => {
  const user = await prisma.user.findUnique({
    where: { alias },
    select: { id: true, businessName: true, businessType: true, name: true, alias: true, openTime: true, closeTime: true, slotDuration: true }
  });
  if (!user) throw new Error('Business not found');
  return user;
};

export const getAllBusinesses = async () => {
  const users = await prisma.user.findMany({
    where: { alias: { not: null } },
    select: { id: true, businessName: true, businessType: true, alias: true, name: true }
  });
  return users.filter(u => u.alias && u.alias.trim() !== '');
};

export const getBookedSlots = async (alias: string, dateStr: string) => {
  const business = await getBusinessByAlias(alias);
  
  const startDate = new Date(`${dateStr}T00:00:00.000Z`);
  const endDate = new Date(`${dateStr}T23:59:59.999Z`);

  const reservations = await prisma.reservation.findMany({
    where: {
      userId: business.id,
      status: 'CONFIRMED',
      startTime: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      startTime: true,
      endTime: true
    }
  });

  return reservations.map(res => ({
    start: res.startTime.toISOString(),
    end: res.endTime.toISOString()
  }));
};

export const createReservation = async (
  userId: string,
  clientName: string,
  clientEmail: string | undefined,
  startTime: Date,
  endTime: Date
) => {
  // Overlap logic: (newStart < existingEnd) AND (newEnd > existingStart)
  const overlapping = await prisma.reservation.findFirst({
    where: {
      userId,
      status: 'CONFIRMED',
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } }
      ]
    }
  });

  if (overlapping) {
    throw new Error('This time slot is already booked');
  }

  return prisma.reservation.create({
    data: {
      userId,
      clientName,
      clientEmail,
      startTime,
      endTime
    }
  });
};

export const getOwnerReservations = async (userId: string) => {
  return prisma.reservation.findMany({
    where: { userId },
    orderBy: { startTime: 'desc' }
  });
};

export const cancelReservation = async (reservationId: string, userId: string) => {
  return prisma.reservation.update({
    where: { id: reservationId, userId },
    data: { status: 'CANCELLED' }
  });
};
