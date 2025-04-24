const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Consultation = require('../models/Consultation');
const authenticateDoctor = require('../middleware/authenticateDoctor');

// @route   GET /api/doctor/me
// @desc    Get logged-in doctor profile
// @access  Private
router.get('/me', authenticateDoctor, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctorId).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctor/consultations
// @desc    Get all consultations for the logged-in doctor
// @access  Private
router.get('/consultations', authenticateDoctor, async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctorId: req.doctorId })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json(consultations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
