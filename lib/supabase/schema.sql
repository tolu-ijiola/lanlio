-- Create websites table
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  design_palette JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  thumbnail TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on domain for fast lookups
CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(domain);
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
CREATE INDEX IF NOT EXISTS idx_websites_status ON websites(status);

-- Create index on slug
CREATE INDEX IF NOT EXISTS idx_websites_slug ON websites(slug);

-- Enable Row Level Security
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own websites
CREATE POLICY "Users can view their own websites"
  ON websites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own websites
CREATE POLICY "Users can insert their own websites"
  ON websites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own websites
CREATE POLICY "Users can update their own websites"
  ON websites
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own websites
CREATE POLICY "Users can delete their own websites"
  ON websites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public can view published websites (for public access)
CREATE POLICY "Public can view published websites"
  ON websites
  FOR SELECT
  USING (status = 'published');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_websites_updated_at
  BEFORE UPDATE ON websites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();





