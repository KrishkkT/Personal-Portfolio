import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")
    const category = searchParams.get("category")

    let query = supabase.from("certificates").select("*").order("created_at", { ascending: false })

    if (category && category !== "All") {
      query = query.eq("category", category)
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching certificates:", error)
      return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      certificates: data || [],
    })
  } catch (error) {
    console.error("Certificates API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const body = await request.json()
    const { title, issuer, date, description, skills, verified, status, image_url, level, hours, category } = body

    if (!title || !issuer || !date || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("certificates")
      .insert({
        title,
        issuer,
        date,
        description,
        skills: skills || [],
        verified: verified || false,
        status: status || "Active",
        image_url,
        level,
        hours,
        category,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating certificate:", error)
      return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      certificate: data,
    })
  } catch (error) {
    console.error("Certificate creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
