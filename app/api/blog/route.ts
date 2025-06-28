import { type NextRequest, NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log("📖 API: GET /api/blog called")

    // Test connection first
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      console.error("❌ Supabase connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          success: false,
          error: `Database connection failed: ${connectionTest.error}`,
          posts: [],
          total: 0,
        },
        { status: 503 },
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit")

    // Return empty array for now since blog functionality is optional
    const response = {
      success: true,
      posts: [],
      total: 0,
      message: "Blog functionality is currently being set up",
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Blog API error:", error)
    return NextResponse.json(
      {
        success: false,
        posts: [],
        error: "Failed to fetch blog posts",
      },
      {
        status: 200, // Return 200 to avoid errors in frontend
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        success: false,
        error: "Blog creation is not yet implemented",
      },
      { status: 501 },
    )
  } catch (error) {
    console.error("Blog creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
