export interface BlogPost {
  id: string
  title: string
  slug: string
  intro: string
  content: string
  date: string
  readingTime: number
  tags: string[]
  imageUrls: string[]
  subheadings?: string[]
  codeSnippets?: CodeSnippet[]
  cta?: CallToAction
  conclusion?: string
  author?: string
  published?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  intro: string
  date: string
  readingTime: number
  tags: string[]
  imageUrls: string[]
  author?: string
}

export interface CreateBlogPost {
  title: string
  slug: string
  intro: string
  content: string
  tags: string[]
  imageUrls: string[]
  subheadings?: string[]
  codeSnippets?: CodeSnippet[]
  cta?: CallToAction
  conclusion?: string
  author?: string
  published?: boolean
}

export interface UpdateBlogPost {
  title?: string
  slug?: string
  intro?: string
  content?: string
  tags?: string[]
  imageUrls?: string[]
  subheadings?: string[]
  codeSnippets?: CodeSnippet[]
  cta?: CallToAction
  conclusion?: string
  author?: string
  published?: boolean
}

export interface CodeSnippet {
  id: string
  language: string
  code: string
  title?: string
  description?: string
}

export interface CallToAction {
  text: string
  link: string
  type: "internal" | "external"
}

export interface CreateBlogPostRequest {
  title: string
  intro?: string
  content: string
  tags: string[]
  imageUrls?: string[]
  subheadings?: string[]
  codeSnippets?: CodeSnippet[]
  cta?: CallToAction
  conclusion?: string
  published?: boolean
}

export interface PaginatedBlogResponse {
  posts: BlogPostSummary[]
  pagination: {
    currentPage: number
    totalPages: number
    totalPosts: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  meta: {
    timestamp: number
    dataIntegrity: boolean
    totalPublishedPosts: number
  }
}

export interface BlogApiResponse {
  success: boolean
  posts?: BlogPostSummary[]
  post?: BlogPost
  total?: number
  error?: string
  message?: string
}
