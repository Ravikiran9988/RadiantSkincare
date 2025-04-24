const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User1');
const sendEmail = require('../utils/sendEmail');
const authMiddleware = require('../middleware/auth');

// ✅ POST /register - Register & send OTP
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      username: username.trim(),
      email: email.trim(),
      password: hashed,
      otp,
      isVerified: false
    });

    await user.save();

    // Fix template string
    await sendEmail(
      email.trim(),
      'Verify your Radiant Skincare account',
      `Your OTP is ${otp}`
    );

    res.status(201).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// ✅ POST /verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email: email.trim() });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('OTP Verification Error:', err);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// ✅ POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login error' });
  }
});

// ✅ GET /user/me
router.get('/user/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ username: user.username, email: user.email });
  } catch (err) {
    console.error('Fetch Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT /user/update-profile
router.put('/user/update-profile', authMiddleware, async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required' });
  }

  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        username: username.trim(),
        email: email.trim()
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ username: updated.username, email: updated.email });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
