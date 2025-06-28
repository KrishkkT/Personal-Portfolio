"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, BookOpen, Diamond } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useBlogPosts } from "@/hooks/use-blog-updates"

export default function HomeBlogSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Use our custom hooks for real-time updates
  const { posts, loading, error } = useBlogPosts(3)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (loading && posts.length === 0) {
    return (
      <section ref={sectionRef} id="blog" className="py-20 royal-gradient">
        <div className="royal-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Diamond className="h-6 w-6 text-yellow-400" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Latest <span className="gradient-text">Blog</span>
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Insights, tutorials, and thoughts on technology, development, and cybersecurity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="animate-pulse"
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                <div className="royal-card h-96">
                  <div className="bg-gray-700/50 h-48 rounded-t-xl mb-4"></div>
                  <div className="p-6">
                    <div className="bg-gray-700/50 h-4 rounded mb-2"></div>
                    <div className="bg-gray-700/50 h-6 rounded w-3/4 mb-4"></div>
                    <div className="bg-gray-700/50 h-4 rounded mb-4"></div>
                    <div className="bg-gray-700/50 h-4 rounded w-1/2 mb-4"></div>
                    <div className="bg-gray-700/50 h-10 rounded"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="blog" className="py-20 royal-gradient">
      <div className="royal-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Diamond className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Latest <span className="gradient-text">Blog</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Insights, tutorials, and thoughts on technology, development, and cybersecurity
          </p>
        </motion.div>

        {/* Posts grid or empty state */}
        <AnimatePresence mode="wait">
          {posts.length === 0 && !loading ? (
            <motion.div
              key="no-posts"
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">No blog posts available</h3>
              <p className="text-gray-300 mb-6">Check back soon for new content!</p>
            </motion.div>
          ) : (
            <motion.div
              key="posts-grid"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="royal-card overflow-hidden h-full transition-all duration-500 hover:shadow-2xl">
                    <div className="relative overflow-hidden">
                      <Image
                        src={post.imageUrls?.[0] || "/placeholder.svg?height=200&width=400&text=Blog+Post"}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readingTime || 5} min read</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 hover:text-yellow-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-300 mb-4 line-clamp-3">{post.intro}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full btn-royal text-black font-semibold">
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/blog">
            <Button size="lg" className="btn-royal text-black font-semibold group">
              <BookOpen className="mr-2 h-5 w-5" />
              View All Blogs
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
