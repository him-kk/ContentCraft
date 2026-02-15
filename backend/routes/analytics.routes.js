const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Content = require('../models/Content');
const { protect } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard overview
// @access  Private
router.get('/dashboard', protect, async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get content stats
    const contentStats = await Content.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get performance stats
    const performanceStats = await Content.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'published',
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$performance.views' },
          totalLikes: { $sum: '$performance.likes' },
          totalComments: { $sum: '$performance.comments' },
          totalShares: { $sum: '$performance.shares' },
          avgEngagement: { $avg: '$performance.engagementRate' },
        },
      },
    ]);

    // Get platform breakdown
    const platformStats = await Content.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'published',
        },
      },
      {
        $group: {
          _id: '$platform',
          posts: { $sum: 1 },
          avgEngagement: { $avg: '$performance.engagementRate' },
        },
      },
    ]);

    // Get recent analytics
    const recentAnalytics = await Analytics.find({
      user: req.user.id,
      date: { $gte: since },
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: {
        contentStats,
        performance: performanceStats[0] || {},
        platformBreakdown: platformStats,
        recentAnalytics,
        period: { days: parseInt(days), since },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/overview
// @desc    Get overview statistics
// @access  Private
router.get('/overview', protect, async (req, res, next) => {
  try {
    const totalContent = await Content.countDocuments({ user: req.user.id });
    const publishedContent = await Content.countDocuments({
      user: req.user.id,
      status: 'published',
    });
    const scheduledContent = await Content.countDocuments({
      user: req.user.id,
      status: 'scheduled',
    });

    const totalPerformance = await Content.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'published',
        },
      },
      {
        $group: {
          _id: null,
          views: { $sum: '$performance.views' },
          likes: { $sum: '$performance.likes' },
          comments: { $sum: '$performance.comments' },
          shares: { $sum: '$performance.shares' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        content: {
          total: totalContent,
          published: publishedContent,
          scheduled: scheduledContent,
          draft: totalContent - publishedContent - scheduledContent,
        },
        performance: totalPerformance[0] || {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/trends
// @desc    Get engagement trends
// @access  Private
router.get('/trends', protect, async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const trends = await Analytics.find({
      user: req.user.id,
      date: { $gte: since },
    }).sort({ date: 1 });

    // Format for chart
    const chartData = trends.map(t => ({
      date: t.date,
      views: t.overview?.totalViews || 0,
      likes: t.overview?.totalLikes || 0,
      comments: t.overview?.totalComments || 0,
      shares: t.overview?.totalShares || 0,
      engagementRate: t.overview?.averageEngagementRate || 0,
    }));

    res.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/platforms
// @desc    Get platform performance
// @access  Private
router.get('/platforms', protect, async (req, res, next) => {
  try {
    const platformData = await Content.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'published',
        },
      },
      {
        $group: {
          _id: '$platform',
          posts: { $sum: 1 },
          totalViews: { $sum: '$performance.views' },
          totalLikes: { $sum: '$performance.likes' },
          totalComments: { $sum: '$performance.comments' },
          totalShares: { $sum: '$performance.shares' },
          avgEngagement: { $avg: '$performance.engagementRate' },
        },
      },
    ]);

    res.json({
      success: true,
      data: platformData,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/content/:id
// @desc    Get content-specific analytics
// @access  Private
router.get('/content/:id', protect, async (req, res, next) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!content) {
      return next(new ErrorResponse('Content not found', 404));
    }

    // Get comparison with other content
    const comparison = await Content.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'published',
          _id: { $ne: content._id },
        },
      },
      {
        $group: {
          _id: null,
          avgEngagement: { $avg: '$performance.engagementRate' },
          avgLikes: { $avg: '$performance.likes' },
          avgComments: { $avg: '$performance.comments' },
          avgShares: { $avg: '$performance.shares' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        content: {
          id: content._id,
          title: content.title,
          performance: content.performance,
          platform: content.platform,
          type: content.type,
          publishedAt: content.publishedAt,
        },
        comparison: comparison[0] || {},
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/competitor
// @desc    Competitor analysis data
// @access  Private
router.get('/competitor', protect, async (req, res, next) => {
  try {
    const { competitor } = req.query;

    // In production, fetch actual competitor data
    // For now, return mock data
    const mockCompetitorData = {
      handle: competitor || '@competitor',
      followers: 50000,
      avgEngagement: 4.5,
      postFrequency: '3-5 per day',
      topHashtags: ['#AI', '#Tech', '#Innovation'],
      bestPerformingContent: ['Tips thread', 'Industry analysis', 'Behind the scenes'],
    };

    res.json({
      success: true,
      data: mockCompetitorData,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/analytics/export
// @desc    Export analytics report
// @access  Private
router.post('/export', protect, async (req, res, next) => {
  try {
    const { format = 'csv', dateRange = {} } = req.body;

    const since = dateRange.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const until = dateRange.end ? new Date(dateRange.end) : new Date();

    const data = await Analytics.find({
      user: req.user.id,
      date: { $gte: since, $lte: until },
    }).sort({ date: 1 });

    // In production, generate actual CSV/PDF
    // For now, return JSON
    res.json({
      success: true,
      data: {
        format,
        dateRange: { since, until },
        records: data.length,
        exportData: data,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/ab-tests
// @desc    Get A/B test results
// @access  Private
router.get('/ab-tests', protect, async (req, res, next) => {
  try {
    // In production, fetch actual A/B test data
    // For now, return mock data
    const mockTests = [
      {
        id: 'test-1',
        name: 'Headline Test',
        variants: [
          { name: 'A', performance: { ctr: 5.2, engagement: 7.1 } },
          { name: 'B', performance: { ctr: 6.8, engagement: 8.5 } },
        ],
        winner: 'B',
        confidence: 95,
      },
    ];

    res.json({
      success: true,
      data: mockTests,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/analytics/ab-tests
// @desc    Create A/B test
// @access  Private
router.post('/ab-tests', protect, async (req, res, next) => {
  try {
    const { name, variants, contentId } = req.body;

    // In production, set up actual A/B test
    // For now, return confirmation
    res.json({
      success: true,
      data: {
        id: `test-${Date.now()}`,
        name,
        variants: variants.length,
        contentId,
        status: 'running',
        startedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;