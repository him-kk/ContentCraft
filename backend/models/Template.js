const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: String,
    category: {
      type: String,
      enum: [
        'blog',
        'social',
        'email',
        'ad',
        'newsletter',
        'product',
        'script',
        'announcement',
        'promotional',
        'educational',
        'entertainment',
        'custom',
      ],
      default: 'custom',
    },
    type: {
      type: String,
      enum: ['blog', 'social', 'email', 'ad', 'newsletter', 'product', 'script', 'other'],
      required: true,
    },
    platform: {
      type: String,
      enum: ['twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'blog', 'email', 'universal'],
      default: 'universal',
    },
    content: {
      type: String,
      required: true,
    },
    structure: {
      headline: String,
      body: String,
      callToAction: String,
      hashtags: [String],
    },
    variables: [{
      name: String,
      description: String,
      defaultValue: String,
      required: {
        type: Boolean,
        default: false,
      },
    }],
    placeholders: [{
      key: String,
      description: String,
    }],
    tone: {
      type: String,
      enum: ['professional', 'casual', 'friendly', 'authoritative', 'humorous', 'inspirational'],
    },
    wordCountRange: {
      min: Number,
      max: Number,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    thumbnail: String,
    preview: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
TemplateSchema.index({ user: 1, category: 1 });
TemplateSchema.index({ isPublic: 1, category: 1 });
TemplateSchema.index({ type: 1, platform: 1 });
TemplateSchema.index({ tags: 1 });

// Static method to get templates by category
TemplateSchema.statics.getByCategory = async function (category, options = {}) {
  const { isPublic = true, limit = 20 } = options;
  const query = { category };
  if (isPublic) {
    query.isPublic = true;
  }
  return this.find(query)
    .sort({ rating: -1, usageCount: -1 })
    .limit(limit);
};

// Method to increment usage
TemplateSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  await this.save();
};

// Method to apply template with variables
TemplateSchema.methods.apply = function (variables = {}) {
  let content = this.content;
  
  // Replace variables in content
  this.variables.forEach(variable => {
    const value = variables[variable.name] || variable.defaultValue || '';
    const regex = new RegExp(`{{${variable.name}}}`, 'g');
    content = content.replace(regex, value);
  });
  
  return content;
};

module.exports = mongoose.model('Template', TemplateSchema);