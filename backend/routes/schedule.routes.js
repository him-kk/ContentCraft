// module.exports = router;
const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/auth');
const { createScheduleValidator } = require('../utils/validators');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET /api/schedule
// @desc    Get scheduled posts
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { status, upcoming = 'true' } = req.query;

    const query = { user: req.user.id };

    if (status) query.status = status;
    if (upcoming === 'true') {
      query.scheduledAt = { $gte: new Date() };
    }

    const schedules = await Schedule.find(query)
      .sort({ scheduledAt: 1 })
      .populate('content', 'title content type status');

    res.json({
      success: true,
      data: schedules,
      count: schedules.length,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/schedule
// @desc    Create schedule
// @access  Private
router.post('/', protect, createScheduleValidator, async (req, res, next) => {
  try {
    const schedule = await Schedule.create({
      user: req.user.id,
      ...req.body,
    });

    await schedule.populate('content');

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
});

// IMPORTANT: Specific routes must come BEFORE parameterized routes
// @route   GET /api/schedule/optimal-times
// @desc    Get best posting times
// @access  Private
router.get('/optimal-times', protect, async (req, res, next) => {
  try {
    const { platform = 'twitter' } = req.query;

    // Platform-specific optimal times
    const optimalTimes = {
      twitter: [
        { day: 'Monday', times: ['8:00 AM', '12:00 PM', '5:00 PM'] },
        { day: 'Tuesday', times: ['8:00 AM', '12:00 PM', '5:00 PM'] },
        { day: 'Wednesday', times: ['8:00 AM', '12:00 PM', '5:00 PM'] },
        { day: 'Thursday', times: ['8:00 AM', '12:00 PM', '5:00 PM'] },
        { day: 'Friday', times: ['8:00 AM', '12:00 PM', '3:00 PM'] },
        { day: 'Saturday', times: ['9:00 AM', '12:00 PM', '8:00 PM'] },
        { day: 'Sunday', times: ['9:00 AM', '12:00 PM', '7:00 PM'] },
      ],
      linkedin: [
        { day: 'Monday', times: ['7:00 AM', '12:00 PM', '5:00 PM'] },
        { day: 'Tuesday', times: ['7:00 AM', '12:00 PM', '5:00 PM'] },
        { day: 'Wednesday', times: ['7:00 AM', '12:00 PM', '5:00 PM'] },
        { day: 'Thursday', times: ['7:00 AM', '12:00 PM', '5:00 PM'] },
        { day: 'Friday', times: ['7:00 AM', '11:00 AM', '4:00 PM'] },
        { day: 'Saturday', times: [] },
        { day: 'Sunday', times: [] },
      ],
      instagram: [
        { day: 'Monday', times: ['11:00 AM', '1:00 PM', '7:00 PM'] },
        { day: 'Tuesday', times: ['11:00 AM', '1:00 PM', '7:00 PM'] },
        { day: 'Wednesday', times: ['11:00 AM', '1:00 PM', '7:00 PM'] },
        { day: 'Thursday', times: ['11:00 AM', '1:00 PM', '7:00 PM'] },
        { day: 'Friday', times: ['11:00 AM', '1:00 PM', '7:00 PM'] },
        { day: 'Saturday', times: ['10:00 AM', '1:00 PM', '7:00 PM'] },
        { day: 'Sunday', times: ['10:00 AM', '1:00 PM', '7:00 PM'] },
      ],
    };

    res.json({
      success: true,
      data: optimalTimes[platform] || optimalTimes.twitter,
      platform,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/schedule/calendar
// @desc    Get calendar view data
// @access  Private
router.get('/calendar/view', protect, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

    const calendarData = await Schedule.getCalendarData(req.user.id, start, end);

    res.json({
      success: true,
      data: calendarData,
      range: { start, end },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/schedule/bulk
// @desc    Bulk schedule posts
// @access  Private
router.post('/bulk', protect, async (req, res, next) => {
  try {
    const { schedules } = req.body;

    const created = await Schedule.insertMany(
      schedules.map(s => ({
        user: req.user.id,
        ...s,
      }))
    );

    res.status(201).json({
      success: true,
      data: created,
      count: created.length,
    });
  } catch (error) {
    next(error);
  }
});

// IMPORTANT: This parameterized route MUST come AFTER all specific routes
// @route   GET /api/schedule/:id
// @desc    Get single schedule
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('content');

    if (!schedule) {
      return next(new ErrorResponse('Schedule not found', 404));
    }

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/schedule/:id
// @desc    Update schedule
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    let schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!schedule) {
      return next(new ErrorResponse('Schedule not found', 404));
    }

    // Don't allow updates to already published schedules
    if (schedule.status === 'completed') {
      return next(new ErrorResponse('Cannot update completed schedule', 400));
    }

    schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('content');

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/schedule/:id
// @desc    Cancel/delete schedule
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!schedule) {
      return next(new ErrorResponse('Schedule not found', 404));
    }

    await schedule.cancel(req.user.id);

    res.json({
      success: true,
      message: 'Schedule cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;