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
  author?: string
  published: boolean
  createdAt?: string
  updatedAt?: string
  cta?: {
    text: string
    link: string
    type: "internal" | "external"
  }
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
}

export interface CreateBlogPostData {
  title: string
  slug: string
  intro: string
  content: string
  tags: string[]
  imageUrls?: string[]
  author?: string
  published?: boolean
  cta?: {
    text: string
    link: string
    type: "internal" | "external"
  }
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {}

export interface BlogApiResponse {
  success: boolean
  posts?: BlogPost[]
  post?: BlogPost
  message?: string
  error?: string
}
