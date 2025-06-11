export interface BlogPost {
  id: string
  slug: string
  title: string
  intro: string
  content: string
  date: string
  readingTime: number
  subheadings: string[]
  codeSnippets: CodeSnippet[]
  imageUrls: string[]
  cta: CallToAction
  conclusion: string
  author: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  intro: string
  date: string
  readingTime: number
  imageUrls: string[]
  author: string
  tags: string[]
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
  meta?: {
    timestamp: number
    dataIntegrity: boolean
    totalPublishedPosts: number
  }
}

export interface CreateBlogPostRequest {
  title: string
  intro: string
  content: string
  subheadings?: string[]
  codeSnippets?: CodeSnippet[]
  imageUrls?: string[]
  cta?: CallToAction
  conclusion?: string
  tags: string[]
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
