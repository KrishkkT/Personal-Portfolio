"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, ArrowRight, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPostSummary } from "@/types/blog"

interface BlogResponse {
  success: boolean
  posts: BlogPostSummary[]
  total: number
  error?: string
}

export default function BlogPageClient() {
  const [blogData, setBlogData] = useState<BlogPostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [allTags, setAllTags] = useState<string[]>([])

  const fetchBlogPosts = async (search = "", tag = "") => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        limit: "12",
        timestamp: Date.now().toString(),
      })

      if (search) params.append("search", search)
      if (tag) params.append("tag", tag)

      const response = await fetch(`/api/blog?${params}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: BlogResponse = await response.json()

      if (data.success && data.posts) {
        setBlogData(data.posts)

        // Extract unique tags
        const tags = new Set<string>()
        data.posts.forEach((post) => {
          post.tags?.forEach((tag) => tags.add(tag))
        })
        setAllTags(Array.from(tags))
      } else {
        throw new Error(data.error || "Failed to fetch blog posts")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch blog posts"
      setError(errorMessage)
      setBlogData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts(searchTerm, selectedTag)
  }, [searchTerm, selectedTag])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBlogPosts(searchTerm, selectedTag)
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag)
  }

  const filteredPosts = blogData.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.intro.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "" || post.tags?.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <section className="pt-32 pb-16">
          <div className="royal-container">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">Blog</h1>
              <div className="text-center text-red-400 p-8 rounded-lg midnight-glass">
                <p className="text-xl mb-4">Unable to load blog posts</p>
                <p className="text-sm text-gray-400">{error}</p>
                <Button
                  onClick={() => fetchBlogPosts()}
                  className="mt-4 bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="royal-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">Blog</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, tutorials, and thoughts on technology, development, and cybersecurity
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  aria-label="Search blog posts"
                />
              </div>
              <Button type="submit" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                Search
              </Button>
            </form>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tags">
                <span className="flex items-center text-gray-300 mr-2">
                  <Filter className="h-4 w-4 mr-1" aria-hidden="true" />
                  Filter by tag:
                </span>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTag === tag
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => handleTagFilter(tag)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleTagFilter(tag)
                      }
                    }}
                    aria-pressed={selectedTag === tag}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pb-20">
        <div className="royal-container">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="status" aria-label="Loading blog posts">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="midnight-glass rounded-xl p-6 h-96">
                    <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-700 h-4 rounded w-3/4 mb-4"></div>
                    <div className="bg-gray-700 h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">No blog posts found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || selectedTag
                  ? "Try adjusting your search or filter criteria."
                  : "Check back soon for new content!"}
              </p>
              {(searchTerm || selectedTag) && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedTag("")
                  }}
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 group h-full">
                    <CardHeader className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <Image
                          src={post.imageUrls?.[0] || "/placeholder.svg?height=200&width=400&text=Blog+Post"}
                          alt={`Featured image for ${post.title}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          <span>{post.readingTime} min read</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-gray-300 mb-4 line-clamp-3">{post.intro}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Link href={`/blog/${post.slug}`} className="block">
                        <Button
                          variant="ghost"
                          className="w-full text-yellow-400 hover:text-gray-900 hover:bg-yellow-400 transition-all duration-300 group"
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
