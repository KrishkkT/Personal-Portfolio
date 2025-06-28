# Environment Setup Guide

This guide will help you set up all the necessary environment variables for the KT Portfolio application.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Supabase Configuration
\`\`\`env
# Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_URL=your_supabase_project_url

# Supabase Keys
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Secret
SUPABASE_JWT_SECRET=your_jwt_secret
\`\`\`

### Vercel Blob Storage
\`\`\`env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

### Application Configuration
\`\`\`env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your_app_jwt_secret
\`\`\`

### Optional: Blog Webhook (for external integrations)
\`\`\`env
BLOG_WEBHOOK_SECRET=your_webhook_secret
BLOG_ADMIN_TOKEN=your_admin_token
\`\`\`

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings > API
3. Copy the following values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`
   - Anon/Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`
   - JWT Secret → `SUPABASE_JWT_SECRET`

4. Run the database initialization script:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `scripts/init-database.sql`
   - Execute the script to create all necessary tables

### 2. Vercel Blob Setup

1. Go to your Vercel dashboard
2. Navigate to Storage and create a new Blob store
3. Copy the read/write token → `BLOB_READ_WRITE_TOKEN`

### 3. Application URLs

- For development: `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- For production: `NEXT_PUBLIC_BASE_URL=https://your-domain.com`

## Verification

After setting up the environment variables, you can verify the setup by:

1. Starting the development server: `npm run dev`
2. Visiting the management page: `http://localhost:3000/kjt-golb`
3. Checking that all data loads without errors

## Troubleshooting

### Common Issues

1. **"Missing Supabase server environment variables"**
   - Ensure both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
   - Restart your development server after adding variables

2. **"relation does not exist" errors**
   - Run the database initialization script in Supabase SQL Editor
   - Ensure all tables are created in the `public` schema

3. **Image upload failures**
   - Verify `BLOB_READ_WRITE_TOKEN` is correctly set
   - Check that the Vercel Blob store is properly configured

### Environment Variable Priority

The application checks for environment variables in this order:
1. `NEXT_PUBLIC_SUPABASE_URL` (preferred) or `SUPABASE_URL`
2. `SUPABASE_SERVICE_ROLE_KEY` (for server operations) or `SUPABASE_ANON_KEY`
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for client operations)

Make sure to set the preferred variables for optimal functionality.
\`\`\`

Finally, let's update the Supabase types to ensure proper typing:
