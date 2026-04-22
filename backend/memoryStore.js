import bcrypt from 'bcryptjs';

export const memoryStore = {
  users: [],
  bookings: [],
  memberships: [
    { _id: 'mem-starter', type: 'Starter', price: 49, features: ['Gym floor access', '2 classes monthly', 'Locker access'], description: 'Perfect for beginners', createdBy: null },
    { _id: 'mem-premium', type: 'Premium', price: 89, features: ['Unlimited classes', 'Trainer check-ins', 'Recovery lounge'], description: 'Most popular plan', createdBy: null },
    { _id: 'mem-elite', type: 'Elite', price: 139, features: ['Personal programming', 'Nutrition review', 'Priority booking'], description: 'Premium experience', createdBy: null },
  ],
  trainers: [
    { _id: 'trainer-aisha', name: 'Aisha Rao', focus: 'Strength coach', stats: '8 yrs coaching' },
    { _id: 'trainer-marcus', name: 'Marcus Lee', focus: 'Boxing and HIIT', stats: '12 fight camps' },
    { _id: 'trainer-nina', name: 'Nina Patel', focus: 'Mobility and recovery', stats: '400+ clients' },
    { _id: 'trainer-dev', name: 'Dev Mehta', focus: 'Hypertrophy specialist', stats: 'NASM certified' },
  ],
  classes: [
    { _id: 'class-mon-strength', day: 'Monday', time: '06:30', type: 'Strength', coach: 'Aisha Rao' },
    { _id: 'class-tue-boxing', day: 'Tuesday', time: '18:00', type: 'Boxing', coach: 'Marcus Lee' },
    { _id: 'class-wed-mobility', day: 'Wednesday', time: '07:15', type: 'Mobility', coach: 'Nina Patel' },
    { _id: 'class-thu-hiit', day: 'Thursday', time: '19:00', type: 'HIIT', coach: 'Marcus Lee' },
    { _id: 'class-sat-hypertrophy', day: 'Saturday', time: '09:30', type: 'Hypertrophy', coach: 'Dev Mehta' },
  ],
  subscriptions: [],
  trainerApplications: [],
  personalTraining: [],
};

export function usingMongo() {
  return globalThis.pulsefitDbMode === 'mongo';
}

export async function createMemoryUser({ name, email, password }) {
  const user = {
    _id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 12),
    role: 'member',
  };
  memoryStore.users.push(user);
  return user;
}
