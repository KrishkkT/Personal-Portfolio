"use client"

import type { BlogPost, BlogPostSummary, CreateBlogPost, UpdateBlogPost } from "@/types/blog"
import { getSupabaseClient } from "./supabase-client"

interface HealthCheckResult {
  status: "healthy" | "warning" | "error"
  issues: string[]
  recommendations: string[]
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    averageReadingTime: number
  }
}

class BlogStoreSupabase {
  private static instance: BlogStoreSupabase
  private cachedPosts: BlogPost[] = []
  private lastFetched = 0
  private readonly CACHE_TTL = 30000 // 30 seconds cache
  private fallbackMode = false

  static getInstance(): BlogStoreSupabase {
    if (!BlogStoreSupabase.instance) {
      BlogStoreSupabase.instance = new BlogStoreSupabase()
    }
    return BlogStoreSupabase.instance
  }

  // Get the Supabase client
  private getClient() {
    const client = getSupabaseClient()
    if (!client) {
      this.fallbackMode = true
      console.warn("Supabase client not available, using fallback mode")
      return null
    }
    return client
  }

  // Get sample posts for fallback
  private getSamplePosts(): BlogPost[] {
    return [
      {
        id: "1",
        title: "Getting Started with Next.js 14",
        slug: "getting-started-nextjs-14",
        intro: "Learn the fundamentals of Next.js 14 and build modern web applications with the latest features.",
        content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements that make building React applications even better. In this comprehensive guide, we'll explore the key features and learn how to build modern web applications.

## What's New in Next.js 14

Next.js 14 introduces several groundbreaking features:

- **Turbopack**: The new Rust-based bundler for faster development
- **Server Actions**: Simplified server-side mutations
- **Partial Prerendering**: Combine static and dynamic content seamlessly
- **Enhanced App Router**: Better performance and developer experience

## Setting Up Your First Next.js 14 Project

Let's start by creating a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Features to Explore

### 1. App Router
The App Router provides a more intuitive way to structure your application with file-based routing.

### 2. Server Components
Server Components allow you to render components on the server, reducing client-side JavaScript and improving performance.

### 3. Streaming
Stream your UI to provide better user experience with faster initial page loads.

## Best Practices

1. **Use TypeScript**: Take advantage of type safety
2. **Optimize Images**: Use Next.js Image component
3. **Implement SEO**: Use metadata API for better search engine optimization
4. **Performance**: Monitor Core Web Vitals

## Conclusion

Next.js 14 represents a significant step forward in React development. With its powerful features and excellent developer experience, it's the perfect choice for modern web applications.`,
        date: new Date().toISOString(),
        readingTime: 8,
        tags: ["Next.js", "React", "Web Development", "JavaScript"],
        imageUrls: ["/placeholder.svg?height=400&width=800&text=Next.js+14"],
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Building Responsive UIs with Tailwind CSS",
        slug: "building-responsive-uis-tailwind",
        intro: "Master the art of creating beautiful, responsive user interfaces using Tailwind CSS utility classes.",
        content: `# Building Responsive UIs with Tailwind CSS

Tailwind CSS has revolutionized how we approach styling in modern web development. This guide will help you master responsive design with Tailwind's utility-first approach.

## Why Tailwind CSS?

- **Utility-First**: Build complex components from simple utilities
- **Responsive Design**: Built-in responsive design system
- **Customizable**: Highly customizable design system
- **Performance**: Purge unused CSS for optimal performance

## Getting Started

Install Tailwind CSS in your project:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Responsive Design Principles

Tailwind uses a mobile-first approach with these breakpoints:

- **sm**: 640px and up
- **md**: 768px and up  
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

## Best Practices

1. Start with mobile design
2. Use consistent spacing scale
3. Leverage Tailwind's design tokens
4. Create reusable component classes

## Conclusion

Tailwind CSS empowers developers to build beautiful, responsive interfaces quickly and efficiently.`,
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        readingTime: 6,
        tags: ["Tailwind CSS", "CSS", "Responsive Design", "UI/UX"],
        imageUrls: ["/placeholder.svg?height=400&width=800&text=Tailwind+CSS"],
        published: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        title: "TypeScript Best Practices for React",
        slug: "typescript-best-practices-react",
        intro: "Enhance your React applications with TypeScript best practices and advanced typing techniques.",
        content: `# TypeScript Best Practices for React

TypeScript brings type safety and better developer experience to React applications. Let's explore the best practices for using TypeScript effectively in React projects.

## Setting Up TypeScript with React

Create a new TypeScript React project:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

## Component Typing

### Functional Components

\`\`\`typescript
interface Props {
  title: string;
  count: number;
  onIncrement: () => void;
}

const Counter: React.FC<Props> = ({ title, count, onIncrement }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
};
\`\`\`

## Advanced Patterns

1. **Generic Components**: Create reusable components with generics
2. **Discriminated Unions**: Handle different component states
3. **Utility Types**: Leverage TypeScript's built-in utility types
4. **Custom Hooks**: Type your custom hooks properly

## Best Practices

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper event typing
- Leverage TypeScript's inference when possible

## Conclusion

TypeScript significantly improves the React development experience by catching errors early and providing excellent IDE support.`,
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        readingTime: 7,
        tags: ["TypeScript", "React", "JavaScript", "Best Practices"],
        imageUrls: ["/placeholder.svg?height=400&width=800&text=TypeScript+React"],
        published: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]
  }

  // Initialize the database schema if needed
  async initializeSchema(): Promise<boolean> {
    try {
      const supabase = this.getClient()
      if (!supabase) {
        console.log("Using fallback mode - no database initialization needed")
        return true
      }

      // Check if the table exists by trying to select from it
      const { error: checkError } = await supabase.from("blog_posts").select("id").limit(1)

      if (checkError && checkError.code === "42P01") {
        console.log("blog_posts table doesn't exist, using sample data")
        this.fallbackMode = true
        return true
      } else if (checkError) {
        console.error("Error checking table existence:", checkError)
        this.fallbackMode = true
        return true
      } else {
        console.log("Table already exists")
      }

      return true
    } catch (error) {
      console.error("Error initializing schema:", error)
      this.fallbackMode = true
      return true
    }
  }

  // Get all posts
  async getAllPosts(forceRefresh = false): Promise<BlogPost[]> {
    try {
      // Use cache if available and not expired
      const now = Date.now()
      if (!forceRefresh && this.cachedPosts.length > 0 && now - this.lastFetched < this.CACHE_TTL) {
        return [...this.cachedPosts]
      }

      const supabase = this.getClient()
      if (!supabase || this.fallbackMode) {
        // Return sample data
        const samplePosts = this.getSamplePosts()
        this.cachedPosts = samplePosts
        this.lastFetched = now
        return samplePosts
      }

      const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false })

      if (error) {
        console.error("Error fetching posts:", error)
        // Fallback to sample data
        const samplePosts = this.getSamplePosts()
        this.cachedPosts = samplePosts
        this.lastFetched = now
        return samplePosts
      }

      // Map Supabase data to BlogPost format
      const posts: BlogPost[] = (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        intro: post.intro,
        content: post.content,
        date: post.date,
        readingTime: post.reading_time || 5,
        tags: post.tags || [],
        imageUrls: post.image_urls || [],
        author: post.author || undefined,
        published: post.published !== false,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
      }))

      // Update cache
      this.cachedPosts = posts
      this.lastFetched = now

      return posts
    } catch (error) {
      console.error("Error fetching posts from Supabase:", error)
      // Return sample data as fallback
      const samplePosts = this.getSamplePosts()
      this.cachedPosts = samplePosts
      this.lastFetched = Date.now()
      return samplePosts
    }
  }

  // Get posts with limit
  async getPosts(limit?: number): Promise<BlogPostSummary[]> {
    try {
      const posts = await this.getAllPosts()
      const limitedPosts = limit ? posts.slice(0, limit) : posts

      return limitedPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        intro: post.intro,
        date: post.date,
        tags: post.tags,
        imageUrls: post.imageUrls,
        readingTime: post.readingTime,
      }))
    } catch (error) {
      console.error("Error getting posts with limit:", error)
      return []
    }
  }

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      // Check cache first
      const cachedPost = this.cachedPosts.find((post) => post.slug === slug)
      if (cachedPost) return { ...cachedPost }

      const supabase = this.getClient()
      if (!supabase || this.fallbackMode) {
        // Check sample data
        const samplePosts = this.getSamplePosts()
        return samplePosts.find((post) => post.slug === slug) || null
      }

      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned, check sample data
          const samplePosts = this.getSamplePosts()
          return samplePosts.find((post) => post.slug === slug) || null
        }
        console.error(`Error fetching post by slug ${slug}:`, error)
        // Fallback to sample data
        const samplePosts = this.getSamplePosts()
        return samplePosts.find((post) => post.slug === slug) || null
      }

      if (!data) return null

      // Map to BlogPost format
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        intro: data.intro,
        content: data.content,
        date: data.date,
        readingTime: data.reading_time || 5,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        author: data.author || undefined,
        published: data.published !== false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error(`Error fetching post by slug ${slug}:`, error)
      // Fallback to sample data
      const samplePosts = this.getSamplePosts()
      return samplePosts.find((post) => post.slug === slug) || null
    }
  }

  // Add new post
  async addPost(post: CreateBlogPost): Promise<BlogPost | null> {
    try {
      const supabase = this.getClient()
      if (!supabase || this.fallbackMode) {
        throw new Error("Database not available - cannot add posts in fallback mode")
      }

      const now = new Date().toISOString()
      const readingTime = this.calculateReadingTime(post.content)

      // Generate a unique ID
      const postId = crypto.randomUUID()

      const insertData = {
        id: postId,
        title: post.title,
        slug: post.slug,
        intro: post.intro,
        content: post.content,
        date: now,
        reading_time: readingTime,
        tags: post.tags || [],
        image_urls: post.imageUrls || [],
        author: post.author || null,
        published: post.published !== false,
        created_at: now,
        updated_at: now,
      }

      console.log("Inserting post data:", insertData)

      const { data, error } = await supabase.from("blog_posts").insert(insertData).select().single()

      if (error) {
        console.error("Error inserting post:", error)
        throw error
      }

      if (!data) {
        throw new Error("No data returned from insert operation")
      }

      // Map to BlogPost format
      const newPost: BlogPost = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        intro: data.intro,
        content: data.content,
        date: data.date,
        readingTime: data.reading_time || 5,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        author: data.author || undefined,
        published: data.published !== false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      // Update cache
      this.cachedPosts = [newPost, ...this.cachedPosts.filter((p) => p.id !== newPost.id)]

      console.log("Successfully created post:", newPost.title)
      return newPost
    } catch (error) {
      console.error("Error adding post to Supabase:", error)
      throw error
    }
  }

  // Update existing post
  async updatePost(slug: string, updates: UpdateBlogPost): Promise<BlogPost | null> {
    try {
      const supabase = this.getClient()
      if (!supabase || this.fallbackMode) {
        throw new Error("Database not available - cannot update posts in fallback mode")
      }

      // Get the existing post first
      const existingPost = await this.getPostBySlug(slug)
      if (!existingPost) {
        throw new Error(`Post with slug "${slug}" not found`)
      }

      const now = new Date().toISOString()
      const readingTime = updates.content ? this.calculateReadingTime(updates.content) : existingPost.readingTime

      const updateData = {
        title: updates.title || existingPost.title,
        slug: updates.slug || existingPost.slug,
        intro: updates.intro || existingPost.intro,
        content: updates.content || existingPost.content,
        reading_time: readingTime,
        tags: updates.tags || existingPost.tags,
        image_urls: updates.imageUrls || existingPost.imageUrls,
        author: updates.author || existingPost.author || null,
        published: updates.published !== undefined ? updates.published : existingPost.published,
        updated_at: now,
      }

      const { data, error } = await supabase.from("blog_posts").update(updateData).eq("slug", slug).select().single()

      if (error) {
        console.error("Error updating post:", error)
        throw error
      }

      if (!data) {
        throw new Error("No data returned from update operation")
      }

      // Map to BlogPost format
      const updatedPost: BlogPost = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        intro: data.intro,
        content: data.content,
        date: data.date,
        readingTime: data.reading_time || 5,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        author: data.author || undefined,
        published: data.published !== false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      // Update cache
      this.cachedPosts = this.cachedPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))

      return updatedPost
    } catch (error) {
      console.error(`Error updating post ${slug}:`, error)
      throw error
    }
  }

  // Delete post
  async deletePost(slug: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      if (!supabase || this.fallbackMode) {
        throw new Error("Database not available - cannot delete posts in fallback mode")
      }

      // Get the post first to ensure it exists
      const existingPost = await this.getPostBySlug(slug)
      if (!existingPost) {
        throw new Error(`Post with slug "${slug}" not found`)
      }

      const { error } = await supabase.from("blog_posts").delete().eq("slug", slug)

      if (error) {
        console.error("Error deleting post:", error)
        throw error
      }

      // Update cache
      this.cachedPosts = this.cachedPosts.filter((post) => post.slug !== slug)

      return true
    } catch (error) {
      console.error(`Error deleting post ${slug}:`, error)
      throw error
    }
  }

  // Check if slug exists
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      if (!supabase || this.fallbackMode) {
        // Check in sample data
        const samplePosts = this.getSamplePosts()
        return samplePosts.some((post) => post.slug === slug && post.id !== excludeId)
      }

      let query = supabase.from("blog_posts").select("id").eq("slug", slug)

      if (excludeId) {
        query = query.neq("id", excludeId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error checking slug existence:", error)
        return false
      }

      return (data || []).length > 0
    } catch (error) {
      console.error(`Error checking if slug ${slug} exists:`, error)
      return false
    }
  }

  // Calculate reading time
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }

  // Perform health check
  async performHealthCheck(): Promise<HealthCheckResult> {
    try {
      const supabase = this.getClient()
      if (!supabase || this.fallbackMode) {
        // Return health check for sample data
        const samplePosts = this.getSamplePosts()
        return {
          status: "warning",
          issues: ["Using fallback mode - database not available"],
          recommendations: ["Check Supabase configuration and environment variables"],
          stats: {
            totalPosts: samplePosts.length,
            publishedPosts: samplePosts.filter((post) => post.published).length,
            draftPosts: samplePosts.filter((post) => !post.published).length,
            averageReadingTime: Math.round(
              samplePosts.reduce((sum, post) => sum + post.readingTime, 0) / samplePosts.length,
            ),
          },
        }
      }

      // Test connection
      const { error: connectionError } = await supabase
        .from("blog_posts")
        .select("count", { count: "exact", head: true })

      if (connectionError) {
        throw connectionError
      }

      // Get posts for stats
      const posts = await this.getAllPosts(true)
      const publishedPosts = posts.filter((post) => post.published !== false)
      const draftPosts = posts.filter((post) => post.published === false)
      const averageReadingTime =
        posts.length > 0 ? posts.reduce((sum, post) => sum + post.readingTime, 0) / posts.length : 0

      const issues: string[] = []
      const recommendations: string[] = []

      // Check for potential issues
      if (posts.length === 0) {
        issues.push("No blog posts found")
        recommendations.push("Add some blog posts to get started")
      }

      if (publishedPosts.length === 0 && posts.length > 0) {
        issues.push("No published posts found")
        recommendations.push("Publish some posts to make them visible")
      }

      // Check for duplicate slugs
      const slugs = posts.map((post) => post.slug)
      const slugCounts = slugs.reduce(
        (acc, slug) => {
          acc[slug] = (acc[slug] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const duplicateSlugs = Object.entries(slugCounts)
        .filter(([_, count]) => count > 1)
        .map(([slug]) => slug)

      if (duplicateSlugs.length > 0) {
        issues.push(`Duplicate slugs found: ${duplicateSlugs.join(", ")}`)
        recommendations.push("Ensure all blog post slugs are unique")
      }

      // Determine overall status
      let status: "healthy" | "warning" | "error" = "healthy"
      if (issues.length > 0) {
        status = "error"
      } else if (recommendations.length > 0) {
        status = "warning"
      }

      return {
        status,
        issues,
        recommendations,
        stats: {
          totalPosts: posts.length,
          publishedPosts: publishedPosts.length,
          draftPosts: draftPosts.length,
          averageReadingTime: Math.round(averageReadingTime),
        },
      }
    } catch (error) {
      console.error("Error performing health check:", error)
      return {
        status: "error",
        issues: [`Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`],
        recommendations: ["Check Supabase credentials and network connection"],
        stats: {
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
          averageReadingTime: 0,
        },
      }
    }
  }

  // Initialize with sample data if empty
  async initializeSampleData(): Promise<void> {
    try {
      const posts = await this.getAllPosts(true)
      if (posts.length === 0) {
        console.log("Initializing with sample blog posts...")
        this.cachedPosts = this.getSamplePosts()
        this.lastFetched = Date.now()
      }
    } catch (error) {
      console.error("Error initializing sample data:", error)
      this.cachedPosts = this.getSamplePosts()
      this.lastFetched = Date.now()
    }
  }

  // Clear all data (for testing/reset purposes)
  async clearAllData(): Promise<boolean> {
    try {
      const supabase = this.getClient()
      if (!supabase || this.fallbackMode) {
        // Clear cache only in fallback mode
        this.cachedPosts = []
        this.lastFetched = 0
        return true
      }

      const { error } = await supabase.from("blog_posts").delete().neq("id", "00000000-0000-0000-0000-000000000000") // Delete all rows

      if (error) {
        console.error("Error clearing data:", error)
        throw error
      }

      // Clear cache
      this.cachedPosts = []
      this.lastFetched = 0

      return true
    } catch (error) {
      console.error("Error clearing data:", error)
      return false
    }
  }
}

// Export singleton instance
export const blogStoreSupabase = BlogStoreSupabase.getInstance()

// Export the performHealthCheck function as a named export
export async function performHealthCheck(): Promise<HealthCheckResult> {
  return await blogStoreSupabase.performHealthCheck()
}

// Initialize schema and sample data
export async function initializeSupabaseBlog(): Promise<void> {
  try {
    console.log("Initializing Supabase blog...")
    await blogStoreSupabase.initializeSchema()
    await blogStoreSupabase.initializeSampleData()
    console.log("Supabase blog initialized successfully")
  } catch (error) {
    console.error("Error initializing Supabase blog:", error)
    // Don't throw error, just log it
  }
}
