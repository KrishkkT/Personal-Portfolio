import { type NextRequest, NextResponse } from "next/server"
import type { CreateBlogPostRequest, PaginatedBlogResponse, BlogPostSummary } from "@/types/blog"
import {
  getAllPosts,
  createPost,
  generateSlug,
  calculateReadingTime,
  performHealthCheck,
  BlogError,
  ValidationError,
  DuplicateError,
} from "@/lib/blog-store-enhanced"
import { validateBlogPost, validateSEO } from "@/lib/blog-validation"

export const dynamic = "force-dynamic"

// Enhanced error response helper
function createErrorResponse(error: any, defaultMessage: string, defaultStatus = 500) {
  console.error("API Error:", error)

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        validationErrors: error.validationErrors,
        timestamp: Date.now(),
      },
      { status: 400 },
    )
  }

  if (error instanceof DuplicateError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        conflictingField: error.conflictingField,
        conflictingValue: error.conflictingValue,
        timestamp: Date.now(),
      },
      { status: 409 },
    )
  }

  if (error instanceof BlogError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: Date.now(),
      },
      { status: defaultStatus },
    )
  }

  return NextResponse.json(
    {
      error: defaultMessage,
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: Date.now(),
    },
    { status: defaultStatus },
  )
}

export async function GET(request: NextRequest) {
  try {
    // Perform health check
    const healthCheck = performHealthCheck()
    if (healthCheck.status === "error") {
      console.warn("Health check failed:", healthCheck.issues)
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
    const limit = Math.max(1, Math.min(50, Number.parseInt(searchParams.get("limit") || "6"))) // Max 50 items per page
    const tag = searchParams.get("tag")?.trim()
    const search = searchParams.get("search")?.trim()
    const includeHealth = searchParams.get("includeHealth") === "true"

    let filteredPosts = getAllPosts().filter((post) => post.published)

    // Filter by tag
    if (tag) {
      filteredPosts = filteredPosts.filter((post) => post.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())))
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.intro.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          post.author.toLowerCase().includes(searchLower),
      )
    }

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    // Convert to summary format with SEO scores
    const postSummaries: BlogPostSummary[] = paginatedPosts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      intro: post.intro,
      date: post.date,
      readingTime: post.readingTime,
      imageUrls: post.imageUrls,
      author: post.author,
      tags: post.tags,
    }))

    const totalPages = Math.ceil(filteredPosts.length / limit)

    const response: PaginatedBlogResponse = {
      posts: postSummaries,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: filteredPosts.length,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      meta: {
        timestamp: Date.now(),
        dataIntegrity: healthCheck.status !== "error",
        totalPublishedPosts: filteredPosts.length,
        ...(includeHealth && { healthCheck }),
      },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Total-Count": filteredPosts.length.toString(),
        "X-Page": page.toString(),
        "X-Per-Page": limit.toString(),
      },
    })
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch blog posts")
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBlogPostRequest = await request.json()

    // Comprehensive validation
    const validation = validateBlogPost(body)
    if (!validation.isValid) {
      throw new ValidationError("Post validation failed", validation.errors)
    }

    // Generate slug and calculate reading time
    const slug = generateSlug(body.title)
    const readingTime = calculateReadingTime(body.content)

    // Create new blog post
    const newPost = createPost({
      slug,
      title: body.title.trim(),
      intro: body.intro.trim(),
      content: body.content.trim(),
      date: new Date().toISOString().split("T")[0],
      readingTime,
      subheadings: body.subheadings || [],
      codeSnippets: body.codeSnippets || [],
      imageUrls: body.imageUrls || [],
      cta: body.cta || { text: "Learn More", link: "/contact", type: "internal" },
      conclusion: body.conclusion?.trim() || "",
      author: "Krish Thakker",
      tags: body.tags.map((tag) => tag.trim()).filter(Boolean),
      published: body.published ?? true,
    })

    // Generate SEO analysis
    const seoAnalysis = validateSEO(newPost)

    return NextResponse.json(
      {
        ...newPost,
        message: "Blog post created successfully",
        seoAnalysis,
        validationWarnings: validation.warnings,
        timestamp: Date.now(),
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
          Location: `/api/blog/${newPost.slug}`,
        },
      },
    )
  } catch (error) {
    return createErrorResponse(error, "Failed to create blog post")
  }
}
