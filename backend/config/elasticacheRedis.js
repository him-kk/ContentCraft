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

    const host = process.env.ELASTICACHE_REDIS_HOST ||
      (() => {
        const url = process.env.ELASTICACHE_REDIS_URL || '';
        // Extract host from URL like rediss://clustercfg.xxx.cache.amazonaws.com:6379
        const match = url.match(/rediss?:\/\/(?:[^@]+@)?([^:]+):?(\d+)?/);
        return match ? match[1] : null;
      })();

    const port = Number(process.env.ELASTICACHE_REDIS_PORT || 6379);

    if (!host) {
      logger.warn('ElastiCache Redis not configured (set ELASTICACHE_REDIS_URL or ELASTICACHE_REDIS_HOST)');
      elasticacheRedis = null;
      return null;
    }

    const connectTimeout = Number(process.env.ELASTICACHE_REDIS_CONNECT_TIMEOUT_MS || 10000);
    const password = process.env.ELASTICACHE_REDIS_PASSWORD || undefined;

    logger.info(`Connecting to ElastiCache Redis Cluster → ${host}:${port}`);

    // Use Redis.Cluster for cluster mode (Cluster Mode Enabled on ElastiCache)
    elasticacheRedis = new Redis.Cluster(
      [{ host, port }],
      {
        // Required for ElastiCache cluster DNS resolution
        dnsLookup: (address, callback) => callback(null, address),

        redisOptions: {
          // TLS is required — ElastiCache has "Encryption in transit: Required"
          tls: {
            rejectUnauthorized: false, // AWS internal certs — safe inside VPC
          },
          connectTimeout,
          maxRetriesPerRequest: 3,
          ...(password ? { password } : {}),
        },

        // Cluster-specific options
        retryDelayOnFailover: 300,
        retryDelayOnClusterDown: 300,
        retryDelayOnTryAgain: 300,
        enableOfflineQueue: false,
        enableReadyCheck: true,

        // Retry strategy for cluster
        clusterRetryStrategy: (times) => {
          if (times > 10) {
            logger.error('ElastiCache Redis Cluster: max retries reached');
            return null; // Stop retrying
          }
          return Math.min(times * 100, 2000);
        },
      }
    );

    elasticacheRedis.on('connect', () => {
      logger.info('ElastiCache Redis Cluster connected successfully');
    });

    elasticacheRedis.on('ready', () => {
      logger.info('ElastiCache Redis Cluster ready');
    });

    elasticacheRedis.on('error', (err) => {
      logger.error('ElastiCache Redis Cluster error:', err);
    });

    elasticacheRedis.on('close', () => {
      logger.warn('ElastiCache Redis Cluster connection closed');
    });

    elasticacheRedis.on('reconnecting', () => {
      logger.info('ElastiCache Redis Cluster reconnecting...');
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