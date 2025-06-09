import { type NextRequest, NextResponse } from "next/server"
import type { BlogPost } from "@/types/blog"

// This would be replaced with actual database queries in production
const blogPosts: BlogPost[] = [
  // Same blog posts data as in the main route
  // In production, this would be fetched from a database
]

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const post = blogPosts.find((post) => post.slug === slug && post.published)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}
