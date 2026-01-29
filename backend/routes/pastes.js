import express from 'express';
import crypto from 'crypto';
import { getRedisClient } from '../config/redis.js';
import { validateCreatePaste } from '../middleware/validation.js';
import { getCurrentTime } from '../utils/time.js';

const router = express.Router();

/**
 * Generate a unique paste ID
 */
function generatePasteId() {
    return crypto.randomBytes(5).toString('hex'); // 10 character alphanumeric
}

/**
 * Create a new paste
 * POST /api/pastes
 */
router.post('/pastes', validateCreatePaste, async (req, res, next) => {
    try {
        const { content, ttl_seconds, max_views } = req.body;
        const redis = getRedisClient();

        // Generate unique ID
        const id = generatePasteId();
        const now = getCurrentTime(req);

        // Calculate expiration time
        const expiresAt = ttl_seconds ? now + (ttl_seconds * 1000) : null;

        // Prepare paste data
        const pasteData = {
            content,
            created_at: now,
            expires_at: expiresAt,
            max_views: max_views || null,
            current_views: 0
        };

        // Store in Redis
        const key = `paste:${id}`;
        await redis.set(key, JSON.stringify(pasteData));

        // Set Redis TTL if provided (as backup to application-level check)
        if (ttl_seconds) {
            await redis.expire(key, ttl_seconds);
        }

        // Generate shareable URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
        const url = `${baseUrl}/p/${id}`;

        res.status(201).json({ id, url });
    } catch (error) {
        next(error);
    }
});

/**
 * Fetch a paste by ID
 * GET /api/pastes/:id
 */
router.get('/pastes/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const redis = getRedisClient();
        const now = getCurrentTime(req);

        // Fetch paste from Redis
        const key = `paste:${id}`;
        const pasteJson = await redis.get(key);

        if (!pasteJson) {
            return res.status(404).json({ error: 'Paste not found' });
        }

        const paste = JSON.parse(pasteJson);

        // Check if paste has expired
        if (paste.expires_at && now > paste.expires_at) {
            // Delete expired paste
            await redis.del(key);
            return res.status(404).json({ error: 'Paste has expired' });
        }

        // Check view limit
        if (paste.max_views !== null && paste.current_views >= paste.max_views) {
            return res.status(404).json({ error: 'Paste view limit exceeded' });
        }

        // Atomically increment view count
        paste.current_views += 1;
        await redis.set(key, JSON.stringify(paste));

        // Calculate remaining views (never negative)
        const remainingViews = paste.max_views !== null
            ? Math.max(0, paste.max_views - paste.current_views)
            : null;

        // Return paste data
        res.status(200).json({
            content: paste.content,
            remaining_views: remainingViews,
            expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null
        });
    } catch (error) {
        next(error);
    }
});

export default router;
