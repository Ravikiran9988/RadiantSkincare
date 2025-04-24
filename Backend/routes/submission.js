const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const UserSubmission = require('../models/submission');

// ✅ Multer config
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ Recommendation logic
function generateRecommendations(skinType, skinIssues) {
  let tips = '';

  if (skinType === 'Oily') tips += 'Use a gel-based cleanser. ';
  if (skinType === 'Dry') tips += 'Use a hydrating cream cleanser. ';
  if (skinType === 'Combination') tips += 'Use a balancing cleanser. ';
  if (skinType === 'Sensitive') tips += 'Use fragrance-free products. ';

  const issues = skinIssues.toLowerCase();
  if (issues.includes('acne')) tips += 'Include salicylic acid. ';
  if (issues.includes('redness')) tips += 'Try niacinamide. ';
  if (issues.includes('pigmentation')) tips += 'Use vitamin C. ';

  return tips.trim();
}

// ✅ POST /api/submit - Submit skin data
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  const { skinType, skinIssues } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    const Disease = generateRecommendations(skinType, skinIssues);

    const submission = new UserSubmission({
      userId: req.user.id,
      skinType,
      skinIssues,
      imagePath,
      Disease
    });

    await submission.save();
    res.status(200).json({ message: 'Submission saved', Disease });
  } catch (err) {
    console.error('Submission Error:', err);
    res.status(500).json({ message: 'Submission failed' });
  }
});

module.exports = router;
