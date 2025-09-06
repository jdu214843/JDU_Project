import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ensureUploadsDir, publicUploadPath } from './util/uploads.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import analysisRoutes from './routes/analyses.js';

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure uploads dir exists and serve statics
ensureUploadsDir();
app.use('/uploads', express.static(publicUploadPath));

// Routes
app.get('/', (req, res) => {
  res.json({ ok: true, name: 'EcoSoil API', version: '0.1.0' });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analyses', analysisRoutes);

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`EcoSoil server running on http://localhost:${PORT}`);
});
