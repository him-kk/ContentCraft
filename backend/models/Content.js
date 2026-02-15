const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

const VersionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    title: String,
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changeDescription: String,
  },
  { timestamps: true }
);

const ContentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    type: {
      type: String,
      enum: ['blog', 'social', 'email', 'ad', 'newsletter', 'product', 'script', 'other'],
      default: 'other',
    },
    platform: {
      type: String,
      enum: ['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'blog', 'email', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'approved', 'scheduled', 'published', 'archived'],
      default: 'draft',
    },
    tone: {
      type: String,
      enum: ['professional', 'casual', 'friendly', 'authoritative', 'humorous', 'inspirational', 'neutral'],
      default: 'neutral',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiPrompt: String,
    aiModel: String,
    viralityScore: {
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
      predictedLikes: Number,
      predictedComments: Number,
      predictedShares: Number,
      predictedReach: Number,
      suggestions: [String],
      risks: [String],
      analyzedAt: Date,
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video', 'gif'],
      },
      url: String,
      thumbnail: String,
      alt: String,
      caption: String,
    }],
    hashtags: [String],
    mentions: [String],
    links: [{
      url: String,
      title: String,
      shortened: String,
    }],
    scheduledFor: Date,
    publishedAt: Date,
    publishedTo: [{
      platform: String,
      postId: String,
      url: String,
      publishedAt: Date,
    }],
    performance: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      engagementRate: Number,
      reach: { type: Number, default: 0 },
    },
    comments: [CommentSchema],
    versions: [VersionSchema],
    collaborators: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['viewer', 'editor', 'owner'],
        default: 'viewer',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    approvalWorkflow: {
      required: {
        type: Boolean,
        default: false,
      },
      approvers: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        comment: String,
        actionAt: Date,
      }],
      currentStage: {
        type: Number,
        default: 0,
      },
    },
    isRecycled: {
      type: Boolean,
      default: false,
    },
    originalContent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
    },
    recycledCount: {
      type: Number,
      default: 0,
    },
    evergreen: {
      type: Boolean,
      default: false,
    },
    seasonal: {
      isSeasonal: { type: Boolean, default: false },
      season: String,
      month: Number,
    },
    wordCount: Number,
    readingTime: Number,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search and filtering
ContentSchema.index({ user: 1, createdAt: -1 });
ContentSchema.index({ status: 1, user: 1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ type: 1, platform: 1 });
ContentSchema.index({ title: 'text', content: 'text' });

// Pre-save middleware to calculate word count and reading time
ContentSchema.pre('save', function (next) {
  if (this.content) {
    this.wordCount = this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    // Average reading speed: 200 words per minute
    this.readingTime = Math.ceil(this.wordCount / 200);
  }
  next();
});

// Method to calculate engagement rate
ContentSchema.methods.calculateEngagementRate = function () {
  const { likes, comments, shares, impressions } = this.performance;
  if (!impressions || impressions === 0) return 0;
  const engagements = likes + comments + shares;
  this.performance.engagementRate = ((engagements / impressions) * 100).toFixed(2);
  return this.performance.engagementRate;
};

// Method to add version
ContentSchema.methods.addVersion = async function (content, title, editedBy, changeDescription) {
  this.versions.push({
    content,
    title,
    editedBy,
    changeDescription,
  });
  // Keep only last 20 versions
  if (this.versions.length > 20) {
    this.versions = this.versions.slice(-20);
  }
  await this.save();
};

// Method to approve content
ContentSchema.methods.approve = async function (userId, comment) {
  const approver = this.approvalWorkflow.approvers.find(
    a => a.user.toString() === userId.toString()
  );
  if (approver) {
    approver.status = 'approved';
    approver.comment = comment;
    approver.actionAt = new Date();
    
    // Check if all approvers have approved
    const allApproved = this.approvalWorkflow.approvers.every(a => a.status === 'approved');
    if (allApproved) {
      this.status = 'approved';
    }
    await this.save();
  }
};

// Static method to get top performing content
ContentSchema.statics.getTopPerforming = async function (userId, limit = 10, days = 90) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    user: userId,
    createdAt: { $gte: since },
    status: { $in: ['published', 'scheduled'] },
  })
    .sort({ 'performance.engagementRate': -1 })
    .limit(limit)
    .select('title content performance createdAt platform type');
};

// Static method to get content for recycling
ContentSchema.statics.getRecyclableContent = async function (userId, options = {}) {
  const { minAge = 180, minEngagement = 5 } = options; // days, engagement rate
  const cutoffDate = new Date(Date.now() - minAge * 24 * 60 * 60 * 1000);
  
  return this.find({
    user: userId,
    createdAt: { $lte: cutoffDate },
    'performance.engagementRate': { $gte: minEngagement },
    status: 'published',
    isDeleted: false,
    $or: [
      { evergreen: true },
      { 'seasonal.isSeasonal': false },
      {
        'seasonal.isSeasonal': true,
        'seasonal.month': new Date().getMonth(),
      },
    ],
  })
    .sort({ 'performance.engagementRate': -1 })
    .limit(20);
};

module.exports = mongoose.model('Content', ContentSchema);