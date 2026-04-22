import { memoryStore, usingMongo } from '../memoryStore.js';
import Booking from '../models/Booking.js';

export async function createBooking(req, res, next) {
  try {
    const { classType, date } = req.body;

    if (!classType || !date) {
      return res.status(400).json({ message: 'Class type and date are required' });
    }

    if (!usingMongo()) {
      const booking = {
        _id: `booking-${Date.now()}`,
        userId: req.user.id,
        classType,
        date,
      };
      memoryStore.bookings.push(booking);
      return res.status(201).json(booking);
    }

    const booking = await Booking.create({
      userId: req.user.id,
      classType,
      date,
    });

    return res.status(201).json(booking);
  } catch (error) {
    return next(error);
  }
}

export async function getBookings(req, res, next) {
  try {
    if (!usingMongo()) {
      const bookings = memoryStore.bookings
        .filter((booking) => booking.userId === req.user.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      return res.json(bookings);
    }

    const bookings = await Booking.find({ userId: req.user.id }).sort({ date: 1 });
    return res.json(bookings);
  } catch (error) {
    return next(error);
  }
}
