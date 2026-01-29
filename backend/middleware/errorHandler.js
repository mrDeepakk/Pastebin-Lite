/**
 * Centralized error handler middleware
 */
export function errorHandler(err, req, res, next) {
    // Log error for debugging
    console.error('Error:', err);

    // Default error status and message
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal server error';

    // Send JSON error response
    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}
