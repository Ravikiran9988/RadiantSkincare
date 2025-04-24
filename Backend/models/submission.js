const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  skinType: {
    type: String,
    required: true
  },
  skinIssues: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    default: ''
  },
  Disease: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserSubmission', submissionSchema);
