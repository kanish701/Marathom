import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Checks slot availability and reserves a slot for a runner for 5 minutes
 * @param {string} categoryId 
 * @param {string} runnerId 
 * @returns {Promise<{allowed: boolean, remaining: number}>}
 */
export async function checkAndLockSlot(categoryId, runnerId) {
  return await prisma.$transaction(async (tx) => {
    // 1. Get Category Details
    const category = await tx.category.findUnique({
      where: { id: categoryId }
    });
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }

    // 2. Count confirmed slots
    const confirmedCount = await tx.runner.count({
      where: {
        categoryId,
        status: 'CONFIRMED'
      }
    });

    // 3. Count locked slots that are not expired
    const now = new Date();
    const activeLocksCount = await tx.slotLock.count({
      where: {
        runner: { categoryId },
        expiresAt: { gt: now }
      }
    });

    const totalReserved = confirmedCount + activeLocksCount;

    if (totalReserved >= category.capacity) {
      return { allowed: false, remaining: 0 };
    }

    // 4. Create or update a lock for this runner
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    
    await tx.slotLock.upsert({
      where: { runnerId },
      update: { expiresAt },
      create: { runnerId, expiresAt }
    });

    return { 
      allowed: true, 
      remaining: category.capacity - (confirmedCount + activeLocksCount + 1)
    };
  });
}

/**
 * Releases all expired locks and sets corresponding pending runners to EXPIRED
 * @returns {Promise<number>} Number of released locks
 */
export async function releaseExpiredLocks() {
  const now = new Date();
  
  const expiredLocks = await prisma.slotLock.findMany({
    where: { expiresAt: { lt: now } }
  });

  if (expiredLocks.length === 0) return 0;

  const runnerIds = expiredLocks.map(lock => lock.runnerId);

  await prisma.$transaction([
    prisma.slotLock.deleteMany({
      where: { runnerId: { in: runnerIds } }
    }),
    prisma.runner.updateMany({
      where: {
        id: { in: runnerIds },
        status: 'PENDING'
      },
      data: { status: 'EXPIRED' }
    })
  ]);

  return expiredLocks.length;
}

/**
 * Gets details on capacity, confirmed runners, active locks, and remaining spots for all categories
 */
export async function getCategorySlotsInfo() {
  const categories = await prisma.category.findMany();
  const now = new Date();
  
  const results = [];
  for (const cat of categories) {
    const confirmed = await prisma.runner.count({
      where: { categoryId: cat.id, status: 'CONFIRMED' }
    });
    const locked = await prisma.slotLock.count({
      where: { runner: { categoryId: cat.id }, expiresAt: { gt: now } }
    });
    results.push({
      id: cat.id,
      name: cat.name,
      price: cat.price,
      capacity: cat.capacity,
      startTime: cat.startTime,
      confirmed,
      locked,
      available: Math.max(0, cat.capacity - confirmed - locked)
    });
  }
  return results;
}
