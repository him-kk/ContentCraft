const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ViralityService = require('../services/viralityService');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET /api/virality/history
// @desc    Get virality score history
// @access  Private
router.get('/history', protect, async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    const result = await ViralityService.getUserHistory(req.user.id, parseInt(days));

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/virality/compare
// @desc    Compare content versions (A/B)
// @access  Private
router.post('/compare', protect, async (req, res, next) => {
  try {
    const { variants, platform } = req.body;

    const result = await ViralityService.compareVersions(variants, platform);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/virality/scores
// @desc    Get all virality scores for user
// @access  Private
router.get('/scores', protect, async (req, res, next) => {
  try {
    const ViralityScore = require('../models/ViralityScore');
    const { page = 1, limit = 20 } = req.query;

    const scores = await ViralityScore.find({ user: req.user.id })
      .sort({ analyzedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('score platform predictions.viralProbability analyzedAt');

    const total = await ViralityScore.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: scores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;