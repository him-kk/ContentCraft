const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: String,
    type: {
      type: String,
      enum: ['image', 'video', 'gif', 'audio'],
      required: true,
    },
    mimeType: String,
    size: Number,
    url: {
      type: String,
      required: true,
    },
    thumbnail: String,
    width: Number,
    height: Number,
    duration: Number, // for video/audio
    alt: String,
    caption: String,
    tags: [String],
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiPrompt: String,
    aiModel: String,
    variations: [{
      url: String,
      size: String,
    }],
    edits: [{
      type: {
        type: String,
        enum: ['crop', 'resize', 'filter', 'text', 'background_remove', 'upscale'],
      },
      settings: mongoose.Schema.Types.Mixed,
      resultUrl: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    usedIn: [{
      content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
      },
      usedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    folder: {
      type: String,
      default: 'default',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
MediaSchema.index({ user: 1, createdAt: -1 });
MediaSchema.index({ type: 1 });
MediaSchema.index({ tags: 1 });
MediaSchema.index({ folder: 1 });

// Static method to get media by folder
MediaSchema.statics.getByFolder = async function (userId, folder = 'default') {
  return this.find({
    user: userId,
    folder,
    isDeleted: false,
  }).sort({ createdAt: -1 });
};

// Static method to get AI generated images
MediaSchema.statics.getAIGenerated = async function (userId, limit = 20) {
  return this.find({
    user: userId,
    aiGenerated: true,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Media', MediaSchema);