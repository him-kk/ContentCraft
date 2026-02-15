const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const RecycleService = require('../services/recycleService');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET /api/recycle/top-performers
// @desc    Get top-performing past content
// @access  Private
router.get('/top-performers', protect, async (req, res, next) => {
  try {
    const { limit = 10, days = 180, minEngagement = 5 } = req.query;

    const result = await RecycleService.getTopPerformers(req.user.id, {
      limit: parseInt(limit),
      days: parseInt(days),
      minEngagement: parseInt(minEngagement),
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

// @route   POST /api/recycle/remix
// @desc    Remix old content
// @access  Private
router.post('/remix', protect, async (req, res, next) => {
  try {
    const { contentId, options = {} } = req.body;

    const result = await RecycleService.remixContent(contentId, req.user.id, options);

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

// @route   GET /api/recycle/seasonal
// @desc    Get seasonal content to resurface
// @access  Private
router.get('/seasonal', protect, async (req, res, next) => {
  try {
    const result = await RecycleService.getSeasonalContent(req.user.id);

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

// @route   POST /api/recycle/update-stats
// @desc    Update content with new stats
// @access  Private
router.post('/update-stats', protect, async (req, res, next) => {
  try {
    const { contentId } = req.body;

    const result = await RecycleService.updateStats(contentId, req.user.id);

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

// @route   GET /api/recycle/unfinished-drafts
// @desc    Get unfinished drafts to complete
// @access  Private
router.get('/unfinished-drafts', protect, async (req, res, next) => {
  try {
    const result = await RecycleService.getUnfinishedDrafts(req.user.id);

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

// @route   GET /api/recycle/evergreen
// @desc    Get evergreen content to update
// @access  Private
router.get('/evergreen', protect, async (req, res, next) => {
  try {
    const result = await RecycleService.getEvergreenContent(req.user.id);

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

// @route   POST /api/recycle/schedule-auto
// @desc    Schedule automatic recycling
// @access  Private
router.post('/schedule-auto', protect, async (req, res, next) => {
  try {
    const options = req.body;

    const result = await RecycleService.scheduleAutoRecycling(req.user.id, options);

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

// @route   GET /api/recycle/suggestions
// @desc    Get recycling suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res, next) => {
  try {
    const result = await RecycleService.getRecyclingSuggestions(req.user.id);

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

// @route   GET /api/recycle/calendar
// @desc    Get content recycling calendar
// @access  Private
router.get('/calendar', protect, async (req, res, next) => {
  try {
    const { months = 3 } = req.query;

    const result = await RecycleService.getRecyclingCalendar(req.user.id, parseInt(months));

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

// @route   GET /api/recycle/performance
// @desc    Get recycling performance
// @access  Private
router.get('/performance', protect, async (req, res, next) => {
  try {
    const result = await RecycleService.getRecyclingPerformance(req.user.id);

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