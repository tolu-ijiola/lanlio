-- Migration: Add missing columns to websites table
-- Run this in your Supabase SQL Editor if the components column is missing

-- First, check if the table exists and add missing columns
DO $$ 
BEGIN
  -- Add components column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'components'
  ) THEN
    ALTER TABLE websites ADD COLUMN components JSONB NOT NULL DEFAULT '[]'::jsonb;
  END IF;

  -- Add design_palette column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'design_palette'
  ) THEN
    ALTER TABLE websites ADD COLUMN design_palette JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;

  -- Add seo_settings column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'seo_settings'
  ) THEN
    ALTER TABLE websites ADD COLUMN seo_settings JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;

  -- Add slug column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'slug'
  ) THEN
    ALTER TABLE websites ADD COLUMN slug VARCHAR(255);
  END IF;

  -- Add domain column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'domain'
  ) THEN
    ALTER TABLE websites ADD COLUMN domain VARCHAR(255) UNIQUE;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'status'
  ) THEN
    ALTER TABLE websites ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
  END IF;

  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'description'
  ) THEN
    ALTER TABLE websites ADD COLUMN description TEXT;
    -- Update existing rows to have empty description if null
    UPDATE websites SET description = '' WHERE description IS NULL;
  END IF;

  -- Add thumbnail column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'thumbnail'
  ) THEN
    ALTER TABLE websites ADD COLUMN thumbnail TEXT;
  END IF;

  -- Add views column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'views'
  ) THEN
    ALTER TABLE websites ADD COLUMN views INTEGER NOT NULL DEFAULT 0;
  END IF;

  -- Add unique_visitors column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'unique_visitors'
  ) THEN
    ALTER TABLE websites ADD COLUMN unique_visitors INTEGER NOT NULL DEFAULT 0;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'websites' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE websites ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(domain);
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
CREATE INDEX IF NOT EXISTS idx_websites_status ON websites(status);
CREATE INDEX IF NOT EXISTS idx_websites_slug ON websites(slug);

