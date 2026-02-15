const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      enum: ['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'medium'],
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    username: String,
    displayName: String,
    avatar: String,
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: String,
    tokenExpiry: Date,
    scope: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
    lastSync: Date,
    settings: {
      autoPost: {
        type: Boolean,
        default: false,
      },
      defaultHashtags: [String],
      mentionHandling: {
        type: String,
        enum: ['ignore', 'notify', 'auto_reply'],
        default: 'notify',
      },
      characterLimit: Number,
      mediaLimits: {
        images: Number,
        videos: Number,
        gif: Number,
      },
    },
    metrics: {
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
      posts: { type: Number, default: 0 },
      avgEngagement: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
    },
    audience: {
      demographics: mongoose.Schema.Types.Mixed,
      topLocations: [String],
      activeHours: mongoose.Schema.Types.Mixed,
      interests: [String],
    },
    webhookUrl: String,
    webhookSecret: String,
  },
  {
    timestamps: true,
  }
);

// Compound index for user + platform
PlatformSchema.index({ user: 1, platform: 1 }, { unique: true });
PlatformSchema.index({ accountId: 1 });

// Static method to get connected platforms
PlatformSchema.statics.getConnected = async function (userId) {
  return this.find({
    user: userId,
    isActive: true,
  });
};

// Method to check if token is expired
PlatformSchema.methods.isTokenExpired = function () {
  if (!this.tokenExpiry) return false;
  return new Date() >= this.tokenExpiry;
};

// Method to update metrics
PlatformSchema.methods.updateMetrics = async function (metrics) {
  this.metrics = { ...this.metrics, ...metrics };
  this.lastSync = new Date();
  await this.save();
};

module.exports = mongoose.model('Platform', PlatformSchema);