"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { blogEvents } from "@/lib/blog-events"
import type { BlogPostSummary } from "@/types/blog"

interface UseBlogUpdatesOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  onUpdate?: (eventType: string, data: any) => void
}

export function useBlogUpdates(options: UseBlogUpdatesOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    onUpdate,
  } = options

  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())
  const [isConnected, setIsConnected] = useState(true)
  const [updateCount, setUpdateCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>()
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  // Handle blog events
  const handleBlogEvent = useCallback(
    (eventType: string, data: any) => {
      setLastUpdate(Date.now())
      setUpdateCount((prev) => prev + 1)
      setIsConnected(true)

      if (onUpdate) {
        onUpdate(eventType, data)
      }
    },
    [onUpdate],
  )

  // Subscribe to blog events
  useEffect(() => {
    const unsubscribers = [
      blogEvents.subscribe("post-created", (data) => handleBlogEvent("post-created", data)),
      blogEvents.subscribe("post-updated", (data) => handleBlogEvent("post-updated", data)),
      blogEvents.subscribe("post-deleted", (data) => handleBlogEvent("post-deleted", data)),
      blogEvents.subscribe("posts-refreshed", (data) => handleBlogEvent("posts-refreshed", data)),
    ]

    // Listen for custom window events (for cross-tab communication)
    const handleWindowEvent = (event: CustomEvent) => {
      const { eventType, data } = event.detail
      handleBlogEvent(eventType, data)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("blog-update", handleWindowEvent as EventListener)
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      if (typeof window !== "undefined") {
        window.removeEventListener("blog-update", handleWindowEvent as EventListener)
      }
    }
  }, [handleBlogEvent])

  // Auto-refresh mechanism
  useEffect(() => {
    if (!autoRefresh) return

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        // Trigger a refresh event
        blogEvents.emit("posts-refreshed", { source: "auto-refresh" })
      }, refreshInterval)
    }

    startInterval()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh, refreshInterval])

  // Connection monitoring
  useEffect(() => {
    const checkConnection = () => {
      const now = Date.now()
      const timeSinceLastUpdate = now - lastUpdate

      // If no updates for 2 minutes, consider disconnected
      if (timeSinceLastUpdate > 120000) {
        setIsConnected(false)

        // Try to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          blogEvents.emit("posts-refreshed", { source: "reconnect" })
        }, 5000)
      }
    }

    const connectionInterval = setInterval(checkConnection, 30000)

    return () => {
      clearInterval(connectionInterval)
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [lastUpdate])

  // Manual refresh function
  const refresh = useCallback(() => {
    blogEvents.emit("posts-refreshed", { source: "manual" })
  }, [])

  // Force update function
  const forceUpdate = useCallback(() => {
    setLastUpdate(Date.now())
    setUpdateCount((prev) => prev + 1)
  }, [])

  return {
    lastUpdate,
    isConnected,
    updateCount,
    refresh,
    forceUpdate,
  }
}

// Hook specifically for fetching blog posts with real-time updates
export function useBlogPosts(limit?: number) {
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const fetchPosts = useCallback(
    async (force = false) => {
      // Avoid too frequent fetches unless forced
      if (!force && Date.now() - lastFetch < 1000) return

      try {
        setError(null)
        const params = new URLSearchParams()
        if (limit) params.append("limit", limit.toString())
        params.append("_t", Date.now().toString()) // Cache busting

        const response = await fetch(`/api/blog?${params}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`)
        }

        const data = await response.json()
        setPosts(data.posts)
        setLastFetch(Date.now())
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch posts")
      } finally {
        setLoading(false)
      }
    },
    [limit, lastFetch],
  )

  // Use blog updates hook
  useBlogUpdates({
    onUpdate: (eventType, data) => {
      // Refresh posts when any blog event occurs
      fetchPosts(true)
    },
  })

  // Initial fetch
  useEffect(() => {
    fetchPosts(true)
  }, [fetchPosts])

  return {
    posts,
    loading,
    error,
    refresh: () => fetchPosts(true),
  }
}
