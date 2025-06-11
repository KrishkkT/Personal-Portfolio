import type { BlogPost, BlogPostSummary, CreateBlogPost, UpdateBlogPost } from "@/types/blog"

interface BlogStore {
  posts: BlogPost[]
  lastUpdated: number
  version: string
}

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

class BlogStoreManager {
  private static instance: BlogStoreManager
  private store: BlogStore = {
    posts: [],
    lastUpdated: 0,
    version: "1.0.0",
  }
  private readonly STORAGE_KEY = "kt_blog_posts"
  private readonly BACKUP_KEY = "kt_blog_posts_backup"
  private isInitialized = false

  static getInstance(): BlogStoreManager {
    if (!BlogStoreManager.instance) {
      BlogStoreManager.instance = new BlogStoreManager()
    }
    return BlogStoreManager.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage()
      this.setupAutoSave()
      this.setupStorageListener()
    }
  }

  // Load data from localStorage
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsedStore = JSON.parse(stored) as BlogStore

        // Validate the stored data structure
        if (this.validateStoreStructure(parsedStore)) {
          this.store = {
            ...parsedStore,
            version: this.store.version, // Always use current version
          }
          console.log(`✅ Loaded ${this.store.posts.length} blog posts from storage`)
        } else {
          console.warn("⚠️ Invalid store structure, initializing with sample data")
          this.initializeSampleData()
        }
      } else {
        console.log("📝 No stored posts found, initializing with sample data")
        this.initializeSampleData()
      }
    } catch (error) {
      console.error("❌ Error loading from storage:", error)
      this.loadFromBackup()
    }
    this.isInitialized = true
  }

  // Load from backup if main storage fails
  private loadFromBackup() {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY)
      if (backup) {
        const parsedStore = JSON.parse(backup) as BlogStore
        if (this.validateStoreStructure(parsedStore)) {
          this.store = parsedStore
          console.log("✅ Restored from backup")
          this.saveToStorage() // Restore main storage
          return
        }
      }
    } catch (error) {
      console.error("❌ Error loading from backup:", error)
    }

    // If backup also fails, initialize with sample data
    this.initializeSampleData()
  }

  // Validate store structure
  private validateStoreStructure(store: any): boolean {
    return (
      store &&
      typeof store === "object" &&
      Array.isArray(store.posts) &&
      typeof store.lastUpdated === "number" &&
      store.posts.every(
        (post: any) =>
          post &&
          typeof post.id === "string" &&
          typeof post.title === "string" &&
          typeof post.slug === "string" &&
          typeof post.content === "string",
      )
    )
  }

  // Save to localStorage with backup
  private saveToStorage() {
    if (typeof window === "undefined") return

    try {
      // Create backup of current data before saving new data
      const currentData = localStorage.getItem(this.STORAGE_KEY)
      if (currentData) {
        localStorage.setItem(this.BACKUP_KEY, currentData)
      }

      // Save new data
      const dataToSave = JSON.stringify(this.store)
      localStorage.setItem(this.STORAGE_KEY, dataToSave)

      console.log(`💾 Saved ${this.store.posts.length} blog posts to storage`)
    } catch (error) {
      console.error("❌ Error saving to storage:", error)
      // Try to clear some space and retry
      try {
        localStorage.removeItem(this.BACKUP_KEY)
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.store))
      } catch (retryError) {
        console.error("❌ Retry save failed:", retryError)
      }
    }
  }

  // Setup auto-save mechanism
  private setupAutoSave() {
    // Save every 30 seconds if there are changes
    setInterval(() => {
      if (this.store.lastUpdated > 0) {
        this.saveToStorage()
      }
    }, 30000)

    // Save before page unload
    window.addEventListener("beforeunload", () => {
      this.saveToStorage()
    })

    // Save on visibility change (when tab becomes hidden)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.saveToStorage()
      }
    })
  }

  // Listen for storage changes from other tabs
  private setupStorageListener() {
    window.addEventListener("storage", (e) => {
      if (e.key === this.STORAGE_KEY && e.newValue) {
        try {
          const updatedStore = JSON.parse(e.newValue) as BlogStore
          if (this.validateStoreStructure(updatedStore) && updatedStore.lastUpdated > this.store.lastUpdated) {
            this.store = updatedStore
            console.log("🔄 Updated store from another tab")
          }
        } catch (error) {
          console.error("❌ Error syncing from other tab:", error)
        }
      }
    })
  }

  // Get all posts
  getAllPosts(): BlogPost[] {
    if (!this.isInitialized && typeof window !== "undefined") {
      this.loadFromStorage()
    }
    return [...this.store.posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Get posts with limit
  getPosts(limit?: number): BlogPostSummary[] {
    const posts = this.getAllPosts()
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
  }

  // Get post by slug
  getPostBySlug(slug: string): BlogPost | null {
    if (!this.isInitialized && typeof window !== "undefined") {
      this.loadFromStorage()
    }
    return this.store.posts.find((post) => post.slug === slug) || null
  }

  // Add new post
  addPost(post: CreateBlogPost): BlogPost {
    const newPost: BlogPost = {
      ...post,
      id: this.generateId(),
      date: new Date().toISOString(),
      readingTime: this.calculateReadingTime(post.content),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.store.posts.push(newPost)
    this.store.lastUpdated = Date.now()

    // Immediate save for new posts
    this.saveToStorage()

    console.log(`✅ Added new post: ${newPost.title}`)
    return newPost
  }

  // Update existing post
  updatePost(slug: string, updates: UpdateBlogPost): BlogPost | null {
    const postIndex = this.store.posts.findIndex((post) => post.slug === slug)
    if (postIndex === -1) return null

    const updatedPost: BlogPost = {
      ...this.store.posts[postIndex],
      ...updates,
      readingTime: updates.content
        ? this.calculateReadingTime(updates.content)
        : this.store.posts[postIndex].readingTime,
      updatedAt: new Date().toISOString(),
    }

    this.store.posts[postIndex] = updatedPost
    this.store.lastUpdated = Date.now()

    // Immediate save for updates
    this.saveToStorage()

    console.log(`✅ Updated post: ${updatedPost.title}`)
    return updatedPost
  }

  // Delete post
  deletePost(slug: string): boolean {
    const postIndex = this.store.posts.findIndex((post) => post.slug === slug)
    if (postIndex === -1) return false

    const deletedPost = this.store.posts[postIndex]
    this.store.posts.splice(postIndex, 1)
    this.store.lastUpdated = Date.now()

    // Immediate save for deletions
    this.saveToStorage()

    console.log(`🗑️ Deleted post: ${deletedPost.title}`)
    return true
  }

  // Check if slug exists
  slugExists(slug: string, excludeId?: string): boolean {
    return this.store.posts.some((post) => post.slug === slug && post.id !== excludeId)
  }

  // Generate unique ID
  private generateId(): string {
    return `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Calculate reading time
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  // Perform health check
  performHealthCheck(): HealthCheckResult {
    try {
      const posts = this.getAllPosts()
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
      const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index)
      if (duplicateSlugs.length > 0) {
        issues.push(`Duplicate slugs found: ${duplicateSlugs.join(", ")}`)
        recommendations.push("Ensure all blog post slugs are unique")
      }

      // Check for posts without content
      const postsWithoutContent = posts.filter((post) => !post.content || post.content.trim().length === 0)
      if (postsWithoutContent.length > 0) {
        recommendations.push(`${postsWithoutContent.length} posts have no content`)
      }

      // Check storage health
      if (typeof window !== "undefined") {
        try {
          const testKey = "storage_test"
          localStorage.setItem(testKey, "test")
          localStorage.removeItem(testKey)
        } catch (error) {
          issues.push("Local storage is not available or full")
          recommendations.push("Clear browser storage or use a different browser")
        }
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
      return {
        status: "error",
        issues: ["Failed to perform health check"],
        recommendations: ["Check system logs for errors"],
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
  initializeSampleData() {
    if (this.store.posts.length === 0) {
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

      samplePosts.forEach((post) => this.addPost(post))
      console.log("📝 Initialized with sample blog posts")
    }
  }

  // Clear all data (for testing/reset purposes)
  clearAllData() {
    this.store = {
      posts: [],
      lastUpdated: Date.now(),
      version: this.store.version,
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.BACKUP_KEY)
    }

    console.log("🧹 Cleared all blog data")
  }

  // Export data for backup
  exportData(): string {
    return JSON.stringify(this.store, null, 2)
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const importedStore = JSON.parse(jsonData) as BlogStore
      if (this.validateStoreStructure(importedStore)) {
        this.store = {
          ...importedStore,
          lastUpdated: Date.now(),
          version: this.store.version,
        }
        this.saveToStorage()
        console.log(`✅ Imported ${this.store.posts.length} blog posts`)
        return true
      }
      return false
    } catch (error) {
      console.error("❌ Error importing data:", error)
      return false
    }
  }

  // Get storage info
  getStorageInfo() {
    if (typeof window === "undefined") {
      return { available: false, used: 0, total: 0 }
    }

    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      const backup = localStorage.getItem(this.BACKUP_KEY)
      const used = (data?.length || 0) + (backup?.length || 0)

      return {
        available: true,
        used,
        total: 5 * 1024 * 1024, // 5MB typical localStorage limit
        posts: this.store.posts.length,
        lastUpdated: new Date(this.store.lastUpdated).toLocaleString(),
      }
    } catch (error) {
      return { available: false, used: 0, total: 0 }
    }
  }
}

// Export singleton instance
export const blogStore = BlogStoreManager.getInstance()

// Export the performHealthCheck function as a named export
export function performHealthCheck(): HealthCheckResult {
  return blogStore.performHealthCheck()
}

// Initialize sample data only if no data exists
if (typeof window !== "undefined") {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    if (blogStore.getAllPosts().length === 0) {
      blogStore.initializeSampleData()
    }
  }, 100)
}
