import type { BlogPost } from "@/types/blog"
import { triggerBlogRefresh } from "./blog-events"
import { validateDataIntegrity, validateBlogPost } from "./blog-validation"

// Enhanced error types
export class BlogError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message)
    this.name = "BlogError"
  }
}

export class ValidationError extends BlogError {
  constructor(
    message: string,
    public validationErrors: Record<string, string[]>,
  ) {
    super(message, "VALIDATION_ERROR", validationErrors)
  }
}

export class DuplicateError extends BlogError {
  constructor(
    message: string,
    public conflictingField: string,
    public conflictingValue: string,
  ) {
    super(message, "DUPLICATE_ERROR", { field: conflictingField, value: conflictingValue })
  }
}

export class NotFoundError extends BlogError {
  constructor(
    message: string,
    public resourceId: string,
  ) {
    super(message, "NOT_FOUND", { resourceId })
  }
}

// Enhanced blog posts storage with backup
let blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-nextjs-14",
    title: "Getting Started with Next.js 14: A Complete Guide",
    intro:
      "Discover the latest features and improvements in Next.js 14, including the new App Router, Server Components, and enhanced performance optimizations that make it the best React framework for production applications.",
    content: `Next.js 14 brings revolutionary changes to React development. In this comprehensive guide, we'll explore the new App Router, Server Components, and performance improvements that make Next.js 14 a game-changer for modern web development.

## What's New in Next.js 14

Next.js 14 introduces several groundbreaking features that enhance developer experience and application performance:

### App Router
The new App Router provides a more intuitive way to structure your applications with improved performance and developer experience. It leverages React Server Components by default and provides better code splitting.

### Server Components
Server Components allow you to render components on the server, reducing bundle size and improving initial page load times. This is particularly beneficial for data-heavy applications.

### Enhanced Performance
With improved bundling and optimization, Next.js 14 delivers faster build times and better runtime performance. The new compiler optimizations can reduce bundle sizes by up to 20%.

## Getting Started

To create a new Next.js 14 project, run the following command:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will set up a new Next.js 14 project with all the latest features enabled by default.

## Best Practices

When working with Next.js 14, consider these best practices:

1. **Use Server Components by default** - Only use Client Components when necessary
2. **Implement proper error boundaries** - Handle errors gracefully in your application
3. **Optimize images with the Image component** - Leverage automatic optimization
4. **Leverage the new caching strategies** - Use the built-in caching for better performance

## Advanced Features

### Streaming and Suspense
Next.js 14 provides excellent support for React's Suspense and streaming, allowing you to show loading states while data is being fetched.

### Middleware Enhancements
The middleware system has been improved with better performance and more capabilities for handling requests.

## Conclusion

Next.js 14 represents a significant step forward in React development, offering improved performance, better developer experience, and more powerful features for building modern web applications. The combination of Server Components, improved bundling, and enhanced developer tools makes it an excellent choice for any React project.`,
    date: "2024-01-15",
    readingTime: 8,
    subheadings: [
      "What's New in Next.js 14",
      "App Router",
      "Server Components",
      "Enhanced Performance",
      "Getting Started",
      "Best Practices",
      "Advanced Features",
      "Streaming and Suspense",
      "Middleware Enhancements",
    ],
    codeSnippets: [
      {
        id: "1",
        language: "bash",
        code: "npx create-next-app@latest my-app\ncd my-app\nnpm run dev",
        title: "Create New Next.js Project",
        description: "Command to create a new Next.js 14 project",
      },
    ],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=Next.js+14+Features"],
    cta: {
      text: "Learn More About Next.js",
      link: "https://nextjs.org/docs",
      type: "external",
    },
    conclusion:
      "Next.js 14 is a powerful framework that continues to push the boundaries of what's possible in React development. With its focus on performance and developer experience, it's the ideal choice for modern web applications.",
    author: "Krish Thakker",
    tags: ["Next.js", "React", "Web Development", "JavaScript", "Performance"],
    published: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    slug: "cybersecurity-best-practices-2024",
    title: "Cybersecurity Best Practices for Developers in 2024",
    intro:
      "Essential cybersecurity practices every developer should implement to protect applications and user data in the modern threat landscape. Learn about the latest security vulnerabilities and how to prevent them in your applications.",
    content: `Cybersecurity has become more critical than ever in 2024. As developers, we have the responsibility to build secure applications that protect user data and maintain trust. This comprehensive guide covers essential security practices every developer should implement.

## Understanding the Threat Landscape

The cybersecurity landscape in 2024 is more complex than ever, with new threats emerging daily and attackers becoming increasingly sophisticated:

### Common Attack Vectors
- **SQL Injection** - Still one of the most common vulnerabilities
- **Cross-Site Scripting (XSS)** - Affects client-side security
- **Cross-Site Request Forgery (CSRF)** - Exploits user trust
- **Authentication bypass** - Weak authentication mechanisms
- **Data breaches** - Unauthorized access to sensitive information
- **Supply chain attacks** - Compromised dependencies and packages

### Modern Security Challenges
With the rise of cloud computing, microservices, and API-first architectures, developers face new security challenges that require updated approaches and tools.

## Essential Security Practices

### 1. Input Validation and Sanitization
Always validate and sanitize user input to prevent injection attacks. Use parameterized queries and prepared statements for database operations.

### 2. Authentication and Authorization
Implement robust authentication mechanisms and proper authorization controls. Use multi-factor authentication where possible and follow the principle of least privilege.

### 3. Data Encryption
Encrypt sensitive data both in transit and at rest. Use strong encryption algorithms and manage encryption keys securely.

### 4. Regular Security Audits
Conduct regular security assessments and penetration testing. Keep dependencies updated and monitor for known vulnerabilities.

### 5. Secure Coding Practices
Follow secure coding guidelines and use static analysis tools to identify potential security issues early in the development process.

## Security Tools and Frameworks

Modern developers have access to powerful security tools:

- **OWASP ZAP** for vulnerability scanning
- **Snyk** for dependency vulnerability detection
- **SonarQube** for code quality and security analysis
- **Burp Suite** for web application security testing
- **Checkmarx** for static application security testing

## Implementation Guidelines

### API Security
- Use HTTPS for all communications
- Implement proper rate limiting
- Validate all inputs and outputs
- Use API keys and tokens securely

### Frontend Security
- Implement Content Security Policy (CSP)
- Use HTTPS and secure cookies
- Validate user inputs on both client and server
- Protect against XSS attacks

### Backend Security
- Use secure authentication methods
- Implement proper session management
- Protect against SQL injection
- Use secure communication protocols

## Conclusion

Security is not an afterthought but an integral part of the development process. By implementing these best practices, developers can build more secure applications and protect user data effectively. Stay updated with the latest security trends and continuously improve your security posture.`,
    date: "2024-01-10",
    readingTime: 12,
    subheadings: [
      "Understanding the Threat Landscape",
      "Common Attack Vectors",
      "Modern Security Challenges",
      "Essential Security Practices",
      "Security Tools and Frameworks",
      "Implementation Guidelines",
      "API Security",
      "Frontend Security",
      "Backend Security",
    ],
    codeSnippets: [
      {
        id: "2",
        language: "javascript",
        code: "// Input validation example\nfunction validateEmail(email) {\n  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return emailRegex.test(email);\n}\n\n// SQL injection prevention\nconst query = 'SELECT * FROM users WHERE email = ?';\ndb.query(query, [userEmail], callback);",
        title: "Security Validation Examples",
        description: "Examples of input validation and SQL injection prevention",
      },
    ],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=Cybersecurity+Best+Practices"],
    cta: {
      text: "Learn More About Security",
      link: "/contact",
      type: "internal",
    },
    conclusion:
      "Cybersecurity is an ongoing process that requires constant vigilance and adaptation to new threats. By following these best practices and staying informed about emerging threats, developers can build more secure applications that protect user data and maintain trust.",
    author: "Krish Thakker",
    tags: ["Cybersecurity", "Security", "Best Practices", "Development", "Web Security"],
    published: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    slug: "cloud-computing-aws-fundamentals",
    title: "Cloud Computing with AWS: Fundamentals and Best Practices",
    intro:
      "A comprehensive guide to AWS cloud services, covering fundamental concepts, core services, and best practices for cloud architecture. Learn how to build scalable, secure, and cost-effective solutions on AWS.",
    content: `Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform. This guide will help you understand the fundamentals of AWS and how to leverage its services effectively for building modern applications.

## What is Cloud Computing?

Cloud computing is the on-demand delivery of IT resources over the Internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, you can access technology services on an as-needed basis from a cloud provider like AWS.

### Benefits of Cloud Computing
- **Cost savings** - Reduce capital expenses and operational costs
- **Scalability** - Scale resources up or down based on demand
- **Flexibility** - Access services from anywhere with an internet connection
- **Security** - Benefit from enterprise-grade security measures
- **Reliability** - High availability and disaster recovery capabilities
- **Innovation** - Access to cutting-edge technologies and services

## Core AWS Services

### Compute Services
- **EC2 (Elastic Compute Cloud)** - Virtual servers in the cloud
- **Lambda** - Serverless computing for event-driven applications
- **ECS (Elastic Container Service)** - Container orchestration service
- **EKS (Elastic Kubernetes Service)** - Managed Kubernetes service
- **Fargate** - Serverless compute for containers

### Storage Services
- **S3 (Simple Storage Service)** - Object storage with high durability
- **EBS (Elastic Block Store)** - Block storage for EC2 instances
- **EFS (Elastic File System)** - Managed file storage
- **Glacier** - Long-term archival storage

### Database Services
- **RDS (Relational Database Service)** - Managed relational databases
- **DynamoDB** - NoSQL database service
- **ElastiCache** - In-memory caching service
- **Redshift** - Data warehouse service
- **Aurora** - High-performance relational database

### Networking Services
- **VPC (Virtual Private Cloud)** - Isolated cloud resources
- **CloudFront** - Content delivery network
- **Route 53** - DNS web service
- **API Gateway** - Managed API service

## AWS Architecture Best Practices

### 1. Design for Failure
Build resilient systems that can handle component failures gracefully. Use multiple Availability Zones and implement proper error handling.

### 2. Implement Security in Depth
Use multiple layers of security controls throughout your architecture. Follow the principle of least privilege and encrypt data in transit and at rest.

### 3. Leverage Automation
Automate deployment, scaling, and management tasks using Infrastructure as Code (IaC) tools like CloudFormation or Terraform.

### 4. Monitor Everything
Implement comprehensive monitoring and logging using CloudWatch, CloudTrail, and other monitoring services.

### 5. Optimize for Cost
Use cost optimization strategies like Reserved Instances, Spot Instances, and right-sizing resources.

## Getting Started with AWS

To begin your AWS journey:

1. **Create an AWS account** and set up billing alerts
2. **Complete the AWS Cloud Practitioner certification** to understand fundamentals
3. **Start with core services** like EC2, S3, and RDS
4. **Build a simple project** to practice and gain hands-on experience
5. **Learn Infrastructure as Code** with CloudFormation or Terraform
6. **Implement monitoring and security** best practices from the start

## Advanced Concepts

### Microservices Architecture
Learn how to build microservices using AWS services like Lambda, API Gateway, and container services.

### DevOps and CI/CD
Implement continuous integration and deployment pipelines using AWS CodePipeline, CodeBuild, and CodeDeploy.

### Data Analytics
Explore AWS analytics services like Kinesis, EMR, and QuickSight for processing and analyzing large datasets.

## Conclusion

AWS provides a robust platform for building scalable, secure, and cost-effective cloud solutions. Understanding these fundamentals is essential for modern developers and architects. The key to success with AWS is to start small, learn continuously, and gradually adopt more advanced services as your needs grow.`,
    date: "2024-01-05",
    readingTime: 15,
    subheadings: [
      "What is Cloud Computing?",
      "Benefits of Cloud Computing",
      "Core AWS Services",
      "Compute Services",
      "Storage Services",
      "Database Services",
      "Networking Services",
      "AWS Architecture Best Practices",
      "Getting Started with AWS",
      "Advanced Concepts",
      "Microservices Architecture",
      "DevOps and CI/CD",
      "Data Analytics",
    ],
    codeSnippets: [
      {
        id: "3",
        language: "bash",
        code: "# AWS CLI example\naws s3 cp myfile.txt s3://my-bucket/\naws ec2 describe-instances\n\n# Create S3 bucket\naws s3 mb s3://my-unique-bucket-name\n\n# Deploy with CloudFormation\naws cloudformation deploy --template-file template.yaml --stack-name my-stack",
        title: "AWS CLI Commands",
        description: "Basic AWS CLI commands for S3, EC2, and CloudFormation",
      },
    ],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=AWS+Cloud+Architecture"],
    cta: {
      text: "Explore AWS Services",
      link: "https://aws.amazon.com",
      type: "external",
    },
    conclusion:
      "AWS continues to innovate and provide powerful tools for building modern cloud applications. By mastering these fundamentals and following best practices, you can build scalable, secure, and cost-effective solutions that grow with your business needs.",
    author: "Krish Thakker",
    tags: ["AWS", "Cloud Computing", "Architecture", "DevOps", "Infrastructure"],
    published: true,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
  },
]

