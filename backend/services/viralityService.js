const { GoogleGenerativeAI } = require('@google/generative-ai');
const ViralityScore = require('../models/ViralityScore');
const Content = require('../models/Content');
const logger = require('../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class ViralityService {
  // Predict virality score for content
  async predictVirality(content, platform = 'twitter', userId = null) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

      const prompt = `Analyze this content for virality potential on ${platform.toUpperCase()}.

Content: "${content}"

Platform Characteristics:
- Optimal length: ${platformInfo.optimalLength}
- Best hashtags: ${platformInfo.bestHashtags}
- Peak times: ${platformInfo.peakTimes}
- Key factors: ${platformInfo.keyFactors}

Provide a detailed analysis in this exact JSON format:
{
  "overallScore": 0-100,
  "breakdown": {
    "contentQuality": { "score": 0-100, "factors": ["factor1", "factor2"] },
    "timing": { "score": 0-100, "optimalTime": "HH:MM", "timezone": "EST" },
    "audienceAlignment": { "score": 0-100, "matchedPersonas": ["persona1"] },
    "trendRelevance": { "score": 0-100, "relatedTrends": ["trend1"] },
    "engagementPotential": { "score": 0-100 },
    "hashtagOptimization": { "score": 0-100, "suggestedHashtags": ["#tag1"], "hashtagCount": 3 },
    "sentiment": { "score": 0-100, "overall": "positive|negative|neutral|mixed" }
  },
  "predictions": {
    "likes": { "min": 0, "max": 0, "confidence": 0-100 },
    "comments": { "min": 0, "max": 0, "confidence": 0-100 },
    "shares": { "min": 0, "max": 0, "confidence": 0-100 },
    "reach": { "min": 0, "max": 0, "confidence": 0-100 },
    "impressions": { "min": 0, "max": 0, "confidence": 0-100 },
    "engagementRate": { "predicted": 0-100, "confidence": 0-100 },
    "viralProbability": 0-100
  },
  "suggestions": [
    { "category": "content|timing|hashtags|format|tone|length", "priority": "high|medium|low", "suggestion": "string", "expectedImpact": "string", "example": "string" }
  ],
  "risks": [
    { "type": "controversy|negative_sentiment|misinformation|copyright|tone_mismatch", "severity": "high|medium|low", "description": "string", "mitigation": "string" }
  ],
  "competitorBenchmark": { "percentile": 0-100, "topPerformerScore": 0-100, "averageScore": 0-100 }
}

Be realistic and data-driven in your predictions. Consider current social media trends and platform algorithms.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Extract JSON from response
      let analysis;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
      } catch (parseError) {
        logger.error('JSON parse error:', parseError);
        // Fallback to structured response
        analysis = this.parseTextResponse(responseText);
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
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      let historicalContext = '';
      if (historicalData) {
        historicalContext = `\nHistorical Performance:\n- Average likes: ${historicalData.avgLikes}\n- Average comments: ${historicalData.avgComments}\n- Average shares: ${historicalData.avgShares}\n- Average engagement rate: ${historicalData.avgEngagementRate}%`;
      }

      const prompt = `Forecast engagement metrics for this ${platform} content:${historicalContext}

Content: "${content}"

Provide forecast in JSON format:
{
  "likes": { "min": number, "max": number, "expected": number, "confidence": 0-100 },
  "comments": { "min": number, "max": number, "expected": number, "confidence": 0-100 },
  "shares": { "min": number, "max": number, "expected": number, "confidence": 0-100 },
  "reach": { "min": number, "max": number, "expected": number, "confidence": 0-100 },
  "impressions": { "min": number, "max": number, "expected": number, "confidence": 0-100 },
  "engagementRate": { "predicted": number, "confidence": 0-100 },
  "clickThroughRate": { "predicted": number, "confidence": 0-100 },
  "bestPostingTime": "HH:MM",
  "peakEngagementWindow": "X hours after posting",
  "factors": ["factor1", "factor2"]
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let forecast;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        forecast = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
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
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Analyze this content for potential risks on ${platform}:

Content: "${content}"

Check for:
1. Controversial or divisive topics
2. Potentially offensive language
3. Misinformation or unverified claims
4. Copyright/trademark issues
5. Tone mismatch with platform culture
6. PR or reputation risks

Provide analysis in JSON format:
{
  "riskLevel": "low|medium|high",
  "risks": [
    { "type": "string", "severity": "low|medium|high", "description": "string", "mitigation": "string" }
  ],
  "recommendations": ["string"]
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let riskAnalysis;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        riskAnalysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
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
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Provide specific improvement suggestions for this ${platform} content:

Content: "${content}"
${currentScore ? `Current Score: ${currentScore}/100` : ''}

Provide 5-7 actionable suggestions in JSON format:
{
  "suggestions": [
    {
      "category": "content|timing|hashtags|format|tone|length",
      "priority": "high|medium|low",
      "current": "what's currently done",
      "suggestion": "what to change",
      "expectedImpact": "estimated score improvement",
      "example": "specific example of the change"
    }
  ],
  "quickWins": ["suggestion1", "suggestion2"],
  "longTermImprovements": ["suggestion1", "suggestion2"]
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let improvements;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        improvements = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
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

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Benchmark this content against typical ${niche} content on ${platform}:

Content: "${content}"

Provide benchmark in JSON format:
{
  "niche": "string",
  "yourEstimatedScore": 0-100,
  "topPerformerScore": 0-100,
  "averageScore": 0-100,
  "percentile": 0-100,
  "gaps": ["area1", "area2"],
  "strengths": ["strength1", "strength2"],
  "recommendationsToReachTop10": ["rec1", "rec2"]
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let benchmark;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        benchmark = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
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
      breakdown: {},
      predictions: {},
      suggestions: [],
      risks: [],
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