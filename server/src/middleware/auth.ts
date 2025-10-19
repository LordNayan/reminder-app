import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Device from '@models/Device.js';

export interface AuthenticatedRequest extends Request {
  authDevice?: { deviceId: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret') as { deviceId: string };
    req.authDevice = { deviceId: payload.deviceId };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function requirePaired(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const deviceId = req.authDevice?.deviceId;
  if (!deviceId) return res.status(401).json({ error: 'Not authenticated' });
  const device = await Device.findOne({ deviceId });
  if (!device || !device.pairedWith) return res.status(400).json({ error: 'Device not paired' });
  next();
}