// Backup mechanism
let blogPostsBackup: BlogPost[] = []

// Create backup
function createBackup() {
  blogPostsBackup = JSON.parse(JSON.stringify(blogPosts))
}

// Restore from backup
function restoreFromBackup() {
  if (blogPostsBackup.length > 0) {
    blogPosts = JSON.parse(JSON.stringify(blogPostsBackup))
    return true
  }
  return false
}

// Initialize backup
createBackup()

// Utility functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Enhanced CRUD operations with comprehensive error handling
export function getAllPosts(): BlogPost[] {
  try {
    // Validate data integrity before returning
    const integrity = validateDataIntegrity(blogPosts)
    if (!integrity.isValid) {
      console.warn("Data integrity issues detected:", integrity.issues)
      // Attempt to restore from backup if data is corrupted
      if (restoreFromBackup()) {
        console.log("Restored from backup due to data integrity issues")
      }
    }
    return [...blogPosts] // Return a copy to prevent direct mutation
  } catch (error) {
    console.error("Error getting all posts:", error)
    throw new BlogError("Failed to retrieve blog posts", "RETRIEVAL_ERROR", error)
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    if (!slug || typeof slug !== "string") {
      throw new ValidationError("Invalid slug provided", { slug: ["Slug must be a non-empty string"] })
    }

    const post = blogPosts.find((post) => post.slug === slug)
    return post || null
  } catch (error) {
    console.error("Error getting post by slug:", error)
    if (error instanceof BlogError) throw error
    throw new BlogError("Failed to retrieve blog post", "RETRIEVAL_ERROR", error)
  }
}

