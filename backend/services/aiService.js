const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const logger = require('../utils/logger');

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class AIService {
  // Content Generation with Gemini
  async generateContent(options) {
    const {
      prompt,
      type = 'blog',
      tone = 'professional',
      length = 'medium',
      platform = 'blog',
      audience = 'general',
      keywords = [],
      includeHashtags = false,
      language = 'en',
    } = options;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const lengthMap = {
        short: '150-300 words',
        medium: '400-600 words',
        long: '800-1200 words',
      };

      const platformGuidelines = {
        twitter: 'Keep it concise, engaging, and under 280 characters per tweet. Use threads for longer content.',
        linkedin: 'Professional tone, focus on insights and value. Use 3-5 hashtags.',
        instagram: 'Visual-focused, use emojis, engaging captions with 10-15 hashtags.',
        facebook: 'Conversational, community-focused, moderate length.',
        blog: 'Comprehensive, SEO-optimized, well-structured with headings.',
        email: 'Personalized, clear subject line, strong call-to-action.',
      };

      const systemPrompt = `You are an expert content creator specializing in ${type} content for ${platform}. 
Create content in a ${tone} tone for a ${audience} audience.
Length: ${lengthMap[length]}
${platformGuidelines[platform] || ''}
${keywords.length > 0 ? `Include these keywords naturally: ${keywords.join(', ')}` : ''}
${includeHashtags ? 'Include relevant hashtags at the end.' : ''}

Respond with ONLY the content, no explanations or meta-commentary.`;

      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'I understand. Please provide the topic or prompt.' }] },
          { role: 'user', parts: [{ text: prompt }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: length === 'long' ? 2048 : length === 'medium' ? 1024 : 512,
        },
      });

      const generatedContent = result.response.text();

      return {
        success: true,
        content: generatedContent,
        metadata: {
          type,
          tone,
          length,
          platform,
          wordCount: generatedContent.split(/\s+/).filter(w => w.length > 0).length,
        },
      };
    } catch (error) {
      logger.error('Content generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate multiple content variations
  async generateVariations(prompt, count = 3, options = {}) {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const result = await this.generateContent({
        ...options,
        prompt: `${prompt} (Variation ${i + 1})`,
      });

      if (result.success) {
        variations.push(result.content);
      }
    }

    return {
      success: variations.length > 0,
      variations,
      count: variations.length,
    };
  }

  // Improve existing content
  async improveContent(content, improvements = [], options = {}) {
    const {
      tone,
      makeShorter = false,
      makeLonger = false,
      addEmojis = false,
      addHashtags = false,
    } = options;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const improvementInstructions = improvements.map(imp => {
        switch (imp) {
          case 'grammar': return 'Fix grammar and spelling errors';
          case 'clarity': return 'Improve clarity and readability';
          case 'engagement': return 'Make it more engaging and compelling';
          case 'seo': return 'Optimize for SEO';
          case 'tone': return `Adjust tone to be ${tone}`;
          default: return imp;
        }
      }).join(', ');

      const prompt = `Improve the following content:

${content}

Improvements to make: ${improvementInstructions}
${makeShorter ? 'Make it shorter and more concise.' : ''}
${makeLonger ? 'Expand with more detail and depth.' : ''}
${addEmojis ? 'Add relevant emojis.' : ''}
${addHashtags ? 'Add relevant hashtags.' : ''}

Respond with ONLY the improved content.`;

      const result = await model.generateContent(prompt);

      return {
        success: true,
        content: result.response.text(),
        improvements: improvementInstructions,
      };
    } catch (error) {
      logger.error('Content improvement error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Summarize content
  async summarize(content, length = 'short') {
    const lengthMap = {
      short: '1-2 sentences',
      medium: '1 short paragraph (3-4 sentences)',
      long: '2-3 paragraphs',
    };

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Summarize the following content in ${lengthMap[length]}:

${content}

Respond with ONLY the summary.`;

      const result = await model.generateContent(prompt);

      return {
        success: true,
        summary: result.response.text(),
        originalLength: content.length,
      };
    } catch (error) {
      logger.error('Summarization error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate hashtags
  async generateHashtags(content, count = 10, platform = 'instagram') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const platformGuidelines = {
        twitter: '3-5 hashtags, trending and relevant',
        instagram: '10-15 hashtags, mix of popular and niche',
        linkedin: '3-5 professional hashtags',
        facebook: '2-3 hashtags, not too many',
        tiktok: '3-5 trending hashtags',
      };

      const prompt = `Generate ${count} relevant hashtags for this content:

${content}

Platform: ${platform}
Guidelines: ${platformGuidelines[platform]}

Respond with ONLY the hashtags, one per line, including the # symbol.`;

      const result = await model.generateContent(prompt);
      const hashtags = result.response.text()
        .split('\n')
        .map(h => h.trim())
        .filter(h => h.startsWith('#'));

      return {
        success: true,
        hashtags: hashtags.slice(0, count),
        platform,
      };
    } catch (error) {
      logger.error('Hashtag generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate SEO suggestions
  async generateSEO(content, title = '', keywords = []) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze and provide SEO suggestions for this content:

Title: ${title}
Content: ${content}
Target Keywords: ${keywords.join(', ')}

Provide:
1. Optimized meta title (50-60 chars)
2. Optimized meta description (150-160 chars)
3. Suggested keywords to add
4. Content structure improvements
5. SEO score (0-100)

Respond in JSON format.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Try to parse JSON, fallback to text
      let seoData;
      try {
        seoData = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
      } catch {
        seoData = {
          suggestions: response,
        };
      }

      return {
        success: true,
        ...seoData,
      };
    } catch (error) {
      logger.error('SEO generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Transform tone
  async transformTone(content, targetTone) {
    const toneDescriptions = {
      professional: 'Formal, authoritative, business-appropriate',
      casual: 'Relaxed, conversational, friendly',
      friendly: 'Warm, approachable, personal',
      authoritative: 'Expert, confident, commanding',
      humorous: 'Funny, light-hearted, entertaining',
      inspirational: 'Motivating, uplifting, empowering',
    };

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Transform the following content to have a ${targetTone} tone (${toneDescriptions[targetTone]}):

${content}

Respond with ONLY the transformed content.`;

      const result = await model.generateContent(prompt);

      return {
        success: true,
        content: result.response.text(),
        originalTone: 'detected',
        targetTone,
      };
    } catch (error) {
      logger.error('Tone transformation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Translate content
  async translate(content, targetLanguage, sourceLanguage = 'en') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Translate the following content from ${sourceLanguage} to ${targetLanguage}:

${content}

Maintain the tone, style, and formatting. Respond with ONLY the translated content.`;

      const result = await model.generateContent(prompt);

      return {
        success: true,
        translation: result.response.text(),
        sourceLanguage,
        targetLanguage,
      };
    } catch (error) {
      logger.error('Translation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Repurpose content for different platforms
  async repurposeContent(content, sourcePlatform, targetPlatform, options = {}) {
    const platformFormats = {
      twitter: '280 characters max, thread if needed, 2-3 hashtags',
      linkedin: 'Professional, 1300 chars max, 3-5 hashtags',
      instagram: 'Caption + 10-15 hashtags, emoji-friendly',
      facebook: 'Conversational, moderate length',
      blog: 'Full article with headings, SEO optimized',
      email: 'Subject line + body, personalized',
    };

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Repurpose this ${sourcePlatform} content for ${targetPlatform}:

Original Content:
${content}

Target Format: ${platformFormats[targetPlatform]}
${options.includeCTA ? 'Include a call-to-action.' : ''}
${options.includeHashtags ? 'Include relevant hashtags.' : ''}

Respond with ONLY the repurposed content.`;

      const result = await model.generateContent(prompt);

      return {
        success: true,
        content: result.response.text(),
        sourcePlatform,
        targetPlatform,
      };
    } catch (error) {
      logger.error('Content repurposing error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Check grammar and readability
  async checkGrammar(content) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze this content for grammar, spelling, and readability:

${content}

Provide:
1. List of errors found
2. Suggested corrections
3. Readability score (Flesch-Kincaid)
4. Overall writing quality score (0-100)

Respond in JSON format.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      let analysis;
      try {
        analysis = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
      } catch {
        analysis = { analysis: response };
      }

      return {
        success: true,
        ...analysis,
      };
    } catch (error) {
      logger.error('Grammar check error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate content ideas
  async generateIdeas(topic, count = 5, platform = 'blog') {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Generate ${count} content ideas about "${topic}" for ${platform}.

For each idea, provide:
1. Title
2. Brief description
3. Target audience
4. Suggested format
5. Estimated engagement potential

Respond in JSON format as an array of ideas.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      let ideas;
      try {
        ideas = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
      } catch {
        ideas = response.split('\n').filter(i => i.trim());
      }

      return {
        success: true,
        ideas,
        topic,
        platform,
      };
    } catch (error) {
      logger.error('Idea generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new AIService();