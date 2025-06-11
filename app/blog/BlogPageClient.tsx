"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, ArrowRight, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { PaginatedBlogResponse } from "@/types/blog"

export default function BlogPageClient() {
  const [blogData, setBlogData] = useState<PaginatedBlogResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchBlogPosts = async (page = 1, search = "", tag = "") => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      })

      if (search) params.append("search", search)
      if (tag) params.append("tag", tag)

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()
      setBlogData(data)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts(currentPage, searchTerm, selectedTag)
  }, [currentPage, searchTerm, selectedTag])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchBlogPosts(1, searchTerm, selectedTag)
  }

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Get all unique tags from posts
  const allTags =
    blogData?.posts.reduce((tags: string[], post) => {
      post.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
      return tags
    }, []) || []

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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <Button type="submit" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                Search
              </Button>
            </form>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center text-gray-300 mr-2">
                <Filter className="h-4 w-4 mr-1" />
                Filter by tag:
              </span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTag === tag ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pb-20">
        <div className="royal-container">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          ) : blogData?.posts.length === 0 ? (
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
                    setCurrentPage(1)
                  }}
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogData?.posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 group h-full">
                      <CardHeader className="p-0">
                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                          <Image
                            src={post.imageUrls[0] || "/placeholder.svg?height=200&width=400&text=Blog+Post"}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min read
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-300 mb-4 line-clamp-3">{post.intro}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Link href={`/blog/${post.slug}`}>
                          <Button
                            variant="ghost"
                            className="w-full text-yellow-400 hover:text-gray-900 hover:bg-yellow-400 transition-all duration-300 group"
                          >
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {blogData && blogData.pagination.totalPages > 1 && (
                <motion.div
                  className="flex justify-center items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!blogData.pagination.hasPreviousPage}
                    className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: blogData.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className={
                          page === currentPage
                            ? "bg-yellow-400 text-gray-900"
                            : "border-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!blogData.pagination.hasNextPage}
                    className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
