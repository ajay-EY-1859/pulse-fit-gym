import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classType: {
      type: String,
      required: true,
      enum: ['Strength', 'Boxing', 'Mobility', 'HIIT', 'Hypertrophy'],
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Booking', bookingSchema);
