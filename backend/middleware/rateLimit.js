// const rateLimit = require('express-rate-limit');
// const ErrorResponse = require('../utils/errorResponse');

// // Check if we're in development mode
// const isDevelopment = process.env.NODE_ENV !== 'production';

// // General API rate limiter
// const apiLimiter = isDevelopment 
//   ? (req, res, next) => next() // Bypass in development
//   : rateLimit({
//       windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
//       max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
//       message: {
//         success: false,
//         error: 'Too many requests from this IP, please try again later',
//       },
//       standardHeaders: true,
//       legacyHeaders: false,
//     });

// // Stricter limiter for AI generation endpoints
// const aiLimiter = isDevelopment
//   ? (req, res, next) => next() // Bypass in development
//   : rateLimit({
//       windowMs: 60 * 1000, // 1 minute
//       max: 10, // 10 requests per minute
//       message: {
//         success: false,
//         error: 'AI generation rate limit exceeded, please try again in a minute',
//       },
//       standardHeaders: true,
//       legacyHeaders: false,
//     });

// // Auth endpoints limiter (prevent brute force)
// // Keep this active even in dev, but with higher limits
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: isDevelopment ? 100 : 5, // 100 attempts in dev, 5 in production
//   message: {
//     success: false,
//     error: 'Too many authentication attempts, please try again later',
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skipSuccessfulRequests: true,
// });

// module.exports = { apiLimiter, aiLimiter, authLimiter };
const rateLimit = require('express-rate-limit');
const ErrorResponse = require('../utils/errorResponse');

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// Log which mode we're in
console.log(`🔒 Rate Limiting: ${isDevelopment ? 'DISABLED (development)' : 'ENABLED (production)'}`);

// General API rate limiter
const apiLimiter = isDevelopment 
  ? (req, res, next) => {
      // Skip rate limiting in development
      next();
    }
  : rateLimit({
      windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
      max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again later',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Stricter limiter for AI generation endpoints
const aiLimiter = isDevelopment
  ? (req, res, next) => next() // Skip in development
  : rateLimit({
      windowMs: 60 * 1000,
      max: 10,
      message: {
        success: false,
        error: 'AI generation rate limit exceeded, please try again in a minute',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Auth endpoints limiter (keep active but lenient in dev)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 1000 : 5, // Very high limit in dev
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

module.exports = { apiLimiter, aiLimiter, authLimiter };