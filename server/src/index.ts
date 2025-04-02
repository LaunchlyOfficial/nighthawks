import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { apiLimiter, authLimiter } from './middleware/rateLimit.js';
import authRouter from './routes/auth.js';
import reportsRouter from './routes/reports.js';
import permissionsRouter from './routes/permissions.js';
import applicationsRouter from './routes/applications.js';
import joinRouter from './routes/join.js';
import { errorHandler } from './middleware/errorHandler.js';
import {
    securityHeaders,
    globalLimiter,
    validateCSRFToken,
    validateRequestBody,
    ipFilter,
    requestLogger
} from './middleware/security';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(globalLimiter);
app.use(ipFilter);
app.use(requestLogger);
app.use(validateRequestBody);

// Add more detailed logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configure CORS to allow requests from anywhere
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  credentials: true,
  maxAge: 600 // 10 minutes
};
app.use(cors(corsOptions));

app.use(express.json());

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes - these must come BEFORE static file handling
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/join', joinRouter);

// API 404 handler - for /api routes only
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve static files from the client/public directory
app.use(express.static(join(__dirname, '../../client/public')));

// Catch-all route for client-side routing - comes LAST
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api/')) {
    res.sendFile(join(__dirname, '../../client/index.html'));
  }
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Protected routes should use CSRF validation
app.use('/api/admin/*', validateCSRFToken);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server: http://localhost:${PORT}/api/health`);
}); 