const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../utils/validators');
const ErrorResponse = require('../utils/errorResponse');
const emailService = require('../services/emailService');

// Generate tokens
const generateTokens = (user) => {
  const accessToken = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();
  return { accessToken, refreshToken };
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerValidator, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    await emailService.sendVerificationEmail(user.email, verificationUrl, user.name);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferences: user.preferences,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidator, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if account is locked
    if (user.isLocked()) {
      return next(new ErrorResponse('Account is temporarily locked. Please try again later.', 423));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    user.lastLogin = new Date();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          subscription: user.subscription,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new ErrorResponse('Refresh token required', 400));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return next(new ErrorResponse('Invalid refresh token', 401));
    }

    // Generate new tokens
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        preferences: user.preferences,
        subscription: user.subscription,
        socialAccounts: user.socialAccounts,
        team: user.team,
        teamRole: user.teamRole,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, avatar, preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          ...(name && { name }),
          ...(avatar && { avatar }),
          ...(preferences && { preferences: { ...req.user.preferences, ...preferences } }),
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/password
// @desc    Change password
// @access  Private
router.put('/password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Current password is incorrect', 400));
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: 'If an account exists, a password reset email has been sent.',
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, resetUrl, user.name);

    res.json({
      success: true,
      message: 'If an account exists, a password reset email has been sent.',
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash token
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/verify-email/:token
// @desc    Verify email
// @access  Public
router.get('/verify-email/:token', async (req, res, next) => {
  try {
    const { token } = req.params;

    // Hash token
    const emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.refreshToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;