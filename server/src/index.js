import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ensureUploadsDir, publicUploadPath } from './util/uploads.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import analysisRoutes from './routes/analyses.js';
import orderRoutes from './routes/orders.js';
import subscriptionRoutes from './routes/subscriptions.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import migrationRoutes from './routes/migration.js';

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
// CORS configuration with support for production environment
const corsOrigins = process.env.NODE_ENV === 'production' && process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:5173', // Local development
      'http://localhost:3000', // Local development alternative
      'https://frontend-git-9-deploy-to-vercel-beks-projects-b6aad7c5.vercel.app', // Old production frontend
      'https://client-4vzhywq1u-beks-projects-b6aad7c5.vercel.app', // New production frontend
      'https://client-8rm5pmimw-beks-projects-b6aad7c5.vercel.app', // Latest production frontend
      /^https:\/\/.*\.vercel\.app$/, // Any Vercel domain (regex fixed)
      /^https:\/\/.*\.onrender\.com$/, // Any Render domain (regex fixed)
      /^https:\/\/.*\.railway\.app$/, // Any Railway domain (regex fixed)
      /^https:\/\/.*\.netlify\.app$/ // Any Netlify domain
    ];

app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure uploads dir exists and serve statics (skip in serverless)
ensureUploadsDir();
if (!process.env.VERCEL) {
  app.use('/uploads', express.static(publicUploadPath));
}

// Serve static files from React build (production only)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  // Serve React build files (not in serverless)
  app.use(express.static(path.join(__dirname, '../public')));
}

// Routes
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  } else {
    res.json({ ok: true, name: 'EcoSoil API', version: '0.1.0' });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/migrations', migrationRoutes);

// Health
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const { query } = await import('./db/index.js');
    await query('SELECT 1');
    res.json({ 
      ok: true, 
      database: 'connected',
      env: process.env.NODE_ENV,
      dbUrlExists: !!process.env.DATABASE_URL
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ 
      ok: false, 
      database: 'disconnected',
      env: process.env.NODE_ENV,
      dbUrlExists: !!process.env.DATABASE_URL,
      error: err.message
    });
  }
});

// Catch all handler for React Router (production only)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });
}

// Create HTTP server and Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔗 Admin connected:', socket.id);
  
  // Join admin room for notifications
  socket.on('join-admin', (token) => {
    // Verify admin token here if needed
    socket.join('admin-room');
    console.log('👨‍💼 Admin joined notification room');
  });

  socket.on('disconnect', () => {
    console.log('❌ Admin disconnected:', socket.id);
  });
});

// Make io available globally for other modules
global.io = io;

// Export for Vercel serverless functions
export default app;

// Start server (both development and production)
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`🚀 EcoSoil server running on port ${PORT}`);
    console.log(`🔌 Socket.io ready for real-time notifications`);
  });
}
