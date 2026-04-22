import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import classRoutes from './routes/classRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import { seedClasses } from './controllers/classController.js';
import { seedMemberships } from './controllers/membershipController.js';
import { seedTrainers } from './controllers/trainerController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: globalThis.pulsefitDbMode || 'starting' });
});

app.use('/api/auth', authRoutes);
app.use('/api/book', bookingRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/trainers', trainerRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    globalThis.pulsefitDbMode = 'mongo';
    await seedClasses();
    await seedMemberships();
    await seedTrainers();
  } catch (error) {
    globalThis.pulsefitDbMode = 'memory';
    console.warn(`MongoDB unavailable, using in-memory dev data: ${error.message}`);
  }

  app.listen(port, () => {
    console.log(`PulseFit API running on port ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
