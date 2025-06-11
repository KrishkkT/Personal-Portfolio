import type { BlogPost, CreateBlogPostRequest } from "@/types/blog"

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
  warnings: string[]
}

export interface DataIntegrityResult {
  isValid: boolean
  issues: string[]
  duplicates: string[]
  missingFields: string[]
  recommendations: string[]
}

// Comprehensive validation for blog post data
export function validateBlogPost(data: CreateBlogPostRequest): ValidationResult {
  const errors: Record<string, string[]> = {}
  const warnings: string[] = []

  // Title validation
  if (!data.title?.trim()) {
    errors.title = ["Title is required"]
  } else {
    if (data.title.length < 10) {
      warnings.push("Title is quite short - consider making it more descriptive")
    }
    if (data.title.length > 100) {
      errors.title = ["Title should be less than 100 characters"]
    }
    if (!/^[a-zA-Z0-9\s\-:.,!?'"()&]+$/.test(data.title)) {
      errors.title = ["Title contains invalid characters"]
    }
  }

  // Introduction validation
  if (!data.intro?.trim()) {
    errors.intro = ["Introduction is required"]
  } else {
    if (data.intro.length < 50) {
      warnings.push("Introduction is quite short - consider adding more detail")
    }
    if (data.intro.length > 500) {
      errors.intro = ["Introduction should be less than 500 characters"]
    }
  }

  // Content validation
  if (!data.content?.trim()) {
    errors.content = ["Content is required"]
  } else {
    if (data.content.length < 200) {
      warnings.push("Content is quite short - consider adding more detail")
    }
    if (data.content.length > 50000) {
      errors.content = ["Content is too long - consider breaking into multiple posts"]
    }
  }

  // Tags validation
  if (!data.tags || data.tags.length === 0) {
    errors.tags = ["At least one tag is required"]
  } else {
    if (data.tags.length > 10) {
      errors.tags = ["Maximum 10 tags allowed"]
    }
    const invalidTags = data.tags.filter((tag) => !/^[a-zA-Z0-9\s-]+$/.test(tag))
    if (invalidTags.length > 0) {
      errors.tags = [`Invalid tags: ${invalidTags.join(", ")}`]
    }
  }

  // Image URL validation
  if (data.imageUrls && data.imageUrls.length > 0) {
    const invalidUrls = data.imageUrls.filter((url) => {
      try {
        new URL(url)
        return false
      } catch {
        return true
      }
    })
    if (invalidUrls.length > 0) {
      errors.imageUrls = ["Invalid image URLs provided"]
    }
  }

  // CTA validation
  if (data.cta) {
    if (!data.cta.text?.trim()) {
      errors.cta = ["CTA text is required if CTA is provided"]
    }
    if (!data.cta.link?.trim()) {
      errors.cta = [...(errors.cta || []), "CTA link is required if CTA is provided"]
    }
    if (data.cta.type === "external") {
      try {
        new URL(data.cta.link)
      } catch {
        errors.cta = [...(errors.cta || []), "Invalid external URL for CTA"]
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  }
}

// Data integrity validation for the entire blog system
export function validateDataIntegrity(posts: BlogPost[]): DataIntegrityResult {
  const issues: string[] = []
  const duplicates: string[] = []
  const missingFields: string[] = []
  const recommendations: string[] = []

  // Check for duplicate slugs
  const slugMap = new Map<string, number>()
  posts.forEach((post) => {
    const count = slugMap.get(post.slug) || 0
    slugMap.set(post.slug, count + 1)
  })

  slugMap.forEach((count, slug) => {
    if (count > 1) {
      duplicates.push(`Duplicate slug: ${slug} (${count} occurrences)`)
    }
  })

  // Check for duplicate IDs
  const idMap = new Map<string, number>()
  posts.forEach((post) => {
    const count = idMap.get(post.id) || 0
    idMap.set(post.id, count + 1)
  })

  idMap.forEach((count, id) => {
    if (count > 1) {
      duplicates.push(`Duplicate ID: ${id} (${count} occurrences)`)
    }
  })

  // Check for missing required fields
  posts.forEach((post, index) => {
    const requiredFields = ["id", "slug", "title", "intro", "content", "author", "tags"]
    requiredFields.forEach((field) => {
      if (!post[field as keyof BlogPost]) {
        missingFields.push(`Post ${index + 1}: Missing ${field}`)
      }
    })

    // Check for empty arrays that should have content
    if (post.tags.length === 0) {
      missingFields.push(`Post ${index + 1}: No tags provided`)
    }
  })

  // Performance recommendations
  const largePosts = posts.filter((post) => post.content.length > 20000)
  if (largePosts.length > 0) {
    recommendations.push(`${largePosts.length} posts are very long - consider breaking them up`)
  }

  const postsWithoutImages = posts.filter((post) => post.imageUrls.length === 0)
  if (postsWithoutImages.length > 0) {
    recommendations.push(`${postsWithoutImages.length} posts don't have featured images`)
  }

  // SEO recommendations
  const postsWithShortIntros = posts.filter((post) => post.intro.length < 100)
  if (postsWithShortIntros.length > 0) {
    recommendations.push(`${postsWithShortIntros.length} posts have short introductions - consider expanding for SEO`)
  }

  return {
    isValid: duplicates.length === 0 && missingFields.length === 0,
    issues: [...duplicates, ...missingFields],
    duplicates,
    missingFields,
    recommendations,
  }
}

// SEO validation for blog posts
export function validateSEO(post: BlogPost): {
  score: number
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100

  // Title SEO check
  if (post.title.length < 30) {
    issues.push("Title is too short for optimal SEO")
    score -= 10
  }
  if (post.title.length > 60) {
    issues.push("Title is too long and may be truncated in search results")
    score -= 10
  }

  // Meta description (intro) check
  if (post.intro.length < 120) {
    issues.push("Introduction is too short for optimal meta description")
    score -= 15
  }
  if (post.intro.length > 160) {
    issues.push("Introduction is too long and may be truncated in search results")
    score -= 10
  }

  // Content length check
  if (post.content.length < 300) {
    issues.push("Content is too short - search engines prefer longer, detailed content")
    score -= 20
  }

  // Heading structure check
  const headingMatches = post.content.match(/^#{1,6}\s/gm)
  if (!headingMatches || headingMatches.length < 2) {
    issues.push("Content lacks proper heading structure")
    score -= 15
  }

  // Image alt text check (basic)
  if (post.imageUrls.length === 0) {
    recommendations.push("Consider adding a featured image for better engagement")
    score -= 5
  }

  // Internal linking opportunities
  if (!post.content.includes("[") && !post.content.includes("](")) {
    recommendations.push("Consider adding internal links to other posts")
    score -= 5
  }

  // Tags check
  if (post.tags.length < 3) {
    recommendations.push("Consider adding more tags for better categorization")
    score -= 5
  }
  if (post.tags.length > 8) {
    recommendations.push("Too many tags may dilute SEO value")
    score -= 5
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  }
}

// API endpoint validation
export function validateApiResponse(response: any, expectedShape: string): boolean {
  switch (expectedShape) {
    case "blogPost":
      return (
        response &&
        typeof response.id === "string" &&
        typeof response.slug === "string" &&
        typeof response.title === "string" &&
        typeof response.content === "string" &&
        Array.isArray(response.tags)
      )

    case "blogPostSummary":
      return (
        response &&
        typeof response.id === "string" &&
        typeof response.slug === "string" &&
        typeof response.title === "string" &&
        typeof response.intro === "string" &&
        Array.isArray(response.tags)
      )

    case "paginatedResponse":
      return (
        response &&
        Array.isArray(response.posts) &&
        response.pagination &&
        typeof response.pagination.currentPage === "number" &&
        typeof response.pagination.totalPages === "number"
      )

    default:
      return false
  }
}
