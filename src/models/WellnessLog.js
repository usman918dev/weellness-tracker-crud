import mongoose from 'mongoose';

const WellnessLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
    enum: ['water', 'sleep', 'exercise', 'mood'],
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  details: {
    // For water: amount in ml
    amount: Number,
    // For sleep: start and end time
    startTime: Date,
    endTime: Date,
    // For exercise: duration and type
    duration: Number,
    exerciseType: String,
    // For mood: rating and notes
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: String,
  },
}, {
  timestamps: true,
  // Add indexes for frequent queries
  indexes: [
    { user: 1, date: -1 },
    { user: 1, type: 1 },
  ],
});

export default mongoose.models.WellnessLog || mongoose.model('WellnessLog', WellnessLogSchema);
