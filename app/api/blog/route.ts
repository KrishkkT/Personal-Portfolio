import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export async function GET(request: NextRequest) {
  try {
    console.log("Blog API GET request received")

    // Test connection first
    const connectionOk = await blogStoreSupabase.testConnection()
    if (!connectionOk) {
      console.error("Supabase connection failed")
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          posts: [],
          count: 0,
        },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    console.log("Fetching posts with limit:", limit)

    // Get posts with optional limit
    const limitNum = limit ? Number.parseInt(limit, 10) : undefined
    const posts = await blogStoreSupabase.getPosts(limitNum)

    console.log("API returning posts:", posts.length)

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    })
  } catch (error) {
    console.error("Error in blog API route:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        posts: [],
        count: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, intro, content, tags, imageUrls, author, published } = body

    // Validation
    if (!title || !slug || !intro || !content) {
      return NextResponse.json(
        { success: false, error: "Title, slug, intro, and content are required" },
        { status: 400 },
      )
    }

    // Check if slug already exists
    const slugExists = await blogStoreSupabase.slugExists(slug)
    if (slugExists) {
      return NextResponse.json({ success: false, error: "A post with this slug already exists" }, { status: 409 })
    }

    const newPost = await blogStoreSupabase.addPost({
      title,
      slug,
      intro,
      content,
      tags: tags || [],
      imageUrls: imageUrls || [],
      author: author || "Admin",
      published: published !== false,
    })

    if (!newPost) {
      throw new Error("Failed to create post")
    }

    return NextResponse.json({
      success: true,
      post: newPost,
      message: "Blog post created successfully",
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to create blog post" }, { status: 500 })
  }
}
