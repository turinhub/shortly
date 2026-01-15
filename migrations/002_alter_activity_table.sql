-- Add fingerprint column to activity table
ALTER TABLE activity ADD COLUMN IF NOT EXISTS fingerprint TEXT;

-- Create index for fingerprint for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_fingerprint ON activity(fingerprint);

-- Drop region column (will be deprecated)
-- ALTER TABLE activity DROP COLUMN IF EXISTS region;

-- Update comments
COMMENT ON COLUMN activity.fingerprint IS 'Browser fingerprint for unique visitor identification';
COMMENT ON COLUMN activity.device IS 'Device type: mobile, desktop, tablet, etc.';
COMMENT ON COLUMN activity.origin IS 'Traffic source/referrer';
