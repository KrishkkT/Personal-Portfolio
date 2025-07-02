"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/types/blog"

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm, selectedTag])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/blog")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        // Filter only published posts
        const publishedPosts = data.filter((post) => post.published)
        setPosts(publishedPosts)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to load blog posts. Please try again later.")
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.intro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag))
    }

    setFilteredPosts(filtered)
  }

  const getAllTags = () => {
    const allTags = posts.flatMap((post) => post.tags)
    return Array.from(new Set(allTags)).sort()
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

  if (isLoading) {
    return (
      <div className="min-h-screen royal-gradient">
        <div className="royal-container py-20">
          <div className="max-w-6xl mx-auto">
            {/* Loading Header */}
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-700/50 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-700/30 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
            </div>

            {/* Loading Cards */}
            <div className="grid gap-8 md:gap-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="royal-card animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-6 bg-gray-700/50 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700/30 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700/30 rounded mb-6 w-3/4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-700/30 rounded w-16"></div>
                      <div className="h-6 bg-gray-700/30 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen royal-gradient">
        <div className="royal-container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="royal-card p-12">
              <BookOpen className="h-16 w-16 text-red-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-300 mb-8">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={fetchPosts} className="btn-royal">
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen royal-gradient">
      <div className="royal-container py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>

            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="h-8 w-8 text-yellow-400" />
              <h1 className="text-5xl font-bold text-white">
                Tech <span className="gradient-text">Blog</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Insights, tutorials, and thoughts on web development, cybersecurity, and modern technology trends.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="royal-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedTag === "" ? "default" : "outline"}
                      onClick={() => setSelectedTag("")}
                      size="sm"
                      className={selectedTag === "" ? "btn-royal" : "border-gray-600 text-gray-300"}
                    >
                      All Topics
                    </Button>
                    {getAllTags()
                      .slice(0, 5)
                      .map((tag) => (
                        <Button
                          key={tag}
                          variant={selectedTag === tag ? "default" : "outline"}
                          onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                          size="sm"
                          className={selectedTag === tag ? "btn-royal" : "border-gray-600 text-gray-300"}
                        >
                          {tag}
                        </Button>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Blog Posts */}
          {filteredPosts.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="royal-card">
                <CardContent className="p-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {posts.length === 0 ? "No blog posts yet" : "No posts found"}
                  </h3>
                  <p className="text-gray-300 mb-8">
                    {posts.length === 0
                      ? "Stay tuned for upcoming articles on web development, cybersecurity, and tech insights."
                      : "Try adjusting your search terms or filters to find what you're looking for."}
                  </p>
                  {searchTerm || selectedTag ? (
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedTag("")
                      }}
                      className="btn-royal"
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Link href="/">
                      <Button className="btn-royal">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Portfolio
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:gap-12">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="royal-card group hover:border-yellow-400/30 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="h-4 w-4" />
                              {formatDate(post.createdAt)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock className="h-4 w-4" />
                              {getReadingTime(post.content)}
                            </div>
                          </div>

                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                            {post.title}
                          </h2>

                          <p className="text-gray-300 text-lg leading-relaxed mb-6 line-clamp-3">{post.intro}</p>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 cursor-pointer"
                                onClick={() => setSelectedTag(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Link href={`/blog/${post.slug}`}>
                            <Button className="btn-royal group/btn">
                              Read Full Article
                              <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>

                        {/* Featured Image */}
                        {post.imageUrls && post.imageUrls.length > 0 && (
                          <div className="lg:w-80 lg:flex-shrink-0">
                            <div className="relative h-48 lg:h-full rounded-xl overflow-hidden bg-gray-800/50">
                              <img
                                src={post.imageUrls[0] || "/placeholder.svg"}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=300&width=400&text=Blog+Image"
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats */}
          {posts.length > 0 && (
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="royal-card">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">{posts.length}</span>
                      </div>
                      <p className="text-gray-300">Total Articles</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">{getAllTags().length}</span>
                      </div>
                      <p className="text-gray-300">Topics Covered</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">{filteredPosts.length}</span>
                      </div>
                      <p className="text-gray-300">Showing Results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
