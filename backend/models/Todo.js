import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    default: '',
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  userId: {
    type: String,
    default: 'default-user',
    index: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Text search index
todoSchema.index({ title: 'text', action: 'text' });

export default mongoose.model('Todo', todoSchema);
