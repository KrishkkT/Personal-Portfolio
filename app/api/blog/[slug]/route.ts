import { type NextRequest, NextResponse } from "next/server"
import type { CreateBlogPostRequest } from "@/types/blog"
import {
  getPostBySlug,
  updatePost,
  deletePost,
  generateSlug,
  calculateReadingTime,
  getAllPosts,
  BlogError,
  ValidationError,
  DuplicateError,
  NotFoundError,
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

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        resourceId: error.resourceId,
        timestamp: Date.now(),
      },
      { status: 404 },
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

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      throw new ValidationError("Slug parameter is required", { slug: ["Slug is required"] })
    }

    const post = getPostBySlug(slug)

    if (!post) {
      throw new NotFoundError("Blog post not found", slug)
    }

    // Generate SEO analysis
    const seoAnalysis = validateSEO(post)

    return NextResponse.json(
      {
        ...post,
        seoAnalysis,
        timestamp: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          "Last-Modified": new Date(post.updatedAt).toUTCString(),
          ETag: `"${post.id}-${post.updatedAt}"`,
        },
      },
    )
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch blog post")
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const body: CreateBlogPostRequest = await request.json()

    if (!slug) {
      throw new ValidationError("Slug parameter is required", { slug: ["Slug is required"] })
    }

    // Comprehensive validation
    const validation = validateBlogPost(body)
    if (!validation.isValid) {
      throw new ValidationError("Post validation failed", validation.errors)
    }

    // Find the existing post
    const existingPost = getPostBySlug(slug)
    if (!existingPost) {
      throw new NotFoundError("Blog post not found", slug)
    }

    // Check if title changed and new slug would conflict
    let newSlug = slug
    if (body.title.trim() !== existingPost.title) {
      newSlug = generateSlug(body.title)
      const allPosts = getAllPosts()
      const slugExists = allPosts.some((post) => post.slug === newSlug && post.id !== existingPost.id)
      if (slugExists) {
        throw new DuplicateError("A post with this title already exists", "slug", newSlug)
      }
    }

    // Update the post
    const updatedPost = updatePost(slug, {
      title: body.title.trim(),
      slug: newSlug,
      intro: body.intro.trim(),
      content: body.content.trim(),
      readingTime: calculateReadingTime(body.content),
      subheadings: body.subheadings || [],
      codeSnippets: body.codeSnippets || [],
      imageUrls: body.imageUrls || [],
      cta: body.cta || existingPost.cta,
      conclusion: body.conclusion?.trim() || "",
      tags: body.tags.map((tag) => tag.trim()).filter(Boolean),
      published: body.published ?? existingPost.published,
    })

    // Generate SEO analysis
    const seoAnalysis = validateSEO(updatedPost)

    return NextResponse.json(
      {
        ...updatedPost,
        message: "Blog post updated successfully",
        seoAnalysis,
        validationWarnings: validation.warnings,
        timestamp: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "Last-Modified": new Date(updatedPost.updatedAt).toUTCString(),
        },
      },
    )
  } catch (error) {
    return createErrorResponse(error, "Failed to update blog post")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      throw new ValidationError("Slug parameter is required", { slug: ["Slug is required"] })
    }

    // Find the post first to confirm it exists
    const existingPost = getPostBySlug(slug)
    if (!existingPost) {
      throw new NotFoundError("Blog post not found", slug)
    }

    const success = deletePost(slug)
    if (!success) {
      throw new BlogError("Failed to delete blog post", "DELETION_ERROR")
    }

    return NextResponse.json(
      {
        message: "Blog post deleted successfully",
        deletedPost: {
          id: existingPost.id,
          slug: existingPost.slug,
          title: existingPost.title,
        },
        timestamp: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    return createErrorResponse(error, "Failed to delete blog post")
  }
}
