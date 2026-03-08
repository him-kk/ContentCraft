// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const compression = require('compression');
// const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsdoc = require('swagger-jsdoc');
// require('dotenv').config();

// const logger = require('./utils/logger');

// // Local/dev defaults & required env validation
// const ensureRuntimeEnv = () => {
//   if (!process.env.NODE_ENV) {
//     process.env.NODE_ENV = 'development';
//   }

//   const requiredInProduction = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
//   const missingInProd = requiredInProduction.filter((key) => !process.env[key]);
//   if (process.env.NODE_ENV === 'production' && missingInProd.length > 0) {
//     logger.error(`Missing required environment variables: ${missingInProd.join(', ')}`);
//     process.exit(1);
//   }

//   // In non-production, keep the app usable even without a .env
//   if (!process.env.JWT_SECRET) {
//     process.env.JWT_SECRET = 'dev_jwt_secret_change_me';
//     logger.warn('JWT_SECRET not set; using development default');
//   }
//   if (!process.env.JWT_REFRESH_SECRET) {
//     process.env.JWT_REFRESH_SECRET = 'dev_jwt_refresh_secret_change_me';
//     logger.warn('JWT_REFRESH_SECRET not set; using development default');
//   }
//   if (!process.env.FRONTEND_URL) {
//     process.env.FRONTEND_URL = 'http://localhost:5173';
//     logger.warn('FRONTEND_URL not set; defaulting to http://localhost:5173');
//   }
// };

// ensureRuntimeEnv();

// const connectDB = require('./config/db');
// const { connectRedis } = require('./config/redis');
// const errorHandler = require('./middleware/error');
// const { apiLimiter } = require('./middleware/rateLimit');

// // Import routes
// const authRoutes = require('./routes/auth.routes');
// const contentRoutes = require('./routes/content.routes');
// const aiRoutes = require('./routes/ai.routes');
// const trendsRoutes = require('./routes/trends.routes');
// const audienceRoutes = require('./routes/audience.routes');
// const recycleRoutes = require('./routes/recycle.routes');
// const scheduleRoutes = require('./routes/schedule.routes');
// const analyticsRoutes = require('./routes/analytics.routes');
// const viralityRoutes = require('./routes/virality.routes');

// // Import services
// const TrendService = require('./services/trendService');

// // Connect to databases
// connectDB();

// // Connect to Redis — non-fatal if it fails, app continues without cache
// try {
//   connectRedis();
// } catch (err) {
//   logger.error('Redis init failed, continuing without Redis:', err.message);
// }

// const app = express();

// // Security middleware
// app.use(helmet());

// // CORS Configuration
// app.use(cors({
//   origin: [
//     process.env.FRONTEND_URL || 'http://localhost:3000',
//     'http://localhost:5173',
//     'https://content-craft-hrs.vercel.app', // Production Vercel frontend
//   ],
//   credentials: true,
// }));

// // Body parsing
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());

// // Compression
// app.use(compression());

// // Logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// } else {
//   app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
// }

// // Rate limiting
// app.use('/api/', apiLimiter);

// // Swagger documentation
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'ContentCraft AI API',
//       version: '1.0.0',
//       description: 'AI-powered content creation platform API',
//     },
//     servers: [
//       {
//         url: `http://localhost:${process.env.PORT || 5000}/api`,
//       },
//     ],
//   },
//   apis: ['./routes/*.js'],
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Health check
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//   });
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/content', contentRoutes);
// app.use('/api/ai', aiRoutes);
// app.use('/api/trends', trendsRoutes);
// app.use('/api/audience', audienceRoutes);
// app.use('/api/recycle', recycleRoutes);
// app.use('/api/schedule', scheduleRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/virality', viralityRoutes);

// // 404 handler
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     error: 'Route not found',
//     requestedUrl: req.originalUrl,
//   });
// });

// // Error handler
// app.use(errorHandler);

// const PORT = process.env.PORT || 8080;

// const server = app.listen(PORT, () => {
//   logger.info(`Server running on (aws) port ${PORT}`);
//   logger.info(`API available at http://localhost:${PORT}/api`);
//   logger.info(`API Docs at http://localhost:${PORT}/api/docs`);

//   // Start trend monitoring
//   if (process.env.NODE_ENV === 'production') {
//     TrendService.startMonitoring(5); // 5 minute interval
//   }
// });

