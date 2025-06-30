"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, BookOpen, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { BlogPost } from "@/types/blog"

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/blog/${slug}`)

        if (!response.ok) {
          throw new Error("Post not found")
        }

        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleShare = async () => {
    if (!post) return

    const shareData = {
      title: post.title,
      text: post.intro,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        // You could add a toast notification here
      }
    } catch (err) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
      } catch (clipboardErr) {
        // Handle clipboard error
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="royal-container">
          <div className="animate-pulse space-y-8" role="status" aria-label="Loading blog post">
            <div className="h-8 bg-gray-700/50 rounded-lg w-1/4"></div>
            <div className="h-16 bg-gray-700/50 rounded-lg"></div>
            <div className="flex gap-4">
              <div className="h-6 bg-gray-700/50 rounded w-32"></div>
              <div className="h-6 bg-gray-700/50 rounded w-24"></div>
              <div className="h-6 bg-gray-700/50 rounded w-28"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-700/50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="royal-container">
          <motion.div className="text-center py-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="midnight-glass rounded-2xl p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6" role="img" aria-label="Document icon">
                📝
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
              <p className="text-gray-300 mb-8">
                {error || "The blog post you're looking for doesn't exist or has been removed."}
              </p>
              <Link href="/blog">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50" role="progressbar" aria-label="Reading progress">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="royal-container py-20">
        {/* Back Navigation */}
        <motion.nav
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          aria-label="Breadcrumb navigation"
        >
          <Link href="/blog">
            <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </motion.nav>

        {/* Article Header */}
        <motion.article
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Section */}
          <header className="mb-12">
            <div className="midnight-glass rounded-2xl p-8 md:p-12 border border-yellow-400/20">
              {/* Title */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {post.title}
              </motion.h1>

              {/* Introduction */}
              {post.intro && (
                <motion.p
                  className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {post.intro}
                </motion.p>
              )}

              {/* Meta Information */}
              <motion.div
                className="flex flex-wrap items-center gap-6 text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <span className="font-medium">{post.author || "KT"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <span>{post.readingTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <span>Article</span>
                </div>
              </motion.div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Tag className="h-5 w-5 text-yellow-400 mr-2" aria-hidden="true" />
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors duration-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </motion.div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.imageUrls && post.imageUrls.length > 0 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={post.imageUrls[0] || "/placeholder.svg"}
                  alt={`Featured image for ${post.title}`}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            className="midnight-glass rounded-2xl p-8 md:p-12 border border-yellow-400/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="prose prose-lg prose-invert max-w-none">
              <div
                className="text-gray-200 leading-relaxed"
                style={{
                  fontSize: "1.125rem",
                  lineHeight: "1.8",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/\n\n/g, '</p><p class="mb-6">')
                    .replace(/\n/g, "<br>")
                    .replace(/^/, '<p class="mb-6">')
                    .replace(/$/, "</p>")
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-400 font-semibold">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
                    .replace(
                      /`(.*?)`/g,
                      '<code class="bg-gray-800 text-yellow-400 px-2 py-1 rounded text-sm font-mono">$1</code>',
                    )
                    .replace(
                      /^### (.*$)/gm,
                      '<h3 class="text-2xl font-bold text-white mt-12 mb-6 border-l-4 border-yellow-400 pl-4">$1</h3>',
                    )
                    .replace(
                      /^## (.*$)/gm,
                      '<h2 class="text-3xl font-bold text-white mt-16 mb-8 gradient-text">$1</h2>',
                    )
                    .replace(
                      /^# (.*$)/gm,
                      '<h1 class="text-4xl font-bold text-white mt-20 mb-10 gradient-text">$1</h1>',
                    ),
                }}
              />
            </div>
          </motion.div>

          {/* Article Footer */}
          <motion.footer
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="midnight-glass border-yellow-400/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold text-white mb-2">Enjoyed this article?</h3>
                    <p className="text-gray-300">Share it with others or explore more content.</p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 bg-transparent"
                      onClick={handleShare}
                      aria-label="Share this article"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Link href="/blog">
                      <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400">
                        <Eye className="mr-2 h-4 w-4" />
                        More Articles
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.footer>
        </motion.article>
      </div>
    </div>
  )
}
