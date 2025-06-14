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
  }
}

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  intro: string
  date: string
  tags: string[]
  imageUrls: string[]
  readingTime: number
}

export interface CreateBlogPost {
  title: string
  slug: string
  intro: string
  content: string
  tags: string[]
  imageUrls: string[]
  author?: string
  published: boolean
  cta?: {
    text: string
    link: string
  }
}

export interface UpdateBlogPost {
  title?: string
  slug?: string
  intro?: string
  content?: string
  tags?: string[]
  imageUrls?: string[]
  author?: string
  published?: boolean
  cta?: {
    text: string
    link: string
  }
}
