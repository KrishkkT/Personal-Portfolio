import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    const post = await blogStoreSupabase.getPostBySlug(slug)

    if (!post) {
      console.log(`❌ API: Post not found - ${slug}`)
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    console.log(`📖 API: Returning post - ${post.title}`)

    return NextResponse.json(post, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("❌ API Error fetching post:", error)
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

    const existingPost = await blogStoreSupabase.getPostBySlug(slug)
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
      const slugExists = await blogStoreSupabase.slugExists(newSlug, existingPost.id)
      if (slugExists) {
        return NextResponse.json({ error: "A post with this title already exists" }, { status: 409 })
      }
    }

    const updatedPost = await blogStoreSupabase.updatePost(slug, {
      title: body.title,
      slug: newSlug,
      intro: body.intro || body.content.substring(0, 150) + "...",
      content: body.content,
      tags: body.tags || [],
      imageUrls: body.imageUrls || [],
      published: body.published !== false,
    })

    if (!updatedPost) {
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }

    console.log(`✅ API: Updated post - ${updatedPost.title}`)

    return NextResponse.json(
      {
        success: true,
        post: updatedPost,
        message: "Post updated successfully",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error("❌ API Error updating post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    const existingPost = await blogStoreSupabase.getPostBySlug(slug)
    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const success = await blogStoreSupabase.deletePost(slug)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }

    console.log(`🗑️ API: Deleted post - ${existingPost.title}`)

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
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    console.error("❌ API Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
