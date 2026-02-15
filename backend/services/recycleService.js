const Content = require('../models/Content');
const RecycledContent = require('../models/RecycledContent');
const ViralityScore = require('../models/ViralityScore');
const AIService = require('./aiService');
const logger = require('../utils/logger');

class RecycleService {
  // Get top performing content for recycling
  async getTopPerformers(userId, options = {}) {
    const { limit = 10, days = 180, minEngagement = 5 } = options;

    try {
      const performers = await Content.getTopPerforming(userId, limit, days);

      // Filter by minimum engagement rate
      const filtered = performers.filter(
        content => (content.performance?.engagementRate || 0) >= minEngagement
      );

      return {
        success: true,
        performers: filtered.map(content => ({
          ...content.toObject(),
          recycleScore: this.calculateRecycleScore(content),
          suggestedActions: this.suggestRecycleActions(content),
        })),
        count: filtered.length,
      };
    } catch (error) {
      logger.error('Get top performers error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Calculate recycle score
  calculateRecycleScore(content) {
    let score = 0;

    // Performance factor (0-40)
    const engagement = content.performance?.engagementRate || 0;
    score += Math.min(engagement * 4, 40);

    // Age factor (0-30) - older content scores higher
    const ageInDays = (Date.now() - new Date(content.createdAt)) / (1000 * 60 * 60 * 24);
    score += Math.min(ageInDays / 10, 30);

    // Evergreen factor (0-20)
    if (content.evergreen) score += 20;

    // Recyclability factor (0-10)
    const recycledCount = content.recycledCount || 0;
    score += Math.max(0, 10 - recycledCount * 2);

    return Math.round(score);
  }

  // Suggest recycle actions
  suggestRecycleActions(content) {
    const actions = [];
    const ageInDays = (Date.now() - new Date(content.createdAt)) / (1000 * 60 * 60 * 24);

    if (ageInDays > 180) {
      actions.push({
        type: 'remix',
        description: 'Remix with fresh perspective and updated information',
        priority: 'high',
      });
    }

    if (content.seasonal?.isSeasonal) {
      const currentMonth = new Date().getMonth();
      if (content.seasonal.month === currentMonth) {
        actions.push({
          type: 'seasonal',
          description: 'Resurface seasonal content at the right time',
          priority: 'high',
        });
      }
    }

    if (content.wordCount > 500) {
      actions.push({
        type: 'repurpose',
        description: 'Break into multiple social media posts',
        priority: 'medium',
      });
    }

    if (!content.platform || content.platform === 'blog') {
      actions.push({
        type: 'cross_platform',
        description: 'Adapt for social media platforms',
        priority: 'medium',
      });
    }

    if (content.status === 'draft') {
      actions.push({
        type: 'completion',
        description: 'Complete unfinished draft with AI',
        priority: 'high',
      });
    }

    return actions;
  }

  // Remix content
  async remixContent(contentId, userId, options = {}) {
    try {
      const content = await Content.findById(contentId);

      if (!content) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      const { tone = 'fresh', format = 'same', updateStats = true } = options;

      let remixPrompt = `Remix this content with a fresh perspective:

Original: "${content.content}"

Make it:`;

      if (tone === 'fresh') {
        remixPrompt += '\n- More engaging and current';
      } else if (tone === 'controversial') {
        remixPrompt += '\n- More provocative and discussion-worthy';
      } else if (tone === 'educational') {
        remixPrompt += '\n- More educational and informative';
      }

      if (updateStats) {
        remixPrompt += '\n- Update any statistics or data with 2025 figures';
      }

      remixPrompt += '\n- Keep the core message but present it differently';
      remixPrompt += '\n- Add new insights or angles';

      const remixResult = await AIService.generateContent({
        prompt: remixPrompt,
        platform: content.platform || 'blog',
        type: content.type || 'blog',
        tone: content.tone || 'professional',
      });

      if (!remixResult.success) {
        return remixResult;
      }

      // Create recycled content record
      const recycled = await RecycledContent.create({
        user: userId,
        originalContent: contentId,
        type: 'remix',
        reason: 'top_performer',
        changes: {
          description: `Remixed with ${tone} tone`,
          originalText: content.content.substring(0, 200) + '...',
          newText: remixResult.content.substring(0, 200) + '...',
          aiGenerated: true,
        },
      });

      // Increment original content recycle count
      content.recycledCount = (content.recycledCount || 0) + 1;
      await content.save();

      return {
        success: true,
        recycled,
        remix: remixResult.content,
        original: content,
      };
    } catch (error) {
      logger.error('Remix content error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get seasonal content to resurface
  async getSeasonalContent(userId) {
    try {
      const currentMonth = new Date().getMonth();
      const nextMonth = (currentMonth + 1) % 12;

      const seasonalContent = await Content.find({
        user: userId,
        'seasonal.isSeasonal': true,
        $or: [
          { 'seasonal.month': currentMonth },
          { 'seasonal.month': nextMonth },
        ],
        status: 'published',
        isDeleted: false,
      }).sort({ 'performance.engagementRate': -1 });

      return {
        success: true,
        currentMonth,
        seasonalContent: seasonalContent.map(content => ({
          ...content.toObject(),
          daysUntilOptimal: this.calculateDaysUntilOptimal(content.seasonal.month),
          recommendedAction: content.seasonal.month === currentMonth
            ? 'Publish now'
            : 'Schedule for next month',
        })),
      };
    } catch (error) {
      logger.error('Get seasonal content error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Calculate days until optimal posting
  calculateDaysUntilOptimal(targetMonth) {
    const today = new Date();
    const target = new Date(today.getFullYear(), targetMonth, 1);
    
    if (target < today) {
      target.setFullYear(target.getFullYear() + 1);
    }
    
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  }

  // Update content with new stats
  async updateStats(contentId, userId) {
    try {
      const content = await Content.findById(contentId);

      if (!content) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      const updatePrompt = `Update this content with the latest 2025 statistics and data:

Original: "${content.content}"

Replace outdated statistics with current 2025 figures. Keep the structure and flow similar. Only change factual data that needs updating.`;

      const updateResult = await AIService.generateContent({
        prompt: updatePrompt,
        platform: content.platform || 'blog',
        type: content.type || 'blog',
      });

      if (!updateResult.success) {
        return updateResult;
      }

      const recycled = await RecycledContent.create({
        user: userId,
        originalContent: contentId,
        type: 'update',
        reason: 'outdated_stats',
        changes: {
          description: 'Updated with 2025 statistics',
          originalText: content.content,
          newText: updateResult.content,
          aiGenerated: true,
        },
      });

      return {
        success: true,
        recycled,
        updated: updateResult.content,
        original: content,
      };
    } catch (error) {
      logger.error('Update stats error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get unfinished drafts
  async getUnfinishedDrafts(userId) {
    try {
      const drafts = await Content.find({
        user: userId,
        status: 'draft',
        $or: [
          { wordCount: { $lt: 100 } },
          { content: { $regex: /\[.*?\]|TODO|FIXME|draft/i } },
        ],
        isDeleted: false,
      }).sort({ updatedAt: -1 });

      const withCompletionSuggestions = await Promise.all(
        drafts.map(async (draft) => {
          const suggestion = await this.suggestCompletion(draft);
          return {
            ...draft.toObject(),
            completionSuggestion: suggestion,
          };
        })
      );

      return {
        success: true,
        drafts: withCompletionSuggestions,
        count: drafts.length,
      };
    } catch (error) {
      logger.error('Get unfinished drafts error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Suggest completion for draft
  async suggestCompletion(draft) {
    try {
      const prompt = `Complete this unfinished draft:

Current draft: "${draft.content}"
Title: ${draft.title || 'Untitled'}
Type: ${draft.type || 'blog'}

Complete the content naturally, maintaining the same tone and style. Expand on the ideas already present.`;

      const result = await AIService.generateContent({
        prompt,
        platform: draft.platform || 'blog',
        type: draft.type || 'blog',
        tone: draft.tone || 'professional',
      });

      return result.success ? result.content : null;
    } catch (error) {
      logger.error('Completion suggestion error:', error);
      return null;
    }
  }

  // Get evergreen content
  async getEvergreenContent(userId) {
    try {
      const evergreen = await Content.find({
        user: userId,
        evergreen: true,
        status: 'published',
        isDeleted: false,
      }).sort({ 'performance.engagementRate': -1 });

      return {
        success: true,
        evergreen: evergreen.map(content => ({
          ...content.toObject(),
          lastUpdated: content.updatedAt,
          needsRefresh: this.checkNeedsRefresh(content),
        })),
      };
    } catch (error) {
      logger.error('Get evergreen content error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Check if content needs refresh
  checkNeedsRefresh(content) {
    const lastUpdate = new Date(content.updatedAt);
    const monthsSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60 * 24 * 30);
    return monthsSinceUpdate > 6;
  }

  // Get recycling suggestions
  async getRecyclingSuggestions(userId) {
    try {
      const [topPerformers, seasonal, unfinished, evergreen] = await Promise.all([
        this.getTopPerformers(userId, { limit: 5 }),
        this.getSeasonalContent(userId),
        this.getUnfinishedDrafts(userId),
        this.getEvergreenContent(userId),
      ]);

      const suggestions = [];

      // Add top performer suggestions
      if (topPerformers.success && topPerformers.performers.length > 0) {
        for (const performer of topPerformers.performers.slice(0, 3)) {
          suggestions.push({
            type: 'remix',
            priority: 'high',
            content: performer,
            reason: `Top performer with ${performer.performance?.engagementRate}% engagement`,
            action: 'remix',
          });
        }
      }

      // Add seasonal suggestions
      if (seasonal.success && seasonal.seasonalContent.length > 0) {
        for (const content of seasonal.seasonalContent.slice(0, 2)) {
          suggestions.push({
            type: 'seasonal',
            priority: content.daysUntilOptimal <= 7 ? 'high' : 'medium',
            content,
            reason: `Seasonal content - ${content.daysUntilOptimal} days until optimal`,
            action: 'resurface',
          });
        }
      }

      // Add unfinished draft suggestions
      if (unfinished.success && unfinished.drafts.length > 0) {
        for (const draft of unfinished.drafts.slice(0, 2)) {
          suggestions.push({
            type: 'completion',
            priority: 'medium',
            content: draft,
            reason: 'Unfinished draft with AI completion available',
            action: 'complete',
          });
        }
      }

      // Add evergreen refresh suggestions
      if (evergreen.success) {
        const needsRefresh = evergreen.evergreen.filter(e => e.needsRefresh);
        for (const content of needsRefresh.slice(0, 2)) {
          suggestions.push({
            type: 'refresh',
            priority: 'low',
            content,
            reason: 'Evergreen content needs updating',
            action: 'update',
          });
        }
      }

      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      return {
        success: true,
        suggestions,
        total: suggestions.length,
        byType: {
          remix: suggestions.filter(s => s.type === 'remix').length,
          seasonal: suggestions.filter(s => s.type === 'seasonal').length,
          completion: suggestions.filter(s => s.type === 'completion').length,
          refresh: suggestions.filter(s => s.type === 'refresh').length,
        },
      };
    } catch (error) {
      logger.error('Get recycling suggestions error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Schedule automatic recycling
  async scheduleAutoRecycling(userId, options = {}) {
    try {
      const {
        frequency = 'weekly',
        maxPerWeek = 3,
        platforms = ['twitter', 'linkedin'],
        autoApprove = false,
      } = options;

      // In production, this would set up a recurring job
      // For now, return the configuration

      return {
        success: true,
        schedule: {
          userId,
          frequency,
          maxPerWeek,
          platforms,
          autoApprove,
          nextRun: this.calculateNextRun(frequency),
          status: 'active',
        },
        message: `Auto-recycling scheduled: ${maxPerWeek} posts per week on ${platforms.join(', ')}`,
      };
    } catch (error) {
      logger.error('Schedule auto recycling error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Calculate next run time
  calculateNextRun(frequency) {
    const now = new Date();
    const next = new Date();

    switch (frequency) {
      case 'daily':
        next.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(now.getDate() + 7);
        break;
      case 'biweekly':
        next.setDate(now.getDate() + 14);
        break;
      case 'monthly':
        next.setMonth(now.getMonth() + 1);
        break;
      default:
        next.setDate(now.getDate() + 7);
    }

    return next;
  }

  // Get recycling calendar
  async getRecyclingCalendar(userId, months = 3) {
    try {
      const suggestions = await this.getRecyclingSuggestions(userId);
      const scheduled = await RecycledContent.find({
        user: userId,
        scheduledAt: { $exists: true },
      }).populate('originalContent', 'title');

      const calendar = [];

      // Add suggested items
      if (suggestions.success) {
        for (const suggestion of suggestions.suggestions) {
          calendar.push({
            date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
            type: suggestion.type,
            content: suggestion.content.title || suggestion.content._id,
            status: 'suggested',
            priority: suggestion.priority,
          });
        }
      }

      // Add scheduled items
      for (const item of scheduled) {
        calendar.push({
          date: item.scheduledAt,
          type: item.type,
          content: item.originalContent?.title || 'Unknown',
          status: 'scheduled',
          priority: 'medium',
        });
      }

      // Sort by date
      calendar.sort((a, b) => a.date - b.date);

      return {
        success: true,
        calendar,
        stats: {
          suggested: suggestions.suggestions?.length || 0,
          scheduled: scheduled.length,
          published: await RecycledContent.countDocuments({
            user: userId,
            status: 'published',
          }),
        },
      };
    } catch (error) {
      logger.error('Get recycling calendar error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get recycling performance
  async getRecyclingPerformance(userId) {
    try {
      const performance = await RecycledContent.getPerformance(userId);

      const summary = {
        totalRecycled: await RecycledContent.countDocuments({ user: userId }),
        published: await RecycledContent.countDocuments({
          user: userId,
          status: 'published',
        }),
        byType: {},
        avgImprovement: 0,
      };

      for (const stat of performance) {
        summary.byType[stat._id] = {
          count: stat.count,
          avgImprovement: stat.avgImprovement?.toFixed(2) || 0,
        };
      }

      return {
        success: true,
        performance: summary,
        detailed: performance,
      };
    } catch (error) {
      logger.error('Get recycling performance error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new RecycleService();