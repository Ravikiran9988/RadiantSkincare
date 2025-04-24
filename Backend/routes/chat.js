const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User1');

// GET /api/chat/history/:doctorName
router.get('/history/:doctorName', auth, async (req, res) => {
  const { doctorName } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const history = user.chatHistory?.filter(chat => chat.doctorName === doctorName) || [];

    res.json({ chatHistory: history });
  } catch (err) {
    console.error('❌ Chat History Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
