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
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`)
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch posts")
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [limit])

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
    // Simulate connection status
    const checkConnection = () => {
      setIsConnected(navigator.onLine)
    }

    window.addEventListener("online", checkConnection)
    window.addEventListener("offline", checkConnection)

    return () => {
      window.removeEventListener("online", checkConnection)
      window.removeEventListener("offline", checkConnection)
    }
  }, [])

  useEffect(() => {
    // Simulate periodic updates
    const interval = setInterval(() => {
      if (isConnected) {
        setUpdateCount((prev) => prev + 1)
        setLastUpdate(new Date())
        config?.onUpdate?.("refresh", { timestamp: new Date() })
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isConnected, config])

  return { isConnected, updateCount, lastUpdate }
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/blog/${slug}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found")
          }
          throw new Error(`Failed to fetch post: ${response.status}`)
        }

        const data = await response.json()
        setPost(data.post)
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch post")
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
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create post")
      }

      const data = await response.json()
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
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update post")
      }

      const data = await response.json()
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
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete post")
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
