import { NextResponse } from "next/server"
import { blogStore, performHealthCheck } from "@/lib/blog-store-enhanced"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const healthCheck = performHealthCheck()
    const storageInfo = blogStore.getStorageInfo()
    const allPosts = blogStore.getAllPosts()

    return NextResponse.json({
      success: true,
      health: healthCheck,
      storage: storageInfo,
      posts: {
        total: allPosts.length,
        published: allPosts.filter((p) => p.published !== false).length,
        drafts: allPosts.filter((p) => p.published === false).length,
        recent: allPosts.slice(0, 5).map((p) => ({
          title: p.title,
          slug: p.slug,
          date: p.date,
          published: p.published !== false,
        })),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
