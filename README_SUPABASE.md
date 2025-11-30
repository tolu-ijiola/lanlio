# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

## 2. Environment Variables

Create a `.env.local` file in the `app` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Database Setup

1. Go to SQL Editor in your Supabase dashboard
2. Run the SQL from `app/lib/supabase/schema.sql`
3. This will create the `websites` table with all necessary indexes and RLS policies

## 4. Domain Configuration

### Option A: Subdomain Routing (Recommended for Development)

For development, you can use subdomain routing:
- `johndoe.localhost:3000` → serves website with domain `johndoe.website.ai`

### Option B: Path-based Routing (Current Implementation)

The current implementation uses path-based routing:
- `localhost:3000/johndoe.website.ai` → serves the website

### Option C: Custom Domain (Production)

For production, you'll need:
1. DNS configuration to point `*.website.ai` to your server
2. Server configuration to handle wildcard subdomains
3. SSL certificates for wildcard domains

## 5. Authentication

The current implementation assumes you have Supabase Auth set up. If not:

1. Enable Authentication in Supabase dashboard
2. Configure your auth providers
3. Update login/register pages to use Supabase Auth

## 6. Testing

1. Create a website in the editor
2. Save it (it will be created as a draft)
3. Publish it from the websites page
4. Visit `localhost:3000/[domain]` to see your website

## Notes

- Websites are saved with a unique domain like `username-123.website.ai`
- The domain is auto-generated from the website name
- Only published websites are accessible publicly
- Users can only see/edit their own websites (enforced by RLS)





