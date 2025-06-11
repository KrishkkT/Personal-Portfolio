import { NextResponse } from "next/server"
import { getServerSupabaseClient, testSupabaseConnection } from "@/lib/supabase-client"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log("🚀 Initializing blog database...")

    // Test connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      console.error("❌ Supabase connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          success: false,
          error: `Database connection failed: ${connectionTest.error}`,
        },
        { status: 503 },
      )
    }

    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to initialize Supabase client",
        },
        { status: 500 },
      )
    }

    // Check if table exists
    const { error: checkError } = await supabase.from("blog_posts").select("id").limit(1)

    if (checkError && checkError.code === "42P01") {
      // Table doesn't exist - this means we need to create it manually in Supabase
      return NextResponse.json(
        {
          success: false,
          error: "Blog posts table doesn't exist. Please run the SQL setup script in your Supabase dashboard.",
          instructions: [
            "1. Go to your Supabase dashboard",
            "2. Navigate to SQL Editor",
            "3. Run the setup script from scripts/setup-supabase.sql",
            "4. Try this initialization again",
          ],
        },
        { status: 400 },
      )
    } else if (checkError) {
      console.error("Error checking table:", checkError)
      return NextResponse.json(
        {
          success: false,
          error: `Database error: ${checkError.message}`,
        },
        { status: 500 },
      )
    }

    // Table exists, check if we have any posts
    const { data: existingPosts, error: countError } = await supabase.from("blog_posts").select("id")

    if (countError) {
      console.error("Error counting posts:", countError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to check existing posts: ${countError.message}`,
        },
        { status: 500 },
      )
    }

    if (existingPosts && existingPosts.length > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already initialized with ${existingPosts.length} posts`,
        postsCount: existingPosts.length,
      })
    }

    // Add sample post
    const samplePost = {
      id: crypto.randomUUID(),
      title: "Welcome to Your Blog",
      slug: "welcome-to-your-blog",
      intro: "This is your first blog post. You can edit or delete it from the blog management page.",
      content: `# Welcome to Your Blog

This is your first blog post! You can edit or delete this post from the blog management page.

## Getting Started

To manage your blog posts:

1. Visit the blog management page at \`/kjt-golb\`
2. Use the login credentials you've set up
3. Create, edit, or delete posts as needed

## Features

Your blog system includes:

- **Rich Text Support**: Write in Markdown format
- **Tag System**: Organize posts with tags
- **Featured Images**: Add images to make posts more engaging
- **SEO Friendly**: Automatic slug generation and meta tags

## Next Steps

1. **Customize this post** or delete it
2. **Create your first real post**
3. **Add some tags** to organize your content
4. **Upload featured images** to make posts more visual

Happy blogging! 🎉`,
      date: new Date().toISOString(),
      reading_time: 2,
      tags: ["Welcome", "Getting Started"],
      image_urls: ["/placeholder.svg?height=400&width=800&text=Welcome+Post"],
      author: null,
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabase.from("blog_posts").insert(samplePost)

    if (insertError) {
      console.error("Error inserting sample post:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to create sample post: ${insertError.message}`,
        },
        { status: 500 },
      )
    }

    console.log("✅ Blog database initialized successfully")

    return NextResponse.json({
      success: true,
      message: "Blog database initialized successfully with sample post",
      samplePost: {
        title: samplePost.title,
        slug: samplePost.slug,
      },
    })
  } catch (error) {
    console.error("❌ Error initializing blog database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to initialize database",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Test connection and return status
    const connectionTest = await testSupabaseConnection()

    return NextResponse.json({
      success: connectionTest.success,
      message: connectionTest.success ? "Database connection successful" : "Database connection failed",
      error: connectionTest.error,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
