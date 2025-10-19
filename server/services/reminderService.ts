import Reminder, { IReminder } from '../models/Reminder.js';

export async function getRandomReminder(): Promise<IReminder | null> {
  const count = await Reminder.countDocuments();
  if (count === 0) return null;
  const random = Math.floor(Math.random() * count);
  const reminder = await Reminder.findOne().skip(random).exec();
  return reminder;
}
