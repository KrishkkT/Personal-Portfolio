import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    console.log("Fetching blog post by slug:", params.slug)

    const post = await blogStoreSupabase.getPostBySlug(params.slug)

    if (!post) {
      console.log("Post not found:", params.slug)
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    console.log("Found post:", post.title)

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json()

    const updatedPost = await blogStoreSupabase.updatePost(params.slug, body)

    if (!updatedPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: "Blog post updated successfully",
    })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const success = await blogStoreSupabase.deletePost(params.slug)

    if (!success) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to delete blog post" }, { status: 500 })
  }
}
