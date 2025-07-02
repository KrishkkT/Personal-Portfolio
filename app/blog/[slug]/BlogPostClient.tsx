"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Share2, BookOpen, User, Tag, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/types/blog"

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/${slug}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Blog post not found")
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setPost(data)
    } catch (error) {
      console.error("Error fetching post:", error)
      setError(error instanceof Error ? error.message : "Failed to load blog post")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = post?.title || "Blog Post"

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
      } catch (error) {
        console.log("Error copying to clipboard:", error)
      }
    }
  }

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering - you might want to use a proper markdown library
    return content.split("\n").map((line, index) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-bold text-white mt-8 mb-4">
            {line.replace("### ", "")}
          </h3>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
            {line.replace("## ", "")}
          </h2>
        )
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">
            {line.replace("# ", "")}
          </h1>
        )
      }

      // Code blocks
      if (line.startsWith("```")) {
        return (
          <div key={index} className="bg-gray-800 rounded-lg p-4 my-4 font-mono text-sm text-gray-300">
            {line.replace(/```/g, "")}
          </div>
        )
      }

      // Bold text
      const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-yellow-400">$1</strong>')

      // Italic text
      const italicText = boldText.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      // Links
      const linkText = italicText.replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-yellow-400 hover:text-yellow-300 underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )

      // Empty lines
      if (line.trim() === "") {
        return <br key={index} />
      }

      // Regular paragraphs
      return (
        <p key={index} className="text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: linkText }} />
      )
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen royal-gradient">
        <div className="royal-container py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen royal-gradient">
        <div className="royal-container py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <Card className="royal-card">
                <CardContent className="p-12">
                  <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {error === "Blog post not found" ? "Article Not Found" : "Something went wrong"}
                  </h1>
                  <p className="text-gray-300 mb-8">
                    {error === "Blog post not found"
                      ? "The article you're looking for doesn't exist or has been moved."
                      : error || "Failed to load the article. Please try again later."}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={fetchPost} className="btn-royal">
                      Try Again
                    </Button>
                    <Link href="/blog">
                      <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Blog
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen royal-gradient">
      <div className="royal-container py-20">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <motion.div className="mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="royal-card">
              <CardContent className="p-8 md:p-12">
                {/* Featured Image */}
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8 bg-gray-800/50">
                    <img
                      src={post.imageUrls[0] || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=400&width=800&text=Blog+Image"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  </div>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {getReadingTime(post.content)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author || "KT"}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>

                {/* Introduction */}
                <p className="text-xl text-gray-300 leading-relaxed mb-8">{post.intro}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <Tag className="h-4 w-4 text-gray-400 mr-2" />
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-yellow-400/30 text-yellow-400">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Share Button */}
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="royal-card">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg prose-invert max-w-none">{renderMarkdown(post.content)}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back to Blog */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/blog">
              <Button className="btn-royal">
                <BookOpen className="h-4 w-4 mr-2" />
                Read More Articles
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
