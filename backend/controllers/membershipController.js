import { memoryStore, usingMongo } from '../memoryStore.js';
import Membership from '../models/Membership.js';

const defaultPlans = [
  { type: 'Starter', price: 49, features: ['Gym floor access', '2 classes monthly', 'Locker access'] },
  { type: 'Premium', price: 89, features: ['Unlimited classes', 'Trainer check-ins', 'Recovery lounge'] },
  { type: 'Elite', price: 139, features: ['Personal programming', 'Nutrition review', 'Priority booking'] },
];

export async function seedMemberships() {
  if (!usingMongo()) {
    return;
  }

  const count = await Membership.countDocuments();

  if (count === 0) {
    await Membership.insertMany(defaultPlans);
  }
}

export async function createMembership(req, res, next) {
  try {
    const { type, price, features = [] } = req.body;

    if (!type || price === undefined) {
      return res.status(400).json({ message: 'Type and price are required' });
    }

    if (!usingMongo()) {
      const plan = { _id: `mem-${Date.now()}`, type, price, features };
      memoryStore.memberships.push(plan);
      return res.status(201).json(plan);
    }

    const plan = await Membership.create({ type, price, features });
    return res.status(201).json(plan);
  } catch (error) {
    return next(error);
  }
}

export async function getMemberships(_req, res, next) {
  try {
    if (!usingMongo()) {
      return res.json([...memoryStore.memberships].sort((a, b) => a.price - b.price));
    }

    const plans = await Membership.find().sort({ price: 1 });
    return res.json(plans);
  } catch (error) {
    return next(error);
  }
}
