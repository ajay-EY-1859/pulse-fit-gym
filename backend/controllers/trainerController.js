import { memoryStore, usingMongo } from '../memoryStore.js';
import Trainer from '../models/Trainer.js';
import ClassSession from '../models/ClassSession.js';
import PersonalTraining from '../models/PersonalTraining.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

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

export async function getMyClasses(req, res, next) {
  try {
    const trainerName = req.user.name;

    if (!usingMongo()) {
      const classes = memoryStore.classes.filter((item) => item.coach === trainerName);
      return res.json({ classes });
    }

    const classes = await ClassSession.find({ coach: trainerName }).sort({ day: 1, time: 1 });
    return res.json({ classes });
  } catch (error) {
    return next(error);
  }
}

export async function getMyMembers(req, res, next) {
  try {
    const trainerName = req.user.name;

    if (!usingMongo()) {
      const classTypes = memoryStore.classes.filter((item) => item.coach === trainerName).map((item) => item.type);
      const memberIds = [
        ...new Set(memoryStore.bookings.filter((item) => classTypes.includes(item.classType)).map((item) => item.userId)),
      ];
      const members = memberIds
        .map((memberId) => memoryStore.users.find((user) => user._id === memberId))
        .filter(Boolean)
        .map(({ password: _password, ...user }) => user);

      return res.json({ members, totalMembers: members.length });
    }

    const classes = await ClassSession.find({ coach: trainerName }).select('type');
    const classTypes = classes.map((item) => item.type);
    const bookings = await Booking.find({ classType: { $in: classTypes } }).populate('userId', 'name email role');
    const membersById = new Map();

    for (const booking of bookings) {
      if (booking.userId) {
        membersById.set(booking.userId._id.toString(), booking.userId);
      }
    }

    const members = [...membersById.values()];
    return res.json({ members, totalMembers: members.length });
  } catch (error) {
    return next(error);
  }
}

export async function getPersonalTrainingAssignments(req, res, next) {
  try {
    const trainerId = req.user.id;

    if (!usingMongo()) {
      const assignments = memoryStore.personalTraining
        .filter((item) => item.trainerId === trainerId && item.status === 'active')
        .map((item) => {
          const member = memoryStore.users.find((user) => user._id === item.memberId);
          return {
            ...item,
            member: member ? { _id: member._id, name: member.name, email: member.email, role: member.role } : null,
          };
        });

      return res.json({ assignments });
    }

    const assignments = await PersonalTraining.find({ trainerId, status: 'active' }).populate(
      'memberId',
      'name email role',
    );
    return res.json({ assignments });
  } catch (error) {
    return next(error);
  }
}

export async function assignPersonalTraining(req, res, next) {
  try {
    const trainerId = req.user.id;
    const { memberId } = req.params;
    const { sessionsPerWeek, notes } = req.body;
    const weeklySessions = Number(sessionsPerWeek);

    if (!Number.isInteger(weeklySessions) || weeklySessions < 1) {
      return res.status(400).json({ message: 'sessionsPerWeek must be a positive integer' });
    }

    if (!usingMongo()) {
      const member = memoryStore.users.find((user) => user._id === memberId && user.role === 'member');
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }

      let assignment = memoryStore.personalTraining.find(
        (item) => item.trainerId === trainerId && item.memberId === memberId && item.status === 'active',
      );

      if (assignment) {
        assignment.sessionsPerWeek = weeklySessions;
        assignment.notes = notes ?? assignment.notes;
        return res.json({ message: 'Personal training updated', assignment });
      }

      assignment = {
        _id: `pt-${Date.now()}`,
        trainerId,
        memberId,
        status: 'active',
        startDate: new Date(),
        endDate: null,
        sessionsPerWeek: weeklySessions,
        notes: notes || '',
      };
      memoryStore.personalTraining.push(assignment);
      return res.status(201).json({ message: 'Personal training assigned', assignment });
    }

    const member = await User.findOne({ _id: memberId, role: 'member' });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    let assignment = await PersonalTraining.findOne({ trainerId, memberId, status: 'active' });
    if (assignment) {
      assignment.sessionsPerWeek = weeklySessions;
      assignment.notes = notes ?? assignment.notes;
      await assignment.save();
      return res.json({ message: 'Personal training updated', assignment });
    }

    assignment = await PersonalTraining.create({
      trainerId,
      memberId,
      status: 'active',
      startDate: new Date(),
      sessionsPerWeek: weeklySessions,
      notes: notes || '',
    });

    return res.status(201).json({ message: 'Personal training assigned', assignment });
  } catch (error) {
    return next(error);
  }
}

export async function endPersonalTraining(req, res, next) {
  try {
    const trainerId = req.user.id;
    const { assignmentId } = req.params;

    if (!usingMongo()) {
      const assignment = memoryStore.personalTraining.find((item) => item._id === assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      if (assignment.trainerId !== trainerId) {
        return res.status(403).json({ message: 'Not authorized for this assignment' });
      }

      assignment.status = 'completed';
      assignment.endDate = new Date();
      return res.json({ message: 'Personal training ended', assignment });
    }

    const assignment = await PersonalTraining.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.trainerId.toString() !== trainerId) {
      return res.status(403).json({ message: 'Not authorized for this assignment' });
    }

    assignment.status = 'completed';
    assignment.endDate = new Date();
    await assignment.save();

    return res.json({ message: 'Personal training ended', assignment });
  } catch (error) {
    return next(error);
  }
}
