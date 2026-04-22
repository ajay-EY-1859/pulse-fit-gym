import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    focus: {
      type: String,
      required: true,
    },
    stats: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Trainer', trainerSchema);
