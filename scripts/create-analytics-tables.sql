-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  isp TEXT,
  page_url TEXT NOT NULL,
  referrer TEXT,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_analytics table
CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_slug TEXT NOT NULL,
  blog_title TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'read', 'click', 'share')),
  event_data JSONB,
  visitor_id TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at);
CREATE INDEX IF NOT EXISTS idx_visitors_ip_address ON visitors(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitors_session_id ON visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);

CREATE INDEX IF NOT EXISTS idx_blog_analytics_created_at ON blog_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_blog_slug ON blog_analytics(blog_slug);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_event_type ON blog_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_visitor_id ON blog_analytics(visitor_id);

-- Add RLS policies (Row Level Security)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public read access for analytics
CREATE POLICY "Allow public read access on visitors" ON visitors FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on visitors" ON visitors FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on blog_analytics" ON blog_analytics FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on blog_analytics" ON blog_analytics FOR INSERT WITH CHECK (true);
