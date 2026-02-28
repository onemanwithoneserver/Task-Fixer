import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
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
milestoneSchema.index({ text: 'text' });

export default mongoose.model('Milestone', milestoneSchema);
