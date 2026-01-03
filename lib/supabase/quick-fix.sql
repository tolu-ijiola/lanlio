-- Quick Fix: Add all missing columns to websites table
-- Run this in Supabase SQL Editor

-- Add components column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS components JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Add design_palette column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS design_palette JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add seo_settings column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS seo_settings JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add slug column (if missing)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Add domain column (if missing)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS domain VARCHAR(255);

-- Add status column (if missing)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft';

-- Add description column (THIS IS THE ONE YOU'RE MISSING)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS description TEXT;

-- Add thumbnail column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS thumbnail TEXT;

-- Add views column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

-- Add unique_visitors column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS unique_visitors INTEGER NOT NULL DEFAULT 0;

-- Add updated_at column (if missing)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(domain);
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
CREATE INDEX IF NOT EXISTS idx_websites_status ON websites(status);
CREATE INDEX IF NOT EXISTS idx_websites_slug ON websites(slug);


