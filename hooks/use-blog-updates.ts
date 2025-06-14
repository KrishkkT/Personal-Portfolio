"use client"

import { useState, useEffect, useCallback } from "react"
import type { BlogPost } from "@/types/blog"

interface BlogUpdatesConfig {
  onUpdate?: (eventType: string, data: any) => void
}

interface UseBlogPostsReturn {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  refresh: () => void
}

interface UseBlogUpdatesReturn {
  isConnected: boolean
  updateCount: number
  lastUpdate: Date | null
}

export function useBlogPosts(limit?: number): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = limit ? `/api/blog?limit=${limit}` : "/api/blog"
      const response = await fetch(url, {
        headers: {
          "Cache-Control": "no-cache",
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Handle both success and warning cases
      if (data.success || data.posts) {
        setPosts(data.posts || [])
        if (data.warning) {
          console.warn("Blog API warning:", data.warning)
        }
      } else {
        throw new Error(data.error || "Unknown error occurred")
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err)

      // Set user-friendly error message
      if (err instanceof Error) {
        if (err.name === "TimeoutError") {
          setError("Request timed out. Please try again.")
        } else if (err.message.includes("Failed to fetch")) {
          setError("Network error. Please check your connection.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Failed to fetch posts")
      }

      // Keep existing posts if available
      if (posts.length === 0) {
        setPosts([])
      }
    } finally {
      setLoading(false)
    }
  }, [limit, posts.length])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const refresh = useCallback(() => {
    fetchPosts()
  }, [fetchPosts])

  return { posts, loading, error, refresh }
}

export function useBlogUpdates(config?: BlogUpdatesConfig): UseBlogUpdatesReturn {
  const [isConnected, setIsConnected] = useState(true)
  const [updateCount, setUpdateCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Check connection status
    const checkConnection = () => {
      setIsConnected(navigator.onLine)
    }

    // Initial check
    checkConnection()

    window.addEventListener("online", checkConnection)
    window.addEventListener("offline", checkConnection)

    return () => {
      window.removeEventListener("online", checkConnection)
      window.removeEventListener("offline", checkConnection)
    }
  }, [])

  useEffect(() => {
    // Simulate periodic updates only when connected
    if (!isConnected) return

    const interval = setInterval(() => {
      setUpdateCount((prev) => prev + 1)
      setLastUpdate(new Date())
      config?.onUpdate?.("refresh", { timestamp: new Date() })
    }, 60000) // Update every minute instead of 30 seconds

    return () => clearInterval(interval)
  }, [isConnected, config])

  return { isConnected, updateCount, lastUpdate }
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/blog/${slug}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
          signal: AbortSignal.timeout(10000),
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found")
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success && data.post) {
          setPost(data.post)
        } else {
          throw new Error(data.error || "Failed to fetch post")
        }
      } catch (err) {
        console.error("Error fetching blog post:", err)

        if (err instanceof Error) {
          if (err.name === "TimeoutError") {
            setError("Request timed out. Please try again.")
          } else {
            setError(err.message)
          }
        } else {
          setError("Failed to fetch post")
        }
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  return { post, loading, error }
}

export function useBlogManagement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPost = useCallback(async (postData: Partial<BlogPost>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        signal: AbortSignal.timeout(15000), // 15 second timeout for POST
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.post) {
        throw new Error(data.error || "Failed to create post")
      }

      return data.post
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create post"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePost = useCallback(async (slug: string, postData: Partial<BlogPost>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.post) {
        throw new Error(data.error || "Failed to update post")
      }

      return data.post
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update post"
      setError(errorMessage)
      throw new Error(errorMessage)
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
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to delete post")
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete post"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createPost,
    updatePost,
    deletePost,
    loading,
    error,
  }
}
