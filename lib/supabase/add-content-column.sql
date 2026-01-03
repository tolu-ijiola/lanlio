-- Add content column to websites table if it doesn't exist
-- This column is used to store the website content as JSON string

ALTER TABLE websites ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '';

-- If the column already exists but has NULL values, update them
UPDATE websites SET content = '' WHERE content IS NULL;

-- If you want to populate content from components for existing rows:
-- UPDATE websites SET content = components::text WHERE content = '' AND components IS NOT NULL;


