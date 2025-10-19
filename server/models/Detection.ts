import mongoose, { Schema, Document } from 'mongoose';

export interface IDetection extends Document {
  deviceA: string; // deviceId
  deviceB: string; // paired deviceId
  lastDetectedAt: Date;
}

const DetectionSchema = new Schema<IDetection>(
  {
    deviceA: { type: String, required: true, index: true },
    deviceB: { type: String, required: true, index: true },
    lastDetectedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

DetectionSchema.index({ deviceA: 1, deviceB: 1 }, { unique: true });

export default mongoose.model<IDetection>('Detection', DetectionSchema);
