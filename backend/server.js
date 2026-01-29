import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initRedis, closeRedis } from './config/redis.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import pastesRouter from './routes/pastes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Redis
try {
    initRedis();
} catch (error) {
    console.error('Failed to initialize Redis. Exiting...');
    process.exit(1);
}

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', healthRouter);
app.use('/api', pastesRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Pastebin-Lite API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/healthz',
            createPaste: 'POST /api/pastes',
            getPaste: 'GET /api/pastes/:id'
        }
    });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Test mode: ${process.env.TEST_MODE === '1' ? 'enabled' : 'disabled'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(async () => {
        await closeRedis();
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    server.close(async () => {
        await closeRedis();
        console.log('Server closed');
        process.exit(0);
    });
});
