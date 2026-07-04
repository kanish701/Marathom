import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { releaseExpiredLocks } from './services/slotManager.js';
import {
  createOnlineRegistration,
  confirmOnlinePayment,
  createOfflineRegistration,
  getDashboardStats,
  checkInRunner,
  getWhatsAppLogs,
  runAbandonedCartRecovery
} from './controllers/registrationController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Seed default categories if database is empty
async function seedCategories() {
  try {
    const count = await prisma.category.count();
    if (count === 0) {
      await prisma.category.createMany({
        data: [
          { id: '5K', name: '5K Fun Run', price: 400, capacity: 200, startTime: '06:30 AM' },
          { id: '10K', name: '10K Challenge', price: 700, capacity: 150, startTime: '06:00 AM' },
          { id: 'HALF', name: 'Half Marathon (21.1K)', price: 1200, capacity: 100, startTime: '05:00 AM' }
        ]
      });
      console.log('Successfully seeded default categories (5K, 10K, Half).');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

// Routes
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Online flow
app.post('/api/registrations', createOnlineRegistration);
app.post('/api/registrations/confirm', confirmOnlinePayment);

// Admin flow
app.post('/api/admin/registrations', createOfflineRegistration);
app.get('/api/admin/stats', getDashboardStats);
app.post('/api/admin/check-in', checkInRunner);
app.get('/api/admin/whatsapp-logs', getWhatsAppLogs);
app.post('/api/admin/trigger-abandoned-recovery', runAbandonedCartRecovery);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start cleaner interval to release expired slot locks every 10 seconds
setInterval(async () => {
  try {
    const released = await releaseExpiredLocks();
    if (released > 0) {
      console.log(`[Cleaner] Automatically released ${released} expired slot locks.`);
    }
  } catch (err) {
    console.error('[Cleaner Error] Failed to release expired locks:', err);
  }
}, 10000);

// Initialize DB and Start Server
async function main() {
  await seedCategories();
  app.listen(PORT, () => {
    console.log(`🚀 Marathon backend listening on port ${PORT}`);
  });
}

main().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
