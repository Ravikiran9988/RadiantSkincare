const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');
const authMiddleware = require('../middleware/auth');

// Get routine
router.get('/', authMiddleware, async (req, res) => {
  const routine = await Routine.findOne({ userId: req.user.id });
  res.json(routine || { steps: [] });
});

// Save/update routine
router.post('/', authMiddleware, async (req, res) => {
  const { steps } = req.body;
  let routine = await Routine.findOne({ userId: req.user.id });
  if (!routine) {
    routine = new Routine({ userId: req.user.id, steps });
  } else {
    routine.steps = steps;
  }
  await routine.save();
  res.json({ success: true });
});

module.exports = router; // ✅ THIS LINE IS CRUCIAL
