import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeUnpublished = searchParams.get("includeUnpublished") === "true"
    const limit = searchParams.get("limit")

    console.log("Blog API GET request:", { includeUnpublished, limit })

    const posts = await blogStoreSupabase.getAllPosts(includeUnpublished)

    let filteredPosts = posts
    if (limit && !isNaN(Number.parseInt(limit))) {
      filteredPosts = posts.slice(0, Number.parseInt(limit))
    }

    console.log("Blog API returning posts:", filteredPosts.length)

    return NextResponse.json(filteredPosts, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Blog API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch blog posts",
        message: error instanceof Error ? error.message : "Unknown error",
        posts: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Blog API POST request:", body)

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: "Missing required fields: title, slug, content" }, { status: 400 })
    }

    const post = await blogStoreSupabase.addPost(body)

    if (!post) {
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
    }

    console.log("Blog API created post:", post.id)

    return NextResponse.json(post, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Blog API POST Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
