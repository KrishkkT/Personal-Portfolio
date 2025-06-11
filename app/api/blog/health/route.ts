import { NextResponse } from "next/server"
import { performHealthCheck } from "@/lib/blog-store-enhanced"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const healthCheck = performHealthCheck()

    return NextResponse.json(
      {
        ...healthCheck,
        timestamp: Date.now(),
        version: "1.0.0",
        uptime: process.uptime(),
      },
      {
        status: healthCheck.status === "error" ? 503 : 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        issues: ["Health check system failure"],
        recommendations: ["Check system logs"],
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
