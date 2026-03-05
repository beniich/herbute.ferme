import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

const REDIS_DISABLED = process.env.DISABLE_REDIS === 'true';

// Obtenir l'URL redis (généralement redis://127.0.0.1:6379 en local)
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Create a dummy client when Redis is disabled to avoid crashes
export const redisClient = REDIS_DISABLED
    ? ({
        isOpen: false,
        connect: async () => {},
        disconnect: async () => {},
        get: async () => null,
        set: async () => null,
        setEx: async () => null,
        del: async () => 0,
        incr: async () => 0,
        expire: async () => false,
        keys: async () => [],
        sendCommand: async () => null,
        on: () => {},
        quit: async () => {},
      } as any)
    : createClient({ url: redisUrl });

if (!REDIS_DISABLED) {
    redisClient.on('error', (err: Error) => logger.error('Redis Client Error', err));
    redisClient.on('connect', () => logger.info('Redis Client Connected'));
}

// Export an initialization function to call on startup
export const connectRedis = async () => {
    if (REDIS_DISABLED) {
        logger.warn('[Redis] Désactivé via DISABLE_REDIS=true — fonctionnement sans cache Redis');
        return;
    }
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};
