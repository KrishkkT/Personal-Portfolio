-- Add new columns to existing tables
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

ALTER TABLE experience 
ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Create hero_section table
CREATE TABLE IF NOT EXISTS hero_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  profile_image TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create about_section table
CREATE TABLE IF NOT EXISTS about_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  profile_image TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing records to have proper order values
UPDATE certificates SET "order" = 
  (SELECT ROW_NUMBER() OVER (ORDER BY created_at) - 1 FROM certificates c2 WHERE c2.id = certificates.id);

UPDATE projects SET "order" = 
  (SELECT ROW_NUMBER() OVER (ORDER BY created_at) - 1 FROM projects p2 WHERE p2.id = projects.id);

UPDATE experience SET "order" = 
  (SELECT ROW_NUMBER() OVER (ORDER BY created_at) - 1 FROM experience e2 WHERE e2.id = experience.id);

-- Insert default hero section if none exists
INSERT INTO hero_section (name, title, description, profile_image, visible)
SELECT 'Krish Thakker', 'Cybersecurity Specialist & Full Stack Developer', 'Passionate about building secure, innovative solutions with expertise in penetration testing, cloud security, and modern web development.', '/images/profile.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM hero_section);

-- Insert default about section if none exists
INSERT INTO about_section (title, description, profile_image, visible)
SELECT 'About Me', 'I am a passionate Cybersecurity Specialist and Full Stack Developer with expertise in penetration testing, cloud security, and modern web development. I love creating secure, innovative solutions that make a difference.', '/images/profile.jpg', true
WHERE NOT EXISTS (SELECT 1 FROM about_section);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificates_order ON certificates("order");
CREATE INDEX IF NOT EXISTS idx_certificates_visible ON certificates(visible);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects("order");
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);
CREATE INDEX IF NOT EXISTS idx_experience_order ON experience("order");
CREATE INDEX IF NOT EXISTS idx_experience_visible ON experience(visible);
CREATE INDEX IF NOT EXISTS idx_hero_section_visible ON hero_section(visible);
CREATE INDEX IF NOT EXISTS idx_about_section_visible ON about_section(visible);
