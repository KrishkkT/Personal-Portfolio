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
    const featured = searchParams.get("featured")

    let query = supabase.from("projects").select("*").order("created_at", { ascending: false })

    if (category && category !== "All") {
      query = query.eq("category", category)
    }

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      projects: data || [],
    })
  } catch (error) {
    console.error("Projects API error:", error)
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
    const { title, description, image_url, technologies, category, featured, live_url, github_url, status } = body

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title,
        description,
        image_url,
        technologies: technologies || [],
        category,
        featured: featured || false,
        live_url,
        github_url,
        status: status || "Live",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      project: data,
    })
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
