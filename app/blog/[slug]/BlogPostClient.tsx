"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Tag, Share2, ArrowLeft, Eye, Heart, MessageCircle, Bookmark } from "lucide-react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { BlogPost } from "@/types/blog"

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/${slug}`)
      const data = await response.json()

      if (data.success && data.post) {
        setPost(data.post)
      } else {
        setError("Post not found")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      setError("Failed to load post")
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The requested post could not be found."}</p>
          <Button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 p-8 border-b border-gray-700/50">
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant={post.published ? "default" : "secondary"}
                  className={
                    post.published
                      ? "bg-green-400/20 text-green-400 border-green-400/30"
                      : "bg-yellow-400/20 text-yellow-400 border-yellow-400/30"
                  }
                >
                  {post.published ? "Published" : "Draft"}
                </Badge>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {calculateReadTime(post.content)} min read
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>

              {post.excerpt && <p className="text-xl text-gray-300 leading-relaxed mb-6">{post.excerpt}</p>}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className={`border-gray-600 ${liked ? "text-red-400 border-red-400/30" : "text-gray-400"} hover:bg-gray-700/50`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`border-gray-600 ${bookmarked ? "text-yellow-400 border-yellow-400/30" : "text-gray-400"} hover:bg-gray-700/50`}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
                  {bookmarked ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-gray-600 text-gray-400 hover:bg-gray-700/50 bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-8">
              <div className="prose prose-lg prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-white mb-6 mt-8 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-white mb-4 mt-8 first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-white mb-3 mt-6 first:mt-0">{children}</h3>
                    ),
                    p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed text-lg">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="text-gray-300 leading-relaxed">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-yellow-400 pl-4 py-2 my-6 bg-gray-700/30 rounded-r-lg">
                        <div className="text-gray-300 italic">{children}</div>
                      </blockquote>
                    ),
                    code: ({ inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "")
                      return !inline && match ? (
                        <div className="my-6">
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-gray-700/50 text-yellow-400 px-2 py-1 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      )
                    },
                    img: ({ src, alt }) => (
                      <div className="my-8">
                        <img
                          src={src || "/placeholder.svg"}
                          alt={alt}
                          className="w-full rounded-lg shadow-lg border border-gray-700/50"
                        />
                        {alt && <p className="text-center text-gray-500 text-sm mt-2 italic">{alt}</p>}
                      </div>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 underline decoration-yellow-400/50 hover:decoration-yellow-300 transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    hr: () => <Separator className="my-8 bg-gray-700/50" />,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </CardContent>

            {/* Footer */}
            <div className="bg-gray-700/30 p-6 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>Last updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comments
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Related Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Related Posts</h3>
              <div className="text-center py-8">
                <p className="text-gray-400">Related posts will appear here</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
