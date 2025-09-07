-- Add additional result fields required for Detailed Report (idempotent)
ALTER TABLE analysis_results
  ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL,
  ADD COLUMN IF NOT EXISTS risk_level VARCHAR(100),
  ADD COLUMN IF NOT EXISTS affected_area_percentage DECIMAL;

