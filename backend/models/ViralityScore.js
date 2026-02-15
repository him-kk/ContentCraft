const mongoose = require('mongoose');

const ViralityScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
    },
    contentText: String,
    platform: {
      type: String,
      enum: ['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'blog'],
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    breakdown: {
      contentQuality: {
        score: Number,
        factors: [String],
      },
      timing: {
        score: Number,
        optimalTime: Date,
        timezone: String,
      },
      audienceAlignment: {
        score: Number,
        matchedPersonas: [String],
      },
      trendRelevance: {
        score: Number,
        relatedTrends: [String],
      },
      engagementPotential: {
        score: Number,
        predictedMetrics: {
          likes: { min: Number, max: Number },
          comments: { min: Number, max: Number },
          shares: { min: Number, max: Number },
          reach: { min: Number, max: Number },
          impressions: { min: Number, max: Number },
        },
      },
      hashtagOptimization: {
        score: Number,
        suggestedHashtags: [String],
        hashtagCount: Number,
      },
      sentiment: {
        score: Number,
        overall: {
          type: String,
          enum: ['positive', 'negative', 'neutral', 'mixed'],
        },
      },
    },
    predictions: {
      likes: {
        min: Number,
        max: Number,
        confidence: Number,
      },
      comments: {
        min: Number,
        max: Number,
        confidence: Number,
      },
      shares: {
        min: Number,
        max: Number,
        confidence: Number,
      },
      reach: {
        min: Number,
        max: Number,
        confidence: Number,
      },
      impressions: {
        min: Number,
        max: Number,
        confidence: Number,
      },
      engagementRate: {
        predicted: Number,
        confidence: Number,
      },
      viralProbability: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    suggestions: [{
      category: {
        type: String,
        enum: ['content', 'timing', 'hashtags', 'format', 'tone', 'length'],
      },
      priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
      },
      suggestion: String,
      expectedImpact: String,
      example: String,
    }],
    risks: [{
      type: {
        type: String,
        enum: ['controversy', 'negative_sentiment', 'misinformation', 'copyright', 'tone_mismatch'],
      },
      severity: {
        type: String,
        enum: ['high', 'medium', 'low'],
      },
      description: String,
      mitigation: String,
    }],
    competitorBenchmark: {
      comparedTo: String,
      percentile: Number,
      topPerformerScore: Number,
      averageScore: Number,
    },
    aBTestVariants: [{
      variant: String,
      predictedScore: Number,
      changes: [String],
    }],
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
    isHistorical: {
      type: Boolean,
      default: false,
    },
    actualPerformance: {
      likes: Number,
      comments: Number,
      shares: Number,
      reach: Number,
      impressions: Number,
      engagementRate: Number,
      accuracy: Number, // how accurate was the prediction
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ViralityScoreSchema.index({ user: 1, analyzedAt: -1 });
ViralityScoreSchema.index({ content: 1 });
ViralityScoreSchema.index({ platform: 1, score: -1 });

// Static method to get average score by platform
ViralityScoreSchema.statics.getAverageByPlatform = async function (userId) {
  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: '$platform',
        averageScore: { $avg: '$score' },
        count: { $sum: 1 },
      },
    },
  ]);
};

// Static method to get score history
ViralityScoreSchema.statics.getScoreHistory = async function (userId, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.find({
    user: userId,
    analyzedAt: { $gte: since },
  })
    .sort({ analyzedAt: -1 })
    .select('score platform analyzedAt predictions.viralProbability');
};

// Method to calculate prediction accuracy
ViralityScoreSchema.methods.calculateAccuracy = async function () {
  if (!this.actualPerformance) return null;
  
  const predictedEngagement = 
    (this.predictions.likes.min + this.predictions.likes.max) / 2 +
    (this.predictions.comments.min + this.predictions.comments.max) / 2 +
    (this.predictions.shares.min + this.predictions.shares.max) / 2;
  
  const actualEngagement = 
    this.actualPerformance.likes +
    this.actualPerformance.comments +
    this.actualPerformance.shares;
  
  const accuracy = 100 - Math.abs((predictedEngagement - actualEngagement) / actualEngagement * 100);
  this.actualPerformance.accuracy = Math.max(0, Math.min(100, accuracy));
  
  await this.save();
  return this.actualPerformance.accuracy;
};

module.exports = mongoose.model('ViralityScore', ViralityScoreSchema);