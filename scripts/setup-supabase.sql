-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  intro TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  reading_time INTEGER DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  author TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'Active',
  image TEXT DEFAULT '',
  level TEXT DEFAULT '',
  hours TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  category TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  live_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  status TEXT DEFAULT 'Live',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the experience table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  type TEXT DEFAULT 'Education',
  achievements TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_certificates_date ON certificates(date);
CREATE INDEX IF NOT EXISTS idx_certificates_verified ON certificates(verified);
CREATE INDEX IF NOT EXISTS idx_certificates_skills ON certificates USING GIN(skills);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN(technologies);

CREATE INDEX IF NOT EXISTS idx_experience_type ON experience(type);
CREATE INDEX IF NOT EXISTS idx_experience_year ON experience(year);
CREATE INDEX IF NOT EXISTS idx_experience_skills ON experience USING GIN(skills);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (you can make this more restrictive)
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on certificates" ON certificates FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on experience" ON experience FOR ALL USING (true);

-- Insert sample data
INSERT INTO certificates (
  title,
  issuer,
  date,
  description,
  skills,
  verified,
  status,
  image,
  level,
  hours
) VALUES (
  'Google Professional Cybersecurity',
  'Google via Coursera',
  '2025',
  'A beginner-friendly, hands-on course that builds foundational cybersecurity skills. It covers essential topics like threat types, risk management, incident response, SIEM tools, and network security.',
  ARRAY['Network Security', 'SOC Tools', 'Python & Linux', 'MySQL', 'Incident Response'],
  true,
  'Active',
  'https://images.unsplash.com/photo-1749188413538-feffa77e73ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D',
  'Professional',
  '40+'
) ON CONFLICT DO NOTHING;

INSERT INTO projects (
  title,
  description,
  image,
  technologies,
  category,
  featured,
  live_url,
  github_url,
  status
) VALUES (
  'SpiceSafari - Simple Travel Website',
  'SpiceSafari is a sleek and responsive travel website developed by a team of three college students as part of a collaborative academic project.',
  'https://images.unsplash.com/photo-1749192715605-2c3f74f1e46b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NHx8fGVufDB8fHx8fA%3D%3D',
  ARRAY['HTML5', 'CSS3', 'Tailwind CSS', 'Vercel'],
  'Web App',
  false,
  'https://spice-safari.vercel.app',
  'https://github.com/KrishkkT/SpiceSafari',
  'Live'
) ON CONFLICT DO NOTHING;

INSERT INTO experience (
  year,
  title,
  organization,
  type,
  achievements,
  skills
) VALUES (
  '2023 - 2027',
  'B.Tech in Information Technology',
  'Dharmsinh Desai University',
  'Education',
  ARRAY['Pursuing comprehensive IT education', 'Learning modern technologies', 'Building practical projects'],
  ARRAY['Information Technology', 'Software Development', 'Database Management']
) ON CONFLICT DO NOTHING;

INSERT INTO blog_posts (
  title,
  slug,
  intro,
  content,
  tags,
  image_urls,
  published
) VALUES (
  'Welcome to Your Blog',
  'welcome-to-your-blog',
  'This is your first blog post. You can edit or delete it from the blog management page.',
  '# Welcome to Your Blog

This is your first blog post! You can edit or delete this post from the blog management page.

## Getting Started

To manage your blog posts:

1. Visit the blog management page at `/kjt-golb`
2. Use the login credentials you''ve set up
3. Create, edit, or delete posts as needed

## Features

Your blog system includes:

- **Rich Text Support**: Write in Markdown format
- **Tag System**: Organize posts with tags
- **Featured Images**: Add images to make posts more engaging
- **SEO Friendly**: Automatic slug generation and meta tags

## Next Steps

1. **Customize this post** or delete it
2. **Create your first real post**
3. **Add some tags** to organize your content
4. **Upload featured images** to make posts more visual

Happy blogging! 🎉',
  ARRAY['Welcome', 'Getting Started'],
  ARRAY['/placeholder.svg?height=400&width=800&text=Welcome+Post'],
  true
) ON CONFLICT (slug) DO NOTHING;
