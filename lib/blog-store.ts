import type { BlogPost } from "@/types/blog"
import { triggerBlogRefresh } from "./blog-events"

// Shared in-memory storage for blog posts
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-nextjs-14",
    title: "Getting Started with Next.js 14: A Complete Guide",
    intro:
      "Discover the latest features and improvements in Next.js 14, including the new App Router, Server Components, and enhanced performance optimizations.",
    content: `Next.js 14 brings revolutionary changes to React development. In this comprehensive guide, we'll explore the new App Router, Server Components, and performance improvements that make Next.js 14 a game-changer for modern web development.

## What's New in Next.js 14

Next.js 14 introduces several groundbreaking features:

### App Router
The new App Router provides a more intuitive way to structure your applications with improved performance and developer experience.

### Server Components
Server Components allow you to render components on the server, reducing bundle size and improving initial page load times.

### Enhanced Performance
With improved bundling and optimization, Next.js 14 delivers faster build times and better runtime performance.

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

1. Use Server Components by default
2. Implement proper error boundaries
3. Optimize images with the Image component
4. Leverage the new caching strategies

## Conclusion

Next.js 14 represents a significant step forward in React development, offering improved performance, better developer experience, and more powerful features for building modern web applications.`,
    date: "2024-01-15",
    readingTime: 8,
    subheadings: [
      "What's New in Next.js 14",
      "App Router",
      "Server Components",
      "Enhanced Performance",
      "Getting Started",
      "Best Practices",
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
      "Next.js 14 is a powerful framework that continues to push the boundaries of what's possible in React development.",
    author: "Krish Thakker",
    tags: ["Next.js", "React", "Web Development", "JavaScript"],
    published: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    slug: "cybersecurity-best-practices-2024",
    title: "Cybersecurity Best Practices for Developers in 2024",
    intro:
      "Essential cybersecurity practices every developer should implement to protect applications and user data in the modern threat landscape.",
    content: `Cybersecurity has become more critical than ever in 2024. As developers, we have the responsibility to build secure applications that protect user data and maintain trust. This guide covers essential security practices every developer should implement.

## Understanding the Threat Landscape

The cybersecurity landscape in 2024 is more complex than ever, with new threats emerging daily:

### Common Attack Vectors
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Authentication bypass
- Data breaches

### Modern Security Challenges
With the rise of cloud computing, microservices, and API-first architectures, developers face new security challenges that require updated approaches and tools.

## Essential Security Practices

### 1. Input Validation and Sanitization
Always validate and sanitize user input to prevent injection attacks.

### 2. Authentication and Authorization
Implement robust authentication mechanisms and proper authorization controls.

### 3. Data Encryption
Encrypt sensitive data both in transit and at rest.

### 4. Regular Security Audits
Conduct regular security assessments and penetration testing.

## Security Tools and Frameworks

Modern developers have access to powerful security tools:

- OWASP ZAP for vulnerability scanning
- Snyk for dependency vulnerability detection
- SonarQube for code quality and security analysis

## Conclusion

Security is not an afterthought but an integral part of the development process. By implementing these best practices, developers can build more secure applications and protect user data effectively.`,
    date: "2024-01-10",
    readingTime: 12,
    subheadings: [
      "Understanding the Threat Landscape",
      "Common Attack Vectors",
      "Modern Security Challenges",
      "Essential Security Practices",
      "Security Tools and Frameworks",
    ],
    codeSnippets: [
      {
        id: "2",
        language: "javascript",
        code: "// Input validation example\nfunction validateEmail(email) {\n  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return emailRegex.test(email);\n}",
        title: "Email Validation",
        description: "Simple email validation function",
      },
    ],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=Cybersecurity+Best+Practices"],
    cta: {
      text: "Learn More About Security",
      link: "/contact",
      type: "internal",
    },
    conclusion: "Cybersecurity is an ongoing process that requires constant vigilance and adaptation to new threats.",
    author: "Krish Thakker",
    tags: ["Cybersecurity", "Security", "Best Practices", "Development"],
    published: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    slug: "cloud-computing-aws-fundamentals",
    title: "Cloud Computing with AWS: Fundamentals and Best Practices",
    intro:
      "A comprehensive guide to AWS cloud services, covering fundamental concepts, core services, and best practices for cloud architecture.",
    content: `Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform. This guide will help you understand the fundamentals of AWS and how to leverage its services effectively.

## What is Cloud Computing?

Cloud computing is the on-demand delivery of IT resources over the Internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, you can access technology services on an as-needed basis.

### Benefits of Cloud Computing
- Cost savings
- Scalability
- Flexibility
- Security
- Reliability

## Core AWS Services

### Compute Services
- **EC2**: Virtual servers in the cloud
- **Lambda**: Serverless computing
- **ECS**: Container orchestration

### Storage Services
- **S3**: Object storage
- **EBS**: Block storage
- **EFS**: File storage

### Database Services
- **RDS**: Relational databases
- **DynamoDB**: NoSQL database
- **ElastiCache**: In-memory caching

## AWS Architecture Best Practices

### 1. Design for Failure
Build resilient systems that can handle component failures gracefully.

### 2. Implement Security in Depth
Use multiple layers of security controls throughout your architecture.

### 3. Leverage Automation
Automate deployment, scaling, and management tasks.

### 4. Monitor Everything
Implement comprehensive monitoring and logging.

## Getting Started with AWS

To begin your AWS journey:

1. Create an AWS account
2. Complete the AWS Cloud Practitioner certification
3. Start with core services like EC2 and S3
4. Build a simple project to practice

## Conclusion

AWS provides a robust platform for building scalable, secure, and cost-effective cloud solutions. Understanding these fundamentals is essential for modern developers and architects.`,
    date: "2024-01-05",
    readingTime: 15,
    subheadings: [
      "What is Cloud Computing?",
      "Benefits of Cloud Computing",
      "Core AWS Services",
      "Compute Services",
      "Storage Services",
      "Database Services",
      "AWS Architecture Best Practices",
      "Getting Started with AWS",
    ],
    codeSnippets: [
      {
        id: "3",
        language: "bash",
        code: "# AWS CLI example\naws s3 cp myfile.txt s3://my-bucket/\naws ec2 describe-instances",
        title: "AWS CLI Commands",
        description: "Basic AWS CLI commands for S3 and EC2",
      },
    ],
    imageUrls: ["/placeholder.svg?height=400&width=800&text=AWS+Cloud+Architecture"],
    cta: {
      text: "Explore AWS Services",
      link: "https://aws.amazon.com",
      type: "external",
    },
    conclusion: "AWS continues to innovate and provide powerful tools for building modern cloud applications.",
    author: "Krish Thakker",
    tags: ["AWS", "Cloud Computing", "Architecture", "DevOps"],
    published: true,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
  },
]

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

