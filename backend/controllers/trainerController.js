import { memoryStore, usingMongo } from '../memoryStore.js';
import Trainer from '../models/Trainer.js';

const defaultTrainers = [
  { name: 'Aisha Rao', focus: 'Strength coach', stats: '8 yrs coaching' },
  { name: 'Marcus Lee', focus: 'Boxing and HIIT', stats: '12 fight camps' },
  { name: 'Nina Patel', focus: 'Mobility and recovery', stats: '400+ clients' },
  { name: 'Dev Mehta', focus: 'Hypertrophy specialist', stats: 'NASM certified' },
];

export async function seedTrainers() {
  if (!usingMongo()) {
    return;
  }

  const count = await Trainer.countDocuments();

  if (count === 0) {
    await Trainer.insertMany(defaultTrainers);
  }
}

export async function getTrainers(_req, res, next) {
  try {
    if (!usingMongo()) {
      return res.json([...memoryStore.trainers].sort((a, b) => a.name.localeCompare(b.name)));
    }

    const trainers = await Trainer.find().sort({ name: 1 });
    return res.json(trainers);
  } catch (error) {
    return next(error);
  }
}
