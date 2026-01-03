# Database Setup Guide

## Issue: Missing `components` Column

If you're getting the error: `Could not find the 'components' column of 'websites' in the schema cache`, it means your Supabase database table is missing required columns.

## Solution

### Option 1: Run the Full Schema (Recommended for New Databases)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `app/lib/supabase/schema.sql`
4. Click **Run** to execute the SQL

This will create the `websites` table with all required columns.

### Option 2: Run the Migration (If Table Already Exists)

If your `websites` table already exists but is missing columns:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `app/lib/supabase/migration-add-components.sql`
4. Click **Run** to execute the SQL

This will add any missing columns to your existing table.

### Option 3: Manual Column Addition

If you prefer to add columns manually:

```sql
-- Add the components column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS components JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Add the design_palette column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS design_palette JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add the seo_settings column
ALTER TABLE websites ADD COLUMN IF NOT EXISTS seo_settings JSONB NOT NULL DEFAULT '{}'::jsonb;
```

## Verify the Setup

After running the migration, verify the columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'websites'
ORDER BY ordinal_position;
```

You should see all these columns:
- `id` (uuid)
- `user_id` (uuid)
- `name` (varchar)
- `slug` (varchar)
- `domain` (varchar)
- `status` (varchar)
- `components` (jsonb) ← **This is the missing one**
- `design_palette` (jsonb)
- `seo_settings` (jsonb)
- `description` (text)
- `thumbnail` (text)
- `views` (integer)
- `unique_visitors` (integer)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## After Running the Migration

1. Refresh your Supabase dashboard
2. Try creating a website again in your application
3. The error should be resolved

## Troubleshooting

If you still get errors:
1. Check that Row Level Security (RLS) policies are set up correctly
2. Verify your Supabase connection settings in `.env.local`
3. Check the browser console for detailed error messages


