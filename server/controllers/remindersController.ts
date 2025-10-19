import { Request, Response } from 'express';
import Reminder from '@models/Reminder.js';

export async function listReminders(_req: Request, res: Response) {
  const reminders = await Reminder.find().sort({ createdAt: -1 }).exec();
  res.json(reminders.map(r => ({ id: r._id, text: r.text })));
}

export async function createReminder(req: Request, res: Response) {
  const { text } = req.body as { text: string };
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'text required' });
  }
  const reminder = await Reminder.create({ text: text.trim() });
  res.status(201).json({ id: reminder._id, text: reminder.text });
}
