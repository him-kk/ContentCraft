import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    // Handle accessToken -> token mapping from backend
    if (response.data?.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken)
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken)
      }
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })
        
        const { accessToken } = response.data.data
        localStorage.setItem('token', accessToken)
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

// Types
export interface LoginResponse {
  success: boolean
  data: {
    user: {
      id: string
      name: string
      email: string
      avatar?: string
      role?: string
      preferences?: any
      subscription?: any
    }
    accessToken: string
    refreshToken: string
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      role?: string
      preferences?: any
    }
    accessToken: string
    refreshToken: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserResponse {
  success: boolean
  data: {
    id: string
    name: string
    email: string
    avatar?: string
    role?: string
    preferences?: any
    subscription?: any
    socialAccounts?: any
    team?: any
    teamRole?: string
    createdAt?: string
  }
}

export interface Content {
  _id: string
  title: string
  content: string
  type: string
  platform: string
  tone: string
  tags?: string[]
  status: 'draft' | 'published' | 'scheduled'
  performance?: {
    views: number
    likes: number
    comments: number
    shares: number
    engagementRate: number
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface ContentResponse {
  success: boolean
  data: Content
}

export interface ContentListResponse {
  success: boolean
  data: Content[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface GeneratedContent {
  title?: string
  content: string
  hashtags?: string[]
  suggestions?: string[]
}

export interface ContentIdea {
  title: string
  description: string
  keywords: string[]
}

export interface Hashtag {
  tag: string
  relevance: number
}

export interface GeneratedImage {
  url: string;
  publicId?: string;
  revisedPrompt?: string;
  index?: number;
}

export interface GeneratedImageResponse {
  images: GeneratedImage[];
  metadata: {
    model: string;
    size: string;
    quality: string;
    style: string;
    prompt: string;
  };
}

export interface Trend {
  _id: string
  id: string
  keyword: string
  platform: string
  category: string
  volume: number
  growth: number
  sentiment?: string
  relatedHashtags?: string[]
  createdAt: string
}

export interface TrendListResponse {
  success: boolean
  data: {
    trends: Trend[]
  }
}

export interface ViralityPrediction {
  score: number
  factors: {
    emotionalImpact?: number
    readability?: number
    trendingKeywords?: number
    lengthScore?: number
    hashtagScore?: number
    timingScore?: number
    engagement?: number
    timing?: number
    content?: number
    hashtags?: number
  }
  predictedReach?: number
  predictedLikes?: number
  predictedShares?: number
  suggestions: string[]
}

export interface ViralityHistory {
  _id: string
  content: string
  contentPreview: string
  platform: string
  score: number
  createdAt: string
}

export interface ViralityHistoryResponse {
  success: boolean
  data: {
    predictions: ViralityHistory[]
  }
}

export interface Persona {
  _id: string
  name: string
  description: string
  industry: string
  createdAt: string
}

export interface Schedule {
  _id: string;
  content: string;
  platforms: Array<{
    platform: string;
    status: string;
    postId?: string;
    postUrl?: string;
    errorMessage?: string;
    postedAt?: string;
  }>;  // ✅ Correct - array of objects
  scheduledAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
}

export interface ScheduleListResponse {
  success: boolean
  data: Schedule[]
}

export interface AnalyticsOverview {
  content: {
    total: number
    published: number
    scheduled: number
    draft: number
  }
  performance: {
    views: number
    likes: number
    comments: number
    shares: number
    engagement?: number
  }
  trends?: {
    viewsChange: number
    engagementChange: number
    followersChange: number
  }
}

export interface ContentPerformanceItem {
  contentId: string
  title: string
  platform: string
  views: number
  likes: number
  comments: number
  shares: number
  engagement: number
}

// Auth API - Matches backend auth.routes.js
export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post<RegisterResponse>('/auth/register', { name, email, password }),
  
  logout: () => api.post<void>('/auth/logout'),
  
  getProfile: () => api.get<UserResponse>('/auth/profile'),
  
  updateProfile: (data: Partial<{ name: string; avatar: string; preferences: any }>) =>
    api.put<UserResponse>('/auth/profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),
}

// Content API - Matches backend content.routes.js
export const contentApi = {
  getAll: (params?: { status?: string; type?: string; platform?: string; page?: number; limit?: number; search?: string; tag?: string }) =>
    api.get<ContentListResponse>('/content', { params }),
  
  getById: (id: string) => 
    api.get<ContentResponse>(`/content/${id}`),
  
  create: (data: {
    title: string
    content: string
    type: string
    platform: string
    tone: string
    tags?: string[]
  }) => api.post<ContentResponse>('/content', data),
  
  update: (id: string, data: Partial<Content>) => 
    api.put<ContentResponse>(`/content/${id}`, data),
  
  delete: (id: string) => 
    api.delete<void>(`/content/${id}`),
  
  duplicate: (id: string) =>
    api.post<ContentResponse>(`/content/${id}/duplicate`),
  
  repurpose: (id: string, targetPlatform: string, options?: any) =>
    api.post<ContentResponse>(`/content/${id}/repurpose`, { targetPlatform, options }),
  
  generate: (data: {
    prompt: string
    type: string
    platform: string
    tone: string
    title?: string
  }) => api.post<ContentResponse>('/content/generate', data),
}

// AI API - Matches backend ai.routes.js
export const aiApi = {
  // Content generation
  generateContent: (data: {
    prompt: string
    type: string
    platform: string
    tone: string
    length?: string
  }) => api.post<{ success: boolean; data: GeneratedContent }>('/ai/generate', data),
  
  // Hashtags
  generateHashtags: (content: string, platform: string) =>
    api.post<{ success: boolean; data: Hashtag[] | { hashtags: Hashtag[] } }>('/ai/hashtags', { content, platform }),
  
  // Image generation
  generateImage: (data: {
  prompt: string
  style?: string
  size?: string
}) => api.post<{ success: boolean; data: GeneratedImageResponse }>('/ai/generate-image', data),
  
  suggestImagePrompt: (content: string, platform?: string, style?: string) =>
    api.post<{ success: boolean; data: { prompt: string } }>('/ai/suggest-image-prompt', { content, platform, style }),
  
  // Content tools
  repurpose: (content: string, sourcePlatform: string, targetPlatform: string, options?: any) =>
    api.post<{ success: boolean; data: GeneratedContent }>('/ai/repurpose', { content, sourcePlatform, targetPlatform, options }),
  
  summarize: (content: string, length?: string) =>
    api.post<{ success: boolean; data: { summary: string } }>('/ai/summarize', { content, length }),
  
  translate: (content: string, targetLanguage: string, sourceLanguage?: string) =>
    api.post<{ success: boolean; data: { translated: string } }>('/ai/translate', { content, targetLanguage, sourceLanguage }),
  
  transformTone: (content: string, targetTone: string) =>
    api.post<{ success: boolean; data: GeneratedContent }>('/ai/transform-tone', { content, targetTone }),
  
  // SEO
  generateSEO: (content: string, title?: string, keywords?: string[]) =>
    api.post<{ success: boolean; data: any }>('/ai/seo', { content, title, keywords }),
  
  // Grammar and readability
  checkGrammar: (content: string) =>
    api.post<{ success: boolean; data: any }>('/ai/grammar', { content }),
  
  checkReadability: (content: string) =>
    api.post<{ success: boolean; data: any }>('/ai/readability', { content }),
  
  // Virality prediction (from ai routes)
  predictVirality: (content: string, platform: string) =>
    api.post<{ success: boolean; data: ViralityPrediction }>('/ai/predict-virality', { content, platform }),
  
  getImprovementSuggestions: (content: string, platform: string, currentScore?: number) =>
    api.post<{ success: boolean; data: any }>('/ai/improvement-suggestions', { content, platform, currentScore }),
  
  // Utilities
  getLanguages: () =>
    api.get<{ success: boolean; data: Array<{ code: string; name: string }> }>('/ai/languages'),
}

// Trends API - Matches backend trends.routes.js
export const trendsApi = {
  getLive: (params?: { limit?: number; platforms?: string; minVelocity?: number }) =>
    api.get<TrendListResponse>('/trends/live', { params }),
  
  getByPlatform: (platform: string, limit?: number) =>
    api.get<TrendListResponse>(`/trends/${platform}`, { params: { limit } }),
  
  generateContent: (trendId: string, platform: string, options?: any) =>
    api.post<{ success: boolean; data: GeneratedContent }>('/trends/generate-content', { trendId, platform, options }),
  
  subscribe: (keywords: string[], options?: any) =>
    api.post<{ success: boolean; data: any }>('/trends/subscribe', { keywords, options }),
  
  getLifecycle: (trendId: string) =>
    api.get<{ success: boolean; data: any }>(`/trends/lifecycle/${trendId}`),
  
  getHashtagMomentum: (hashtags: string[]) =>
    api.get<{ success: boolean; data: any }>('/trends/hashtag-momentum', { 
      params: { hashtags: hashtags.join(',') } 
    }),
  
  getNicheTrends: (categories: string[], limit?: number) =>
    api.get<{ success: boolean; data: any }>('/trends/niche/list', { 
      params: { categories: categories.join(','), limit } 
    }),
  
  getCalendar: (days?: number) =>
    api.get<{ success: boolean; data: any }>('/trends/calendar/upcoming', { params: { days } }),
  
  getOpportunities: (niche?: string, limit?: number) =>
    api.get<{ success: boolean; data: any }>('/trends/opportunities/list', { params: { niche, limit } }),
  
  analyzeCompetitor: (competitorHandle: string, platform: string) =>
    api.post<{ success: boolean; data: any }>('/trends/analyze-competitor', { competitorHandle, platform }),
}

// Virality API - Matches backend virality.routes.js
export const viralityApi = {
  getHistory: (days?: number) => 
    api.get<ViralityHistoryResponse>('/virality/history', { params: { days } }),
  
  compare: (variants: any[], platform: string) =>
    api.post<{ success: boolean; data: any }>('/virality/compare', { variants, platform }),
  
  getScores: (page?: number, limit?: number) =>
    api.get<{ success: boolean; data: any[] }>('/virality/scores', { params: { page, limit } }),
}

// Audience API - Matches backend audience.routes.js
export const audienceApi = {
  getPersonas: () => 
    api.get<{ success: boolean; data: Persona[] }>('/audience/personas'),
  
  generatePersonas: (platformData?: any) =>
    api.post<{ success: boolean; data: any }>('/audience/analyze', { platformData }),
  
  getBehaviorPatterns: (personaId?: string) =>
    api.get<{ success: boolean; data: any }>('/audience/behavior-patterns', { params: { personaId } }),
  
  getPainPoints: () =>
    api.get<{ success: boolean; data: any }>('/audience/pain-points'),
  
  getContentGaps: () =>
    api.get<{ success: boolean; data: any }>('/audience/content-gaps'),
  
  getDemographics: () =>
    api.get<{ success: boolean; data: any }>('/audience/demographics'),
  
  getPersonalityProfile: () =>
    api.get<{ success: boolean; data: any }>('/audience/personality-profile'),
  
  createSegments: (criteria: any) =>
    api.post<{ success: boolean; data: any }>('/audience/segment', { criteria }),
  
  getPurchaseIntent: () =>
    api.get<{ success: boolean; data: any }>('/audience/purchase-intent'),
  
  trackEvolution: (months?: number) =>
    api.get<{ success: boolean; data: any }>('/audience/evolution', { params: { months } }),
}

// Scheduler API - Matches backend schedule.routes.js
export const schedulerApi = {
  getAll: (params?: { status?: string; upcoming?: boolean }) =>
    api.get<ScheduleListResponse>('/schedule', { params }),
  
  getById: (id: string) =>
    api.get<{ success: boolean; data: Schedule }>(`/schedule/${id}`),
  
  create: (data: {
    content: string
    platforms: Array<{
      platform: string;
      status: string;
    }>
    scheduledAt: string
  }) => api.post<{ success: boolean; data: Schedule }>('/schedule', data),
  
  update: (id: string, data: { scheduledAt: string }) =>
    api.put<{ success: boolean; data: Schedule }>(`/schedule/${id}`, data),
  
  cancel: (id: string) => 
    api.delete<void>(`/schedule/${id}`),
  
  getCalendarView: (startDate?: string, endDate?: string) =>
    api.get<{ success: boolean; data: any }>('/schedule/calendar/view', { 
      params: { startDate, endDate } 
    }),
  
  bulkSchedule: (schedules: any[]) =>
    api.post<{ success: boolean; data: Schedule[] }>('/schedule/bulk', { schedules }),
  
  getOptimalTimes: (platform?: string) =>
    api.get<{ success: boolean; data: any }>('/schedule/optimal-times', { params: { platform } }),
}


// Recycle API - Matches backend recycle.routes.js
export const recycleApi = {
  getTopPerformers: (params?: { limit?: number; days?: number; minEngagement?: number }) =>
    api.get<{ success: boolean; data: any }>('/recycle/top-performers', { params }),
  
  remix: (contentId: string, options?: any) =>
    api.post<{ success: boolean; data: any }>('/recycle/remix', { contentId, options }),
  
  getSeasonal: () =>
    api.get<{ success: boolean; data: any }>('/recycle/seasonal'),
  
  updateStats: (contentId: string) =>
    api.post<{ success: boolean; data: any }>('/recycle/update-stats', { contentId }),
  
  getUnfinishedDrafts: () =>
    api.get<{ success: boolean; data: any }>('/recycle/unfinished-drafts'),
  
  getEvergreen: () =>
    api.get<{ success: boolean; data: any }>('/recycle/evergreen'),
  
  scheduleAuto: (options: any) =>
    api.post<{ success: boolean; data: any }>('/recycle/schedule-auto', options),
  
  getSuggestions: () =>
    api.get<{ success: boolean; data: any }>('/recycle/suggestions'),
  
  getCalendar: (months?: number) =>
    api.get<{ success: boolean; data: any }>('/recycle/calendar', { params: { months } }),
  
  getPerformance: () =>
    api.get<{ success: boolean; data: any }>('/recycle/performance'),
}

// Analytics API - Matches backend analytics.routes.js
export const analyticsApi = {
  getDashboard: (days?: number) =>
    api.get<{ success: boolean; data: any }>('/analytics/dashboard', { params: { days } }),
  
  getOverview: () => 
    api.get<{ success: boolean; data: AnalyticsOverview }>('/analytics/overview'),
  
  getTrends: (params?: { days?: number }) =>
    api.get<{ success: boolean; data: any[] }>('/analytics/trends', { params }),
  
  getPlatforms: () =>
    api.get<{ success: boolean; data: any[] }>('/analytics/platforms'),
  
  getContentAnalytics: (id: string) =>
    api.get<{ success: boolean; data: any }>(`/analytics/content/${id}`),
  
  getCompetitor: (competitor: string) =>
    api.get<{ success: boolean; data: any }>('/analytics/competitor', { 
      params: { competitor } 
    }),
  
  exportReport: (format?: string, dateRange?: any) =>
    api.post<{ success: boolean; data: any }>('/analytics/export', { format, dateRange }),
  
  getABTests: () =>
    api.get<{ success: boolean; data: any[] }>('/analytics/ab-tests'),
  
  createABTest: (data: { name: string; variants: any[]; contentId: string }) =>
    api.post<{ success: boolean; data: any }>('/analytics/ab-tests', data),
}

export default api