"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Tag, Share2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"
import type { BlogPost } from "@/types/blog"
import Link from "next/link"

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const fetchedPost = await blogStoreSupabase.getPost(slug)
        if (fetchedPost) {
          setPost(fetchedPost)
        } else {
          setError("Post not found")
        }
      } catch (err) {
        console.error("Error fetching post:", err)
        setError("Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const formatContent = (content: string) => {
    // Convert markdown-like syntax to HTML
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-white mb-6 leading-tight">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-semibold text-white mb-5 mt-8 leading-tight">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold text-white mb-4 mt-6 leading-tight">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-yellow-400">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-yellow-400 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-6 text-lg">')
      .replace(/\n/g, "<br>")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-6"
              />
              <p className="text-gray-300 text-lg">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Post Not Found</h1>
            <p className="text-gray-300 mb-8 text-lg">{error || "The requested blog post could not be found."}</p>
            <Link href="/blog">
              <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <div className="container mx-auto px-4 py-8">
          <Link href="/blog">
            <Button
              variant="outline"
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 backdrop-blur-sm bg-gray-900/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              {/* Featured Image */}
              {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={post.imageUrls[0] || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{post.title}</h1>

              {/* Intro */}
              {post.intro && <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">{post.intro}</p>}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-yellow-400" />
                  <span className="text-base">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <span className="text-base">{Math.ceil(post.content.split(" ").length / 200)} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-yellow-400" />
                  <span className="text-base">Article</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-yellow-400/30 text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors px-3 py-1 text-sm"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.header>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="text-gray-300 leading-relaxed mb-6 text-lg">${formatContent(post.content)}</p>`,
                  }}
                />
              </Card>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-white mb-4">Share this article</h3>
                <p className="text-gray-300 mb-6">Found this helpful? Share it with others!</p>
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.intro,
                        url: window.location.href,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert("Link copied to clipboard!")
                    }
                  }}
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold px-6 py-3"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Article
                </Button>
              </Card>
            </motion.div>

            {/* Back to Blog */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 font-semibold px-6 py-3 bg-transparent"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Read More Articles
                </Button>
              </Link>
            </motion.div>
          </div>
        </article>
      </div>
    </div>
  )
}
