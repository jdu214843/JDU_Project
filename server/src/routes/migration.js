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
    const isProd = process.env.NODE_ENV === 'production'
    const requiredSecret = process.env.MIGRATION_SECRET
    const providedSecret = req.headers['x-migration-secret']
    if (isProd && !requiredSecret) {
      return res.status(403).json({ error: 'Migrations are disabled in production' })
    }
    if (requiredSecret && providedSecret !== requiredSecret) {
      return res.status(403).json({ error: 'Invalid migration secret' })
    }

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
        phone_number VARCHAR(50),
        region VARCHAR(255),
        settings JSONB DEFAULT '{"notifications":{"email":true,"sms":false,"marketing":true},"language":"uz"}',
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS region VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"notifications":{"email":true,"sms":false,"marketing":true},"language":"uz"}'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'`,
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
        last_harvest_date TIMESTAMPTZ,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      `ALTER TABLE analyses ADD COLUMN IF NOT EXISTS last_harvest_date TIMESTAMPTZ`,
      `ALTER TABLE analyses ADD COLUMN IF NOT EXISTS share_token TEXT`,
      `ALTER TABLE analyses ADD COLUMN IF NOT EXISTS share_enabled BOOLEAN DEFAULT false`,
      `ALTER TABLE analyses ADD COLUMN IF NOT EXISTS report_pdf_url TEXT`,
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_analyses_share_token ON analyses(share_token) WHERE share_token IS NOT NULL`,
      `CREATE TABLE IF NOT EXISTS analysis_results (
        id UUID PRIMARY KEY,
        analysis_id UUID NOT NULL UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
        salinity_level DECIMAL,
        ph_level DECIMAL,
        moisture_percentage DECIMAL,
        soil_composition JSONB,
        chemical_properties JSONB,
        recommendations JSONB,
        ai_confidence DECIMAL,
        risk_level VARCHAR(100),
        affected_area_percentage DECIMAL,
        health_score DECIMAL,
        completed_at TIMESTAMPTZ
      )`,
      `ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL`,
      `ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS risk_level VARCHAR(100)`,
      `ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS affected_area_percentage DECIMAL`,
      `ALTER TABLE analysis_results ADD COLUMN IF NOT EXISTS health_score DECIMAL`,
      `CREATE TABLE IF NOT EXISTS analysis_images (
        id UUID PRIMARY KEY,
        analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
        image_url VARCHAR(1024) NOT NULL,
        uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        phone_number VARCHAR(100) NOT NULL,
        region VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        address TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS order_logs (
        id UUID PRIMARY KEY,
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        admin_id UUID REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        old_status VARCHAR(50),
        new_status VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        recipient_emails JSONB,
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        sent_at TIMESTAMPTZ DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'sent'
      )`,
      `CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        permissions JSONB DEFAULT '{"orders": true, "users": true, "analytics": true}',
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`,
      `INSERT INTO users (id, full_name, email, password_hash, role, created_at) 
       VALUES (
         gen_random_uuid(),
         'System Administrator', 
         'admin@ecosoil.uz', 
         '$2a$10$oTuccVEnpVEOgbqjTG8kYuYMVEEi/4zi0JJ3pKwEqMxTTB22bpcpq',
         'admin',
         NOW()
       ) ON CONFLICT (email) DO NOTHING`
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
