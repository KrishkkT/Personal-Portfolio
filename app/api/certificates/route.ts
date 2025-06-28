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

    const certificates = await dataStore.getAllCertificates(true)
    return NextResponse.json({ certificates }, { status: 200 })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch certificates" },
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

    if (!body.title || !body.issuer) {
      return NextResponse.json({ error: "Title and issuer are required" }, { status: 400 })
    }

    const certificate = await dataStore.addCertificate(body)
    return NextResponse.json({ certificate }, { status: 201 })
  } catch (error) {
    console.error("Error creating certificate:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create certificate" },
      { status: 500 },
    )
  }
}
