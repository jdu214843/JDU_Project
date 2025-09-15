import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ensureUploadsDir, publicUploadPath } from './util/uploads.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import analysisRoutes from './routes/analyses.js';
import orderRoutes from './routes/orders.js';
import subscriptionRoutes from './routes/subscriptions.js';
import publicRoutes from './routes/public.js';

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://frontend-git-9-deploy-to-vercel-beks-projects-b6aad7c5.vercel.app', // Production frontend
    /\.vercel\.app$/, // Any Vercel domain
    /\.onrender\.com$/ // Any Render domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Catch all handler for React Router (production only)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });
}

// Export for Vercel serverless functions
export default app;

// Start server (both development and production)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`EcoSoil server running on port ${PORT}`);
  });
}
