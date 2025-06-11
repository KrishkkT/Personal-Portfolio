"use client"

import { useState, useEffect, useCallback } from "react"
import type { BlogPostSummary, BlogPost } from "@/types/blog"

interface UseBlogUpdatesOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  onUpdate?: (eventType: string, data: any) => void
}

interface UseBlogPostsReturn {
  posts: BlogPostSummary[]
  loading: boolean
  error: string | null
  refetch: () => void
}

interface UseBlogPostReturn {
  post: BlogPost | null
  loading: boolean
  error: string | null
  refetch: () => void
}

// Blog updates hook
export function useBlogUpdates(options: UseBlogUpdatesOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000, onUpdate } = options

  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())
  const [isConnected, setIsConnected] = useState(true)
  const [updateCount, setUpdateCount] = useState(0)

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

  const refresh = useCallback(() => {
    handleBlogEvent("posts-refreshed", { source: "manual" })
  }, [handleBlogEvent])

  const forceUpdate = useCallback(() => {
    setLastUpdate(Date.now())
    setUpdateCount((prev) => prev + 1)
  }, [])

  // Auto-refresh mechanism
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      handleBlogEvent("posts-refreshed", { source: "auto-refresh" })
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, handleBlogEvent])

  return {
    lastUpdate,
    isConnected,
    updateCount,
    refresh,
    forceUpdate,
  }
}

// Blog posts hook
export function useBlogPosts(limit?: number): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (limit) params.append("limit", limit.toString())
      params.append("_t", Date.now().toString()) // Cache busting

      const response = await fetch(`/api/blog?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch blog posts"
      setError(errorMessage)
      setPosts([]) // Set empty array on error to prevent UI issues
    } finally {
      setLoading(false)
    }
  }, [limit])

  // Use blog updates hook for real-time updates
  useBlogUpdates({
    onUpdate: () => {
      fetchPosts()
    },
  })

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
  }
}

// Single blog post hook
export function useBlogPost(slug: string): UseBlogPostReturn {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    if (!slug) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Blog post not found")
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data && typeof data === "object") {
        setPost(data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch blog post"
      setError(errorMessage)
      setPost(null)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return {
    post,
    loading,
    error,
    refetch: fetchPost,
  }
}

// Blog management hook for admin operations
export function useBlogManagement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPost = useCallback(async (postData: any) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create post")
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create post"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePost = useCallback(async (slug: string, postData: any) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update post")
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update post"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePost = useCallback(async (slug: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete post")
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete post"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
  }
}
