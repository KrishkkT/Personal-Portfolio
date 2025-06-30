import { type NextRequest, NextResponse } from "next/server"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const limitNum = limit ? Number.parseInt(limit, 10) : undefined

    const posts = await blogStoreSupabase.getPosts(limitNum)

    return NextResponse.json(
      {
        success: true,
        posts,
        total: posts.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        posts: [],
        error: "Failed to fetch blog posts",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "slug", "intro", "content"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const post = await blogStoreSupabase.addPost(body)

    if (!post) {
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
