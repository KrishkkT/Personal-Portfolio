import { type NextRequest, NextResponse } from "next/server"
import { getAllPosts, performHealthCheck } from "@/lib/blog-store-enhanced"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const health = searchParams.get("health")

    // Health check endpoint
    if (health === "true") {
      const healthStatus = performHealthCheck()
      return NextResponse.json(healthStatus)
    }

    // Get all posts
    const allPosts = getAllPosts()

    // Apply limit if specified
    let posts = allPosts
    if (limit) {
      const limitNum = Number.parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        posts = allPosts.slice(0, limitNum)
      }
    }

    // Transform posts to ensure all required fields are present
    const transformedPosts = posts.map((post) => ({
      id: post.id || "",
      slug: post.slug || "",
      title: post.title || "Untitled Post",
      intro: post.intro || "",
      content: post.content || "",
      date: post.date || new Date().toISOString().split("T")[0],
      readingTime: post.readingTime || 5,
      subheadings: post.subheadings || [],
      codeSnippets: post.codeSnippets || [],
      imageUrls: post.imageUrls || [],
      cta: post.cta || null,
      conclusion: post.conclusion || "",
      author: post.author || "Anonymous",
      tags: post.tags || [],
      published: post.published !== false, // Default to true if not specified
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || new Date().toISOString(),
    }))

    return NextResponse.json({
      posts: transformedPosts,
      total: transformedPosts.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in blog API route:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch blog posts",
        message: error instanceof Error ? error.message : "Unknown error",
        posts: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
