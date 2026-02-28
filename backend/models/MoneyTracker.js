import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const moneyTrackerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0]
  },
  gateway: {
    type: String,
    default: 'UPI / GPay',
    trim: true
  },
  originalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  remainingAmount: {
    type: Number,
    required: true,
    min: 0
  },
  payments: {
    type: [paymentSchema],
    default: []
  },
  userId: {
    type: String,
    default: 'default-user',
    index: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

// Text search index
moneyTrackerSchema.index({ name: 'text' });

export default mongoose.model('MoneyTracker', moneyTrackerSchema);
