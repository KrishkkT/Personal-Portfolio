# n8n Blog Integration Guide

This guide explains how to integrate the blog system with n8n for automated content creation and management.

## API Endpoints

### 1. Create Blog Post (Webhook)
- **URL**: `https://kjt.vercel.app/api/blog/webhook`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_WEBHOOK_SECRET`

### 2. Get Blog Posts
- **URL**: `https://kjt.vercel.app/api/blog`
- **Method**: GET
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Posts per page (default: 6)
  - `search`: Search term
  - `tag`: Filter by tag

### 3. Get Single Blog Post
- **URL**: `https://kjt.vercel.app/api/blog/[slug]`
- **Method**: GET

## n8n Workflow Setup

### Step 1: Create Webhook Node
1. Add a Webhook node to your workflow
2. Set the webhook URL to your endpoint
3. Configure authentication headers

### Step 2: Process Content
1. Add nodes to process AI-generated content
2. Format the content according to the blog post schema
3. Extract metadata like tags, reading time, etc.

### Step 3: Send to Blog API
1. Add an HTTP Request node
2. Configure the request:
   - **URL**: `https://kjt.vercel.app/api/blog/webhook`
   - **Method**: POST
   - **Headers**: 
     \`\`\`json
     {
       "Content-Type": "application/json",
       "Authorization": "Bearer {{ $env.BLOG_WEBHOOK_SECRET }}"
     }
     \`\`\`
   - **Body**: JSON with blog post data

### Step 4: Handle Response
1. Add error handling nodes
2. Log successful posts
3. Send notifications on completion

## Blog Post Schema

\`\`\`json
{
  "title": "string (required)",
  "intro": "string (required)",
  "content": "string (required)",
  "subheadings": ["string"],
  "codeSnippets": [
    {
      "language": "string",
      "code": "string",
      "title": "string (optional)",
      "description": "string (optional)"
    }
  ],
  "imageUrls": ["string"],
  "cta": {
    "text": "string",
    "link": "string",
    "type": "internal|external"
  },
  "conclusion": "string",
  "tags": ["string"],
  "published": "boolean (default: true)"
}
\`\`\`

## Environment Variables

Add these to your environment:

\`\`\`env
BLOG_WEBHOOK_SECRET=your-secure-webhook-secret
NEXT_PUBLIC_BASE_URL=https://kjt.vercel.app
\`\`\`

## Example n8n Workflow

1. **Trigger**: Schedule or manual trigger
2. **AI Content Generation**: Use OpenAI or similar
3. **Content Processing**: Format and structure content
4. **Image Generation**: Generate featured images (optional)
5. **Blog Creation**: Send to webhook endpoint
6. **Notification**: Send success/failure notifications

## Security Considerations

- Always use HTTPS for webhook endpoints
- Implement rate limiting for the webhook
- Validate all input data
- Use strong webhook secrets
- Log all webhook activities for monitoring
\`\`\`

Now let's add the environment variable to the layout for the webhook secret:
