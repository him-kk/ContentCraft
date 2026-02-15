const axios = require('axios');
const googleTrends = require('google-trends-api');
const Trend = require('../models/Trend');
const logger = require('../utils/logger');

class TrendService {
  constructor() {
    this.activeTrends = new Map();
    this.monitoringInterval = null;
  }

  // Start real-time trend monitoring
  startMonitoring(intervalMinutes = 5) {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(
      () => this.fetchAllTrends(),
      intervalMinutes * 60 * 1000
    );

    // Initial fetch
    this.fetchAllTrends();
    logger.info(`Trend monitoring started with ${intervalMinutes} minute interval`);
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      logger.info('Trend monitoring stopped');
    }
  }

  // Fetch trends from all platforms
  async fetchAllTrends() {
    try {
      await Promise.all([
        this.fetchGoogleTrends(),
        this.fetchTwitterTrends(),
        this.fetchRedditTrends(),
      ]);

      // Update trend lifecycles
      await this.updateTrendLifecycles();

      logger.info('All trends fetched and updated');
    } catch (error) {
      logger.error('Error fetching trends:', error);
    }
  }

  // Fetch Google Trends
  async fetchGoogleTrends() {
    try {
      const results = await googleTrends.realTimeTrends({
        geo: 'US',
        category: 'all',
      });

      const trends = JSON.parse(results);
      
      for (const story of trends.storySummaries?.trendingStories || []) {
        await this.processTrend({
          keyword: story.title,
          source: 'google',
          mentions: story.articles?.length || 0,
          relatedKeywords: story.entityNames || [],
          categories: [story.category],
        });
      }
    } catch (error) {
      logger.error('Google Trends error:', error);
    }
  }

  // Fetch Twitter trends
  async fetchTwitterTrends() {
    try {
      // In production, use Twitter API v2
      // This is a mock implementation
      const mockTrends = [
        { keyword: '#AI', mentions: 50000, velocity: 1200 },
        { keyword: '#TechNews', mentions: 30000, velocity: 800 },
        { keyword: '#Innovation', mentions: 25000, velocity: 600 },
      ];

      for (const trend of mockTrends) {
        await this.processTrend({
          keyword: trend.keyword,
          source: 'twitter',
          mentions: trend.mentions,
          velocity: trend.velocity,
        });
      }
    } catch (error) {
      logger.error('Twitter trends error:', error);
    }
  }

  // Fetch Reddit trends
  async fetchRedditTrends() {
    try {
      const response = await axios.get('https://www.reddit.com/r/all/hot.json?limit=25', {
        headers: { 'User-Agent': 'ContentCraft-AI/1.0' },
      });

      const posts = response.data.data.children;
      
      for (const post of posts) {
        const data = post.data;
        await this.processTrend({
          keyword: data.title.split(' ').slice(0, 5).join(' '),
          source: 'reddit',
          mentions: data.score,
          velocity: data.upvote_ratio * 100,
          subreddit: data.subreddit,
        });
      }
    } catch (error) {
      logger.error('Reddit trends error:', error);
    }
  }

  // Process and store trend
  async processTrend(trendData) {
    try {
      const { keyword, source, mentions, velocity = 0 } = trendData;

      let trend = await Trend.findOne({ keyword: keyword.toLowerCase() });

      if (trend) {
        // Update existing trend
        const platformData = trend.platforms.find(p => p.platform === source);
        
        if (platformData) {
          platformData.mentions = mentions;
          platformData.velocity = velocity;
        } else {
          trend.platforms.push({
            platform: source,
            mentions,
            velocity,
          });
        }

        // Calculate total mentions and velocity
        trend.totalMentions = trend.platforms.reduce((sum, p) => sum + p.mentions, 0);
        const oldVelocity = trend.velocity;
        trend.velocity = trend.platforms.reduce((sum, p) => sum + p.velocity, 0) / trend.platforms.length;
        trend.velocityChange = ((trend.velocity - oldVelocity) / oldVelocity) * 100;
        
        trend.lastUpdated = new Date();
        await trend.save();
      } else {
        // Create new trend
        trend = await Trend.create({
          keyword: keyword.toLowerCase(),
          platforms: [{
            platform: source,
            mentions,
            velocity,
          }],
          totalMentions: mentions,
          velocity,
          lifecycle: 'emerging',
          firstDetected: new Date(),
          lastUpdated: new Date(),
        });
      }

      // Add to active trends
      this.activeTrends.set(trend.keyword, trend);

      return trend;
    } catch (error) {
      logger.error('Process trend error:', error);
    }
  }

  // Update trend lifecycles
  async updateTrendLifecycles() {
    try {
      const trends = await Trend.find({ isActive: true });
      
      for (const trend of trends) {
        await trend.updateLifecycle();
      }
    } catch (error) {
      logger.error('Update lifecycle error:', error);
    }
  }

  // Get live trending topics
  async getLiveTrends(options = {}) {
    const { limit = 20, platforms = [], minVelocity = 100 } = options;

    try {
      const query = {
        isActive: true,
        velocity: { $gte: minVelocity },
      };

      if (platforms.length > 0) {
        query['platforms.platform'] = { $in: platforms };
      }

      const trends = await Trend.find(query)
        .sort({ velocity: -1 })
        .limit(limit);

      return {
        success: true,
        trends,
        count: trends.length,
        lastUpdated: new Date(),
      };
    } catch (error) {
      logger.error('Get live trends error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get trends by platform
  async getTrendsByPlatform(platform, limit = 20) {
    try {
      const trends = await Trend.find({
        isActive: true,
        'platforms.platform': platform,
      })
        .sort({ velocity: -1 })
        .limit(limit);

      return {
        success: true,
        platform,
        trends,
      };
    } catch (error) {
      logger.error('Get platform trends error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get niche trends
  async getNicheTrends(nicheCategories, limit = 10) {
    try {
      const trends = await Trend.getNicheTrends(nicheCategories, limit);

      return {
        success: true,
        categories: nicheCategories,
        trends,
      };
    } catch (error) {
      logger.error('Get niche trends error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get trend lifecycle
  async getTrendLifecycle(trendId) {
    try {
      const trend = await Trend.findById(trendId);

      if (!trend) {
        return {
          success: false,
          error: 'Trend not found',
        };
      }

      // Calculate lifecycle prediction
      const lifecyclePrediction = this.predictLifecycle(trend);

      return {
        success: true,
        trend: {
          keyword: trend.keyword,
          currentLifecycle: trend.lifecycle,
          firstDetected: trend.firstDetected,
          peakTime: trend.peakTime,
        },
        prediction: lifecyclePrediction,
        historicalData: trend.historicalData,
      };
    } catch (error) {
      logger.error('Get lifecycle error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Predict trend lifecycle
  predictLifecycle(trend) {
    const now = Date.now();
    const hoursSinceDetection = (now - trend.firstDetected) / (1000 * 60 * 60);
    
    let predictedPeak = null;
    let predictedDecline = null;
    let predictedExpiry = null;

    switch (trend.lifecycle) {
      case 'emerging':
        predictedPeak = new Date(now + 12 * 60 * 60 * 1000); // 12 hours
        predictedDecline = new Date(now + 36 * 60 * 60 * 1000); // 36 hours
        predictedExpiry = new Date(now + 72 * 60 * 60 * 1000); // 72 hours
        break;
      case 'rising':
        predictedPeak = new Date(now + 6 * 60 * 60 * 1000); // 6 hours
        predictedDecline = new Date(now + 24 * 60 * 60 * 1000); // 24 hours
        predictedExpiry = new Date(now + 48 * 60 * 60 * 1000); // 48 hours
        break;
      case 'peaking':
        predictedDecline = new Date(now + 12 * 60 * 60 * 1000); // 12 hours
        predictedExpiry = new Date(now + 36 * 60 * 60 * 1000); // 36 hours
        break;
      case 'declining':
        predictedExpiry = new Date(now + 24 * 60 * 60 * 1000); // 24 hours
        break;
    }

    return {
      predictedPeak,
      predictedDecline,
      predictedExpiry,
      hoursRemaining: predictedExpiry
        ? Math.round((predictedExpiry - now) / (1000 * 60 * 60))
        : 0,
      recommendation: this.getLifecycleRecommendation(trend.lifecycle),
    };
  }

  // Get recommendation based on lifecycle
  getLifecycleRecommendation(lifecycle) {
    const recommendations = {
      emerging: 'Monitor closely. Prepare content to capitalize when it rises.',
      rising: 'ACT NOW! Create and post content immediately for maximum impact.',
      peaking: 'Post quickly. The window is closing. Focus on speed over perfection.',
      declining: 'Consider skipping unless highly relevant to your niche.',
      expired: 'Avoid. Trend has passed. Focus on emerging trends instead.',
    };

    return recommendations[lifecycle] || 'Monitor trend development.';
  }

  // Generate content from trend
  async generateTrendContent(trendId, platform, options = {}) {
    try {
      const trend = await Trend.findById(trendId);

      if (!trend) {
        return {
          success: false,
          error: 'Trend not found',
        };
      }

      const AIService = require('./aiService');
      
      const prompt = `Create ${platform} content about "${trend.keyword}".
Related topics: ${trend.relatedKeywords?.join(', ') || 'none'}
Trending hashtags: ${trend.hashtags?.join(', ') || '#trending'}

Make it timely, engaging, and relevant to the current conversation.`;

      const generated = await AIService.generateContent({
        prompt,
        platform,
        type: 'social',
        tone: options.tone || 'trendy',
        includeHashtags: true,
      });

      if (generated.success) {
        // Store generated content
        trend.aiGeneratedContent.push({
          type: platform,
          content: generated.content,
          createdAt: new Date(),
        });
        await trend.save();
      }

      return generated;
    } catch (error) {
      logger.error('Generate trend content error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get trend opportunities
  async getTrendOpportunities(userNiche = null, limit = 10) {
    try {
      const query = {
        isActive: true,
        lifecycle: { $in: ['emerging', 'rising'] },
        velocity: { $gte: 200 },
      };

      if (userNiche) {
        query.$or = [
          { categories: { $in: [userNiche] } },
          { nicheCategories: { $in: [userNiche] } },
        ];
      }

      const opportunities = await Trend.find(query)
        .sort({ velocity: -1 })
        .limit(limit);

      // Score each opportunity
      const scored = opportunities.map(trend => ({
        ...trend.toObject(),
        opportunityScore: this.calculateOpportunityScore(trend),
        recommendation: this.getOpportunityRecommendation(trend),
      }));

      return {
        success: true,
        opportunities: scored.sort((a, b) => b.opportunityScore - a.opportunityScore),
      };
    } catch (error) {
      logger.error('Get opportunities error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Calculate opportunity score
  calculateOpportunityScore(trend) {
    let score = 0;
    
    // Velocity factor (0-40)
    score += Math.min(trend.velocity / 50, 40);
    
    // Lifecycle factor (0-30)
    const lifecycleScores = { emerging: 25, rising: 30, peaking: 15, declining: 5, expired: 0 };
    score += lifecycleScores[trend.lifecycle] || 0;
    
    // Mention volume factor (0-20)
    score += Math.min(trend.totalMentions / 1000, 20);
    
    // Sentiment factor (0-10)
    const sentimentScores = { positive: 10, neutral: 7, mixed: 5, negative: 2 };
    score += sentimentScores[trend.sentiment?.overall] || 5;

    return Math.round(score);
  }

  // Get recommendation for opportunity
  getOpportunityRecommendation(trend) {
    const score = this.calculateOpportunityScore(trend);
    
    if (score >= 80) {
      return 'HIGH PRIORITY: Create content immediately. This trend has high viral potential.';
    } else if (score >= 60) {
      return 'MEDIUM PRIORITY: Good opportunity. Create content within the next few hours.';
    } else if (score >= 40) {
      return 'LOW PRIORITY: Monitor and prepare content if highly relevant to your niche.';
    }
    return 'SKIP: Not a strong opportunity for your content strategy.';
  }

  // Get upcoming predictable trends
  async getTrendCalendar(days = 30) {
    try {
      const upcoming = [];
      const today = new Date();

      // Add predictable events (holidays, events, etc.)
      const predictableEvents = [
        { name: 'Valentine\'s Day', date: '2025-02-14', category: 'holiday' },
        { name: 'International Women\'s Day', date: '2025-03-08', category: 'holiday' },
        { name: 'Earth Day', date: '2025-04-22', category: 'holiday' },
        { name: 'Mother\'s Day', date: '2025-05-11', category: 'holiday' },
        { name: 'Father\'s Day', date: '2025-06-15', category: 'holiday' },
        { name: 'Summer Solstice', date: '2025-06-21', category: 'seasonal' },
        { name: 'Back to School', date: '2025-08-15', category: 'seasonal' },
        { name: 'Halloween', date: '2025-10-31', category: 'holiday' },
        { name: 'Black Friday', date: '2025-11-28', category: 'shopping' },
        { name: 'Cyber Monday', date: '2025-12-01', category: 'shopping' },
        { name: 'Christmas', date: '2025-12-25', category: 'holiday' },
        { name: 'New Year\'s Eve', date: '2025-12-31', category: 'holiday' },
      ];

      for (const event of predictableEvents) {
        const eventDate = new Date(event.date);
        const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil > 0 && daysUntil <= days) {
          upcoming.push({
            ...event,
            daysUntil,
            recommendedPrepDate: new Date(eventDate - 7 * 24 * 60 * 60 * 1000),
            contentIdeas: this.getEventContentIdeas(event.name, event.category),
          });
        }
      }

      return {
        success: true,
        upcoming: upcoming.sort((a, b) => a.daysUntil - b.daysUntil),
      };
    } catch (error) {
      logger.error('Get trend calendar error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get content ideas for predictable events
  getEventContentIdeas(eventName, category) {
    const ideaTemplates = {
      holiday: [
        `How to celebrate ${eventName} authentically`,
        `${eventName} traditions around the world`,
        `Last-minute ${eventName} ideas`,
        `${eventName} deals and offers`,
        `The history of ${eventName}`,
      ],
      seasonal: [
        `Preparing for ${eventName}`,
        `${eventName} trends to watch`,
        `How ${eventName} affects your industry`,
        `${eventName} marketing strategies`,
      ],
      shopping: [
        `Best ${eventName} deals`,
        `${eventName} shopping tips`,
        `How to maximize ${eventName} savings`,
        `${eventName} predictions and analysis`,
      ],
    };

    return ideaTemplates[category] || [`Content ideas for ${eventName}`];
  }

  // Subscribe to trend alerts
  async subscribeToAlerts(userId, keywords, options = {}) {
    try {
      // In production, store in database
      // For now, return subscription confirmation
      return {
        success: true,
        subscription: {
          userId,
          keywords,
          options,
          createdAt: new Date(),
        },
        message: `Subscribed to alerts for: ${keywords.join(', ')}`,
      };
    } catch (error) {
      logger.error('Subscribe error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Analyze competitor trend usage
  async analyzeCompetitorTrends(competitorHandle, platform) {
    try {
      // In production, fetch actual competitor data
      // This is a mock implementation
      const mockAnalysis = {
        competitor: competitorHandle,
        platform,
        trendsUsed: 15,
        avgEngagementOnTrends: 8.5,
        topPerformingTrends: ['#AI', '#TechNews', '#Innovation'],
        timingStrategy: 'Posts within 2 hours of trend emergence',
        contentStyle: 'Educational with personal insights',
      };

      return {
        success: true,
        analysis: mockAnalysis,
        recommendations: [
          'Monitor their trend response time',
          'Analyze their content angle on trends',
          'Identify gaps in their trend coverage',
        ],
      };
    } catch (error) {
      logger.error('Competitor analysis error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new TrendService();