import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import activityRoutes from './routes/activities.js';
import examRoutes from './routes/exams.js';
import attendanceRoutes from './routes/attendance.js';
import membershipRoutes from './routes/membership.js';
import membershipRequestRoutes from './routes/membership-requests.js';
import partnerRoutes from './routes/partners.js';
import runMigration from './scripts/migrate.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting (needed on Render/Vercel)
app.set('trust proxy', 1);

app.get('/', (req, res) => {
  res.status(200).send('Backend Epitech Blockchain is Live! 🚀');
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Club Blockchain Epitech API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Club Blockchain Epitech API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/membership-requests', membershipRequestRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attendance', attendanceRoutes);

// Route de test pour la propagation du déploiement
app.get('/api/test-deploy', (req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString(), version: 'deploy-check-1' });
});

// Santé de l'API & Base de données
app.get('/api', (req, res) => {
  res.json({
    name: 'Club Blockchain Epitech API',
    version: '1.0.0',
    description: 'API pour le site web du Club Blockchain d\'Epitech Bénin',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      activities: '/api/activities',
      exams: '/api/exams',
      attendance: '/api/attendance',
      membership: '/api/membership',
      membershipRequests: '/api/membership-requests',
      partners: '/api/partners'
    },
    documentation: '/api/docs'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Exécuter les migrations avant de démarrer le serveur
    await runMigration();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📱 Environnement: ${process.env.NODE_ENV}`);
      console.log(`🌐 API disponible sur: http://localhost:${PORT}/api`);
      console.log(`❤️  Club Blockchain Epitech Bénin`);
    });
  } catch (error) {
    console.error('❌ Échec du démarrage du serveur - Erreur de migration:', error);
    process.exit(1);
  }
};

startServer();

export default app;
