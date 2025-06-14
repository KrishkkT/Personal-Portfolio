export interface VisitorData {
  id: string
  ip_address: string
  user_agent: string
  country?: string
  city?: string
  region?: string
  timezone?: string
  isp?: string
  page_url: string
  referrer?: string
  session_id: string
  created_at: string
}

export interface BlogAnalytics {
  id: string
  blog_slug: string
  blog_title: string
  event_type: "view" | "read" | "click" | "share"
  event_data?: Record<string, any>
  visitor_id: string
  ip_address: string
  user_agent: string
  created_at: string
}

export interface AnalyticsStats {
  totalVisitors: number
  totalPageViews: number
  totalBlogViews: number
  totalBlogReads: number
  totalLinkClicks: number
  topBlogPosts: Array<{
    slug: string
    title: string
    views: number
    reads: number
    clicks: number
  }>
  visitorsByCountry: Array<{
    country: string
    count: number
  }>
  recentVisitors: VisitorData[]
  dailyStats: Array<{
    date: string
    visitors: number
    pageViews: number
    blogViews: number
  }>
}
