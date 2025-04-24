const mongoose = require('mongoose');

const analysisEntrySchema = new mongoose.Schema({
  skinType: { type: String, trim: true },
  skinIssues: { type: String, trim: true },
  result: { type: String, trim: true },
  date: { type: Date, default: Date.now },
});

const routineStepSchema = new mongoose.Schema({
  step: { type: String, trim: true },
  done: { type: Boolean, default: false },
});

const chatMessageSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  sender: { type: String, required: true }, // 'user' or 'doctor'
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    default: null,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  // Real-time Dashboard:
  analysisHistory: [analysisEntrySchema],
  routineChecklist: [routineStepSchema],

  // 🟢 Chat history with doctors
  chatHistory: [chatMessageSchema],
},
{ timestamps: true });

module.exports = mongoose.model('User1', userSchema);
