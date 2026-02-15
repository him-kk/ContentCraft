const { body, param, query, validationResult } = require('express-validator');
const ErrorResponse = require('./errorResponse');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new ErrorResponse(errorMessages.join(', '), 400));
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Content validators
const createContentValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('type')
    .optional()
    .isIn(['blog', 'social', 'email', 'ad', 'newsletter', 'product', 'other'])
    .withMessage('Invalid content type'),
  body('platform')
    .optional()
    .isIn(['twitter', 'linkedin', 'instagram', 'facebook', 'blog', 'email', 'other'])
    .withMessage('Invalid platform'),
  handleValidationErrors,
];

const updateContentValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid content ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  handleValidationErrors,
];

// Schedule validators
const createScheduleValidator = [
  body('content')
    .notEmpty()
    .withMessage('Content ID is required')
    .isMongoId()
    .withMessage('Invalid content ID'),
  body('scheduledAt')
    .notEmpty()
    .withMessage('Schedule date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('platforms')
    .optional()
    .isArray()
    .withMessage('Platforms must be an array'),
  handleValidationErrors,
];

// AI generation validators
const generateContentValidator = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ max: 2000 })
    .withMessage('Prompt cannot exceed 2000 characters'),
  body('type')
    .optional()
    .isIn(['blog', 'social', 'email', 'ad', 'newsletter', 'product', 'other'])
    .withMessage('Invalid content type'),
  body('tone')
    .optional()
    .isIn(['professional', 'casual', 'friendly', 'authoritative', 'humorous', 'inspirational'])
    .withMessage('Invalid tone'),
  body('length')
    .optional()
    .isIn(['short', 'medium', 'long'])
    .withMessage('Invalid length'),
  handleValidationErrors,
];

const generateImageValidator = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ max: 1000 })
    .withMessage('Prompt cannot exceed 1000 characters'),
  body('size')
    .optional()
    .isIn(['1024x1024', '1792x1024', '1024x1792'])
    .withMessage('Invalid image size'),
  body('style')
    .optional()
    .isIn(['photorealistic', 'artistic', 'minimalist', 'illustration', '3d'])
    .withMessage('Invalid style'),
  handleValidationErrors,
];

// Virality prediction validators
const predictViralityValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('platform')
    .optional()
    .isIn(['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok'])
    .withMessage('Invalid platform'),
  handleValidationErrors,
];

// Pagination validators
const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

// Team validators
const inviteMemberValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['admin', 'editor', 'writer', 'viewer'])
    .withMessage('Invalid role'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  registerValidator,
  loginValidator,
  createContentValidator,
  updateContentValidator,
  createScheduleValidator,
  generateContentValidator,
  generateImageValidator,
  predictViralityValidator,
  paginationValidator,
  inviteMemberValidator,
};