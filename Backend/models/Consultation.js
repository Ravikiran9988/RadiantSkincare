const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  date: {
    type: Date,
    required: true,
  },
  concern: {
    type: String,
  },
}, {
  timestamps: true,
});

// ✅ This line prevents OverwriteModelError:
module.exports = mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);
