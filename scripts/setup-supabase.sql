-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  intro TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  reading_time INTEGER NOT NULL DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  author TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);

-- Create function to create the table if needed
CREATE OR REPLACE FUNCTION create_blog_posts_table()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'blog_posts'
  ) THEN
    -- Create the table
    CREATE TABLE blog_posts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      intro TEXT NOT NULL,
      content TEXT NOT NULL,
      date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      reading_time INTEGER NOT NULL DEFAULT 5,
      tags TEXT[] DEFAULT '{}',
      image_urls TEXT[] DEFAULT '{}',
      author TEXT,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    
    -- Create index on slug
    CREATE INDEX blog_posts_slug_idx ON blog_posts(slug);
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies for security
-- Enable RLS on the table
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow anonymous read access" ON blog_posts;
  DROP POLICY IF EXISTS "Allow authenticated full access" ON blog_posts;
  
  -- Create new policies
  CREATE POLICY "Allow anonymous read access" 
    ON blog_posts FOR SELECT 
    USING (published = TRUE);
    
  CREATE POLICY "Allow authenticated full access" 
    ON blog_posts FOR ALL 
    USING (auth.role() = 'authenticated');
END
$$;
