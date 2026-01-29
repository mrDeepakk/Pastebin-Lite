import express from 'express';
import { checkRedisHealth } from '../config/redis.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/healthz
 */
router.get('/healthz', async (req, res, next) => {
    try {
        // Check Redis connectivity
        const redisOk = await checkRedisHealth();

        if (!redisOk) {
            return res.status(503).json({
                ok: false,
                error: 'Redis connection failed'
            });
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        next(error);
    }
});

export default router;
