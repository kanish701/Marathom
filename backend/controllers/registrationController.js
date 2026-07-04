import { PrismaClient } from '@prisma/client';
import { checkAndLockSlot, getCategorySlotsInfo } from '../services/slotManager.js';
import { sendWhatsAppConfirmation, sendWhatsAppAbandonedReminder } from '../services/whatsapp.js';

const prisma = new PrismaClient();

const CATEGORY_CODES = {
  '5K': '5K',
  '10K': '10K',
  'HALF': 'HM',
  'FULL': 'FM'
};

function generateBibNumber(categoryId, gender, seq) {
  const code = CATEGORY_CODES[categoryId] || categoryId.substring(0, 3).toUpperCase();
  const genderCode = (gender || 'O').substring(0, 1).toUpperCase();
  const padSeq = String(seq).padStart(4, '0');
  return `${code}-${genderCode}-${padSeq}`;
}

export async function createOnlineRegistration(req, res) {
  const {
    name,
    email,
    phone,
    gender,
    tshirtSize,
    medicalDetails,
    emergencyName,
    emergencyPhone,
    categoryId
  } = req.body;

  if (!name || !email || !phone || !gender || !tshirtSize || !emergencyName || !emergencyPhone || !categoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Create the pending runner record
    const runner = await prisma.runner.create({
      data: {
        name,
        email,
        phone,
        gender,
        tshirtSize,
        medicalDetails,
        emergencyName,
        emergencyPhone,
        categoryId,
        status: 'PENDING'
      }
    });

    // 2. Atomically lock the slot
    const lockResult = await checkAndLockSlot(categoryId, runner.id);

    if (!lockResult.allowed) {
      // Release or mark as expired immediately
      await prisma.runner.update({
        where: { id: runner.id },
        data: { status: 'EXPIRED' }
      });
      return res.status(400).json({ error: 'No slots available in this category' });
    }

    res.status(201).json({
      message: 'Registration initiated and slot locked for 5 minutes',
      runnerId: runner.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
  } catch (error) {
    console.error('Error initiating registration', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function confirmOnlinePayment(req, res) {
  const { runnerId, paymentId, paymentMethod } = req.body;

  if (!runnerId || !paymentId) {
    return res.status(400).json({ error: 'Missing runnerId or paymentId' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const runner = await tx.runner.findUnique({
        where: { id: runnerId },
        include: { category: true }
      });

      if (!runner) {
        throw new Error('Runner not found');
      }

      if (runner.status === 'CONFIRMED') {
        return { alreadyConfirmed: true, runner };
      }

      // Check if slot lock is still valid or if we can lock it now
      const lock = await tx.slotLock.findUnique({
        where: { runnerId }
      });

      const now = new Date();
      if (!lock || lock.expiresAt < now) {
        // Lock expired! Check if slot is still available before confirming
        const confirmedCount = await tx.runner.count({
          where: { categoryId: runner.categoryId, status: 'CONFIRMED' }
        });
        if (confirmedCount >= runner.category.capacity) {
          throw new Error('Lock expired and no slots are available anymore.');
        }
      }

      // Allocate unique BIB number
      // We count the number of confirmed runners in this category to generate the next sequence number
      const confirmedCount = await tx.runner.count({
        where: { categoryId: runner.categoryId, status: 'CONFIRMED' }
      });
      const bib = generateBibNumber(runner.categoryId, runner.gender, confirmedCount + 1);

      // Update runner status and remove the lock
      const updatedRunner = await tx.runner.update({
        where: { id: runnerId },
        data: {
          status: 'CONFIRMED',
          paymentId,
          paymentMethod: paymentMethod || 'ONLINE',
          bibNumber: bib
        },
        include: { category: true }
      });

      // Remove the slot lock
      await tx.slotLock.deleteMany({
        where: { runnerId }
      });

      return { alreadyConfirmed: false, runner: updatedRunner };
    });

    if (!result.alreadyConfirmed) {
      // Trigger WhatsApp API in background
      sendWhatsAppConfirmation({
        runner: result.runner,
        categoryName: result.runner.category.name
      });
    }

    res.json({
      message: 'Payment confirmed successfully',
      runner: {
        id: result.runner.id,
        name: result.runner.name,
        bibNumber: result.runner.bibNumber,
        status: result.runner.status
      }
    });
  } catch (error) {
    console.error('Error confirming payment', error);
    res.status(400).json({ error: error.message || 'Payment confirmation failed' });
  }
}

export async function createOfflineRegistration(req, res) {
  const {
    name,
    email,
    phone,
    gender,
    tshirtSize,
    medicalDetails,
    emergencyName,
    emergencyPhone,
    categoryId,
    paymentMethod,
    paymentId
  } = req.body;

  if (!name || !email || !phone || !gender || !tshirtSize || !emergencyName || !emergencyPhone || !categoryId || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get Category Details
      const category = await tx.category.findUnique({
        where: { id: categoryId }
      });
      if (!category) {
        throw new Error(`Category ${categoryId} not found`);
      }

      // 2. Count confirmed slots
      const confirmedCount = await tx.runner.count({
        where: { categoryId, status: 'CONFIRMED' }
      });

      if (confirmedCount >= category.capacity) {
        throw new Error('No slots available in this category');
      }

      // 3. Generate Bib Number
      const bib = generateBibNumber(categoryId, gender, confirmedCount + 1);

      // 4. Create runner directly in CONFIRMED status
      const runner = await tx.runner.create({
        data: {
          name,
          email,
          phone,
          gender,
          tshirtSize,
          medicalDetails,
          emergencyName,
          emergencyPhone,
          categoryId,
          status: 'CONFIRMED',
          paymentMethod,
          paymentId: paymentId || `OFFLINE-${Date.now()}`,
          bibNumber: bib
        },
        include: { category: true }
      });

      return runner;
    });

    // Trigger WhatsApp trigger in background
    sendWhatsAppConfirmation({
      runner: result,
      categoryName: result.category.name
    });

    res.status(201).json({
      message: 'Offline registration confirmed',
      runner: result
    });
  } catch (error) {
    console.error('Error creating offline registration', error);
    res.status(400).json({ error: error.message || 'Offline registration failed' });
  }
}

export async function getDashboardStats(req, res) {
  try {
    const slotsInfo = await getCategorySlotsInfo();

    const totalConfirmed = await prisma.runner.count({
      where: { status: 'CONFIRMED' }
    });

    // Calculate revenue (only count confirmed registrations)
    const confirmedRunners = await prisma.runner.findMany({
      where: { status: 'CONFIRMED' },
      include: { category: true }
    });
    const totalRevenue = confirmedRunners.reduce((sum, r) => sum + r.category.price, 0);

    const checkedInCount = await prisma.runner.count({
      where: { status: 'CONFIRMED', checkedIn: true }
    });

    // Get recent registrations
    const recentRunners = await prisma.runner.findMany({
      orderBy: { registeredAt: 'desc' },
      take: 10,
      include: { category: true }
    });

    res.json({
      stats: {
        totalConfirmed,
        totalRevenue,
        checkedInCount,
        categoryBreakdown: slotsInfo
      },
      recentRunners
    });
  } catch (error) {
    console.error('Error fetching dashboard stats', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function checkInRunner(req, res) {
  const { query } = req.body; // Can be runnerId or bibNumber

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const runner = await prisma.runner.findFirst({
      where: {
        OR: [
          { id: query },
          { bibNumber: query }
        ],
        status: 'CONFIRMED'
      },
      include: { category: true }
    });

    if (!runner) {
      return res.status(404).json({ error: 'Confirmed runner not found' });
    }

    if (runner.checkedIn) {
      return res.status(400).json({
        message: 'Runner is already checked in',
        runner
      });
    }

    const updatedRunner = await prisma.runner.update({
      where: { id: runner.id },
      data: {
        checkedIn: true,
        checkedInAt: new Date()
      },
      include: { category: true }
    });

    res.json({
      message: 'Check-in successful! Kit issued.',
      runner: updatedRunner
    });
  } catch (error) {
    console.error('Error checking in runner', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getWhatsAppLogs(req, res) {
  try {
    const logs = await prisma.whatsAppLog.findMany({
      orderBy: { sentAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching WhatsApp logs', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function runAbandonedCartRecovery(req, res) {
  try {
    // Find all runners who are PENDING and created more than 1 minute ago (for demo purposes) and haven't completed payment.
    // Wait, in production we would check for 2 hours, but for testing we can check for registrations older than 1 minute.
    const timeThreshold = new Date(Date.now() - 1 * 60 * 1000); // 1 minute for easy demoing!
    
    const abandonedRunners = await prisma.runner.findMany({
      where: {
        status: 'PENDING',
        registeredAt: { lt: timeThreshold }
      },
      include: {
        category: true,
        slotLock: true
      }
    });

    let count = 0;
    for (const runner of abandonedRunners) {
      // Send reminder
      await sendWhatsAppAbandonedReminder(runner, runner.category.name);
      
      // Update status to EXPIRED so we don't spam them in the next cron
      await prisma.runner.update({
        where: { id: runner.id },
        data: { status: 'EXPIRED' }
      });
      
      // Clear lock if exists
      if (runner.slotLock) {
        await prisma.slotLock.delete({
          where: { runnerId: runner.id }
        });
      }
      count++;
    }

    res.json({
      message: `Abandoned cart recovery run completed. Processed ${count} runners.`,
      count
    });
  } catch (error) {
    console.error('Error running abandoned cart recovery', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
