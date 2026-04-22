import mongoose from 'mongoose';

const classSessionSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    coach: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('ClassSession', classSessionSchema);
