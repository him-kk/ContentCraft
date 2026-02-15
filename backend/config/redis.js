const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis = null;

const connectRedis = () => {
  try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redis.on('error', (err) => {
      logger.error('Redis error:', err);
    });

    return redis;
  } catch (error) {
    logger.error('Redis connection error:', error);
    return null;
  }
};

const getRedis = () => {
  if (!redis) {
    return connectRedis();
  }
  return redis;
};

module.exports = { connectRedis, getRedis };