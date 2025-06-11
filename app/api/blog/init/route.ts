import { NextResponse } from "next/server"
import { initializeSupabaseBlog } from "@/lib/blog-store-supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await initializeSupabaseBlog()

    return NextResponse.json(
      {
        success: true,
        message: "Supabase blog initialized successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Failed to initialize Supabase blog:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize Supabase blog",
      },
      { status: 500 },
    )
  }
}
