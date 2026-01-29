import Redis from 'ioredis';

let redisClient = null;

/**
 * Initialize Redis connection
 */
export function initRedis() {
    if (redisClient) {
        return redisClient;
    }

    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        console.error('REDIS_URL environment variable is not set');
        throw new Error('REDIS_URL is required');
    }

    try {
        redisClient = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            // Enable TLS for Upstash
            tls: redisUrl.includes('upstash.io') ? {} : undefined,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        redisClient.on('connect', () => {
            console.log('✓ Redis connected successfully');
        });

        return redisClient;
    } catch (error) {
        console.error('Failed to initialize Redis:', error);
        throw error;
    }
}

/**
 * Get Redis client instance
 */
export function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis not initialized. Call initRedis() first.');
    }
    return redisClient;
}

/**
 * Check Redis health
 */
export async function checkRedisHealth() {
    try {
        const client = getRedisClient();
        await client.ping();
        return true;
    } catch (error) {
        console.error('Redis health check failed:', error);
        return false;
    }
}

/**
 * Close Redis connection
 */
export async function closeRedis() {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
    }
}
