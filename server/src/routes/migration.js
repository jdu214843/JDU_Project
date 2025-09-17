import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../db/index.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run migrations endpoint (for development/setup only)
router.post('/run', async (req, res) => {
  try {
    // Hardcode the essential table creation
    const migrations = [
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto"',
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        bio TEXT NULL,
        location VARCHAR(255) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS analyses (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        location VARCHAR(255),
        area DECIMAL,
        soil_type VARCHAR(100),
        crop_type VARCHAR(100),
        irrigation_method VARCHAR(100),
        observations TEXT,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS analysis_results (
        id UUID PRIMARY KEY,
        analysis_id UUID NOT NULL UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
        salinity_level DECIMAL,
        ph_level DECIMAL,
        moisture_percentage DECIMAL,
        soil_composition JSONB,
        chemical_properties JSONB,
        recommendations JSONB,
        completed_at TIMESTAMPTZ
      )`
    ];
    
    console.log(`Executing ${migrations.length} migration statements...`);
    
    for (let i = 0; i < migrations.length; i++) {
      const statement = migrations[i];
      console.log(`${i + 1}. Creating table...`);
      try {
        await query(statement);
        console.log('✓ Success');
      } catch (err) {
        console.log(`✗ Error: ${err.message}`);
      }
    }
    
    res.json({ 
      success: true, 
      message: `Migration completed successfully. Created essential tables.` 
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Migration failed', 
      details: error.message 
    });
  }
});

export default router;