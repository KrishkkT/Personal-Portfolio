import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = supabase.from("skills").select("*").order("name", { ascending: true })

    if (category && category !== "All") {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching skills:", error)
      return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      skills: data || [],
    })
  } catch (error) {
    console.error("Skills API error:", error)
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
    const { name, icon_name, color, category } = body

    if (!name || !icon_name || !color || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({
        name,
        icon_name,
        color,
        category,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating skill:", error)
      return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      skill: data,
    })
  } catch (error) {
    console.error("Skill creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
