import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    console.log("Blog API GET single post:", slug)

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    const post = await blogStoreSupabase.getPost(slug)

    if (!post) {
      console.log("Blog post not found:", slug)
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    console.log("Blog API returning post:", post.id)

    return NextResponse.json(post, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Blog API [slug] GET Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const body = await request.json()
    console.log("Blog API PUT request:", slug, body)

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    const post = await blogStoreSupabase.updatePost(slug, body)

    if (!post) {
      return NextResponse.json({ error: "Failed to update blog post or post not found" }, { status: 404 })
    }

    console.log("Blog API updated post:", post.id)

    return NextResponse.json(post, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Blog API [slug] PUT Error:", error)
    return NextResponse.json(
      {
        error: "Failed to update blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    console.log("Blog API DELETE request:", slug)

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    const success = await blogStoreSupabase.deletePost(slug)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete blog post or post not found" }, { status: 404 })
    }

    console.log("Blog API deleted post:", slug)

    return NextResponse.json(
      { success: true, message: "Blog post deleted successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Blog API [slug] DELETE Error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
