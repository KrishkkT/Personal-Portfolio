-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.experience CASCADE;

-- Create the blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  intro TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  reading_time INTEGER DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Krish Thakkar',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the certificates table
CREATE TABLE public.certificates (
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
CREATE TABLE public.projects (
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
CREATE TABLE public.experience (
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
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_date ON public.blog_posts(date DESC);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

CREATE INDEX idx_certificates_date ON public.certificates(date);
CREATE INDEX idx_certificates_verified ON public.certificates(verified);
CREATE INDEX idx_certificates_skills ON public.certificates USING GIN(skills);

CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_featured ON public.projects(featured);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_technologies ON public.projects USING GIN(technologies);

CREATE INDEX idx_experience_type ON public.experience(type);
CREATE INDEX idx_experience_year ON public.experience(year);
CREATE INDEX idx_experience_skills ON public.experience USING GIN(skills);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations
CREATE POLICY "Allow all operations on blog_posts" ON public.blog_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations on certificates" ON public.certificates FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on experience" ON public.experience FOR ALL USING (true);

-- Insert sample certificates
INSERT INTO public.certificates (
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
) VALUES 
(
  'Google Professional Cybersecurity Certificate',
  'Google via Coursera',
  '2025',
  'A comprehensive cybersecurity program that covers essential topics including threat types, risk management, incident response, SIEM tools, and network security fundamentals.',
  ARRAY['Network Security', 'SOC Tools', 'Python & Linux', 'MySQL', 'Incident Response', 'Risk Management'],
  true,
  'Active',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop&q=60',
  'Professional',
  '40+'
),
(
  'CompTIA Security+ Certification',
  'CompTIA',
  '2024',
  'Industry-standard certification covering cybersecurity fundamentals, risk management, cryptography, and security architecture.',
  ARRAY['Cybersecurity', 'Risk Assessment', 'Cryptography', 'Network Security'],
  true,
  'Active',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=60',
  'Professional',
  '30+'
);

-- Insert sample projects
INSERT INTO public.projects (
  title,
  description,
  image,
  technologies,
  category,
  featured,
  live_url,
  github_url,
  status
) VALUES 
(
  'SpiceSafari - Travel Website',
  'A modern, responsive travel website built collaboratively by a team of three students. Features destination showcases, travel planning tools, and an intuitive user interface designed to inspire wanderlust.',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60',
  ARRAY['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Vercel'],
  'Web Development',
  true,
  'https://spice-safari.vercel.app',
  'https://github.com/KrishkkT/SpiceSafari',
  'Live'
),
(
  'Portfolio Website',
  'A personal portfolio website showcasing my skills, projects, and professional journey. Built with modern web technologies and featuring smooth animations and responsive design.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
  'Web Development',
  true,
  '#',
  '#',
  'Live'
);

-- Insert sample experience
INSERT INTO public.experience (
  year,
  title,
  organization,
  type,
  achievements,
  skills
) VALUES 
(
  '2023 - 2027',
  'Bachelor of Technology in Information Technology',
  'Dharmsinh Desai University',
  'Education',
  ARRAY[
    'Pursuing comprehensive IT education with focus on modern technologies',
    'Learning software development, database management, and cybersecurity',
    'Participating in coding competitions and technical workshops',
    'Building practical projects to apply theoretical knowledge'
  ],
  ARRAY['Information Technology', 'Software Development', 'Database Management', 'Web Development', 'Cybersecurity']
),
(
  '2021 - 2023',
  'Higher Secondary Education (Science)',
  'Gujarat Board',
  'Education',
  ARRAY[
    'Completed higher secondary education with science stream',
    'Strong foundation in mathematics and computer science',
    'Developed interest in programming and technology'
  ],
  ARRAY['Mathematics', 'Physics', 'Chemistry', 'Computer Science']
);

-- Insert sample blog post
INSERT INTO public.blog_posts (
  title,
  slug,
  intro,
  content,
  tags,
  image_urls,
  published
) VALUES (
  'Welcome to My Blog',
  'welcome-to-my-blog',
  'Welcome to my personal blog where I share insights about technology, cybersecurity, and my journey as a developer.',
  '# Welcome to My Blog

Hello and welcome to my personal blog! I''m excited to share this space with you where I''ll be documenting my journey in technology, cybersecurity, and software development.

## What You Can Expect

In this blog, you''ll find:

- **Technical Tutorials**: Step-by-step guides on various technologies
- **Project Showcases**: Deep dives into my latest projects
- **Learning Experiences**: Lessons learned from my educational journey
- **Industry Insights**: Thoughts on cybersecurity and web development trends

## My Background

I''m currently pursuing a B.Tech in Information Technology at Dharmsinh Desai University. My interests span across:

- Cybersecurity and ethical hacking
- Full-stack web development
- Modern JavaScript frameworks
- Database design and management

## Let''s Connect

I believe in the power of community and knowledge sharing. Feel free to reach out if you have questions, suggestions, or just want to connect!

Thank you for visiting, and I hope you find the content valuable!

---

*Happy coding!* 🚀',
  ARRAY['Welcome', 'Introduction', 'Technology', 'Blog'],
  ARRAY['https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60'],
  true
);

-- Verify tables were created successfully
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('blog_posts', 'certificates', 'projects', 'experience');