// // Helper to check if an error is Redis-related
// const isRedisError = (err) => {
//   if (!err || !err.message) return false;
//   const msg = err.message.toLowerCase();
//   return (
//     msg.includes('redis') ||
//     msg.includes('econnrefused') ||
//     msg.includes('clustералlfailed') ||
//     msg.includes('clusterallfailed') ||
//     msg.includes('connection refused') ||
//     msg.includes('maxretriesperrequest')
//   );
// };

// // Handle unhandled promise rejections — non-fatal for Redis errors
// process.on('unhandledRejection', (err) => {
//   logger.error('Unhandled Rejection:', err);
//   if (isRedisError(err)) {
//     logger.warn('Redis unhandled rejection — continuing without Redis cache');
//     return; // Don't crash the app
//   }
//   server.close(() => process.exit(1));
// });

// // Handle uncaught exceptions — non-fatal for Redis errors
// process.on('uncaughtException', (err) => {
//   logger.error('Uncaught Exception:', err);
//   if (isRedisError(err)) {
//     logger.warn('Redis uncaught exception — continuing without Redis cache');
//     return; // Don't crash the app
//   }
//   server.close(() => process.exit(1));
// });

// module.exports = app;




//sequence chnaged 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const logger = require('./utils/logger');

// Local/dev defaults & required env validation
const ensureRuntimeEnv = () => {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  const requiredInProduction = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missingInProd = requiredInProduction.filter((key) => !process.env[key]);
  if (process.env.NODE_ENV === 'production' && missingInProd.length > 0) {
    logger.error(`Missing required environment variables: ${missingInProd.join(', ')}`);
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'dev_jwt_secret_change_me';
    logger.warn('JWT_SECRET not set; using development default');
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = 'dev_jwt_refresh_secret_change_me';
    logger.warn('JWT_REFRESH_SECRET not set; using development default');
  }
  if (!process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL = 'http://localhost:5173';
    logger.warn('FRONTEND_URL not set; defaulting to http://localhost:5173');
  }
};

ensureRuntimeEnv();

const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const errorHandler = require('./middleware/error');
const { apiLimiter } = require('./middleware/rateLimit');

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

const app = express();

// Security middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'https://content-craft-hrs.vercel.app',
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
    requestedUrl: req.originalUrl,
  });
});

// Error handler
app.use(errorHandler);

// Helper to check if an error is Redis-related
const isRedisError = (err) => {
  if (!err || !err.message) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('redis') ||
    msg.includes('econnrefused') ||
    msg.includes('clusterallfailed') ||
    msg.includes('connection refused') ||
    msg.includes('maxretriesperrequest')
  );
};

const PORT = process.env.PORT || 8080;

// ── Sequential startup: DocumentDB → Redis → HTTP server ──────────────────────
const startServer = async () => {

  // Step 1 — DocumentDB (required, exit if it fails)
  logger.info('Step 1/3: Connecting to DocumentDB...');
  try {
    await connectDB();
    logger.info('Step 1/3: DocumentDB connected ✅');
  } catch (err) {
    logger.error('Step 1/3: DocumentDB connection failed ❌:', err.message);
    process.exit(1);
  }

  // Step 2 — Redis (optional, app continues without it)
  logger.info('Step 2/3: Connecting to Redis...');
  try {
    connectRedis();
    // Give Redis 3 seconds to attempt connection before moving on
    await new Promise((resolve) => setTimeout(resolve, 3000));
    logger.info('Step 2/3: Redis init done ✅ (connecting in background)');
  } catch (err) {
    logger.warn('Step 2/3: Redis init failed, continuing without cache ⚠️:', err.message);
  }

  // Step 3 — Start HTTP server
  logger.info('Step 3/3: Starting HTTP server...');
  const server = app.listen(PORT, () => {
    logger.info(`Step 3/3: Server running on port ${PORT} ✅`);
    logger.info(`API available at http://localhost:${PORT}/api`);
    logger.info(`API Docs at http://localhost:${PORT}/api/docs`);

    if (process.env.NODE_ENV === 'production') {
      TrendService.startMonitoring(5);
    }
  });

  // Non-fatal for Redis errors
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    if (isRedisError(err)) {
      logger.warn('Redis unhandled rejection — continuing without Redis cache');
      return;
    }
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    if (isRedisError(err)) {
      logger.warn('Redis uncaught exception — continuing without Redis cache');
      return;
    }
    server.close(() => process.exit(1));
  });
};

startServer();

module.exports = app;