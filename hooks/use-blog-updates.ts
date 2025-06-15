"use client"

import { useState, useEffect, useCallback } from "react"
import type { BlogPost, BlogPostSummary } from "@/types/blog"

interface UseBlogUpdatesOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  onUpdate?: (eventType: string, data: any) => void
}

interface UseBlogPostsResult {
  posts: BlogPostSummary[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseBlogPostResult {
  post: BlogPost | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Blog updates hook for real-time updates and refresh management
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

// Blog posts hook for fetching and managing blog posts
export function useBlogPosts(limit?: number): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (limit) params.append("limit", limit.toString())
      params.append("timestamp", Date.now().toString())

      const response = await fetch(`/api/blog?${params}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts)
      } else {
        throw new Error(data.error || "Failed to fetch blog posts")
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch blog posts")
      setPosts([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  // Use blog updates hook for real-time updates
  useBlogUpdates({
    onUpdate: () => {
      fetchPosts()
    },
  })

  useEffect(() => {
    fetchPosts()
  }, [limit])

  return { posts, isLoading, error, refetch: fetchPosts }
}

// Single blog post hook
export function useBlogPost(slug: string): UseBlogPostResult {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = async () => {
    if (!slug) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/${slug}?timestamp=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Blog post not found")
        }
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setPost(data)
    } catch (err) {
      console.error(`Error fetching blog post ${slug}:`, err)
      setError(err instanceof Error ? err.message : "Failed to fetch blog post")
      setPost(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  return { post, isLoading, error, refetch: fetchPost }
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
