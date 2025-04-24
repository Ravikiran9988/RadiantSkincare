const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  senderType: { type: String, enum: ['user', 'doctor'], required: true },
  content: String,
  image: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
