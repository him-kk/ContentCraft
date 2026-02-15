# ContentCraft AI

A complete AI-powered content creation platform with intelligent automation, trend analysis, and seamless multi-platform distribution.

## Features

### Core AI Features
- **AI Virality Predictor** - Predict content virality with 85%+ accuracy
- **Real-Time Trend Hijacking Engine** - Auto-detect and capitalize on trends
- **AI Audience Persona Generator** - Dynamic persona creation from analytics
- **Smart Content Recycling Engine** - Auto-transform evergreen content

### Content Creation
- AI-powered content generation (Google Gemini)
- Image generation with DALL-E 3
- Multi-tone content transformation
- Content translation and summarization
- SEO optimization suggestions

### Distribution & Scheduling
- Multi-platform scheduling
- Smart queue management
- Optimal timing recommendations
- Bulk scheduling capabilities

### Analytics & Insights
- Comprehensive analytics dashboard
- Performance tracking across platforms
- Audience insights and demographics
- Engagement metrics and trends

### Team Collaboration
- Real-time collaboration with Socket.io
- Team workspaces
- Role-based permissions
- Activity feeds and notifications

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB 6+ with Mongoose ODM
- **Cache**: Redis 7+
- **Queue**: Bull (Redis-based)
- **AI**: Google Gemini API, OpenAI DALL-E 3
- **Auth**: JWT with refresh tokens, OAuth 2.0
- **Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Process Management**: PM2

## Project Structure

```
contentcraft-ai/
├── backend/                 # Express.js API server
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server entry
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── types/          # TypeScript types
│   ├── index.html
│   └── package.json
├── extension/              # Browser extension
├── docs/                   # Documentation
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Backend Docker image
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6+
- Redis 7+
- Docker (optional)

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## API Keys Required

### Required for Core Features
- **Google Gemini API** - Content generation (https://makersuite.google.com/app/apikey)
- **OpenAI API** - Image generation (https://platform.openai.com/api-keys)

### Optional for Trend Detection
- **Twitter API** - Trend monitoring (https://developer.twitter.com)
- **Reddit API** - Trend analysis (https://www.reddit.com/prefs/apps)

### Optional for Social Publishing
- **LinkedIn OAuth** - LinkedIn publishing
- **Facebook/Instagram OAuth** - Meta platform publishing

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:5000/api-docs
- OpenAPI JSON: http://localhost:5000/api-docs.json

## Key Features Implementation

### Virality Predictor
Analyzes content using AI to predict virality score (0-100) with:
- Engagement forecasting
- Optimal posting time
- Risk analysis
- Improvement suggestions

### Trend Hijacking Engine
Monitors trends across platforms every 5 minutes:
- Twitter trending topics
- Reddit hot posts
- Google Trends data
- Lifecycle tracking and opportunity scoring

### Audience Persona Generator
Creates dynamic personas from analytics:
- Demographics analysis
- Interest mapping
- Behavioral patterns
- Content preferences

### Content Recycling Engine
Automatically transforms content:
- Format adaptation (blog → social)
- Tone transformation
- Seasonal content detection
- Performance-based suggestions

## Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build

# Start production server
npm start
```

### Docker Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

Ensure these are set in production:
- `NODE_ENV=production`
- Strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Proper `FRONTEND_URL` pointing to your domain
- Secure database connections
- API rate limiting enabled

## Browser Extension

The browser extension allows quick content capture and ideation:

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.

---
