import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"
import { testSupabaseConnection } from "@/lib/supabase-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      return NextResponse.json({ error: `Database connection failed: ${connectionTest.error}` }, { status: 503 })
    }

    const experience = await dataStore.getAllExperience(true)
    return NextResponse.json({ experience }, { status: 200 })
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch experience" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      return NextResponse.json({ error: `Database connection failed: ${connectionTest.error}` }, { status: 503 })
    }

    const body = await request.json()

    if (!body.title || !body.organization) {
      return NextResponse.json({ error: "Title and organization are required" }, { status: 400 })
    }

    const experience = await dataStore.addExperience(body)
    return NextResponse.json({ experience }, { status: 201 })
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create experience" },
      { status: 500 },
    )
  }
}
