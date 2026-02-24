const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis = null;

const parseBooleanEnv = (value) => {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return undefined;
};

const isRedisEnabled = () => {
  const explicit = parseBooleanEnv(process.env.REDIS_ENABLED);
  if (explicit !== undefined) return explicit;
  return process.env.NODE_ENV === 'production';
};

const getRedisProvider = () => {
  const provider = String(process.env.REDIS_PROVIDER || '').trim().toLowerCase();
  if (provider) return provider;
  if (process.env.UPSTASH_REDIS_URL || process.env.UPSTASH_REDIS_HOST) return 'upstash';
  return 'local';
};

const connectRedis = () => {
  try {
    if (!isRedisEnabled()) {
      logger.info('Redis disabled (set REDIS_ENABLED=true to enable)');
      redis = null;
      return null;
    }

    const provider = getRedisProvider();
    if (provider === 'upstash') {
      const { connectUpstashRedis } = require('./upstashRedis');
      return connectUpstashRedis();
    }

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
  const provider = getRedisProvider();
  if (provider === 'upstash') {
    const { getUpstashRedis } = require('./upstashRedis');
    return getUpstashRedis();
  }

  if (!redis) {
    return connectRedis();
  }
  return redis;
};

module.exports = { connectRedis, getRedis };