import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { data, error } = await supabase.from("skills").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching skill:", error)
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      skill: data,
    })
  } catch (error) {
    console.error("Skill fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const body = await request.json()
    const { name, icon_name, color, category } = body

    const { data, error } = await supabase
      .from("skills")
      .update({
        name,
        icon_name,
        color,
        category,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating skill:", error)
      return NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      skill: data,
    })
  } catch (error) {
    console.error("Skill update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { error } = await supabase.from("skills").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting skill:", error)
      return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Skill deleted successfully",
    })
  } catch (error) {
    console.error("Skill deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
