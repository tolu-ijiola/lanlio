-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  job_title VARCHAR(255),
  experience VARCHAR(100),
  location VARCHAR(255),
  bio TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  education TEXT,
  work_history TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own resumes
CREATE POLICY "Users can view their own resumes"
  ON resumes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own resumes
CREATE POLICY "Users can insert their own resumes"
  ON resumes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own resumes
CREATE POLICY "Users can update their own resumes"
  ON resumes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own resumes
CREATE POLICY "Users can delete their own resumes"
  ON resumes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for resumes (run this in Supabase dashboard SQL editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policy: Users can upload their own resumes
CREATE POLICY "Users can upload their own resumes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: Users can view their own resumes
CREATE POLICY "Users can view their own resumes"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: Users can delete their own resumes
CREATE POLICY "Users can delete their own resumes"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);











