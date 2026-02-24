const Redis = require('ioredis');
const logger = require('../utils/logger');

let elasticacheRedis = null;

const parseBooleanEnv = (value) => {
  if (value === undefined || value === null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return undefined;
};

const buildElastiCacheRedisUrl = () => {
  if (process.env.ELASTICACHE_REDIS_URL) return process.env.ELASTICACHE_REDIS_URL;

  const host = process.env.ELASTICACHE_REDIS_HOST;
  const port = process.env.ELASTICACHE_REDIS_PORT || '6379';

  if (!host) return null;

  // If in-transit encryption is enabled, use rediss://
  const tlsEnabled = parseBooleanEnv(process.env.ELASTICACHE_REDIS_TLS);
  const tls = tlsEnabled !== undefined ? tlsEnabled : false;

  // Redis AUTH token (ElastiCache for Redis 6+). Username is typically not used.
  // If you use ACLs, you can supply username too.
  const username = process.env.ELASTICACHE_REDIS_USERNAME;
  const password = process.env.ELASTICACHE_REDIS_PASSWORD;

  const scheme = tls ? 'rediss' : 'redis';

  if (password) {
    const userPart = username ? encodeURIComponent(username) : '';
    const passPart = encodeURIComponent(password);
    const authPart = userPart ? `${userPart}:${passPart}` : `:${passPart}`;
    return `${scheme}://${authPart}@${host}:${port}`;
  }

  return `${scheme}://${host}:${port}`;
};

const isElastiCacheEnabled = () => {
  const explicit = parseBooleanEnv(process.env.ELASTICACHE_REDIS_ENABLED);
  if (explicit !== undefined) return explicit;

  const fallback = parseBooleanEnv(process.env.REDIS_ENABLED);
  if (fallback !== undefined) return fallback;

  // Default: enabled in production, disabled otherwise
  return process.env.NODE_ENV === 'production';
};

const connectElastiCacheRedis = () => {
  try {
    if (!isElastiCacheEnabled()) {
      logger.info('ElastiCache Redis disabled (set ELASTICACHE_REDIS_ENABLED=true to enable)');
      elasticacheRedis = null;
      return null;
    }

    const url = buildElastiCacheRedisUrl();
    if (!url) {
      logger.warn('ElastiCache Redis not configured (set ELASTICACHE_REDIS_URL or ELASTICACHE_REDIS_HOST)');
      elasticacheRedis = null;
      return null;
    }

    const tlsEnabled = parseBooleanEnv(process.env.ELASTICACHE_REDIS_TLS);
    const tls = tlsEnabled !== undefined ? tlsEnabled : url.startsWith('rediss://');

    elasticacheRedis = new Redis(url, {
      retryStrategy: (times) => Math.min(times * 100, 2000),
      maxRetriesPerRequest: 3,
      connectTimeout: Number(process.env.ELASTICACHE_REDIS_CONNECT_TIMEOUT_MS || 10000),
      enableReadyCheck: true,
      ...(tls
        ? {
            tls: {
              // For AWS ElastiCache with TLS, Node will validate certs by default.
              // Use ELASTICACHE_REDIS_TLS_INSECURE=true only for debugging.
              rejectUnauthorized: !(parseBooleanEnv(process.env.ELASTICACHE_REDIS_TLS_INSECURE) || false),
            },
          }
        : {}),
    });

    elasticacheRedis.on('connect', () => {
      logger.info('ElastiCache Redis connected successfully');
    });

    elasticacheRedis.on('error', (err) => {
      logger.error('ElastiCache Redis error:', err);
    });

    return elasticacheRedis;
  } catch (error) {
    logger.error('ElastiCache Redis connection error:', error);
    elasticacheRedis = null;
    return null;
  }
};

const getElastiCacheRedis = () => {
  if (!elasticacheRedis) {
    return connectElastiCacheRedis();
  }
  return elasticacheRedis;
};

module.exports = { connectElastiCacheRedis, getElastiCacheRedis, buildElastiCacheRedisUrl };
