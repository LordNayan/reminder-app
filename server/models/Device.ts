import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string; // UUID generated on device
  phoneNumber: string; // for WhatsApp
  pairedWith?: string; // deviceId of paired device
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSchema = new Schema<IDevice>(
  {
    deviceId: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    pairedWith: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IDevice>('Device', DeviceSchema);
