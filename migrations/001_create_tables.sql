-- Create link table
CREATE TABLE IF NOT EXISTS link (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  long_link TEXT NOT NULL,
  short_link TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity table
CREATE TABLE IF NOT EXISTS activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES link(id) ON DELETE CASCADE,
  ip TEXT NOT NULL,
  device TEXT,
  region TEXT,
  origin TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_link_user_id ON link(user_id);
CREATE INDEX IF NOT EXISTS idx_link_short_link ON link(short_link);
CREATE INDEX IF NOT EXISTS idx_link_status ON link(status);
CREATE INDEX IF NOT EXISTS idx_link_created_at ON link(created_at);

CREATE INDEX IF NOT EXISTS idx_activity_link_id ON activity(link_id);
CREATE INDEX IF NOT EXISTS idx_activity_clicked_at ON activity(clicked_at);
CREATE INDEX IF NOT EXISTS idx_activity_ip ON activity(ip);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_link_updated_at ON link;
CREATE TRIGGER update_link_updated_at
  BEFORE UPDATE ON link
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE link IS 'Stores shortened links with metadata';
COMMENT ON TABLE activity IS 'Tracks link click activities';

COMMENT ON COLUMN link.status IS 'Status: active or frozen';
COMMENT ON COLUMN activity.ip IS 'IP address of the clicker';
COMMENT ON COLUMN activity.device IS 'Device type: mobile, desktop, tablet, etc.';
COMMENT ON COLUMN activity.region IS 'User region/location';
COMMENT ON COLUMN activity.origin IS 'Traffic source/referrer';
