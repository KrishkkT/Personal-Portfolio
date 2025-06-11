import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"
import { testSupabaseConnection } from "@/lib/supabase-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log("📖 API: GET /api/blog called")

    // Test connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      console.error("❌ Supabase connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          success: false,
          error: `Database connection failed: ${connectionTest.error}`,
          posts: [],
          total: 0,
        },
        { status: 503 },
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const limitNum = limit ? Number.parseInt(limit, 10) : undefined

    // Validate limit parameter
    if (limit && (isNaN(limitNum!) || limitNum! < 1)) {
      return NextResponse.json({ error: "Invalid limit parameter" }, { status: 400 })
    }

    const posts = await blogStoreSupabase.getPosts(limitNum)

    console.log(`📖 API: Returning ${posts.length} blog posts`)

    return NextResponse.json(
      {
        success: true,
        posts,
        total: posts.length,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("❌ API Error fetching posts:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch blog posts",
        posts: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("✏️ API: POST /api/blog called")

    // Test connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      console.error("❌ Supabase connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          success: false,
          error: `Database connection failed: ${connectionTest.error}`,
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    console.log("📝 Request body:", {
      title: body.title,
      contentLength: body.content?.length,
      tags: body.tags,
    })

    // Basic validation
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and content are required",
        },
        { status: 400 },
      )
    }

    if (body.title.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is too long (max 200 characters)",
        },
        { status: 400 },
      )
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not generate a valid slug from the title",
        },
        { status: 400 },
      )
    }

    // Check if slug already exists
    const slugExists = await blogStoreSupabase.slugExists(slug)
    if (slugExists) {
      return NextResponse.json(
        {
          success: false,
          error: "A post with this title already exists",
        },
        { status: 409 },
      )
    }

    const postData = {
      title: body.title.trim(),
      slug,
      intro: body.intro?.trim() || body.content.substring(0, 150).trim() + "...",
      content: body.content.trim(),
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls.filter(Boolean) : [],
      published: body.published !== false, // Default to published
    }

    console.log("📝 Creating post with data:", {
      title: postData.title,
      slug: postData.slug,
      tagsCount: postData.tags.length,
      contentLength: postData.content.length,
    })

    const newPost = await blogStoreSupabase.addPost(postData)

    if (!newPost) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create post - no data returned",
        },
        { status: 500 },
      )
    }

    console.log(`✅ API: Created new post - ${newPost.title}`)

    return NextResponse.json(
      {
        success: true,
        post: newPost,
        message: "Post created successfully",
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error("❌ API Error creating post:", error)

    // Provide more specific error messages
    let errorMessage = "Failed to create post"
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        errorMessage = "A post with this title already exists"
      } else if (error.message.includes("connection")) {
        errorMessage = "Database connection error"
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
