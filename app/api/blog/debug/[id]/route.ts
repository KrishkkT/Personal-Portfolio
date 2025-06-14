import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Debug: Fetching post by ID:", params.id)

    // Test connection
    const connectionOk = await blogStoreSupabase.testConnection()
    console.log("Connection status:", connectionOk)

    // Get all posts
    const allPosts = await blogStoreSupabase.getAllPosts(true)
    console.log("All posts count:", allPosts.length)

    // Try to find the specific post
    const postById = await blogStoreSupabase.getPostById(params.id)
    console.log("Post by ID:", postById ? postById.title : "Not found")

    // Get the post from all posts
    const postFromAll = allPosts.find((p) => p.id === params.id)
    console.log("Post from all posts:", postFromAll ? postFromAll.title : "Not found")

    return NextResponse.json({
      success: true,
      debug: {
        connectionOk,
        allPostsCount: allPosts.length,
        postById: postById ? { id: postById.id, title: postById.title, published: postById.published } : null,
        postFromAll: postFromAll
          ? { id: postFromAll.id, title: postFromAll.title, published: postFromAll.published }
          : null,
        allPosts: allPosts.map((p) => ({ id: p.id, title: p.title, slug: p.slug, published: p.published })),
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        debug: { error: true },
      },
      { status: 500 },
    )
  }
}
