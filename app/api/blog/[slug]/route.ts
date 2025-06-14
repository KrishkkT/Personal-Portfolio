import { type NextRequest, NextResponse } from "next/server"

// This would normally come from your database
// For demo purposes, we'll use the same in-memory storage
const blogPosts: any[] = []

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const post = blogPosts.find((p) => p.slug === slug && p.published)

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

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
    const { slug } = params
    const body = await request.json()

    const postIndex = blogPosts.findIndex((p) => p.slug === slug)
    if (postIndex === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    // Update the post
    const updatedPost = {
      ...blogPosts[postIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // If slug is being changed, check for conflicts
    if (body.slug && body.slug !== slug) {
      if (blogPosts.some((p) => p.slug === body.slug)) {
        return NextResponse.json({ success: false, error: "A post with this slug already exists" }, { status: 409 })
      }
    }

    blogPosts[postIndex] = updatedPost

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
    const { slug } = params
    const postIndex = blogPosts.findIndex((p) => p.slug === slug)

    if (postIndex === -1) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    blogPosts.splice(postIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to delete blog post" }, { status: 500 })
  }
}
