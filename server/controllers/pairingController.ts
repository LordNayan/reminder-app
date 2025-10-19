import { Request, Response } from 'express';
import Device from '@models/Device.js';
import jwt from 'jsonwebtoken';

export async function pairDevice(req: Request, res: Response) {
  try {
    const { deviceId, phoneNumber, targetDeviceId } = req.body as { deviceId: string; phoneNumber: string; targetDeviceId?: string };
    if (!deviceId || !phoneNumber) {
      return res.status(400).json({ error: 'deviceId and phoneNumber required' });
    }
    let device = await Device.findOne({ deviceId });
    if (!device) {
      device = await Device.create({ deviceId, phoneNumber });
    } else if (device.phoneNumber !== phoneNumber) {
      device.phoneNumber = phoneNumber;
      await device.save();
    }

    if (targetDeviceId) {
      const other = await Device.findOne({ deviceId: targetDeviceId });
      if (!other) {
        return res.status(404).json({ error: 'Target device not found' });
      }
      // Set pairing both ways
      device.pairedWith = other.deviceId;
      other.pairedWith = device.deviceId;
      await device.save();
      await other.save();
    }

    const token = jwt.sign({ deviceId: device.deviceId }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '90d' });
    res.json({ token, deviceId: device.deviceId, pairedWith: device.pairedWith });
  } catch (e: any) {
    console.error('Pairing error', e.message);
    res.status(500).json({ error: 'Internal error' });
  }
}
