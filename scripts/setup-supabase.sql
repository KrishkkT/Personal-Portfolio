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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can make this more restrictive)
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts
  FOR ALL USING (true);

-- Insert a sample blog post
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
