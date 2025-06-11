"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { blogEvents } from "@/lib/blog-events"
import type { BlogPostSummary } from "@/types/blog"

interface UseBlogUpdatesOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  onUpdate?: (eventType: string, data: any) => void
  onPermanentDeletion?: (data: any) => void
}

export function useBlogUpdates(options: UseBlogUpdatesOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000, onUpdate, onPermanentDeletion } = options

  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())
  const [isConnected, setIsConnected] = useState(true)
  const [updateCount, setUpdateCount] = useState(0)
  const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set())
  const intervalRef = useRef<NodeJS.Timeout>()

  // Handle blog events
  const handleBlogEvent = useCallback(
    (eventType: string, data: any) => {
      setLastUpdate(Date.now())
      setUpdateCount((prev) => prev + 1)
      setIsConnected(true)

      // Track permanent deletions
      if (eventType === "post-deleted" && data?.permanent) {
        setDeletedItems((prev) => {
          const newSet = new Set(prev)
          if (data.deletedId) newSet.add(data.deletedId)
          if (data.deletedSlug) newSet.add(data.deletedSlug)
          return newSet
        })

        if (onPermanentDeletion) {
          onPermanentDeletion(data)
        }
      }

      if (onUpdate) {
        onUpdate(eventType, data)
      }
    },
    [onUpdate, onPermanentDeletion],
  )

  // Subscribe to blog events
  useEffect(() => {
    const unsubscribers = [
      blogEvents.subscribe("post-created", (data) => handleBlogEvent("post-created", data)),
      blogEvents.subscribe("post-updated", (data) => handleBlogEvent("post-updated", data)),
      blogEvents.subscribe("post-deleted", (data) => handleBlogEvent("post-deleted", data)),
      blogEvents.subscribe("post-permanently-deleted", (data) => handleBlogEvent("post-permanently-deleted", data)),
      blogEvents.subscribe("posts-refreshed", (data) => handleBlogEvent("posts-refreshed", data)),
    ]

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [handleBlogEvent])

  // Manual refresh function
  const refresh = useCallback(() => {
    blogEvents.emit("posts-refreshed", { source: "manual" })
  }, [])

  // Force update function
  const forceUpdate = useCallback(() => {
    setLastUpdate(Date.now())
    setUpdateCount((prev) => prev + 1)
  }, [])

  // Check if item is deleted
  const isDeleted = useCallback(
    (id: string) => {
      return deletedItems.has(id)
    },
    [deletedItems],
  )

  return {
    lastUpdate,
    isConnected,
    updateCount,
    deletedItems: Array.from(deletedItems),
    refresh,
    forceUpdate,
    isDeleted,
  }
}

// Hook specifically for fetching blog posts with real-time updates and permanent deletion support
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

        // Ensure we have a valid posts array
        const postsArray = Array.isArray(data.posts) ? data.posts : []
        setPosts(postsArray)
        setLastFetch(Date.now())
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch posts")
        // Don't clear posts on error, keep showing cached data
      } finally {
        setLoading(false)
      }
    },
    [limit, lastFetch],
  )

  // Use blog updates hook with permanent deletion handling
  const { isDeleted } = useBlogUpdates({
    autoRefresh: false,
    onUpdate: (eventType, data) => {
      // Only refresh for relevant events
      if (["post-created", "post-updated", "post-deleted"].includes(eventType)) {
        fetchPosts(true)
      }
    },
    onPermanentDeletion: (data) => {
      // Immediately remove deleted post from state
      if (data?.deletedId || data?.deletedSlug) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== data.deletedId && post.slug !== data.deletedSlug),
        )
      }
    },
  })

  // Initial fetch
  useEffect(() => {
    fetchPosts(true)
  }, [fetchPosts])

  // Filter out deleted posts from current state
  const activePosts = posts.filter((post) => !isDeleted(post.id) && !isDeleted(post.slug))

  return {
    posts: activePosts,
    loading,
    error,
    refresh: () => fetchPosts(true),
  }
}
