import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    mockPaymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Subscription', subscriptionSchema);
