"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useBlogPosts } from "@/hooks/use-blog-updates"

export default function BlogSection() {
  const { posts: recentPosts, loading, error } = useBlogPosts(3)

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="royal-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Latest Blog Posts</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, tutorials, and thoughts on technology, development, and cybersecurity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="royal-container">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Latest Blog Posts</h2>
            <p className="text-xl text-red-400 mb-4">Unable to load blog posts at this time.</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (!recentPosts || recentPosts.length === 0) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="royal-container">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Latest Blog Posts</h2>
            <p className="text-xl text-gray-300">No blog posts available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="royal-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Latest Blog Posts</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on technology, development, and cybersecurity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recentPosts.map((post, index) => (
            <div
              key={post.id}
              className="opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: "forwards",
              }}
            >
              <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 group h-full">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <Image
                      src={post.imageUrls?.[0] || "/placeholder.svg?height=200&width=400&text=Blog+Post"}
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
            </div>
          ))}
        </div>

        <div
          className="text-center opacity-0 animate-fade-in-up"
          style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
        >
          <Link href="/blog">
            <Button
              size="lg"
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-all duration-300 group"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              See More Blogs
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
