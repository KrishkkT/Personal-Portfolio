import { type NextRequest, NextResponse } from "next/server"
import type { BlogPost } from "@/types/blog"

// In-memory storage for demo purposes
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    slug: "getting-started-with-nextjs",
    intro: "Learn how to build modern web applications with Next.js, the React framework for production.",
    content:
      "# Getting Started with Next.js\n\nNext.js is a powerful React framework that makes it easy to build fast, SEO-friendly web applications...",
    date: new Date().toISOString(),
    readingTime: 5,
    tags: ["nextjs", "react", "web-development"],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=Next.js"],
    author: "KT",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Building Secure Web Applications",
    slug: "building-secure-web-applications",
    intro:
      "Security best practices for modern web development, including authentication, authorization, and data protection.",
    content:
      "# Building Secure Web Applications\n\nSecurity is paramount in web development. Here are the essential practices...",
    date: new Date(Date.now() - 86400000).toISOString(),
    readingTime: 8,
    tags: ["security", "web-development", "best-practices"],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=Security"],
    author: "KT",
    published: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    let posts = blogPosts.filter((post) => post.published)

    if (limit) {
      const limitNum = Number.parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        posts = posts.slice(0, limitNum)
      }
    }

    return NextResponse.json({
      success: true,
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        intro: post.intro,
        date: post.date,
        readingTime: post.readingTime,
        tags: post.tags,
        imageUrls: post.imageUrls,
      })),
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, intro, content, tags, imageUrls, author, published, cta } = body

    // Validation
    if (!title || !slug || !intro || !content || !tags) {
      return NextResponse.json(
        { success: false, error: "Title, slug, intro, content, and tags are required" },
        { status: 400 },
      )
    }

    if (intro.length < 50) {
      return NextResponse.json({ success: false, error: "Intro must be at least 50 characters long" }, { status: 400 })
    }

    if (content.length < 200) {
      return NextResponse.json(
        { success: false, error: "Content must be at least 200 characters long" },
        { status: 400 },
      )
    }

    // Check if slug already exists
    if (blogPosts.some((post) => post.slug === slug)) {
      return NextResponse.json({ success: false, error: "A post with this slug already exists" }, { status: 409 })
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title,
      slug,
      intro,
      content,
      date: new Date().toISOString(),
      readingTime,
      tags: Array.isArray(tags) ? tags : [tags],
      imageUrls: imageUrls || [],
      author: author || "Admin",
      published: published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cta,
    }

    blogPosts.unshift(newPost)

    return NextResponse.json(
      {
        success: true,
        post: newPost,
        message: "Blog post created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to create blog post" }, { status: 500 })
  }
}
