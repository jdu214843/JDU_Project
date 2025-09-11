-- Analysis sharing + report fields (idempotent)
ALTER TABLE analyses
  ADD COLUMN IF NOT EXISTS share_token TEXT,
  ADD COLUMN IF NOT EXISTS share_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS report_pdf_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_analyses_share_token ON analyses(share_token) WHERE share_token IS NOT NULL;

