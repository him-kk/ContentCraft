const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    platforms: [{
      platform: {
        type: String,
        enum: ['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'blog'],
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'processing', 'posted', 'failed', 'cancelled'],
        default: 'pending',
      },
      postId: String,
      postUrl: String,
      errorMessage: String,
      postedAt: Date,
    }],
    scheduledAt: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    recurring: {
      isRecurring: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'custom'],
      },
      interval: Number, // days between posts
      endDate: Date,
      occurrences: Number,
      currentOccurrence: {
        type: Number,
        default: 0,
      },
    },
    optimalTime: {
      calculated: {
        type: Boolean,
        default: false,
      },
      score: Number,
      reason: String,
    },
    queuePosition: Number,
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    processedAt: Date,
    processedBy: String, // job ID
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
ScheduleSchema.index({ user: 1, scheduledAt: 1 });
ScheduleSchema.index({ status: 1, scheduledAt: 1 });
ScheduleSchema.index({ 'platforms.status': 1 });

// Static method to get upcoming schedules
ScheduleSchema.statics.getUpcoming = async function (userId, limit = 10) {
  return this.find({
    user: userId,
    scheduledAt: { $gte: new Date() },
    status: { $in: ['pending', 'processing'] },
  })
    .sort({ scheduledAt: 1 })
    .limit(limit)
    .populate('content', 'title content type');
};

// Static method to get calendar data
ScheduleSchema.statics.getCalendarData = async function (userId, startDate, endDate) {
  return this.find({
    user: userId,
    scheduledAt: {
      $gte: startDate,
      $lte: endDate,
    },
    status: { $ne: 'cancelled' },
  })
    .populate('content', 'title type status')
    .select('scheduledAt status platforms recurring');
};

// Method to cancel schedule
ScheduleSchema.methods.cancel = async function (userId) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = userId;
  this.platforms.forEach(p => {
    if (p.status === 'pending') {
      p.status = 'cancelled';
    }
  });
  await this.save();
};

// Method to reschedule
ScheduleSchema.methods.reschedule = async function (newDate) {
  this.scheduledAt = newDate;
  this.status = 'pending';
  this.platforms.forEach(p => {
    p.status = 'pending';
    p.postId = undefined;
    p.postUrl = undefined;
  });
  await this.save();
};

module.exports = mongoose.model('Schedule', ScheduleSchema);