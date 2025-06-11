import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
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
        error: "Failed to fetch blog posts",
        posts: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const slugExists = await blogStoreSupabase.slugExists(slug)
    if (slugExists) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 409 })
    }

    const newPost = await blogStoreSupabase.addPost({
      title: body.title,
      slug,
      intro: body.intro || body.content.substring(0, 150) + "...",
      content: body.content,
      tags: body.tags || [],
      imageUrls: body.imageUrls || [],
      published: body.published !== false, // Default to published
    })

    if (!newPost) {
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
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
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 500 })
  }
}
