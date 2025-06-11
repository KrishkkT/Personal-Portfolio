import type { BlogPost, BlogPostSummary, CreateBlogPost, UpdateBlogPost } from "@/types/blog"
import { getSupabaseClient, getServerSupabaseClient } from "./supabase-client"
import { v4 as uuidv4 } from "uuid"

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

  // Initialize the database schema if needed
  async initializeSchema(): Promise<boolean> {
    try {
      const supabase = getServerSupabaseClient()

      // Check if the table exists
      const { error: checkError } = await supabase.from("blog_posts").select("id").limit(1)

      if (checkError) {
        console.log("Creating blog_posts table...")

        // Create the table
        const { error: createError } = await supabase.rpc("create_blog_posts_table")

        if (createError) {
          console.error("Failed to create table:", createError)
          return false
        }

        console.log("Table created successfully")
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

      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false })

      if (error) throw error

      // Map Supabase data to BlogPost format
      const posts: BlogPost[] = (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        intro: post.intro,
        content: post.content,
        date: post.date,
        readingTime: post.reading_time,
        tags: post.tags || [],
        imageUrls: post.image_urls || [],
        author: post.author || undefined,
        published: post.published,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
      }))

      // Update cache
      this.cachedPosts = posts
      this.lastFetched = now

      return posts
    } catch (error) {
      console.error("Error fetching posts from Supabase:", error)
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

      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

      if (error) {
        if (error.code === "PGRST116") return null // No rows returned
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
        readingTime: data.reading_time,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        author: data.author || undefined,
        published: data.published,
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
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      const now = new Date().toISOString()
      const readingTime = this.calculateReadingTime(post.content)
      const postId = uuidv4()

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
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
        })
        .select()
        .single()

      if (error) throw error

      if (!data) return null

      // Map to BlogPost format
      const newPost: BlogPost = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        intro: data.intro,
        content: data.content,
        date: data.date,
        readingTime: data.reading_time,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        author: data.author || undefined,
        published: data.published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      // Update cache
      this.cachedPosts = [newPost, ...this.cachedPosts]

      return newPost
    } catch (error) {
      console.error("Error adding post to Supabase:", error)
      return null
    }
  }

  // Update existing post
  async updatePost(slug: string, updates: UpdateBlogPost): Promise<BlogPost | null> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      // Get the existing post first
      const existingPost = await this.getPostBySlug(slug)
      if (!existingPost) return null

      const now = new Date().toISOString()
      const readingTime = updates.content ? this.calculateReadingTime(updates.content) : existingPost.readingTime

      const { data, error } = await supabase
        .from("blog_posts")
        .update({
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
        })
        .eq("slug", slug)
        .select()
        .single()

      if (error) throw error

      if (!data) return null

      // Map to BlogPost format
      const updatedPost: BlogPost = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        intro: data.intro,
        content: data.content,
        date: data.date,
        readingTime: data.reading_time,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        author: data.author || undefined,
        published: data.published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      // Update cache
      this.cachedPosts = this.cachedPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))

      return updatedPost
    } catch (error) {
      console.error(`Error updating post ${slug}:`, error)
      return null
    }
  }

  // Delete post
  async deletePost(slug: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      // Get the post ID first
      const existingPost = await this.getPostBySlug(slug)
      if (!existingPost) return false

      const { error } = await supabase.from("blog_posts").delete().eq("slug", slug)

      if (error) throw error

      // Update cache
      this.cachedPosts = this.cachedPosts.filter((post) => post.slug !== slug)

      return true
    } catch (error) {
      console.error(`Error deleting post ${slug}:`, error)
      return false
    }
  }

  // Check if slug exists
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      let query = supabase.from("blog_posts").select("id").eq("slug", slug)

      if (excludeId) {
        query = query.neq("id", excludeId)
      }

      const { data, error } = await query

      if (error) throw error

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
    return Math.ceil(wordCount / wordsPerMinute)
  }

  // Perform health check
  async performHealthCheck(): Promise<HealthCheckResult> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      // Test connection
      const { error: connectionError } = await supabase
        .from("blog_posts")
        .select("count()", { count: "exact", head: true })

      if (connectionError) throw connectionError

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
        issues: ["Failed to connect to Supabase database"],
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
          {
            title: "Cybersecurity Best Practices for Developers",
            slug: "cybersecurity-best-practices-developers",
            intro: "Essential security practices every developer should implement to build secure applications.",
            content: `# Cybersecurity Best Practices for Developers

Security should be a top priority in every development project. This guide covers essential cybersecurity practices that every developer should implement.

## Authentication and Authorization

### Secure Authentication
- Use strong password policies
- Implement multi-factor authentication (MFA)
- Use secure session management
- Hash passwords with bcrypt or similar

### Authorization Best Practices
- Implement role-based access control (RBAC)
- Use principle of least privilege
- Validate permissions on every request
- Implement proper session timeout

## Input Validation and Sanitization

### Client-Side Validation
Never trust client-side validation alone. Always validate on the server side.

### Server-Side Validation
- Validate all input data
- Use parameterized queries to prevent SQL injection
- Sanitize user input to prevent XSS attacks
- Implement rate limiting

## Secure Communication

### HTTPS Everywhere
- Use HTTPS for all communications
- Implement HTTP Strict Transport Security (HSTS)
- Use secure cookies with HttpOnly and Secure flags

### API Security
- Use API keys and tokens securely
- Implement proper CORS policies
- Use OAuth 2.0 for third-party integrations

## Data Protection

### Encryption
- Encrypt sensitive data at rest
- Use strong encryption algorithms
- Manage encryption keys securely
- Implement data masking for non-production environments

### Privacy
- Follow GDPR and other privacy regulations
- Implement data retention policies
- Provide user data export and deletion capabilities

## Security Headers

Implement essential security headers:
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## Regular Security Audits

- Perform regular security assessments
- Use automated security scanning tools
- Keep dependencies updated
- Monitor for security vulnerabilities

## Conclusion

Security is not a one-time implementation but an ongoing process. Stay updated with the latest security threats and best practices to keep your applications secure.`,
            tags: ["Cybersecurity", "Security", "Web Development", "Best Practices"],
            imageUrls: ["/placeholder.svg?height=400&width=800&text=Cybersecurity"],
            published: true,
          },
          {
            title: "Building Scalable Cloud Applications",
            slug: "building-scalable-cloud-applications",
            intro: "Learn how to design and build applications that scale efficiently in the cloud environment.",
            content: `# Building Scalable Cloud Applications

Cloud computing has revolutionized how we build and deploy applications. This guide explores the principles and practices for building scalable cloud applications.

## Cloud-First Architecture

### Microservices Architecture
- Break down monolithic applications into smaller services
- Use containerization with Docker
- Implement service mesh for communication
- Design for failure and resilience

### Serverless Computing
- Use Functions as a Service (FaaS)
- Implement event-driven architectures
- Optimize for cold start performance
- Manage state externally

## Scalability Patterns

### Horizontal Scaling
- Design stateless applications
- Use load balancers effectively
- Implement auto-scaling policies
- Distribute workload across multiple instances

### Vertical Scaling
- Monitor resource utilization
- Optimize application performance
- Use appropriate instance types
- Implement resource limits

## Database Scaling

### SQL Databases
- Implement read replicas
- Use database sharding
- Optimize queries and indexes
- Consider database clustering

### NoSQL Databases
- Choose the right database type
- Design for eventual consistency
- Implement proper data modeling
- Use caching strategies

## Caching Strategies

### Application-Level Caching
- Implement in-memory caching
- Use distributed caching systems
- Cache frequently accessed data
- Implement cache invalidation strategies

### CDN and Edge Caching
- Use Content Delivery Networks
- Implement edge computing
- Cache static assets
- Optimize for global distribution

## Monitoring and Observability

### Application Monitoring
- Implement comprehensive logging
- Use distributed tracing
- Monitor application metrics
- Set up alerting systems

### Infrastructure Monitoring
- Monitor cloud resources
- Track performance metrics
- Implement health checks
- Use infrastructure as code

## Cost Optimization

### Resource Management
- Right-size your resources
- Use spot instances when appropriate
- Implement auto-shutdown policies
- Monitor and optimize costs regularly

### Performance Optimization
- Optimize application code
- Use efficient algorithms and data structures
- Implement proper caching
- Minimize network calls

## Security in the Cloud

### Identity and Access Management
- Use cloud IAM services
- Implement least privilege access
- Use service accounts properly
- Audit access regularly

### Network Security
- Implement proper network segmentation
- Use VPCs and security groups
- Encrypt data in transit and at rest
- Use managed security services

## Conclusion

Building scalable cloud applications requires careful planning, proper architecture, and continuous optimization. By following these best practices, you can build applications that scale efficiently and cost-effectively in the cloud.`,
            tags: ["Cloud Computing", "Scalability", "Architecture", "DevOps"],
            imageUrls: ["/placeholder.svg?height=400&width=800&text=Cloud+Applications"],
            published: true,
          },
        ]

        // Add sample posts
        for (const post of samplePosts) {
          await this.addPost(post)
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
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      const { error } = await supabase.from("blog_posts").delete().neq("id", "0") // Delete all rows

      if (error) throw error

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
    await blogStoreSupabase.initializeSchema()
    await blogStoreSupabase.initializeSampleData()
  } catch (error) {
    console.error("Error initializing Supabase blog:", error)
  }
}
