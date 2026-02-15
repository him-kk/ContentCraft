const mongoose = require('mongoose');

const TrendSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      index: true,
    },
    platforms: [{
      platform: {
        type: String,
        enum: ['twitter', 'reddit', 'tiktok', 'youtube', 'google', 'news'],
      },
      mentions: { type: Number, default: 0 },
      velocity: { type: Number, default: 0 }, // mentions per hour
      sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral', 'mixed'],
        default: 'neutral',
      },
      topPosts: [{
        id: String,
        url: String,
        text: String,
        engagement: Number,
      }],
    }],
    totalMentions: {
      type: Number,
      default: 0,
    },
    velocity: {
      type: Number,
      default: 0,
    },
    velocityChange: {
      type: Number,
      default: 0,
    },
    lifecycle: {
      type: String,
      enum: ['emerging', 'rising', 'peaking', 'declining', 'expired'],
      default: 'emerging',
    },
    peakTime: Date,
    estimatedDuration: Number, // hours
    categories: [String],
    relatedKeywords: [String],
    hashtags: [String],
    sentiment: {
      overall: {
        type: String,
        enum: ['positive', 'negative', 'neutral', 'mixed'],
        default: 'neutral',
      },
      score: {
        type: Number,
        min: -1,
        max: 1,
        default: 0,
      },
    },
    demographics: {
      ageGroups: mongoose.Schema.Types.Mixed,
      locations: mongoose.Schema.Types.Mixed,
      interests: mongoose.Schema.Types.Mixed,
    },
    isNiche: {
      type: Boolean,
      default: false,
    },
    nicheCategories: [String],
    aiGeneratedContent: [{
      type: {
        type: String,
        enum: ['twitter', 'linkedin', 'instagram', 'blog'],
      },
      content: String,
      viralityScore: Number,
    }],
    firstDetected: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    historicalData: [{
      timestamp: Date,
      mentions: Number,
      velocity: Number,
      sentiment: Number,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes
TrendSchema.index({ keyword: 1 });
TrendSchema.index({ lifecycle: 1, velocity: -1 });
TrendSchema.index({ categories: 1 });
TrendSchema.index({ firstDetected: -1 });
TrendSchema.index({ lastUpdated: -1 });
TrendSchema.index({ isActive: 1, velocity: -1 });

// Static method to get trending topics
TrendSchema.statics.getTrending = async function (options = {}) {
  const { limit = 20, minVelocity = 100, platforms = [] } = options;
  
  const query = {
    isActive: true,
    velocity: { $gte: minVelocity },
    lifecycle: { $in: ['rising', 'peaking'] },
  };
  
  if (platforms.length > 0) {
    query['platforms.platform'] = { $in: platforms };
  }
  
  return this.find(query)
    .sort({ velocity: -1 })
    .limit(limit);
};

// Static method to get trends by category
TrendSchema.statics.getByCategory = async function (category, limit = 10) {
  return this.find({
    isActive: true,
    categories: category,
  })
    .sort({ velocity: -1 })
    .limit(limit);
};

// Static method to get niche trends
TrendSchema.statics.getNicheTrends = async function (nicheCategories, limit = 10) {
  return this.find({
    isActive: true,
    isNiche: true,
    nicheCategories: { $in: nicheCategories },
  })
    .sort({ velocity: -1 })
    .limit(limit);
};

// Method to update lifecycle
TrendSchema.methods.updateLifecycle = async function () {
  const now = Date.now();
  const hoursSinceDetection = (now - this.firstDetected) / (1000 * 60 * 60);
  
  if (this.velocityChange > 50 && this.lifecycle === 'emerging') {
    this.lifecycle = 'rising';
  } else if (this.velocityChange < -30 && this.lifecycle === 'rising') {
    this.lifecycle = 'peaking';
    this.peakTime = new Date();
  } else if (this.velocity < 50 && this.lifecycle === 'peaking') {
    this.lifecycle = 'declining';
  } else if (hoursSinceDetection > 72 && this.velocity < 10) {
    this.lifecycle = 'expired';
    this.isActive = false;
  }
  
  this.lastUpdated = new Date();
  await this.save();
};

// Method to add historical data point
TrendSchema.methods.addHistoricalData = async function () {
  this.historicalData.push({
    timestamp: new Date(),
    mentions: this.totalMentions,
    velocity: this.velocity,
    sentiment: this.sentiment.score,
  });
  
  // Keep only last 168 data points (1 week if hourly)
  if (this.historicalData.length > 168) {
    this.historicalData = this.historicalData.slice(-168);
  }
  
  await this.save();
};

module.exports = mongoose.model('Trend', TrendSchema);