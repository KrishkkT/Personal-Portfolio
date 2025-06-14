import { type NextRequest, NextResponse } from "next/server"
import { getServerSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Get date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Total visitors
    const { count: totalVisitors } = await supabase
      .from("visitors")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())

    // Total page views
    const { count: totalPageViews } = await supabase
      .from("visitors")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())

    // Blog analytics
    const { count: totalBlogViews } = await supabase
      .from("blog_analytics")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "view")
      .gte("created_at", startDate.toISOString())

    const { count: totalBlogReads } = await supabase
      .from("blog_analytics")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "read")
      .gte("created_at", startDate.toISOString())

    const { count: totalLinkClicks } = await supabase
      .from("blog_analytics")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "click")
      .gte("created_at", startDate.toISOString())

    // Top blog posts
    const { data: topBlogPosts } = await supabase
      .from("blog_analytics")
      .select("blog_slug, blog_title, event_type")
      .gte("created_at", startDate.toISOString())

    // Process top blog posts
    const blogStats = {}
    topBlogPosts?.forEach((item) => {
      if (!blogStats[item.blog_slug]) {
        blogStats[item.blog_slug] = {
          slug: item.blog_slug,
          title: item.blog_title,
          views: 0,
          reads: 0,
          clicks: 0,
        }
      }
      blogStats[item.blog_slug][
        item.event_type === "view" ? "views" : item.event_type === "read" ? "reads" : "clicks"
      ]++
    })

    const topBlogPostsArray = Object.values(blogStats)
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 10)

    // Visitors by country
    const { data: visitorsByCountry } = await supabase
      .from("visitors")
      .select("country")
      .gte("created_at", startDate.toISOString())
      .not("country", "is", null)

    const countryStats = {}
    visitorsByCountry?.forEach((visitor) => {
      countryStats[visitor.country] = (countryStats[visitor.country] || 0) + 1
    })

    const visitorsByCountryArray = Object.entries(countryStats)
      .map(([country, count]) => ({ country, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)

    // Recent visitors
    const { data: recentVisitors } = await supabase
      .from("visitors")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    // Daily stats for the last 30 days
    const { data: dailyVisitors } = await supabase
      .from("visitors")
      .select("created_at")
      .gte("created_at", startDate.toISOString())

    const { data: dailyBlogViews } = await supabase
      .from("blog_analytics")
      .select("created_at")
      .eq("event_type", "view")
      .gte("created_at", startDate.toISOString())

    // Process daily stats
    const dailyStats = {}
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      dailyStats[dateStr] = {
        date: dateStr,
        visitors: 0,
        pageViews: 0,
        blogViews: 0,
      }
    }

    dailyVisitors?.forEach((visitor) => {
      const date = visitor.created_at.split("T")[0]
      if (dailyStats[date]) {
        dailyStats[date].visitors++
        dailyStats[date].pageViews++
      }
    })

    dailyBlogViews?.forEach((view) => {
      const date = view.created_at.split("T")[0]
      if (dailyStats[date]) {
        dailyStats[date].blogViews++
      }
    })

    const dailyStatsArray = Object.values(dailyStats).reverse()

    const stats = {
      totalVisitors: totalVisitors || 0,
      totalPageViews: totalPageViews || 0,
      totalBlogViews: totalBlogViews || 0,
      totalBlogReads: totalBlogReads || 0,
      totalLinkClicks: totalLinkClicks || 0,
      topBlogPosts: topBlogPostsArray,
      visitorsByCountry: visitorsByCountryArray,
      recentVisitors: recentVisitors || [],
      dailyStats: dailyStatsArray,
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("Error fetching analytics stats:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
