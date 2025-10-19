import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema = new Schema<IReminder>(
  {
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReminder>('Reminder', ReminderSchema);
