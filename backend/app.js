import express from 'express';
import { corsMiddleware } from './config/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problem.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import contestRoutes from './routes/contest.routes.js';
import { sendSuccess } from './utils/apiResponse.js';

const app = express();

// CORS must run before routes
const [corsHandler, corsOptionsHandler] = corsMiddleware();
app.use(corsHandler);
app.options('*', corsOptionsHandler);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health checks
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/api/health', (req, res) => {
  sendSuccess(res, { message: 'API is healthy', data: { status: 'ok' } });
});

// API routes (canonical prefix: /api)
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/contests', contestRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
