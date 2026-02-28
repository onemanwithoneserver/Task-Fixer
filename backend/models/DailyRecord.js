import mongoose from "mongoose";

const DailyRecordSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },

  submitted: {
    type: Boolean,
    default: false,
  },

  stats: {
    completedTasks: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    habitsDone: { type: Number, default: 0 },
    totalHabits: { type: Number, default: 0 },
    learningItems: { type: Number, default: 0 },
    totalLearningItems: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
  },

  planner: {
    type: Array,
    default: [],
  },

  habits: {
    type: Array,
    default: [],
  },

  learning: {
    type: Object,
    default: {},
  },

  queries: {
    type: Array,
    default: [],
  },

  milestones: {
    type: Array,
    default: [],
  },

  reflection: {
    type: String,
    default: "",
  },

  goal: {
    type: String,
    default: "",
  },

  cycleDay: {
    type: Number,
    default: 1,
  },

  userId: {
    type: String,
    default: 'default-user',
    index: true,
  },

}, { timestamps: true });

// Compound index for efficient queries
DailyRecordSchema.index({ date: 1, userId: 1 });

export default mongoose.model("DailyRecord", DailyRecordSchema);
