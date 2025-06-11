import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"
import { testSupabaseConnection } from "@/lib/supabase-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Test connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      console.error("❌ Supabase connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          error: `Database connection failed: ${connectionTest.error}`,
        },
        { status: 503 },
      )
    }

    const post = await blogStoreSupabase.getPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error(`❌ API Error fetching post ${params.slug}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch post" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Test connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      console.error("❌ Supabase connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          error: `Database connection failed: ${connectionTest.error}`,
        },
        { status: 503 },
      )
    }

    const body = await request.json()

    // Basic validation
    if (body.title && !body.title.trim()) {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 })
    }

    if (body.content && !body.content.trim()) {
      return NextResponse.json({ error: "Content cannot be empty" }, { status: 400 })
    }

    const updateData: any = {}
    if (body.title) updateData.title = body.title.trim()
    if (body.intro) updateData.intro = body.intro.trim()
    if (body.content) updateData.content = body.content.trim()
    if (body.tags) updateData.tags = Array.isArray(body.tags) ? body.tags.filter(Boolean) : []
    if (body.imageUrls) updateData.imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.filter(Boolean) : []
    if (body.published !== undefined) updateData.published = body.published

    const updatedPost = await blogStoreSupabase.updatePost(slug, updateData)

    if (!updatedPost) {
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        post: updatedPost,
        message: "Post updated successfully",
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error(`❌ API Error updating post ${params.slug}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update post" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // Test connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      console.error("❌ Supabase connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          error: `Database connection failed: ${connectionTest.error}`,
        },
        { status: 503 },
      )
    }

    const success = await blogStoreSupabase.deletePost(slug)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully",
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error(`❌ API Error deleting post ${params.slug}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete post" },
      { status: 500 },
    )
  }
}
