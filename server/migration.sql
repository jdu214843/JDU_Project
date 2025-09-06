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
