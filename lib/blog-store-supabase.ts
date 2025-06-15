import type { BlogPost, BlogPostSummary, CreateBlogPost, UpdateBlogPost } from "@/types/blog"
import { getSupabaseClient, getServerSupabaseClient } from "./supabase-client"

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

  static getInstance(): BlogStoreSupabase {
    if (!BlogStoreSupabase.instance) {
      BlogStoreSupabase.instance = new BlogStoreSupabase()
    }
    return BlogStoreSupabase.instance
  }

  // Get the appropriate Supabase client
  private getClient() {
    // Try server client first (for API routes)
    const serverClient = getServerSupabaseClient()
    if (serverClient) return serverClient

    // Fallback to client-side client
    const clientClient = getSupabaseClient()
    if (clientClient) return clientClient

    throw new Error("No Supabase client available")
  }

  // Initialize the database schema if needed
  async initializeSchema(): Promise<boolean> {
    try {
      const supabase = this.getClient()

      // Check if the table exists by trying to select from it
      const { error: checkError } = await supabase.from("blog_posts").select("id").limit(1)

      if (checkError && checkError.code === "42P01") {
        // Table doesn't exist, create it
        console.log("Creating blog_posts table...")

        const { error: createError } = await supabase.rpc("create_blog_posts_table")

        if (createError) {
          console.error("Failed to create table via RPC, trying direct SQL:", createError)

          // Fallback: try to create table directly
          const createTableSQL = `
            CREATE TABLE IF NOT EXISTS blog_posts (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              title TEXT NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              intro TEXT NOT NULL,
              content TEXT NOT NULL,
              date TIMESTAMPTZ DEFAULT NOW(),
              reading_time INTEGER DEFAULT 5,
              tags TEXT[] DEFAULT '{}',
              image_urls TEXT[] DEFAULT '{}',
              author TEXT,
              published BOOLEAN DEFAULT true,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
            CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
            CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
          `

          const { error: directCreateError } = await supabase.rpc("exec_sql", { sql: createTableSQL })

          if (directCreateError) {
            console.error("Failed to create table directly:", directCreateError)
            return false
          }
        }

        console.log("Table created successfully")
      } else if (checkError) {
        console.error("Error checking table existence:", checkError)
        return false
      } else {
        console.log("Table already exists")
      }

      return true
    } catch (error) {
      console.error("Error initializing schema:", error)
      return false
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
      const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false })

      if (error) {
        console.error("Error fetching posts:", error)
        throw error
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
      // Return cached posts if available, otherwise empty array
      return this.cachedPosts.length > 0 ? [...this.cachedPosts] : []
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
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

      if (error) {
        if (error.code === "PGRST116") return null // No rows returned
        console.error(`Error fetching post by slug ${slug}:`, error)
        throw error
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
      return null
    }
  }

  // Add new post
  async addPost(post: CreateBlogPost): Promise<BlogPost | null> {
    try {
      const supabase = this.getClient()
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

      let query = supabase.from("blog_posts").select("id").eq("slug", slug)

      if (excludeId) {
        query = query.neq("id", excludeId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error checking slug existence:", error)
        throw error
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
        console.log("Initializing sample blog posts...")

        const samplePosts: CreateBlogPost[] = [
          {
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
            tags: ["Next.js", "React", "Web Development", "JavaScript"],
            imageUrls: ["/placeholder.svg?height=400&width=800&text=Next.js+14"],
            published: true,
          },
        ]

        // Add sample posts
        for (const post of samplePosts) {
          try {
            await this.addPost(post)
          } catch (error) {
            console.error(`Failed to add sample post "${post.title}":`, error)
          }
        }

        console.log("Sample blog posts initialized")
      }
    } catch (error) {
      console.error("Error initializing sample data:", error)
    }
  }

  // Clear all data (for testing/reset purposes)
  async clearAllData(): Promise<boolean> {
    try {
      const supabase = this.getClient()

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
    throw error
  }
}
