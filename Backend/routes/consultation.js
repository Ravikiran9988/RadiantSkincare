const express = require('express');
const router = express.Router();
const User = require('../models/User1'); // Ensure this matches your actual User model
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// POST /api/consultation/book
router.post('/book', auth, async (req, res) => {
  const { dateTime } = req.body;

  if (!dateTime) {
    return res.status(400).json({ message: 'Date and time are required' });
  }

  try {
    // 1. Get all doctors
    const doctors = await Doctor.find();
    if (!doctors.length) {
      return res.status(500).json({ message: 'No doctors available at the moment' });
    }

    // 2. Randomly assign a doctor
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];

    // 3. Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Fix: Ensure consultations array exists
    if (!user.consultations) {
      user.consultations = [];
    }

    // 4. Push consultation info
    user.consultations.push({
      doctorId: doctor._id,
      scheduledAt: dateTime
    });

    await user.save();

    // 5. Send success response
    res.json({
      message: 'Consultation booked',
      doctor: {
        name: doctor.name,
        avatar: doctor.avatar,
        languages: doctor.languages,
        specialization: doctor.specialization
      }
    });
  } catch (err) {
    console.error('❌ Booking Error:', err);
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
});

module.exports = router;
