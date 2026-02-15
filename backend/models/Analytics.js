const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    period: {
      type: String,
      enum: ['day', 'week', 'month', 'year'],
      default: 'day',
    },
    overview: {
      totalContent: { type: Number, default: 0 },
      publishedContent: { type: Number, default: 0 },
      scheduledContent: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
      totalLikes: { type: Number, default: 0 },
      totalComments: { type: Number, default: 0 },
      totalShares: { type: Number, default: 0 },
      totalClicks: { type: Number, default: 0 },
      totalImpressions: { type: Number, default: 0 },
      averageEngagementRate: { type: Number, default: 0 },
      totalReach: { type: Number, default: 0 },
    },
    byPlatform: {
      twitter: {
        posts: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
      },
      linkedin: {
        posts: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
      },
      instagram: {
        posts: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
      },
      facebook: {
        posts: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
      },
      tiktok: {
        posts: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
      },
      blog: {
        posts: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
      },
    },
    byContentType: {
      blog: { count: Number, engagementRate: Number },
      social: { count: Number, engagementRate: Number },
      email: { count: Number, engagementRate: Number },
      ad: { count: Number, engagementRate: Number },
      newsletter: { count: Number, engagementRate: Number },
      product: { count: Number, engagementRate: Number },
    },
    topPerforming: [{
      content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
      },
      engagementRate: Number,
      reach: Number,
    }],
    growth: {
      followers: { type: Number, default: 0 },
      followersChange: { type: Number, default: 0 },
      impressionsChange: { type: Number, default: 0 },
      engagementChange: { type: Number, default: 0 },
    },
    aiUsage: {
      generations: { type: Number, default: 0 },
      imagesGenerated: { type: Number, default: 0 },
      viralityPredictions: { type: Number, default: 0 },
      trendAnalyses: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user + date queries
AnalyticsSchema.index({ user: 1, date: -1 });
AnalyticsSchema.index({ user: 1, period: 1, date: -1 });

// Static method to get analytics for date range
AnalyticsSchema.statics.getForDateRange = async function (userId, startDate, endDate) {
  return this.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1 });
};

// Static method to get latest analytics
AnalyticsSchema.statics.getLatest = async function (userId, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    user: userId,
    date: { $gte: since },
  }).sort({ date: -1 });
};

// Static method to aggregate platform performance
AnalyticsSchema.statics.getPlatformPerformance = async function (userId, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: since },
      },
    },
    {
      $group: {
        _id: null,
        twitter: {
          $sum: '$byPlatform.twitter.engagementRate',
        },
        linkedin: {
          $sum: '$byPlatform.linkedin.engagementRate',
        },
        instagram: {
          $sum: '$byPlatform.instagram.engagementRate',
        },
        facebook: {
          $sum: '$byPlatform.facebook.engagementRate',
        },
        tiktok: {
          $sum: '$byPlatform.tiktok.engagementRate',
        },
      },
    },
  ]);
};

module.exports = mongoose.model('Analytics', AnalyticsSchema);