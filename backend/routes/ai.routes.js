const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimit');
const {
  generateContentValidator,
  generateImageValidator,
  predictViralityValidator,
} = require('../utils/validators');
const AIService = require('../services/aiService');
const ImageService = require('../services/imageService');
const ViralityService = require('../services/viralityService');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @route   POST /api/ai/generate
// @desc    Generate text content with AI
// @access  Private
router.post('/generate', protect, aiLimiter, generateContentValidator, async (req, res, next) => {
  try {
    // Check usage limits
    const user = await User.findById(req.user.id);
    if (user.hasExceededLimit('aiGenerations')) {
      return next(new ErrorResponse('AI generation limit exceeded. Please upgrade your plan.', 429));
    }

    const result = await AIService.generateContent(req.body);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    // Increment usage
    await user.incrementUsage('aiGenerations');

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/generate-image
// @desc    Generate image with AI
// @access  Private
router.post('/generate-image', protect, aiLimiter, generateImageValidator, async (req, res, next) => {
  try {
    // Check usage limits
    const user = await User.findById(req.user.id);
    if (user.hasExceededLimit('imageGenerations')) {
      return next(new ErrorResponse('Image generation limit exceeded. Please upgrade your plan.', 429));
    }

    const result = await ImageService.generateImage(req.body);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    // Increment usage
    await user.incrementUsage('imageGenerations');

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/hashtags
// @desc    Generate hashtags
// @access  Private
router.post('/hashtags', protect, aiLimiter, async (req, res, next) => {
  try {
    const { content, count = 10, platform = 'instagram' } = req.body;

    const result = await AIService.generateHashtags(content, count, platform);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/seo
// @desc    Generate SEO suggestions
// @access  Private
router.post('/seo', protect, async (req, res, next) => {
  try {
    const { content, title, keywords = [] } = req.body;

    const result = await AIService.generateSEO(content, title, keywords);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/repurpose
// @desc    Repurpose content
// @access  Private
router.post('/repurpose', protect, aiLimiter, async (req, res, next) => {
  try {
    const { content, sourcePlatform, targetPlatform, options = {} } = req.body;

    const result = await AIService.repurposeContent(content, sourcePlatform, targetPlatform, options);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/summarize
// @desc    Summarize content
// @access  Private
router.post('/summarize', protect, async (req, res, next) => {
  try {
    const { content, length = 'short' } = req.body;

    const result = await AIService.summarize(content, length);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/translate
// @desc    Translate content
// @access  Private
router.post('/translate', protect, aiLimiter, async (req, res, next) => {
  try {
    const { content, targetLanguage, sourceLanguage = 'en' } = req.body;

    const result = await AIService.translate(content, targetLanguage, sourceLanguage);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/transform-tone
// @desc    Transform content tone
// @access  Private
router.post('/transform-tone', protect, aiLimiter, async (req, res, next) => {
  try {
    const { content, targetTone } = req.body;

    const result = await AIService.transformTone(content, targetTone);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/predict-virality
// @desc    Predict content virality
// @access  Private
router.post('/predict-virality', protect, predictViralityValidator, async (req, res, next) => {
  try {
    const { content, platform = 'twitter' } = req.body;

    const result = await ViralityService.predictVirality(content, platform, req.user.id);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/engagement-forecast
// @desc    Forecast engagement
// @access  Private
router.post('/engagement-forecast', protect, async (req, res, next) => {
  try {
    const { content, platform, historicalData } = req.body;

    const result = await ViralityService.getEngagementForecast(content, platform, historicalData);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/optimal-time
// @desc    Get optimal posting time
// @access  Private
router.post('/optimal-time', protect, async (req, res, next) => {
  try {
    const { platform, timezone = 'UTC' } = req.body;

    const result = await ViralityService.getOptimalTime(platform, timezone);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/improvement-suggestions
// @desc    Get content improvement suggestions
// @access  Private
router.post('/improvement-suggestions', protect, async (req, res, next) => {
  try {
    const { content, platform, currentScore } = req.body;

    const result = await ViralityService.getImprovements(content, platform, currentScore);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/competitor-benchmark
// @desc    Benchmark against competitors
// @access  Private
router.post('/competitor-benchmark', protect, async (req, res, next) => {
  try {
    const { content, platform, niche } = req.body;

    const result = await ViralityService.getCompetitorBenchmark(content, platform, niche);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/risk-analysis
// @desc    Analyze content risks
// @access  Private
router.post('/risk-analysis', protect, async (req, res, next) => {
  try {
    const { content, platform } = req.body;

    const result = await ViralityService.analyzeRisks(content, platform);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/check-originality
// @desc    Check content originality
// @access  Private
router.post('/check-originality', protect, async (req, res, next) => {
  try {
    const { content } = req.body;

    // In production, integrate with plagiarism detection service
    // For now, return a simulated result
    res.json({
      success: true,
      data: {
        originalityScore: 95,
        matches: [],
        suggestions: ['Content appears to be original'],
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/readability
// @desc    Get readability score
// @access  Private
router.post('/readability', protect, async (req, res, next) => {
  try {
    const { content } = req.body;

    const result = await AIService.checkGrammar(content);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/grammar
// @desc    Check grammar
// @access  Private
router.post('/grammar', protect, async (req, res, next) => {
  try {
    const { content } = req.body;

    const result = await AIService.checkGrammar(content);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/ai/languages
// @desc    Get supported languages
// @access  Private
router.get('/languages', protect, async (req, res, next) => {
  try {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
    ];

    res.json({
      success: true,
      data: languages,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/suggest-image-prompt
// @desc    Suggest image prompt from content
// @access  Private
router.post('/suggest-image-prompt', protect, async (req, res, next) => {
  try {
    const { content, platform, style } = req.body;

    const result = await ImageService.suggestPrompt(content, platform, style);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/upscale-image
// @desc    Upscale image
// @access  Private
router.post('/upscale-image', protect, async (req, res, next) => {
  try {
    const { publicId, scale } = req.body;

    const result = await ImageService.upscaleImage(publicId, scale);

    if (!result.success) {
      return next(new ErrorResponse(result.error, 500));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;