export function createPost(postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): BlogPost {
  try {
    // Validate the post data
    const validation = validateBlogPost(postData as any)
    if (!validation.isValid) {
      throw new ValidationError("Post validation failed", validation.errors)
    }

    // Check for duplicate slug
    const existingPost = blogPosts.find((post) => post.slug === postData.slug)
    if (existingPost) {
      throw new DuplicateError("A post with this slug already exists", "slug", postData.slug)
    }

    // Create backup before modification
    createBackup()

    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    blogPosts.unshift(newPost)

    // Trigger real-time update
    triggerBlogRefresh("post-created", {
      post: newPost,
      totalPosts: blogPosts.length,
    })

    return newPost
  } catch (error) {
    console.error("Error creating post:", error)
    if (error instanceof BlogError) throw error
    throw new BlogError("Failed to create blog post", "CREATION_ERROR", error)
  }
}

export function updatePost(slug: string, postData: Partial<BlogPost>): BlogPost {
  try {
    if (!slug || typeof slug !== "string") {
      throw new ValidationError("Invalid slug provided", { slug: ["Slug must be a non-empty string"] })
    }

    const postIndex = blogPosts.findIndex((post) => post.slug === slug)
    if (postIndex === -1) {
      throw new NotFoundError("Blog post not found", slug)
    }

    // Create backup before modification
    createBackup()

    const oldPost = { ...blogPosts[postIndex] }
    const updatedPost = {
      ...blogPosts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString(),
    }

    // Validate the updated post
    const validation = validateBlogPost(updatedPost as any)
    if (!validation.isValid) {
      throw new ValidationError("Updated post validation failed", validation.errors)
    }

    // Check for slug conflicts if slug is being changed
    if (postData.slug && postData.slug !== oldPost.slug) {
      const conflictingPost = blogPosts.find((post) => post.slug === postData.slug && post.id !== oldPost.id)
      if (conflictingPost) {
        throw new DuplicateError("A post with this slug already exists", "slug", postData.slug)
      }
    }

    blogPosts[postIndex] = updatedPost

    // Trigger real-time update
    triggerBlogRefresh("post-updated", {
      post: updatedPost,
      oldPost,
      changes: postData,
    })

    return updatedPost
  } catch (error) {
    console.error("Error updating post:", error)
    if (error instanceof BlogError) throw error
    throw new BlogError("Failed to update blog post", "UPDATE_ERROR", error)
  }
}

