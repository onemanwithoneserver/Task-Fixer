import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    default: '',
    trim: true
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString()
  },
  userId: {
    type: String,
    default: 'default-user',
    index: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

// Text search index
querySchema.index({ title: 'text', desc: 'text' });

export default mongoose.model('Query', querySchema);
