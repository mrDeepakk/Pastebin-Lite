import { body, validationResult } from 'express-validator';

/**
 * Validation middleware for creating a paste
 */
export const validateCreatePaste = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required and cannot be empty')
        .isString()
        .withMessage('Content must be a string'),

    body('ttl_seconds')
        .optional()
        .isInt({ min: 1 })
        .withMessage('TTL must be an integer greater than or equal to 1'),

    body('max_views')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Max views must be an integer greater than or equal to 1'),

    // Middleware to handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }
        next();
    }
];
