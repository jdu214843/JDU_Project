-- EcoSoil single-file migration (psql)

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT NULL,
  location VARCHAR(255) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analyses (
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
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY,
  analysis_id UUID NOT NULL UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
  salinity_level DECIMAL,
  ph_level DECIMAL,
  moisture_percentage DECIMAL,
  soil_composition JSONB,
  chemical_properties JSONB,
  recommendations JSONB,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS analysis_images (
  id UUID PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  image_url VARCHAR(1024) NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_images_analysis_id ON analysis_images(analysis_id);

-- Alter users table to add dashboard-related fields (idempotent)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS region VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"notifications":{"email":true,"sms":false,"marketing":true},"language":"uz"}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Create admin users table for admin-specific info
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{"orders": true, "users": true, "analytics": true}',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add customer_email to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Create order logs table for tracking status changes
CREATE TABLE IF NOT EXISTS order_logs (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table for email tracking
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  recipient_emails JSONB,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent'
);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, full_name, email, password_hash, role, created_at) 
VALUES (
  gen_random_uuid(),
  'System Administrator', 
  'admin@ecosoil.uz', 
  '$2a$10$oTuccVEnpVEOgbqjTG8kYuYMVEEi/4zi0JJ3pKwEqMxTTB22bpcpq',
  'admin',
  NOW()
) ON CONFLICT (email) DO NOTHING;
