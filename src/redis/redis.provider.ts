import Redis from 'ioredis';

export const REDIS = Symbol('REDIS');

/**
 * Provides an ioredis client, or null when REDIS_ADDR is unset so the service
 * keeps running standalone with deterministic mock data.
 */
export const redisProvider = {
  provide: REDIS,
  useFactory: (): Redis | null => {
    const addr = process.env.REDIS_ADDR;
    if (!addr) {
      return null;
    }
    return new Redis(addr, { maxRetriesPerRequest: 1 });
  },
};
