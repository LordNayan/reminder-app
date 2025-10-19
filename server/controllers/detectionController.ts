import { Request, Response } from 'express';
import Device from '@models/Device.js';
import Detection from '@models/Detection.js';
import { getRandomReminder } from '@services/reminderService.js';
import { sendWhatsAppMessage } from '@services/whatsappService.js';

const cooldownMinutes = parseInt(process.env.COOLDOWN_MINUTES || '30', 10);

export async function handleDetection(req: Request, res: Response) {
  try {
    const { deviceId } = (req as any).authDevice; // set by auth middleware
    const { nearbyDeviceId, rssi } = req.body as { nearbyDeviceId: string; rssi: number };
    if (!nearbyDeviceId || typeof rssi !== 'number') {
      return res.status(400).json({ error: 'nearbyDeviceId and rssi required' });
    }
    if (rssi < -70) {
      return res.status(200).json({ skipped: true, reason: 'RSSI below threshold' });
    }

    // Verify devices are paired
    const device = await Device.findOne({ deviceId });
    const other = await Device.findOne({ deviceId: nearbyDeviceId });
    if (!device || !other || device.pairedWith !== other.deviceId || other.pairedWith !== device.deviceId) {
      return res.status(403).json({ error: 'Devices not paired' });
    }

    const detection = await Detection.findOne({ deviceA: device.deviceId, deviceB: other.deviceId });
    const now = new Date();
    if (detection) {
      const diffMinutes = (now.getTime() - detection.lastDetectedAt.getTime()) / 60000;
      if (diffMinutes < cooldownMinutes) {
        return res.status(200).json({ skipped: true, reason: `Cooldown active (${Math.round(diffMinutes)}m elapsed)` });
      }
      detection.lastDetectedAt = now;
      await detection.save();
    } else {
      await Detection.create({ deviceA: device.deviceId, deviceB: other.deviceId, lastDetectedAt: now });
    }

    const reminder = await getRandomReminder();
    if (!reminder) {
      return res.status(200).json({ sent: false, reason: 'No reminders configured' });
    }

    const message = `💫 Reminder: ${reminder.text}`;
    // send message to both phones
    await sendWhatsAppMessage({ toPhoneNumber: device.phoneNumber, message });
    await sendWhatsAppMessage({ toPhoneNumber: other.phoneNumber, message });

    res.json({ sent: true, reminder: reminder.text });
  } catch (e: any) {
    console.error('Detection error', e.message);
    res.status(500).json({ error: 'Internal error' });
  }
}
