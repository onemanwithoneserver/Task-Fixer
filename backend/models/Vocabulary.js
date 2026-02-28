import mongoose from 'mongoose';

const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true
  },
  meaning: {
    type: String,
    default: '',
    trim: true
  },
  example: {
    type: String,
    default: '',
    trim: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    default: 'default-user',
    index: true
  }
}, {
  timestamps: true
});

// Index for faster searches
vocabularySchema.index({ word: 'text', meaning: 'text', example: 'text' });

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

export default Vocabulary;
