import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import path from 'path';
import { connectDB } from './config/db.js';
import { envValidator } from './config/envValidator.js';
import errorHandler from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiters.js';
import { requestId } from './middleware/requestId.js';
import { securityHeaders } from './middleware/security.js';
import { logger } from './utils/logger.js';

// Auth
import authRoutes from './routes/auth.js';
import googleAuthRoutes from './routes/googleAuth.js';

// Herbute domain routes
import feedbackRoutes from './routes/feedback.js';
import fleetRoutes from './routes/fleet.js';
import interventionRoutes from './routes/interventions.js';
import knowledgeRoutes from './routes/knowledge.js';
import leaveRoutes from './routes/leave.js';
import messageRoutes from './routes/messages.js';
import planningRoutes from './routes/planning.js';
import rosterRoutes from './routes/roster.js';
import schedulerRoutes from './routes/scheduler.js';
import staffRoutes from './routes/staff.js';
import uploadRoutes from './routes/upload.js';

// Validate environment
envValidator();

const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(requestId);
app.use(securityHeaders);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1 && allowedOrigins[0] !== '*') {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use('/api/', globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);

// Fleet / Vehicle management
app.use('/api/fleet', fleetRoutes);

// HR / Workforce
app.use('/api/staff', staffRoutes);
app.use('/api/roster', rosterRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/scheduler', schedulerRoutes);

// Operations
app.use('/api/interventions', interventionRoutes);

// Communication & knowledge
app.use('/api/messages', messageRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/feedback', feedbackRoutes);

// Upload
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'Herbute API' });
});

// Error handler
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 2065;
    httpServer.listen(PORT, () => {
      logger.info(`🌿 API Herbute écoute sur le port ${PORT}`);
    });
  } catch (err) {
    logger.error('❌ Échec démarrage serveur Herbute', err);
    process.exit(1);
  }
};

start();
