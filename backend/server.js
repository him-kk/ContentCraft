const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const errorHandler = require('./middleware/error');
const { apiLimiter } = require('./middleware/rateLimit');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const contentRoutes = require('./routes/content.routes');
const aiRoutes = require('./routes/ai.routes');
const trendsRoutes = require('./routes/trends.routes');
const audienceRoutes = require('./routes/audience.routes');
const recycleRoutes = require('./routes/recycle.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const viralityRoutes = require('./routes/virality.routes');

// Import services
const TrendService = require('./services/trendService');

// Connect to databases
connectDB();
connectRedis();

const app = express();

// Security middleware
app.use(helmet());

// CORS Configuration - FIXED to allow Vite port
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',  // Vite default port
  ],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ContentCraft AI API',
      version: '1.0.0',
      description: 'AI-powered content creation platform API',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/audience', audienceRoutes);
app.use('/api/recycle', recycleRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/virality', viralityRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requestedUrl: req.originalUrl,  // Added for debugging
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}/api`);
  logger.info(`API Docs at http://localhost:${PORT}/api/docs`);
  
  // Start trend monitoring
  if (process.env.NODE_ENV === 'production') {
    TrendService.startMonitoring(5); // 5 minute interval
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

module.exports = app;