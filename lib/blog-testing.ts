import type { BlogPost, CreateBlogPostRequest } from "@/types/blog"
import { validateBlogPost, validateDataIntegrity, validateSEO, validateApiResponse } from "./blog-validation"

export interface TestResult {
  passed: boolean
  message: string
  details?: any
}

export interface TestSuite {
  name: string
  tests: TestResult[]
  passed: number
  failed: number
  total: number
}

// Comprehensive test suite for blog functionality
export class BlogTestRunner {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  // Test API endpoints
  async testApiEndpoints(): Promise<TestSuite> {
    const tests: TestResult[] = []

    // Test GET /api/blog
    try {
      const response = await fetch(`${this.baseUrl}/api/blog`)
      const data = await response.json()

      tests.push({
        passed: response.ok,
        message: "GET /api/blog - Fetch blog posts",
        details: { status: response.status, hasData: !!data.posts },
      })

      if (response.ok && validateApiResponse(data, "paginatedResponse")) {
        tests.push({
          passed: true,
          message: "GET /api/blog - Response structure validation",
        })
      } else {
        tests.push({
          passed: false,
          message: "GET /api/blog - Invalid response structure",
          details: data,
        })
      }
    } catch (error) {
      tests.push({
        passed: false,
        message: "GET /api/blog - Network error",
        details: error,
      })
    }

    // Test GET /api/blog/health
    try {
      const response = await fetch(`${this.baseUrl}/api/blog/health`)
      const data = await response.json()

      tests.push({
        passed: response.ok,
        message: "GET /api/blog/health - Health check",
        details: { status: response.status, health: data.status },
      })
    } catch (error) {
      tests.push({
        passed: false,
        message: "GET /api/blog/health - Health check failed",
        details: error,
      })
    }

    // Test POST /api/blog (create post)
    const testPost: CreateBlogPostRequest = {
      title: "Test Post " + Date.now(),
      intro: "This is a test post introduction that should be long enough to pass validation requirements.",
      content:
        "This is test content for the blog post. It should be comprehensive enough to pass all validation checks and provide meaningful content for testing purposes.",
      tags: ["test", "automation"],
      published: false,
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPost),
      })
      const data = await response.json()

      tests.push({
        passed: response.ok,
        message: "POST /api/blog - Create test post",
        details: { status: response.status, created: !!data.id },
      })

      // Clean up test post if created successfully
      if (response.ok && data.slug) {
        try {
          await fetch(`${this.baseUrl}/api/blog/${data.slug}`, {
            method: "DELETE",
          })
        } catch (cleanupError) {
          console.warn("Failed to clean up test post:", cleanupError)
        }
      }
    } catch (error) {
      tests.push({
        passed: false,
        message: "POST /api/blog - Create post failed",
        details: error,
      })
    }

    const passed = tests.filter((t) => t.passed).length
    const failed = tests.filter((t) => !t.passed).length

    return {
      name: "API Endpoints",
      tests,
      passed,
      failed,
      total: tests.length,
    }
  }

  // Test data validation
  testDataValidation(): TestSuite {
    const tests: TestResult[] = []

    // Test valid post validation
    const validPost: CreateBlogPostRequest = {
      title: "Valid Test Post Title",
      intro: "This is a valid introduction that meets all the requirements for length and content quality.",
      content:
        "This is valid content that is long enough to pass validation and provides meaningful information for readers.",
      tags: ["test", "validation"],
      published: true,
    }

    const validResult = validateBlogPost(validPost)
    tests.push({
      passed: validResult.isValid,
      message: "Valid post validation",
      details: validResult,
    })

    // Test invalid post validation
    const invalidPost: CreateBlogPostRequest = {
      title: "",
      intro: "",
      content: "",
      tags: [],
      published: true,
    }

    const invalidResult = validateBlogPost(invalidPost)
    tests.push({
      passed: !invalidResult.isValid,
      message: "Invalid post validation (should fail)",
      details: invalidResult,
    })

    // Test SEO validation
    const samplePost: BlogPost = {
      id: "test-1",
      slug: "test-post",
      title: "This is a Test Post Title That Should Be Good for SEO",
      intro:
        "This is a test introduction that should be long enough for good SEO practices and provide meaningful description for search engines.",
      content:
        "# Main Heading\n\nThis is comprehensive content with proper structure.\n\n## Subheading\n\nMore content here.",
      date: "2024-01-01",
      readingTime: 5,
      subheadings: ["Main Heading", "Subheading"],
      codeSnippets: [],
      imageUrls: [],
      cta: { text: "Learn More", link: "/contact", type: "internal" },
      conclusion: "This is a test conclusion.",
      author: "Test Author",
      tags: ["test", "seo", "validation"],
      published: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    }

    const seoResult = validateSEO(samplePost)
    tests.push({
      passed: seoResult.score > 70,
      message: "SEO validation (score > 70)",
      details: seoResult,
    })

    const passed = tests.filter((t) => t.passed).length
    const failed = tests.filter((t) => !t.passed).length

    return {
      name: "Data Validation",
      tests,
      passed,
      failed,
      total: tests.length,
    }
  }

  // Test data integrity
  testDataIntegrity(posts: BlogPost[]): TestSuite {
    const tests: TestResult[] = []

    const integrityResult = validateDataIntegrity(posts)
    tests.push({
      passed: integrityResult.isValid,
      message: "Data integrity check",
      details: integrityResult,
    })

    // Test for required fields
    const postsWithMissingFields = posts.filter(
      (post) => !post.id || !post.slug || !post.title || !post.content || !post.author,
    )
    tests.push({
      passed: postsWithMissingFields.length === 0,
      message: "Required fields check",
      details: { missingFields: postsWithMissingFields.length },
    })

    // Test for duplicate slugs
    const slugs = posts.map((post) => post.slug)
    const uniqueSlugs = new Set(slugs)
    tests.push({
      passed: slugs.length === uniqueSlugs.size,
      message: "Unique slugs check",
      details: { total: slugs.length, unique: uniqueSlugs.size },
    })

    const passed = tests.filter((t) => t.passed).length
    const failed = tests.filter((t) => !t.passed).length

    return {
      name: "Data Integrity",
      tests,
      passed,
      failed,
      total: tests.length,
    }
  }

  // Run all tests
  async runAllTests(posts?: BlogPost[]): Promise<{
    suites: TestSuite[]
    totalPassed: number
    totalFailed: number
    totalTests: number
    overallPassed: boolean
  }> {
    const suites: TestSuite[] = []

    // Run API tests
    suites.push(await this.testApiEndpoints())

    // Run validation tests
    suites.push(this.testDataValidation())

    // Run integrity tests if posts provided
    if (posts) {
      suites.push(this.testDataIntegrity(posts))
    }

    const totalPassed = suites.reduce((sum, suite) => sum + suite.passed, 0)
    const totalFailed = suites.reduce((sum, suite) => sum + suite.failed, 0)
    const totalTests = suites.reduce((sum, suite) => sum + suite.total, 0)

    return {
      suites,
      totalPassed,
      totalFailed,
      totalTests,
      overallPassed: totalFailed === 0,
    }
  }
}

// Export test runner instance
export const blogTestRunner = new BlogTestRunner()

// Utility function to run tests and log results
export async function runBlogTests(posts?: BlogPost[]) {
  console.log("🧪 Running blog system tests...")

  const results = await blogTestRunner.runAllTests(posts)

  console.log("\n📊 Test Results:")
  console.log(`Total Tests: ${results.totalTests}`)
  console.log(`✅ Passed: ${results.totalPassed}`)
  console.log(`❌ Failed: ${results.totalFailed}`)
  console.log(`Overall: ${results.overallPassed ? "✅ PASSED" : "❌ FAILED"}`)

  results.suites.forEach((suite) => {
    console.log(`\n📋 ${suite.name}:`)
    suite.tests.forEach((test) => {
      console.log(`  ${test.passed ? "✅" : "❌"} ${test.message}`)
      if (!test.passed && test.details) {
        console.log(`    Details:`, test.details)
      }
    })
  })

  return results
}
