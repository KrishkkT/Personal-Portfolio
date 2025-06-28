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

    const projects = await dataStore.getAllProjects(true)
    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch projects" },
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

    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const project = await dataStore.addProject(body)
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create project" },
      { status: 500 },
    )
  }
}
