export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
}

export interface Content {
  id: string;
  title: string;
  body: string;
  type: 'blog' | 'social' | 'email' | 'ad';
  status: 'draft' | 'scheduled' | 'published';
  platform?: string[];
  tags: string[];
  viralityScore?: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledFor?: Date;
  publishedAt?: Date;
  authorId: string;
  mediaUrls?: string[];
}

export interface Trend {
  id: string;
  topic: string;
  platform: string;
  volume: number;
  growth: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  lifecycle: 'emerging' | 'rising' | 'peaking' | 'declining';
  opportunityScore: number;
  relatedHashtags: string[];
  discoveredAt: Date;
}

export interface AudiencePersona {
  id: string;
  name: string;
  demographics: {
    ageRange: string;
    gender: string;
    location: string[];
    income: string;
  };
  interests: string[];
  painPoints: string[];
  contentPreferences: string[];
  purchaseIntent: number;
  engagementRate: number;
}

export interface ViralityPrediction {
  contentId: string;
  score: number;
  confidence: number;
  predictedEngagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  optimalPostingTime: Date;
  riskAnalysis: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  suggestions: string[];
}

export interface Analytics {
  period: string;
  totalViews: number;
  totalEngagement: number;
  followers: number;
  growth: number;
  topPerformingContent: Content[];
  platformBreakdown: {
    platform: string;
    views: number;
    engagement: number;
  }[];
  audienceDemographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
  };
}

export interface Schedule {
  id: string;
  contentId: string;
  platform: string;
  scheduledAt: Date;
  status: 'pending' | 'published' | 'failed';
  content?: Content;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  createdAt: Date;
}

export interface TeamMember {
  userId: string;
  user: User;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
