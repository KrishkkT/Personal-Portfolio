import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const body = await request.json()
    const { blog_slug, blog_title, event_type, event_data, visitor_id } = body

    // Get visitor's IP address
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Insert blog analytics data
    const { data, error } = await supabase
      .from("blog_analytics")
      .insert({
        blog_slug,
        blog_title,
        event_type,
        event_data,
        visitor_id,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting blog analytics:", error)
      return NextResponse.json({ error: "Failed to log blog event" }, { status: 500 })
    }

    return NextResponse.json({ success: true, analytics: data })
  } catch (error) {
    console.error("Error in blog analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
