"use client"

import { useState, useEffect } from "react"
import type { AnalyticsStats } from "@/types/analytics"

export function useAnalytics(days = 30) {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/stats?days=${days}`)
      if (!response.ok) throw new Error("Failed to fetch analytics")

      const data = await response.json()
      setStats(data.stats)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [days])

  return { stats, loading, error, refetch: fetchStats }
}

export function useVisitorTracking() {
  const trackVisitor = async (pageUrl: string, referrer?: string) => {
    try {
      const sessionId = getOrCreateSessionId()

      await fetch("/api/analytics/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_url: pageUrl,
          referrer,
          session_id: sessionId,
        }),
      })
    } catch (error) {
      console.error("Failed to track visitor:", error)
    }
  }

  const trackBlogEvent = async (
    blogSlug: string,
    blogTitle: string,
    eventType: "view" | "read" | "click" | "share",
    eventData?: Record<string, any>,
  ) => {
    try {
      const visitorId = getOrCreateVisitorId()

      await fetch("/api/analytics/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blog_slug: blogSlug,
          blog_title: blogTitle,
          event_type: eventType,
          event_data: eventData,
          visitor_id: visitorId,
        }),
      })
    } catch (error) {
      console.error("Failed to track blog event:", error)
    }
  }

  return { trackVisitor, trackBlogEvent }
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem("kt_session_id")
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("kt_session_id", sessionId)
  }
  return sessionId
}

function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem("kt_visitor_id")
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("kt_visitor_id", visitorId)
  }
  return visitorId
}