// Enhanced CRUD operations with event triggers
export function getAllPosts() {
  return [...blogPosts] // Return a copy to prevent direct mutation
}

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function createPost(postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) {
  try {
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
    throw new Error("Failed to create blog post")
  }
}

export function updatePost(slug: string, postData: Partial<BlogPost>) {
  try {
    const postIndex = blogPosts.findIndex((post) => post.slug === slug)
    if (postIndex === -1) return null

    const oldPost = { ...blogPosts[postIndex] }
    const updatedPost = {
      ...blogPosts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString(),
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
    throw new Error("Failed to update blog post")
  }
}

export function deletePost(slug: string) {
  try {
    const postIndex = blogPosts.findIndex((post) => post.slug === slug)
    if (postIndex === -1) return false

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
    throw new Error("Failed to delete blog post")
  }
}

// Data integrity validation
export function validateDataIntegrity() {
  const issues: string[] = []

  // Check for duplicate slugs
  const slugs = new Set()
  blogPosts.forEach((post) => {
    if (slugs.has(post.slug)) {
      issues.push(`Duplicate slug found: ${post.slug}`)
    }
    slugs.add(post.slug)
  })

  // Check for required fields
  blogPosts.forEach((post) => {
    if (!post.id) issues.push(`Post missing ID: ${post.title}`)
    if (!post.title) issues.push(`Post missing title: ${post.id}`)
    if (!post.slug) issues.push(`Post missing slug: ${post.id}`)
    if (!post.content) issues.push(`Post missing content: ${post.id}`)
  })

  return {
    isValid: issues.length === 0,
    issues,
  }
}
