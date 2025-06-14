import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const body = await request.json()
    const { page_url, referrer, session_id } = body

    // Get visitor's IP address
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Get IP info from ipify API
    let ipInfo = {}
    try {
      const ipResponse = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.IPIFY_API_KEY}&ipAddress=${ip}`,
      )
      if (ipResponse.ok) {
        ipInfo = await ipResponse.json()
      }
    } catch (error) {
      console.warn("Failed to fetch IP info:", error)
    }

    // Insert visitor data
    const { data, error } = await supabase
      .from("visitors")
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        country: ipInfo.location?.country || null,
        city: ipInfo.location?.city || null,
        region: ipInfo.location?.region || null,
        timezone: ipInfo.location?.timezone || null,
        isp: ipInfo.isp || null,
        page_url,
        referrer,
        session_id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting visitor data:", error)
      return NextResponse.json({ error: "Failed to log visitor" }, { status: 500 })
    }

    return NextResponse.json({ success: true, visitor: data })
  } catch (error) {
    console.error("Error in visitor tracking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
