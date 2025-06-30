"use client"

import { useState, useEffect } from "react"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"
import type { BlogPost } from "@/types/blog"

export function useBlogPosts(limit?: number) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const allPosts = await blogStoreSupabase.getAllPosts(true)

        if (!mounted) return

        const publishedPosts = allPosts.filter((post) => post.published)
        const limitedPosts = limit ? publishedPosts.slice(0, limit) : publishedPosts

        setPosts(limitedPosts)
      } catch (err) {
        if (!mounted) return

        console.warn("Error loading blog posts:", err)
        // Don't set error for blog posts - just use empty array
        setPosts([])
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      mounted = false
    }
  }, [limit])

  return { posts, loading, error }
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadPost = async () => {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        const fetchedPost = await blogStoreSupabase.getPostBySlug(slug)

        if (!mounted) return

        setPost(fetchedPost)
      } catch (err) {
        if (!mounted) return

        console.warn("Error loading blog post:", err)
        setError(err instanceof Error ? err.message : "Failed to load blog post")
        setPost(null)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadPost()

    return () => {
      mounted = false
    }
  }, [slug])

  return { post, loading, error }
}
