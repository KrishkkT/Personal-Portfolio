"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowLeft, ArrowRight, Copy, Check, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/types/blog"
import { notFound } from "next/navigation"

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`)

        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error("Failed to fetch post")
        }

        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error("Error fetching blog post:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const formatContent = (content: string) => {
    // Split content by code blocks and format accordingly
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // This is a code block
        const lines = part.split("\n")
        const language = lines[0].replace("```", "") || "text"
        const code = lines.slice(1, -1).join("\n")

        return (
          <div key={index} className="my-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-700">
                <span className="text-sm text-gray-300 font-mono">{language}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(code, `inline-${index}`)}
                  className="h-8 w-8 p-0 text-gray-300 hover:text-white"
                >
                  {copiedCode === `inline-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-100 font-mono">{code}</code>
              </pre>
            </div>
          </div>
        )
      } else {
        // Regular content - format markdown-style
        return (
          <div key={index} className="prose prose-invert max-w-none">
            {part.split("\n\n").map((paragraph, pIndex) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={pIndex} className="text-2xl font-bold text-white mt-8 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              } else if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={pIndex} className="text-xl font-bold text-white mt-6 mb-3">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              } else if (paragraph.startsWith("- ")) {
                const listItems = paragraph.split("\n").filter((line) => line.startsWith("- "))
                return (
                  <ul key={pIndex} className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                    {listItems.map((item, itemIndex) => (
                      <li key={itemIndex}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                )
              } else if (paragraph.match(/^\d+\. /)) {
                const listItems = paragraph.split("\n").filter((line) => line.match(/^\d+\. /))
                return (
                  <ol key={pIndex} className="list-decimal list-inside text-gray-300 mb-4 space-y-1">
                    {listItems.map((item, itemIndex) => (
                      <li key={itemIndex}>{item.replace(/^\d+\. /, "")}</li>
                    ))}
                  </ol>
                )
              } else if (paragraph.trim()) {
                return (
                  <p key={pIndex} className="text-gray-300 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                )
              }
              return null
            })}
          </div>
        )
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="royal-container pt-32 pb-20">
          <div className="animate-pulse">
            <div className="bg-gray-700 h-8 rounded w-1/4 mb-8"></div>
            <div className="bg-gray-700 h-12 rounded w-3/4 mb-4"></div>
            <div className="bg-gray-700 h-6 rounded w-1/2 mb-8"></div>
            <div className="bg-gray-700 h-64 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="bg-gray-700 h-4 rounded"></div>
              <div className="bg-gray-700 h-4 rounded w-5/6"></div>
              <div className="bg-gray-700 h-4 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="royal-container pt-32 pb-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/blog">
            <Button
              variant="ghost"
              className="text-yellow-400 hover:text-gray-900 hover:bg-yellow-400 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-xl text-gray-300 leading-relaxed">{post.intro}</p>
          </header>

          {/* Featured Image */}
          {post.imageUrls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
                <Image src={post.imageUrls[0] || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            {formatContent(post.content)}
          </motion.div>

          {/* Code Snippets */}
          {post.codeSnippets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Code Examples</h2>
              <div className="space-y-6">
                {post.codeSnippets.map((snippet) => (
                  <Card key={snippet.id} className="midnight-glass border-yellow-400/20">
                    <CardContent className="p-0">
                      {snippet.title && (
                        <div className="px-6 py-4 border-b border-gray-700">
                          <h3 className="text-lg font-semibold text-white">{snippet.title}</h3>
                          {snippet.description && <p className="text-gray-400 mt-1">{snippet.description}</p>}
                        </div>
                      )}
                      <div className="bg-gray-800">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-700">
                          <span className="text-sm text-gray-300 font-mono">{snippet.language}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(snippet.code, snippet.id)}
                            className="h-8 w-8 p-0 text-gray-300 hover:text-white"
                          >
                            {copiedCode === snippet.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-sm text-gray-100 font-mono">{snippet.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Conclusion */}
          {post.conclusion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Conclusion</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{post.conclusion}</p>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Card className="midnight-glass border-yellow-400/20 p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-white mb-4">Enjoyed this article?</h3>
                <p className="text-gray-300 mb-6">{post.cta.text}</p>
                <Link href={post.cta.link}>
                  <Button
                    size="lg"
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-all duration-300 group"
                  >
                    {post.cta.text}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.article>
      </div>
    </div>
  )
}
