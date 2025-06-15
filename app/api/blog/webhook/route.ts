import { type NextRequest, NextResponse } from "next/server"
import type { CreateBlogPostRequest } from "@/types/blog"

// Webhook secret for n8n integration
const WEBHOOK_SECRET = process.env.BLOG_WEBHOOK_SECRET || "Kjthakker#8@6$"

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get("authorization")
    const providedSecret = authHeader?.replace("Bearer ", "")

    if (providedSecret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CreateBlogPostRequest & { webhook_source?: string } = await request.json()

    // Validate required fields
    if (!body.title || !body.intro || !body.content) {
      return NextResponse.json({ error: "Title, intro, and content are required" }, { status: 400 })
    }

    // Forward to main blog API
    const blogResponse = await fetch(`${request.nextUrl.origin}/api/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!blogResponse.ok) {
      const errorData = await blogResponse.json()
      return NextResponse.json(errorData, { status: blogResponse.status })
    }

    const newPost = await blogResponse.json()

    // Log successful webhook
    console.log(`Blog post created via webhook: ${newPost.title} (ID: ${newPost.id})`)

    return NextResponse.json(
      {
        success: true,
        message: "Blog post created successfully",
        post: newPost,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Health check endpoint for n8n
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      create_post: "/api/blog/webhook (POST)",
      get_posts: "/api/blog (GET)",
      get_post: "/api/blog/[slug] (GET)",
    },
  })
}
