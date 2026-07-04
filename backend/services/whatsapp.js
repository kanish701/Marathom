import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Generates a Base64 QR code image URI
 * @param {string} text Payload to embed in QR Code
 */
export async function generateQRCode(text) {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error('Error generating QR Code', err);
    throw err;
  }
}

/**
 * Simulates sending WhatsApp registration confirmation template message
 */
export async function sendWhatsAppConfirmation({ runner, categoryName }) {
  try {
    // Generate verification payload
    const qrPayload = JSON.stringify({
      runnerId: runner.id,
      name: runner.name,
      bib: runner.bibNumber,
      category: categoryName
    });

    const qrCodeDataUrl = await generateQRCode(qrPayload);

    // Template message variables:
    // 1: Runner Name
    // 2: Category Name
    // 3: Bib Number
    const message = `Hi ${runner.name}, your registration for the ${categoryName} is confirmed! Your Bib Number is ${runner.bibNumber}. Show this message (or the attached QR Code) at the expo to collect your kit.`;

    // Create log in database
    const log = await prisma.whatsAppLog.create({
      data: {
        runnerName: runner.name,
        phone: runner.phone,
        message,
        status: 'DELIVERED',
        qrCode: qrCodeDataUrl
      }
    });

    console.log(`[WhatsApp Sim] Confirmation sent to ${runner.phone}: ${message}`);
    return log;
  } catch (error) {
    console.error('Failed to send WhatsApp notification', error);
    try {
      return await prisma.whatsAppLog.create({
        data: {
          runnerName: runner.name,
          phone: runner.phone,
          message: `Failed to generate notification: ${error.message}`,
          status: 'FAILED'
        }
      });
    } catch (e) {
      console.error('Error writing failed WhatsApp log', e);
    }
  }
}

/**
 * Simulates sending WhatsApp abandoned cart reminder
 */
export async function sendWhatsAppAbandonedReminder(runner, categoryName) {
  try {
    const message = `Hi ${runner.name}, you left your marathon registration for the ${categoryName} incomplete. Click here to finish! Places are filling up fast!`;
    const log = await prisma.whatsAppLog.create({
      data: {
        runnerName: runner.name,
        phone: runner.phone,
        message,
        status: 'DELIVERED'
      }
    });
    console.log(`[WhatsApp Sim Reminder] Nudge sent to ${runner.phone}: ${message}`);
    return log;
  } catch (error) {
    console.error('Failed to send WhatsApp reminder', error);
  }
}
