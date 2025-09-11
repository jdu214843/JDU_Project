-- Add health_score to analysis_results (idempotent)
ALTER TABLE analysis_results
  ADD COLUMN IF NOT EXISTS health_score DECIMAL;

