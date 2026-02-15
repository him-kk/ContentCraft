const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const AudienceService = require('../services/audienceService');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET /api/audience/personas
// @desc    Get auto-generated personas
// @access  Private
router.get('/personas', protect, async (req, res, next) => {
  try {
    const personas = await AudienceService.generatePersonas(req.user.id);

    if (!personas.success) {
      return next(new ErrorResponse(personas.error, 500));
    }

    res.json({
      success: true,
      data: personas,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/audience/personas/list
// @desc    Get existing personas
// @access  Private
router.get('/personas/list', protect, async (req, res, next) => {
  try {
    const AudiencePersona = require('../models/AudiencePersona');
    const personas = await AudiencePersona.getByUser(req.user.id);

    res.json({
      success: true,
      data: personas,
      count: personas.length,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/audience/analyze
// @desc    Analyze audience data
// @access  Private
router.post('/analyze', protect, async (req, res, next) => {
  try {
    const { platformData = {} } = req.body;

    const result = await AudienceService.generatePersonas(req.user.id, platformData);

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

// @route   GET /api/audience/behavior-patterns
// @desc    Get behavioral patterns
// @access  Private
router.get('/behavior-patterns', protect, async (req, res, next) => {
  try {
    const { personaId } = req.query;

    const result = await AudienceService.analyzeBehaviorPatterns(req.user.id, personaId);

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

// @route   GET /api/audience/pain-points
// @desc    Identify audience pain points
// @access  Private
router.get('/pain-points', protect, async (req, res, next) => {
  try {
    const result = await AudienceService.identifyPainPoints(req.user.id);

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

// @route   GET /api/audience/content-gaps
// @desc    Find content gap opportunities
// @access  Private
router.get('/content-gaps', protect, async (req, res, next) => {
  try {
    const result = await AudienceService.findContentGaps(req.user.id);

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

// @route   GET /api/audience/demographics
// @desc    Get demographic breakdown
// @access  Private
router.get('/demographics', protect, async (req, res, next) => {
  try {
    const result = await AudienceService.getDemographics(req.user.id);

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

// @route   GET /api/audience/personality-profile
// @desc    Get personality insights
// @access  Private
router.get('/personality-profile', protect, async (req, res, next) => {
  try {
    const result = await AudienceService.getPersonalityProfile(req.user.id);

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

// @route   POST /api/audience/segment
// @desc    Create audience segments
// @access  Private
router.post('/segment', protect, async (req, res, next) => {
  try {
    const { criteria } = req.body;

    const result = await AudienceService.createSegments(req.user.id, criteria);

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

// @route   GET /api/audience/purchase-intent
// @desc    Get purchase intent scores
// @access  Private
router.get('/purchase-intent', protect, async (req, res, next) => {
  try {
    const result = await AudienceService.getPurchaseIntent(req.user.id);

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

// @route   GET /api/audience/evolution
// @desc    Track audience changes over time
// @access  Private
router.get('/evolution', protect, async (req, res, next) => {
  try {
    const { months = 6 } = req.query;

    const result = await AudienceService.trackEvolution(req.user.id, parseInt(months));

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

module.exports = router;