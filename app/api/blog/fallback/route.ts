import { NextResponse } from "next/server"

// Fallback blog posts when database is unavailable
const fallbackPosts = [
  {
    id: "fallback-1",
    title: "Welcome to My Blog",
    slug: "welcome-to-my-blog",
    intro: "This is a sample blog post to demonstrate the blog functionality while the database is being set up.",
    date: new Date().toISOString(),
    readingTime: 2,
    tags: ["welcome", "blog"],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=Welcome"],
  },
  {
    id: "fallback-2",
    title: "Getting Started",
    slug: "getting-started",
    intro: "Learn how to use this blog system and create your own posts.",
    date: new Date(Date.now() - 86400000).toISOString(),
    readingTime: 3,
    tags: ["tutorial", "getting-started"],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=Getting+Started"],
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    posts: fallbackPosts,
    count: fallbackPosts.length,
    fallback: true,
  })
}
