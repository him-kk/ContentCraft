const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'editor', 'writer', 'viewer'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: String,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'dark',
      },
      language: {
        type: String,
        default: 'en',
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        trends: { type: Boolean, default: true },
        team: { type: Boolean, default: true },
      },
      defaultPlatform: {
        type: String,
        enum: ['twitter', 'linkedin', 'instagram', 'facebook', 'blog', 'none'],
        default: 'none',
      },
      brandVoice: {
        tone: {
          type: String,
          enum: ['professional', 'casual', 'friendly', 'authoritative', 'humorous', 'inspirational'],
          default: 'professional',
        },
        style: String,
        guidelines: String,
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'past_due'],
        default: 'active',
      },
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
      cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
      },
      usage: {
        aiGenerations: { type: Number, default: 0 },
        imageGenerations: { type: Number, default: 0 },
        scheduledPosts: { type: Number, default: 0 },
        teamMembers: { type: Number, default: 0 },
      },
      limits: {
        aiGenerations: { type: Number, default: 10 },
        imageGenerations: { type: Number, default: 5 },
        scheduledPosts: { type: Number, default: 10 },
        teamMembers: { type: Number, default: 1 },
      },
    },
    socialAccounts: [{
      platform: {
        type: String,
        enum: ['twitter', 'linkedin', 'instagram', 'facebook', 'pinterest'],
      },
      accountId: String,
      username: String,
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      isActive: { type: Boolean, default: true },
      connectedAt: { type: Date, default: Date.now },
    }],
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    teamRole: {
      type: String,
      enum: ['owner', 'admin', 'editor', 'writer', 'viewer'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user's content count
UserSchema.virtual('contentCount', {
  ref: 'Content',
  localField: '_id',
  foreignField: 'user',
  count: true,
});

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Generate refresh token
UserSchema.methods.getRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '90d',
  });
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = require('crypto').randomBytes(20).toString('hex');
  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = require('crypto').randomBytes(20).toString('hex');
  this.emailVerificationToken = require('crypto')
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

// Check if account is locked
UserSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
UserSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  return this.updateOne(updates);
};

// Check if user has exceeded usage limits
UserSchema.methods.hasExceededLimit = function (limitType) {
  const usage = this.subscription.usage[limitType] || 0;
  const limit = this.subscription.limits[limitType] || 0;
  return usage >= limit;
};

// Increment usage
UserSchema.methods.incrementUsage = async function (limitType) {
  this.subscription.usage[limitType] = (this.subscription.usage[limitType] || 0) + 1;
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);