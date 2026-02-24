const Redis = require('ioredis');
const logger = require('../utils/logger');

let upstashRedis = null;

const parseBooleanEnv = (value) => {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return undefined;
};

const buildUpstashRedisUrl = () => {
  if (process.env.UPSTASH_REDIS_URL) return process.env.UPSTASH_REDIS_URL;

  const host = process.env.UPSTASH_REDIS_HOST;
  const port = process.env.UPSTASH_REDIS_PORT;
  const password = process.env.UPSTASH_REDIS_PASSWORD;
  const username = process.env.UPSTASH_REDIS_USERNAME || 'default';

  if (!host || !port || !password) return null;

  const userPart = encodeURIComponent(username);
  const passPart = encodeURIComponent(password);
  return `rediss://${userPart}:${passPart}@${host}:${port}`;
};

const isUpstashRedisEnabled = () => {
  // Prefer UPSTASH_REDIS_ENABLED; fall back to REDIS_ENABLED
  const explicit = parseBooleanEnv(process.env.UPSTASH_REDIS_ENABLED);
  if (explicit !== undefined) return explicit;

  const fallback = parseBooleanEnv(process.env.REDIS_ENABLED);
  if (fallback !== undefined) return fallback;

  // Default: enabled in production, disabled otherwise
  return process.env.NODE_ENV === 'production';
};

const connectUpstashRedis = () => {
  try {
    if (!isUpstashRedisEnabled()) {
      logger.info('Upstash Redis disabled (set UPSTASH_REDIS_ENABLED=true to enable)');
      upstashRedis = null;
      return null;
    }

    const url = buildUpstashRedisUrl();
    if (!url) {
      logger.warn('Upstash Redis not configured (set UPSTASH_REDIS_URL or UPSTASH_REDIS_HOST/PORT/PASSWORD)');
      upstashRedis = null;
      return null;
    }

    upstashRedis = new Redis(url, {
      // Upstash uses TLS; `rediss://` will enable it automatically.
      // Keep retries bounded to avoid noisy logs.
      retryStrategy: (times) => {
        const delay = Math.min(times * 100, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      enableReadyCheck: true,
    });

    upstashRedis.on('connect', () => {
      logger.info('Upstash Redis connected successfully');
    });

    upstashRedis.on('error', (err) => {
      logger.error('Upstash Redis error:', err);
    });

    return upstashRedis;
  } catch (error) {
    logger.error('Upstash Redis connection error:', error);
    upstashRedis = null;
    return null;
  }
};

const getUpstashRedis = () => {
  if (!upstashRedis) {
    return connectUpstashRedis();
  }
  return upstashRedis;
};

module.exports = { connectUpstashRedis, getUpstashRedis };
