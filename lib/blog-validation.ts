import type { BlogPost } from "@/types/blog"

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
  warnings: string[]
}

export interface SEOAnalysis {
  score: number
  issues: string[]
  recommendations: string[]
}

export interface DataIntegrityResult {
  isValid: boolean
  issues: string[]
  recommendations: string[]
}

export function validateBlogPost(post: Partial<BlogPost>): ValidationResult {
  const errors: Record<string, string[]> = {}
  const warnings: string[] = []

  // Required fields validation
  if (!post.title?.trim()) {
    errors.title = ["Title is required"]
  } else if (post.title.length < 10) {
    warnings.push("Title is quite short, consider making it more descriptive")
  } else if (post.title.length > 100) {
    errors.title = ["Title is too long (max 100 characters)"]
  }

  if (!post.intro?.trim()) {
    errors.intro = ["Introduction is required"]
  } else if (post.intro.length < 50) {
    warnings.push("Introduction is quite short, consider adding more detail")
  } else if (post.intro.length > 500) {
    errors.intro = ["Introduction is too long (max 500 characters)"]
  }

  if (!post.content?.trim()) {
    errors.content = ["Content is required"]
  } else if (post.content.length < 100) {
    warnings.push("Content is quite short, consider adding more detail")
  }

  if (!post.tags || post.tags.length === 0) {
    errors.tags = ["At least one tag is required"]
  } else if (post.tags.length > 10) {
    errors.tags = ["Too many tags (max 10)"]
  }

  // Optional field validation
  if (post.author && post.author.length > 100) {
    errors.author = ["Author name is too long (max 100 characters)"]
  }

  if (post.conclusion && post.conclusion.length > 1000) {
    errors.conclusion = ["Conclusion is too long (max 1000 characters)"]
  }

  // URL validation for images
  if (post.imageUrls && post.imageUrls.length > 0) {
    const invalidUrls = post.imageUrls.filter((url) => {
      try {
        new URL(url)
        return false
      } catch {
        return true
      }
    })
    if (invalidUrls.length > 0) {
      errors.imageUrls = [`Invalid URLs: ${invalidUrls.join(", ")}`]
    }
  }

  // CTA validation
  if (post.cta) {
    if (!post.cta.text?.trim()) {
      errors.cta = ["CTA text is required"]
    }
    if (!post.cta.link?.trim()) {
      errors.cta = [...(errors.cta || []), "CTA link is required"]
    }
    if (post.cta.type && !["internal", "external"].includes(post.cta.type)) {
      errors.cta = [...(errors.cta || []), "CTA type must be 'internal' or 'external'"]
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  }
}

export function validateSEO(post: BlogPost): SEOAnalysis {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100

  // Title SEO check
  if (post.title.length < 30) {
    issues.push("Title is too short for optimal SEO")
    score -= 10
  }
  if (post.title.length > 60) {
    issues.push("Title is too long for search results")
    score -= 10
  }

  // Meta description (intro) check
  if (post.intro.length < 120) {
    issues.push("Introduction is too short for meta description")
    score -= 10
  }
  if (post.intro.length > 160) {
    issues.push("Introduction is too long for meta description")
    score -= 10
  }

  // Content length check
  if (post.content.length < 300) {
    issues.push("Content is too short for good SEO ranking")
    score -= 15
  }

  // Heading structure check
  const headingCount = (post.content.match(/^#{1,6}\s/gm) || []).length
  if (headingCount === 0) {
    issues.push("No headings found in content")
    score -= 10
  }

  // Image alt text check (basic)
  if (post.imageUrls.length > 0) {
    recommendations.push("Ensure all images have descriptive alt text")
  }

  // Tags check
  if (post.tags.length < 3) {
    recommendations.push("Consider adding more tags for better categorization")
  }

  // Reading time check
  if (post.readingTime < 2) {
    recommendations.push("Consider expanding content for better engagement")
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  }
}

export function validateDataIntegrity(posts: BlogPost[]): DataIntegrityResult {
  const issues: string[] = []
  const recommendations: string[] = []

  // Check for duplicate slugs
  const slugs = posts.map((post) => post.slug)
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index)
  if (duplicateSlugs.length > 0) {
    issues.push(`Duplicate slugs found: ${duplicateSlugs.join(", ")}`)
  }

  // Check for duplicate IDs
  const ids = posts.map((post) => post.id)
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicateIds.length > 0) {
    issues.push(`Duplicate IDs found: ${duplicateIds.join(", ")}`)
  }

  // Check for missing required fields
  posts.forEach((post, index) => {
    if (!post.title) issues.push(`Post at index ${index} missing title`)
    if (!post.content) issues.push(`Post at index ${index} missing content`)
    if (!post.slug) issues.push(`Post at index ${index} missing slug`)
    if (!post.id) issues.push(`Post at index ${index} missing ID`)
  })

  // Check for invalid dates
  posts.forEach((post, index) => {
    if (post.date && isNaN(new Date(post.date).getTime())) {
      issues.push(`Post at index ${index} has invalid date: ${post.date}`)
    }
  })

  // Performance recommendations
  if (posts.length > 100) {
    recommendations.push("Consider implementing pagination for better performance")
  }

  const averageContentLength = posts.reduce((sum, post) => sum + post.content.length, 0) / posts.length
  if (averageContentLength < 500) {
    recommendations.push("Consider expanding content length for better SEO")
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  }
}
