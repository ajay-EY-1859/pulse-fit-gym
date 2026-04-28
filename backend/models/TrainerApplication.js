import mongoose from 'mongoose';

const trainerApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // Removed unique: true - we allow re-application after rejected/approved
      // Application-level checks prevent multiple pending applications
    },
    requestDate: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvalDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model('TrainerApplication', trainerApplicationSchema);
