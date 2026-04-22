import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Membership', membershipSchema);
