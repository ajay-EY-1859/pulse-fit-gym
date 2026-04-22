import { memoryStore, usingMongo } from '../memoryStore.js';
import ClassSession from '../models/ClassSession.js';

const defaultClasses = [
  { day: 'Monday', time: '06:30', type: 'Strength', coach: 'Aisha Rao' },
  { day: 'Tuesday', time: '18:00', type: 'Boxing', coach: 'Marcus Lee' },
  { day: 'Wednesday', time: '07:15', type: 'Mobility', coach: 'Nina Patel' },
  { day: 'Thursday', time: '19:00', type: 'HIIT', coach: 'Marcus Lee' },
  { day: 'Saturday', time: '09:30', type: 'Hypertrophy', coach: 'Dev Mehta' },
];

export async function seedClasses() {
  if (!usingMongo()) {
    return;
  }

  const count = await ClassSession.countDocuments();

  if (count === 0) {
    await ClassSession.insertMany(defaultClasses);
  }
}

export async function getClasses(req, res, next) {
  try {
    if (!usingMongo()) {
      const classes = memoryStore.classes.filter((item) => !req.query.type || req.query.type === 'All' || item.type === req.query.type);
      return res.json(classes);
    }

    const filter = req.query.type && req.query.type !== 'All' ? { type: req.query.type } : {};
    const classes = await ClassSession.find(filter).sort({ day: 1, time: 1 });
    return res.json(classes);
  } catch (error) {
    return next(error);
  }
}
