const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect } = require('../middleware/auth');
const { createContentValidator, updateContentValidator, paginationValidator } = require('../utils/validators');
const ErrorResponse = require('../utils/errorResponse');

// @route   GET /api/content
// @desc    Get all content
// @access  Private
router.get('/', protect, paginationValidator, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, type, platform, search, tag } = req.query;

    const query = { user: req.user.id, isDeleted: false };

    if (status) query.status = status;
    if (type) query.type = type;
    if (platform) query.platform = platform;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$text = { $search: search };
    }

    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('collaborators.user', 'name avatar');

    const total = await Content.countDocuments(query);

    res.json({
      success: true,
      data: content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/content
// @desc    Create new content
// @access  Private
router.post('/', protect, createContentValidator, async (req, res, next) => {
  try {
    const content = await Content.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/content/generate
// @desc    Generate content with AI
// @access  Private
router.post('/generate', protect, async (req, res, next) => {
  try {
    const AIService = require('../services/aiService');

    const result = await AIService.generateContent({
      ...req.body,
    });

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    // Create content record
    const content = await Content.create({
      user: req.user.id,
      title: req.body.title || 'AI Generated Content',
      content: result.content,
      type: req.body.type || 'blog',
      platform: req.body.platform || 'blog',
      tone: req.body.tone || 'professional',
      aiGenerated: true,
      aiPrompt: req.body.prompt,
      aiModel: 'gemini-pro',
    });

    res.status(201).json({
      success: true,
      data: {
        content,
        generated: result,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/content/:id
// @desc    Get single content
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false,
    }).populate('collaborators.user', 'name avatar');

    if (!content) {
      return next(new ErrorResponse('Content not found', 404));
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/content/:id
// @desc    Update content
// @access  Private
router.put('/:id', protect, updateContentValidator, async (req, res, next) => {
  try {
    let content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!content) {
      return next(new ErrorResponse('Content not found', 404));
    }

    // Save version before update
    await content.addVersion(
      content.content,
      content.title,
      req.user.id,
      req.body.changeDescription || 'Content updated'
    );

    content = await Content.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/content/:id
// @desc    Delete content (soft delete)
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!content) {
      return next(new ErrorResponse('Content not found', 404));
    }

    content.isDeleted = true;
    content.deletedAt = new Date();
    await content.save();

    res.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/content/:id/comment
// @desc    Add comment to content
// @access  Private
router.post('/:id/comment', protect, async (req, res, next) => {
  try {
    const { text } = req.body;

    const content = await Content.findOne({
      _id: req.params.id,
      $or: [{ user: req.user.id }, { 'collaborators.user': req.user.id }],
    });

    if (!content) {
      return next(new ErrorResponse('Content not found', 404));
    }

    content.comments.push({
      user: req.user.id,
      text,
    });

    await content.save();

    res.status(201).json({
      success: true,
      data: content.comments[content.comments.length - 1],
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/content/:id/approve
// @desc    Approve content
// @access  Private
router.post('/:id/approve', protect, async (req, res, next) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      $or: [{ user: req.user.id }, { 'collaborators.user': req.user.id }],
    });

    if (!content) {
      return next(new ErrorResponse('Content not found', 404));
    }

    await content.approve(req.user.id, req.body.comment);

    res.json({
      success: true,
      message: 'Content approved',
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/content/:id/repurpose
// @desc    Repurpose content for platform
// @access  Private
router.post('/:id/repurpose', protect, async (req, res, next) => {
  try {
    const { targetPlatform, options = {} } = req.body;

    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!content) {
      return next(new ErrorResponse('Content not found', 404));
    }

    const AIService = require('../services/aiService');

    const result = await AIService.repurposeContent(
      content.content,
      content.platform || 'blog',
      targetPlatform,
      options
    );

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    // Create new repurposed content
    const repurposed = await Content.create({
      user: req.user.id,
      title: `${content.title} (Repurposed for ${targetPlatform})`,
      content: result.content,
      type: content.type,
      platform: targetPlatform,
      originalContent: content._id,
      isRecycled: true,
    });

    res.status(201).json({
      success: true,
      data: {
        original: content,
        repurposed,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/content/:id/duplicate
// @desc    Duplicate content
// @access  Private
router.post('/:id/duplicate', protect, async (req, res, next) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!content) {
      return next(new ErrorResponse('Content not found', 404));
    }

    const duplicated = await Content.create({
      user: req.user.id,
      title: `${content.title} (Copy)`,
      content: content.content,
      type: content.type,
      platform: content.platform,
      tone: content.tone,
      tags: content.tags,
      status: 'draft',
    });

    res.status(201).json({
      success: true,
      data: duplicated,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/content/search
// @desc    Search content
// @access  Private
router.get('/search', protect, async (req, res, next) => {
  try {
    const { q, filters = '{}' } = req.query;

    const searchQuery = {
      user: req.user.id,
      isDeleted: false,
    };

    if (q) {
      searchQuery.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    const parsedFilters = JSON.parse(filters);
    Object.assign(searchQuery, parsedFilters);

    const content = await Content.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: content,
      count: content.length,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/content/tags
// @desc    Get all tags
// @access  Private
router.get('/tags/all', protect, async (req, res, next) => {
  try {
    const tags = await Content.distinct('tags', {
      user: req.user.id,
      isDeleted: false,
    });

    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/content/archive
// @desc    Get archived content
// @access  Private
router.get('/archive/list', protect, async (req, res, next) => {
  try {
    const content = await Content.find({
      user: req.user.id,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;