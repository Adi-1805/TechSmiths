-- Create applications table for FounderSmith nominations
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  college TEXT NOT NULL,
  is_solo_founder BOOLEAN NOT NULL DEFAULT true,
  needs_cofounder BOOLEAN NOT NULL DEFAULT false,
  idea_type TEXT NOT NULL CHECK (idea_type IN ('tech', 'non-tech', 'combined')),
  domains TEXT[] NOT NULL DEFAULT '{}',
  idea_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (public form submission)
CREATE POLICY "Allow public insert" ON applications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only service role can read applications
CREATE POLICY "Service role can read all" ON applications
  FOR SELECT
  USING (auth.role() = 'service_role');
