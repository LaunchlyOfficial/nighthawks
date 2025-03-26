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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// CORS configuration - not needed since everything is on same port
app.use(express.json());

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/join', joinRouter);

// Serve static files from the client directory
app.use(express.static(join(__dirname, '../../client')));

// All other routes should serve the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../client/index.html'));
});

app.use(errorHandler);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 