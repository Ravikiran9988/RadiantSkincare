const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  task: String,
  checked: Boolean,
});

const dashboardDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  routineChecklist: [checklistItemSchema],
});

module.exports = mongoose.model('DashboardData', dashboardDataSchema);
