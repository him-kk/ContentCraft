const mongoose = require('mongoose');

const RecycledContentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalContent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    recycledContent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
    },
    type: {
      type: String,
      enum: ['remix', 'update', 'seasonal', 'completion', 'cross_platform', 'evergreen'],
      required: true,
    },
    reason: {
      type: String,
      enum: ['top_performer', 'seasonal', 'outdated_stats', 'unfinished', 'evergreen', 'cross_platform'],
    },
    changes: {
      description: String,
      originalText: String,
      newText: String,
      aiGenerated: {
        type: Boolean,
        default: false,
      },
    },
    performance: {
      original: {
        likes: Number,
        comments: Number,
        shares: Number,
        engagementRate: Number,
      },
      recycled: {
        likes: Number,
        comments: Number,
        shares: Number,
        engagementRate: Number,
      },
      improvement: {
        likes: Number,
        comments: Number,
        shares: Number,
        engagementRate: Number,
      },
    },
    scheduledAt: Date,
    publishedAt: Date,
    platforms: [String],
    autoScheduled: {
      type: Boolean,
      default: false,
    },
    aiSuggestions: [{
      type: {
        type: String,
        enum: ['hashtag', 'tone', 'length', 'timing', 'format'],
      },
      suggestion: String,
      applied: {
        type: Boolean,
        default: false,
      },
    }],
    status: {
      type: String,
      enum: ['suggested', 'approved', 'scheduled', 'published', 'rejected'],
      default: 'suggested',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RecycledContentSchema.index({ user: 1, createdAt: -1 });
RecycledContentSchema.index({ originalContent: 1 });
RecycledContentSchema.index({ status: 1 });

// Static method to get recycling suggestions
RecycledContentSchema.statics.getSuggestions = async function (userId) {
  return this.find({
    user: userId,
    status: 'suggested',
  })
    .populate('originalContent', 'title content performance createdAt')
    .sort({ createdAt: -1 });
};

// Static method to get recycling performance
RecycledContentSchema.statics.getPerformance = async function (userId) {
  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: 'published',
      },
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        avgImprovement: { $avg: '$performance.improvement.engagementRate' },
      },
    },
  ]);
};

module.exports = mongoose.model('RecycledContent', RecycledContentSchema);