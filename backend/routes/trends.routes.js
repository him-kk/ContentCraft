const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const TrendService = require('../services/trendService');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET /api/trends/live
// @desc    Get live trending topics
// @access  Private
router.get('/live', protect, async (req, res, next) => {
  try {
    const { limit = 20, platforms, minVelocity } = req.query;

    const platformArray = platforms ? platforms.split(',') : [];

    const result = await TrendService.getLiveTrends({
      limit: parseInt(limit),
      platforms: platformArray,
      minVelocity: parseInt(minVelocity) || 100,
    });

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

// @route   GET /api/trends/:platform
// @desc    Get trends for specific platform
// @access  Private
router.get('/:platform', protect, async (req, res, next) => {
  try {
    const { platform } = req.params;
    const { limit = 20 } = req.query;

    const result = await TrendService.getTrendsByPlatform(platform, parseInt(limit));

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

// @route   POST /api/trends/generate-content
// @desc    Generate content from trend
// @access  Private
router.post('/generate-content', protect, async (req, res, next) => {
  try {
    const { trendId, platform, options = {} } = req.body;

    const result = await TrendService.generateTrendContent(trendId, platform, options);

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

// @route   POST /api/trends/subscribe
// @desc    Subscribe to trend alerts
// @access  Private
router.post('/subscribe', protect, async (req, res, next) => {
  try {
    const { keywords, options = {} } = req.body;

    const result = await TrendService.subscribeToAlerts(req.user.id, keywords, options);

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

// @route   GET /api/trends/lifecycle/:trendId
// @desc    Get trend lifecycle
// @access  Private
router.get('/lifecycle/:trendId', protect, async (req, res, next) => {
  try {
    const { trendId } = req.params;

    const result = await TrendService.getTrendLifecycle(trendId);

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

// @route   GET /api/trends/hashtag-momentum
// @desc    Track hashtag momentum
// @access  Private
router.get('/hashtag-momentum', protect, async (req, res, next) => {
  try {
    const { hashtags } = req.query;

    // In production, track actual hashtag momentum
    // For now, return simulated data
    const hashtagArray = hashtags ? hashtags.split(',') : ['#AI', '#Tech'];

    const momentum = hashtagArray.map(tag => ({
      hashtag: tag,
      velocity: Math.floor(Math.random() * 1000),
      change24h: (Math.random() * 200 - 100).toFixed(1),
      trending: Math.random() > 0.5,
    }));

    res.json({
      success: true,
      data: momentum,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/trends/niche
// @desc    Get niche-specific trends
// @access  Private
router.get('/niche/list', protect, async (req, res, next) => {
  try {
    const { categories, limit = 10 } = req.query;
    const categoryArray = categories ? categories.split(',') : ['tech', 'business'];

    const result = await TrendService.getNicheTrends(categoryArray, parseInt(limit));

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

// @route   GET /api/trends/calendar
// @desc    Get upcoming predictable trends
// @access  Private
router.get('/calendar/upcoming', protect, async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    const result = await TrendService.getTrendCalendar(parseInt(days));

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

// @route   GET /api/trends/opportunities
// @desc    Get trend opportunities
// @access  Private
router.get('/opportunities/list', protect, async (req, res, next) => {
  try {
    const { niche, limit = 10 } = req.query;

    const result = await TrendService.getTrendOpportunities(niche, parseInt(limit));

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

// @route   POST /api/trends/analyze-competitor
// @desc    Analyze competitor trend usage
// @access  Private
router.post('/analyze-competitor', protect, async (req, res, next) => {
  try {
    const { competitorHandle, platform } = req.body;

    const result = await TrendService.analyzeCompetitorTrends(competitorHandle, platform);

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