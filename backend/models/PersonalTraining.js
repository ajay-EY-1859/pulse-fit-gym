import mongoose from 'mongoose';

const personalTrainingSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    endDate: {
      type: Date,
      default: null,
    },
    sessionsPerWeek: {
      type: Number,
      default: 1,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

export default mongoose.model('PersonalTraining', personalTrainingSchema);
