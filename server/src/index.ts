import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import remindersRouter from '../routes/reminders.js';
import detectionRouter from '../routes/detection.js';
import pairingRouter from '../routes/pairing.js';

dotenv.config();

const app = express();
app.use(express.json());

// Basic health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api/reminders', remindersRouter);
app.use('/api/detection', detectionRouter);
app.use('/api/pair', pairingRouter);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reminder_app';

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (e) {
    console.error('Startup failure', e);
    process.exit(1);
  }
}

start();
