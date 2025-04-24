const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Dummy data — Replace with real analysis/fetch logic if needed
router.get('/dashboard/data', auth, async (req, res) => {
  try {
    res.json({
      welcomeMessage: 'Welcome to your Dashboard!',
      userId: req.user.id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
