import { type NextRequest, NextResponse } from "next/server"
import { blogStore } from "@/lib/blog-store-enhanced"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    const post = blogStore.getPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const body = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    // Basic validation
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const existingPost = blogStore.getPostBySlug(slug)
    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Generate new slug if title changed
    let newSlug = slug
    if (body.title !== existingPost.title) {
      newSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      // Check if new slug conflicts with existing posts
      if (blogStore.slugExists(newSlug, existingPost.id)) {
        return NextResponse.json({ error: "A post with this title already exists" }, { status: 409 })
      }
    }

    const updatedPost = blogStore.updatePost(slug, {
      title: body.title,
      slug: newSlug,
      intro: body.intro || body.content.substring(0, 150) + "...",
      content: body.content,
      tags: body.tags || [],
      imageUrls: body.imageUrls || [],
    })

    if (!updatedPost) {
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        post: updatedPost,
        message: "Post updated successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    const existingPost = blogStore.getPostBySlug(slug)
    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const success = blogStore.deletePost(slug)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully",
        deletedPost: {
          id: existingPost.id,
          slug: existingPost.slug,
          title: existingPost.title,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
