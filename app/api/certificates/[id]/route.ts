import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { data, error } = await supabase.from("certificates").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching certificate:", error)
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      certificate: data,
    })
  } catch (error) {
    console.error("Certificate fetch error:", error)
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
    const { title, issuer, date, description, skills, verified, status, image_url, level, hours, category } = body

    const { data, error } = await supabase
      .from("certificates")
      .update({
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
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating certificate:", error)
      return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      certificate: data,
    })
  } catch (error) {
    console.error("Certificate update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { error } = await supabase.from("certificates").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting certificate:", error)
      return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Certificate deleted successfully",
    })
  } catch (error) {
    console.error("Certificate deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
