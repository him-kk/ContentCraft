const ViralityScore = require('../models/ViralityScore');
const Content = require('../models/Content');
const callModel = require('../services/callModel');
const { extractJSON } = require('../services/callModel');
const logger = require('../utils/logger');

class ViralityService {
  // Predict virality score for content
  async predictVirality(content, platform = 'twitter', userId = null) {
    try {

      const platformCharacteristics = {
        twitter: {
          optimalLength: '100-280 chars',
          bestHashtags: '2-3',
          peakTimes: '8-10 AM, 6-9 PM',
          keyFactors: 'brevity, wit, timeliness, visual appeal',
        },
        linkedin: {
          optimalLength: '150-300 words',
          bestHashtags: '3-5',
          peakTimes: '7-9 AM, 12-1 PM, 5-6 PM',
          keyFactors: 'professional insights, storytelling, value-driven',
        },
        instagram: {
          optimalLength: '100-150 words',
          bestHashtags: '10-15',
          peakTimes: '11 AM - 1 PM, 7-9 PM',
          keyFactors: 'visual appeal, authenticity, engagement hooks',
        },
        facebook: {
          optimalLength: '50-80 words',
          bestHashtags: '1-2',
          peakTimes: '1-3 PM, 7-9 PM',
          keyFactors: 'emotional connection, shareability, discussion',
        },
        tiktok: {
          optimalLength: '50-100 chars',
          bestHashtags: '3-5 trending',
          peakTimes: '7-9 AM, 12-1 PM, 7-11 PM',
          keyFactors: 'trending sounds, authenticity, entertainment',
        },
      };

      const platformInfo = platformCharacteristics[platform] || platformCharacteristics.twitter;

      const systemPrompt = `You are a social media virality expert. You must respond ONLY with valid JSON, no other text.`;

      const prompt = `Analyze this content for virality potential on ${platform.toUpperCase()}.

Content: "${content}"

Platform Characteristics:
- Optimal length: ${platformInfo.optimalLength}
- Best hashtags: ${platformInfo.bestHashtags}
- Peak times: ${platformInfo.peakTimes}
- Key factors: ${platformInfo.keyFactors}

RESPOND ONLY WITH THIS JSON STRUCTURE (no other text):
{
  "overallScore": 75,
  "breakdown": {
    "contentQuality": { "score": 78, "factors": ["engaging", "clear"] },
    "timing": { "score": 72, "optimalTime": "09:00", "timezone": "EST" },
    "audienceAlignment": { "score": 75, "matchedPersonas": ["professionals"] },
    "trendRelevance": { "score": 68, "relatedTrends": ["marketing"] },
    "engagementPotential": { "score": 76 },
    "hashtagOptimization": { "score": 74, "suggestedHashtags": ["#tip1", "#tip2"], "hashtagCount": 2 },
    "sentiment": { "score": 80, "overall": "positive" }
  },
  "predictions": {
    "likes": { "min": 50, "max": 200, "confidence": 72 },
    "comments": { "min": 5, "max": 30, "confidence": 68 },
    "shares": { "min": 10, "max": 50, "confidence": 65 },
    "reach": { "min": 500, "max": 2000, "confidence": 70 },
    "impressions": { "min": 1000, "max": 5000, "confidence": 68 },
    "engagementRate": { "predicted": 5.5, "confidence": 70 },
    "viralProbability": 65
  },
  "suggestions": [
    { "category": "content", "priority": "high", "suggestion": "Add call-to-action", "expectedImpact": "+10% engagement", "example": "End with 'What do you think?'" }
  ],
  "risks": [
    { "type": "tone_mismatch", "severity": "low", "description": "Slightly formal", "mitigation": "Casual up tone slightly" }
  ],
  "competitorBenchmark": { "percentile": 72, "topPerformerScore": 95, "averageScore": 68 }
}`;

      // const result = await model.generateContent(prompt);
      // const responseText = result.response.text();
       const responseText = await callModel(prompt, systemPrompt);

      // Extract JSON from response
      let analysis;
      try {
        analysis = extractJSON(responseText);
        
        if (!analysis) {
          logger.error('No JSON found in response:', responseText.substring(0, 200));
          // Fallback to structured response
          analysis = this.parseTextResponse(responseText);
        }
      } catch (parseError) {
        logger.error('JSON extraction error:', parseError);
        analysis = this.parseTextResponse(responseText);
      }

      // Sanitize AI output before saving

      // Convert "HH:MM" string to a proper Date object for optimalTime
      if (analysis.breakdown?.timing?.optimalTime) {
        const timeStr = analysis.breakdown.timing.optimalTime;
        const match = String(timeStr).match(/^(\d{1,2}):(\d{2})/);
        if (match) {
          const date = new Date();
          date.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
          analysis.breakdown.timing.optimalTime = date;
        } else {
          delete analysis.breakdown.timing.optimalTime;
        }
      }

      // Map unknown suggestion categories to valid enum values
      const validSuggestionCategories = ['content', 'timing', 'hashtags', 'format', 'tone', 'length'];
      const categoryMap = {
        engagement: 'content',
        visuals: 'format',
        visual: 'format',
        audience: 'content',
        seo: 'content',
        cta: 'content',
      };
      if (Array.isArray(analysis.suggestions)) {
        analysis.suggestions = analysis.suggestions.map((s) => ({
          ...s,
          category: validSuggestionCategories.includes(s.category)
            ? s.category
            : (categoryMap[s.category] || 'content'),
        }));
      }

      // Map unknown risk types to valid enum values
      const validRiskTypes = ['controversy', 'negative_sentiment', 'misinformation', 'copyright', 'tone_mismatch'];
      const riskTypeMap = {
        length: 'tone_mismatch',
        engagement: 'tone_mismatch',
        format: 'tone_mismatch',
        relevance: 'tone_mismatch',
        quality: 'tone_mismatch',
        spam: 'misinformation',
        plagiarism: 'copyright',
        offensive: 'controversy',
        sensitive: 'controversy',
      };
      if (Array.isArray(analysis.risks)) {
        analysis.risks = analysis.risks.map((r) => ({
          ...r,
          type: validRiskTypes.includes(r.type)
            ? r.type
            : (riskTypeMap[r.type] || 'controversy'),
        }));
      }

      // Save to database if userId provided
      if (userId) {
        await ViralityScore.create({
          user: userId,
          contentText: content,
          platform,
          score: analysis.overallScore,
          breakdown: analysis.breakdown,
          predictions: analysis.predictions,
          suggestions: analysis.suggestions,
          risks: analysis.risks,
          competitorBenchmark: analysis.competitorBenchmark,
        });
      }

      return {
        success: true,
        score: analysis.overallScore,
        ...analysis,
      };
    } catch (error) {
      logger.error('Virality prediction error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get engagement forecast
  async getEngagementForecast(content, platform, historicalData = null) {
    try {

      let historicalContext = '';
      if (historicalData) {
        historicalContext = `\nHistorical Performance:\n- Average likes: ${historicalData.avgLikes}\n- Average comments: ${historicalData.avgComments}\n- Average shares: ${historicalData.avgShares}\n- Average engagement rate: ${historicalData.avgEngagementRate}%`;
      }

      const systemPrompt = `You are a social media engagement prediction expert. Respond ONLY with valid JSON, no other text.`;

      const prompt = `Forecast engagement metrics for this ${platform} content:${historicalContext}

Content: "${content}"

RESPOND ONLY WITH THIS JSON:
{
  "likes": { "min": 50, "max": 200, "expected": 100, "confidence": 70 },
  "comments": { "min": 5, "max": 30, "expected": 15, "confidence": 65 },
  "shares": { "min": 10, "max": 50, "expected": 25, "confidence": 60 },
  "reach": { "min": 500, "max": 2000, "expected": 1000, "confidence": 65 },
  "impressions": { "min": 1000, "max": 5000, "expected": 2500, "confidence": 65 },
  "engagementRate": { "predicted": 5, "confidence": 60 },
  "clickThroughRate": { "predicted": 2, "confidence": 55 },
  "bestPostingTime": "09:00",
  "peakEngagementWindow": "2 hours after posting",
  "factors": ["timing", "content quality"]
}`;

      // const result = await model.generateContent(prompt);
      // const responseText = result.response.text();

       const responseText = await callModel(prompt, systemPrompt);

      let forecast;
      try {
        forecast = extractJSON(responseText);
        if (!forecast) {
          logger.error('No JSON found in forecast response:', responseText.substring(0, 200));
          forecast = this.parseForecastText(responseText);
        }
      } catch {
        forecast = this.parseForecastText(responseText);
      }

      return {
        success: true,
        forecast,
        platform,
      };
    } catch (error) {
      logger.error('Engagement forecast error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get optimal posting time
  async getOptimalTime(platform, audienceTimezone = 'UTC', audienceData = null) {
    try {
      // Platform-specific peak times
      const platformPeakTimes = {
        twitter: [
          { day: 'Monday', hours: [8, 9, 12, 17, 18] },
          { day: 'Tuesday', hours: [8, 9, 12, 17, 18] },
          { day: 'Wednesday', hours: [8, 9, 12, 17, 18] },
          { day: 'Thursday', hours: [8, 9, 12, 17, 18] },
          { day: 'Friday', hours: [8, 9, 12, 15, 16] },
          { day: 'Saturday', hours: [9, 10, 12, 20, 21] },
          { day: 'Sunday', hours: [9, 10, 12, 19, 20] },
        ],
        linkedin: [
          { day: 'Monday', hours: [7, 8, 12, 17] },
          { day: 'Tuesday', hours: [7, 8, 12, 17] },
          { day: 'Wednesday', hours: [7, 8, 12, 17] },
          { day: 'Thursday', hours: [7, 8, 12, 17] },
          { day: 'Friday', hours: [7, 8, 11, 16] },
          { day: 'Saturday', hours: [] },
          { day: 'Sunday', hours: [] },
        ],
        instagram: [
          { day: 'Monday', hours: [11, 12, 19, 20] },
          { day: 'Tuesday', hours: [11, 12, 19, 20] },
          { day: 'Wednesday', hours: [11, 12, 19, 20] },
          { day: 'Thursday', hours: [11, 12, 19, 20] },
          { day: 'Friday', hours: [11, 12, 19, 20] },
          { day: 'Saturday', hours: [10, 11, 19, 20] },
          { day: 'Sunday', hours: [10, 11, 19, 20] },
        ],
        facebook: [
          { day: 'Monday', hours: [13, 14, 15] },
          { day: 'Tuesday', hours: [13, 14, 15] },
          { day: 'Wednesday', hours: [13, 14, 15] },
          { day: 'Thursday', hours: [13, 14, 15] },
          { day: 'Friday', hours: [13, 14, 15] },
          { day: 'Saturday', hours: [12, 13, 19, 20] },
          { day: 'Sunday', hours: [12, 13, 19, 20] },
        ],
        tiktok: [
          { day: 'Monday', hours: [7, 8, 12, 19, 20, 21] },
          { day: 'Tuesday', hours: [7, 8, 12, 19, 20, 21] },
          { day: 'Wednesday', hours: [7, 8, 12, 19, 20, 21] },
          { day: 'Thursday', hours: [7, 8, 12, 19, 20, 21] },
          { day: 'Friday', hours: [7, 8, 12, 19, 20, 21, 22] },
          { day: 'Saturday', hours: [9, 10, 12, 19, 20, 21, 22, 23] },
          { day: 'Sunday', hours: [9, 10, 12, 19, 20, 21] },
        ],
      };

      const today = new Date();
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      const peakTimes = platformPeakTimes[platform] || platformPeakTimes.twitter;
      const todayPeak = peakTimes.find(p => p.day === dayName);

      // Get next optimal time
      const currentHour = today.getHours();
      const nextOptimalHour = todayPeak?.hours.find(h => h > currentHour) || todayPeak?.hours[0];

      return {
        success: true,
        optimalTimes: peakTimes,
        today: {
          day: dayName,
          hours: todayPeak?.hours || [],
        },
        nextOptimal: nextOptimalHour
          ? `${nextOptimalHour}:00 ${audienceTimezone}`
          : 'Tomorrow 9:00 AM',
        timezone: audienceTimezone,
        platform,
      };
    } catch (error) {
      logger.error('Optimal time error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Compare content versions (A/B prediction)
  async compareVersions(variants, platform) {
    try {
      const predictions = await Promise.all(
        variants.map(async (variant, index) => {
          const prediction = await this.predictVirality(variant, platform);
          return {
            variant: index + 1,
            content: variant.substring(0, 100) + '...',
            ...prediction,
          };
        })
      );

      // Sort by score
      predictions.sort((a, b) => b.score - a.score);

      return {
        success: true,
        predictions,
        winner: predictions[0],
        recommendation: `Variant ${predictions[0].variant} is predicted to perform ${
          ((predictions[0].score - predictions[1]?.score || 0) / predictions[1]?.score * 100 || 0).toFixed(1)
        }% better than the alternative.`,
      };
    } catch (error) {
      logger.error('A/B comparison error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Analyze risk factors
  async analyzeRisks(content, platform) {
    try {
      const systemPrompt = `You are a content risk assessment expert. Respond ONLY with valid JSON, no other text.`;

      const prompt = `Analyze this content for potential risks on ${platform}:

Content: "${content}"

Check for controversies, offensive language, misinformation, copyright issues, tone mismatches, and PR risks.

RESPOND ONLY WITH THIS JSON:
{
  "riskLevel": "low",
  "risks": [
    { "type": "tone_mismatch", "severity": "low", "description": "Slightly formal for platform", "mitigation": "Make it more casual" }
  ],
  "recommendations": ["Add more personality", "Include a call-to-action"]
}`;

      const responseText = await callModel(prompt, systemPrompt);

      let riskAnalysis;
      try {
        riskAnalysis = extractJSON(responseText);
        if (!riskAnalysis) {
          logger.error('No JSON found in risk response:', responseText.substring(0, 200));
          riskAnalysis = { riskLevel: 'low', risks: [], recommendations: [] };
        }
      } catch {
        riskAnalysis = { riskLevel: 'low', risks: [], recommendations: [] };
      }

      return {
        success: true,
        ...riskAnalysis,
      };
    } catch (error) {
      logger.error('Risk analysis error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get improvement suggestions
  async getImprovements(content, platform, currentScore = null) {
    try {
      const systemPrompt = `You are a content optimization expert. Respond ONLY with valid JSON, no other text.`;

      const prompt = `Provide specific improvement suggestions for this ${platform} content:

Content: "${content}"
${currentScore ? `Current Score: ${currentScore}/100` : ''}

RESPOND ONLY WITH THIS JSON:
{
  "suggestions": [
    {
      "category": "content",
      "priority": "high",
      "current": "Generic headline",
      "suggestion": "Make it more specific and engaging",
      "expectedImpact": "+15 score",
      "example": "Instead of 'Marketing tips' say '5 Proven Marketing Tactics'"
    }
  ],
  "quickWins": ["Add emojis", "Create shorter sentences"],
  "longTermImprovements": ["Build audience engagement", "Develop unique voice"]
}`;

      const responseText = await callModel(prompt, systemPrompt);

      let improvements;
      try {
        improvements = extractJSON(responseText);
        if (!improvements) {
          logger.error('No JSON found in improvements response:', responseText.substring(0, 200));
          improvements = { suggestions: [], quickWins: [], longTermImprovements: [] };
        }
      } catch {
        improvements = { suggestions: [], quickWins: [], longTermImprovements: [] };
      }

      return {
        success: true,
        ...improvements,
      };
    } catch (error) {
      logger.error('Improvement suggestions error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get competitor benchmark
  async getCompetitorBenchmark(content, platform, niche = 'general') {
    try {
      // In a real implementation, this would analyze actual competitor data
      // For now, we'll use AI to estimate based on content characteristics

      const systemPrompt = `You are a competitive analysis expert. Respond ONLY with valid JSON, no other text.`;

      const prompt = `Benchmark this content against typical ${niche} content on ${platform}:

Content: "${content}"

RESPOND ONLY WITH THIS JSON:
{
  "niche": "${niche}",
  "yourEstimatedScore": 72,
  "topPerformerScore": 95,
  "averageScore": 65,
  "percentile": 75,
  "gaps": ["More engagement hooks", "Better story structure"],
  "strengths": ["Clear messaging", "Relevant topic"],
  "recommendationsToReachTop10": ["Master storytelling", "Increase interaction", "Optimize timing"]
}`;

      const responseText = await callModel(prompt, systemPrompt);

      let benchmark;
      try {
        benchmark = extractJSON(responseText);
        if (!benchmark) {
          logger.error('No JSON found in benchmark response:', responseText.substring(0, 200));
          benchmark = {
            niche,
            yourEstimatedScore: 70,
            topPerformerScore: 95,
            averageScore: 60,
            percentile: 65,
            gaps: [],
            strengths: [],
            recommendationsToReachTop10: [],
          };
        }
      } catch {
        benchmark = {
          niche,
          yourEstimatedScore: 70,
          topPerformerScore: 95,
          averageScore: 60,
          percentile: 65,
          gaps: [],
          strengths: [],
          recommendationsToReachTop10: [],
        };
      }

      return {
        success: true,
        ...benchmark,
      };
    } catch (error) {
      logger.error('Competitor benchmark error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get user's virality score history
  async getUserHistory(userId, days = 30) {
    try {
      const history = await ViralityScore.getScoreHistory(userId, days);
      
      // Calculate trends
      const scores = history.map(h => h.score);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length || 0;
      
      // Simple trend calculation
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length || 0;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length || 0;
      
      return {
        success: true,
        history,
        summary: {
          totalAnalyzed: history.length,
          averageScore: avgScore.toFixed(1),
          highestScore: Math.max(...scores, 0),
          lowestScore: Math.min(...scores, 100),
          trend: secondAvg > firstAvg ? 'improving' : secondAvg < firstAvg ? 'declining' : 'stable',
          trendPercentage: (((secondAvg - firstAvg) / firstAvg) * 100 || 0).toFixed(1),
        },
      };
    } catch (error) {
      logger.error('Get history error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Parse text response when JSON fails
  parseTextResponse(text) {
    const scoreMatch = text.match(/score[:\s]+(\d+)/i);
    return {
      overallScore: parseInt(scoreMatch?.[1]) || 70,
      breakdown: {
        contentQuality: { score: 70, factors: ['clear messaging', 'relevant topic'] },
        timing: { score: 68, optimalTime: new Date(), timezone: 'UTC' },
        audienceAlignment: { score: 72, matchedPersonas: ['general audience'] },
        trendRelevance: { score: 65, relatedTrends: ['current trends'] },
        engagementPotential: { score: 71 },
        hashtagOptimization: { score: 69, suggestedHashtags: ['#trending'], hashtagCount: 3 },
        sentiment: { score: 75, overall: 'positive' }
      },
      predictions: {
        likes: { min: 50, max: 200, confidence: 70 },
        comments: { min: 5, max: 30, confidence: 68 },
        shares: { min: 10, max: 50, confidence: 65 },
        reach: { min: 500, max: 2000, confidence: 70 },
        impressions: { min: 1000, max: 5000, confidence: 68 },
        engagementRate: { predicted: 5.5, confidence: 70 },
        viralProbability: 65
      },
      suggestions: [
        { category: 'content', priority: 'high', suggestion: 'Add call-to-action', expectedImpact: '+10% engagement', example: 'End with a question' },
        { category: 'timing', priority: 'medium', suggestion: 'Post during peak hours', expectedImpact: '+8% reach', example: '9 AM on weekdays' }
      ],
      risks: [
        { type: 'tone_mismatch', severity: 'low', description: 'Slightly formal tone', mitigation: 'Make it more conversational' }
      ],
      competitorBenchmark: { percentile: 70, topPerformerScore: 95, averageScore: 65 }
    };
  }

  // Parse forecast text
  parseForecastText(text) {
    return {
      likes: { min: 50, max: 200, expected: 100, confidence: 70 },
      comments: { min: 5, max: 30, expected: 15, confidence: 65 },
      shares: { min: 10, max: 50, expected: 25, confidence: 60 },
      reach: { min: 500, max: 2000, expected: 1000, confidence: 65 },
      engagementRate: { predicted: 5, confidence: 60 },
    };
  }
}

module.exports = new ViralityService();