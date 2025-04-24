const mongoose = require('mongoose');

const routineStepSchema = new mongoose.Schema({
  stepName: String,
  product: String,
  timeOfDay: { type: String, enum: ['morning', 'evening'] },
});

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  steps: [routineStepSchema],
});

module.exports = mongoose.model('Routine', routineSchema);
