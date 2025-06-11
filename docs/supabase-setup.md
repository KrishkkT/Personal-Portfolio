# Supabase Setup Guide for Blog Storage

This guide will help you set up Supabase for your blog storage.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Choose a name and password for your project
4. Wait for your database to be provisioned

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to Settings > API
2. Copy the following values:
   - URL: `https://[your-project-id].supabase.co`
   - anon/public key
   - service_role key (for admin operations)

## 3. Set Up Environment Variables

Add the following environment variables to your `.env.local` file:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
\`\`\`

## 4. Initialize the Database

After setting up your environment variables, visit the following URL to initialize your database:

\`\`\`
https://[your-domain]/api/blog/init
\`\`\`

This will create the necessary tables and sample data.

## 5. Row Level Security (RLS) Policies

The setup script automatically creates the following RLS policies:

- Anonymous users can only read published posts
- Authenticated users have full access to all posts

## 6. Troubleshooting

If you encounter any issues:

1. Check your environment variables
2. Ensure your Supabase project is active
3. Check the browser console for error messages
4. Try reinitializing the database by visiting `/api/blog/init`

## 7. Database Schema

The blog posts are stored in a table with the following structure:

\`\`\`sql
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