export function deletePost(slug: string): boolean {
  try {
    if (!slug || typeof slug !== "string") {
      throw new ValidationError("Invalid slug provided", { slug: ["Slug must be a non-empty string"] })
    }

    const postIndex = blogPosts.findIndex((post) => post.slug === slug)
    if (postIndex === -1) {
      throw new NotFoundError("Blog post not found", slug)
    }

    // Create backup before modification
    createBackup()

    const deletedPost = blogPosts[postIndex]
    blogPosts.splice(postIndex, 1)

    // Trigger real-time update
    triggerBlogRefresh("post-deleted", {
      post: deletedPost,
      totalPosts: blogPosts.length,
    })

    return true
  } catch (error) {
    console.error("Error deleting post:", error)
    if (error instanceof BlogError) throw error
    throw new BlogError("Failed to delete blog post", "DELETION_ERROR", error)
  }
}

// Data integrity and health check functions
export function performHealthCheck(): {
  status: "healthy" | "warning" | "error"
  issues: string[]
  recommendations: string[]
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    averageReadingTime: number
  }
} {
  try {
    const integrity = validateDataIntegrity(blogPosts)
    const publishedPosts = blogPosts.filter((post) => post.published)
    const draftPosts = blogPosts.filter((post) => !post.published)
    const averageReadingTime = blogPosts.reduce((sum, post) => sum + post.readingTime, 0) / blogPosts.length || 0

    let status: "healthy" | "warning" | "error" = "healthy"
    if (integrity.issues.length > 0) {
      status = "error"
    } else if (integrity.recommendations.length > 0) {
      status = "warning"
    }

    return {
      status,
      issues: integrity.issues,
      recommendations: integrity.recommendations,
      stats: {
        totalPosts: blogPosts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        averageReadingTime: Math.round(averageReadingTime),
      },
    }
  } catch (error) {
    console.error("Error performing health check:", error)
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

// Export error classes for use in API routes
