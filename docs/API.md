# ContentCraft AI - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.contentcraft.ai/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Auth Endpoints

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "..." },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### POST /auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### POST /auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "..."
}
```

## Content Management

### GET /content
Get all content with pagination.

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `status` (string) - Filter by status: draft, review, approved, scheduled, published
- `type` (string) - Filter by type: blog, social, email, ad, newsletter, product
- `platform` (string) - Filter by platform
- `search` (string) - Search query

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### POST /content
Create new content.

**Request Body:**
```json
{
  "title": "My Blog Post",
  "content": "Content body...",
  "type": "blog",
  "platform": "blog",
  "tone": "professional",
  "tags": ["tech", "ai"]
}
```

### POST /content/generate
Generate content with AI.

**Request Body:**
```json
{
  "prompt": "Write a blog post about AI trends",
  "type": "blog",
  "tone": "professional",
  "length": "medium",
  "platform": "blog",
  "includeHashtags": true
}
```

## AI Services

### POST /ai/generate
Generate text content with Gemini AI.

**Request Body:**
```json
{
  "prompt": "Write a tweet about AI",
  "type": "social",
  "tone": "casual",
  "platform": "twitter"
}
```

### POST /ai/generate-image
Generate images with DALL-E 3.

**Request Body:**
```json
{
  "prompt": "A futuristic AI robot in a modern office",
  "size": "1024x1024",
  "quality": "standard",
  "style": "vivid"
}
```

### POST /ai/predict-virality
Predict content virality score.

**Request Body:**
```json
{
  "content": "Your content text here...",
  "platform": "twitter"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "breakdown": {
      "contentQuality": { "score": 90, "factors": [...] },
      "timing": { "score": 80, "optimalTime": "09:00" },
      "engagementPotential": { "score": 85 }
    },
    "predictions": {
      "likes": { "min": 100, "max": 500 },
      "engagementRate": { "predicted": 8.5 }
    },
    "suggestions": [...],
    "risks": [...]
  }
}
```

### POST /ai/hashtags
Generate hashtags for content.

**Request Body:**
```json
{
  "content": "Your content here...",
  "count": 10,
  "platform": "instagram"
}
```

### POST /ai/seo
Generate SEO suggestions.

**Request Body:**
```json
{
  "content": "Your content...",
  "title": "Post Title",
  "keywords": ["ai", "technology"]
}
```

## Trends

### GET /trends/live
Get live trending topics.

**Query Parameters:**
- `limit` (number) - Number of trends (default: 20)
- `platforms` (string) - Comma-separated platforms
- `minVelocity` (number) - Minimum trend velocity

**Response:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "keyword": "#AI",
        "velocity": 1250,
        "lifecycle": "rising",
        "totalMentions": 50000,
        "sentiment": { "overall": "positive", "score": 0.7 }
      }
    ],
    "lastUpdated": "2024-01-31T12:00:00Z"
  }
}
```

### POST /trends/generate-content
Generate content from a trend.

**Request Body:**
```json
{
  "trendId": "...",
  "platform": "twitter",
  "options": { "tone": "trendy" }
}
```

### GET /trends/calendar/upcoming
Get upcoming predictable trends (holidays, events).

**Response:**
```json
{
  "success": true,
  "data": {
    "upcoming": [
      {
        "name": "Valentine's Day",
        "date": "2025-02-14",
        "daysUntil": 14,
        "contentIdeas": [...]
      }
    ]
  }
}
```

## Audience

### GET /audience/personas
Generate or get audience personas.

**Response:**
```json
{
  "success": true,
  "data": {
    "personas": [
      {
        "name": "Tech-Savvy Professional",
        "demographics": {
          "ageRange": { "min": 25, "max": 40 },
          "locations": [{ "country": "US", "percentage": 60 }]
        },
        "psychographics": {
          "interests": [{ "name": "Technology", "affinity": 90 }],
          "values": ["Innovation", "Efficiency"]
        }
      }
    ]
  }
}
```

### GET /audience/content-gaps
Find content gap opportunities.

**Response:**
```json
{
  "success": true,
  "data": {
    "gaps": [
      {
        "topic": "AI in Healthcare",
        "demand": 85,
        "supply": 30,
        "opportunity": 95,
        "contentIdeas": [...]
      }
    ]
  }
}
```

### GET /audience/pain-points
Identify audience pain points.

### GET /audience/demographics
Get demographic breakdown.

## Content Recycling

### GET /recycle/top-performers
Get top-performing past content.

### POST /recycle/remix
Remix old content with AI.

**Request Body:**
```json
{
  "contentId": "...",
  "options": {
    "tone": "fresh",
    "updateStats": true
  }
}
```

### GET /recycle/seasonal
Get seasonal content to resurface.

### GET /recycle/suggestions
Get AI-powered recycling suggestions.

## Scheduling

### GET /schedule
Get scheduled posts.

### POST /schedule
Create new schedule.

**Request Body:**
```json
{
  "contentId": "...",
  "scheduledAt": "2024-02-01T09:00:00Z",
  "platforms": ["twitter", "linkedin"],
  "timezone": "America/New_York"
}
```

### GET /schedule/calendar/view
Get calendar view data.

**Query Parameters:**
- `startDate` (ISO date)
- `endDate` (ISO date)

## Analytics

### GET /analytics/dashboard
Get dashboard overview.

**Query Parameters:**
- `days` (number) - Days to include (default: 30)

### GET /analytics/overview
Get overview statistics.

### GET /analytics/trends
Get engagement trends for charts.

### GET /analytics/platforms
Get platform performance breakdown.

### GET /analytics/content/:id
Get content-specific analytics.

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limits

- General API: 100 requests per 15 minutes
- AI Generation: 10 requests per minute
- Authentication: 5 attempts per 15 minutes

## WebSocket Events

Real-time updates via Socket.io:

- `content:updated` - Content updated
- `schedule:published` - Post published
- `trend:detected` - New trend detected
- `notification:new` - New notification
