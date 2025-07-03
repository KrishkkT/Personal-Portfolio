"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Tag, ArrowRight, Search, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { BlogPost } from "@/types/blog"

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blog")

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`)
      }

      const data = await response.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError(err instanceof Error ? err.message : "Failed to load blog posts")
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])))

  // Filter posts based on search and tag
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.intro.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = selectedTag === null || (post.tags && post.tags.includes(selectedTag))

    return matchesSearch && matchesTag
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="h-12 bg-gray-700/50 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-700/30 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
            </div>
            <div className="grid gap-8 md:gap-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gray-800/50 border-gray-700/50 animate-pulse p-8">
                  <div className="h-6 bg-gray-700/50 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700/30 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700/30 rounded mb-6 w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-700/30 rounded w-16"></div>
                    <div className="h-6 bg-gray-700/30 rounded w-20"></div>
                  </div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Unable to Load Blog Posts</h1>
            <p className="text-gray-300 mb-8">{error}</p>
            <Button onClick={fetchPosts} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Blog & <span className="text-yellow-400">Insights</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore my thoughts on web development, cybersecurity, and the latest technology trends. Sharing knowledge
              and insights from my journey in tech.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedTag(null)
                }}
                className="border-gray-700/50 text-gray-300 hover:bg-gray-800/50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedTag === tag
                        ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                        : "border-gray-700/50 text-gray-300 hover:bg-gray-800/50"
                    }`}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>

          {/* Blog Posts */}
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-700/50 rounded-2xl flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Articles Found</h3>
              <p className="text-gray-300 mb-8">
                {searchTerm || selectedTag
                  ? "Try adjusting your search criteria or clearing the filters."
                  : "No blog posts are available at the moment. Check back soon!"}
              </p>
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
                  <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min read
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl text-white group-hover:text-yellow-400 transition-colors">
                        <Link href={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">{post.intro}</p>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 cursor-pointer"
                              onClick={() => setSelectedTag(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 group">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
