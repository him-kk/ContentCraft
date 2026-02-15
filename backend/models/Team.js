const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'editor', 'writer', 'viewer'],
      default: 'viewer',
    },
    permissions: {
      canCreate: { type: Boolean, default: true },
      canEdit: { type: Boolean, default: true },
      canDelete: { type: Boolean, default: false },
      canPublish: { type: Boolean, default: false },
      canSchedule: { type: Boolean, default: true },
      canManageTeam: { type: Boolean, default: false },
      canViewAnalytics: { type: Boolean, default: true },
      canManageSettings: { type: Boolean, default: false },
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive', 'removed'],
      default: 'pending',
    },
  },
  { _id: false }
);

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done', 'cancelled'],
      default: 'todo',
    },
    dueDate: Date,
    completedAt: Date,
    tags: [String],
  },
  { timestamps: true }
);

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ['content', 'schedule', 'template', 'team', 'settings', 'other'],
    },
    targetId: mongoose.Schema.Types.ObjectId,
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [TeamMemberSchema],
    tasks: [TaskSchema],
    activities: [ActivitySchema],
    settings: {
      requireApproval: {
        type: Boolean,
        default: false,
      },
      approvers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      defaultPermissions: {
        canCreate: { type: Boolean, default: true },
        canEdit: { type: Boolean, default: true },
        canDelete: { type: Boolean, default: false },
        canPublish: { type: Boolean, default: false },
        canSchedule: { type: Boolean, default: true },
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'free',
      },
      maxMembers: {
        type: Number,
        default: 5,
      },
    },
    inviteCode: String,
    inviteCodeExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
TeamSchema.index({ owner: 1 });
TeamSchema.index({ 'members.user': 1 });
TeamSchema.index({ inviteCode: 1 });

// Method to add member
TeamSchema.methods.addMember = async function (userId, role = 'viewer', invitedBy) {
  const existingMember = this.members.find(
    m => m.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('User is already a team member');
  }
  
  if (this.members.length >= this.subscription.maxMembers) {
    throw new Error('Team member limit reached');
  }
  
  this.members.push({
    user: userId,
    role,
    invitedBy,
    status: 'pending',
  });
  
  await this.save();
};

// Method to remove member
TeamSchema.methods.removeMember = async function (userId) {
  this.members = this.members.filter(
    m => m.user.toString() !== userId.toString()
  );
  await this.save();
};

// Method to update member role
TeamSchema.methods.updateMemberRole = async function (userId, newRole) {
  const member = this.members.find(
    m => m.user.toString() === userId.toString()
  );
  
  if (!member) {
    throw new Error('Member not found');
  }
  
  member.role = newRole;
  await this.save();
};

// Method to add activity
TeamSchema.methods.addActivity = async function (userId, action, targetType, targetId, details) {
  this.activities.unshift({
    user: userId,
    action,
    targetType,
    targetId,
    details,
  });
  
  // Keep only last 100 activities
  if (this.activities.length > 100) {
    this.activities = this.activities.slice(0, 100);
  }
  
  await this.save();
};

// Method to create task
TeamSchema.methods.createTask = async function (taskData) {
  this.tasks.push(taskData);
  await this.save();
  return this.tasks[this.tasks.length - 1];
};

// Static method to get team by member
TeamSchema.statics.getByMember = async function (userId) {
  return this.findOne({
    'members.user': userId,
  }).populate('members.user', 'name email avatar');
};

module.exports = mongoose.model('Team', TeamSchema);