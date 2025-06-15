"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, BookOpen, Diamond, Wifi, WifiOff, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useBlogPosts, useBlogUpdates } from "@/hooks/use-blog-updates"
import Head from "next/head"

export default function HomeBlogSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  // Use our custom hooks for real-time updates
  const { posts, loading, error, refresh } = useBlogPosts(3)
  const { isConnected, updateCount, lastUpdate } = useBlogUpdates({
    onUpdate: (eventType, data) => {
      console.log(`Blog update received: ${eventType}`, data)
      setRetryCount(0) // Reset retry count on successful update
    },
  })

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

  // Auto-retry mechanism for failed requests
  useEffect(() => {
    if (error && retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        setRetryCount((prev) => prev + 1)
        refresh()
      }, Math.pow(2, retryCount) * 1000) // Exponential backoff

      return () => clearTimeout(retryTimeout)
    }
  }, [error, retryCount, refresh])

  const handleManualRefresh = () => {
    setRetryCount(0)
    refresh()
  }

  if (loading && posts.length === 0) {
    return (
      <>
        <Head>
          <title>Blog - KT Portfolio | Latest Tech Insights</title>
          <meta
            name="description"
            content="Discover the latest insights on web development, cybersecurity, and cloud computing from Krish Thakker. Stay updated with cutting-edge technology trends and best practices."
          />
          <meta name="keywords" content="blog, web development, cybersecurity, cloud computing, tech insights" />
        </Head>
        <section ref={sectionRef} id="blog" className="royal-spacing royal-gradient" aria-labelledby="blog-heading">
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
                  aria-hidden="true"
                >
                  <Diamond className="h-6 w-6 text-yellow-400" />
                </motion.div>
                <h2 id="blog-heading" className="text-5xl font-bold text-white">
                  <span className="gradient-text">Blog</span>
                </h2>
                <motion.div
                  animate={{
                    rotate: [0, -180, -360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  aria-hidden="true"
                >
                  <Diamond className="h-6 w-6 text-yellow-400" />
                </motion.div>
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
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Blog - KT Portfolio | Latest Tech Insights</title>
        <meta
          name="description"
          content="Discover the latest insights on web development, cybersecurity, and cloud computing from Krish Thakker. Stay updated with cutting-edge technology trends and best practices."
        />
        <meta name="keywords" content="blog, web development, cybersecurity, cloud computing, tech insights" />
        <meta property="og:title" content="Blog - KT Portfolio | Latest Tech Insights" />
        <meta
          property="og:description"
          content="Discover the latest insights on web development, cybersecurity, and cloud computing from Krish Thakker."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kjt.vercel.app/#blog" />
        <link rel="canonical" href="https://kjt.vercel.app/#blog" />
      </Head>
      <section
        ref={sectionRef}
        id="blog"
        className="royal-spacing royal-gradient"
        aria-labelledby="blog-heading"
        itemScope
        itemType="https://schema.org/Blog"
      >
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
                aria-hidden="true"
              >
                <Diamond className="h-6 w-6 text-yellow-400" />
              </motion.div>
              <h2 id="blog-heading" className="text-5xl font-bold text-white" itemProp="name">
                <span className="gradient-text">Blog</span>
              </h2>
              <motion.div
                animate={{
                  rotate: [0, -180, -360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                <Diamond className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed" itemProp="description">
              Insights, tutorials, and thoughts on technology, development, and cybersecurity
            </p>

            {/* Enhanced connection status and update info */}
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-400" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-400" />
                )}
                <span>{isConnected ? "Live" : "Offline"}</span>
              </div>
              {updateCount > 0 && (
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  <span>{updateCount} updates</span>
                </div>
              )}
              {error && retryCount > 0 && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Retry {retryCount}/3</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Enhanced error state with retry options */}
          {error && (
            <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-red-500/20 text-red-400 border border-red-400/30 rounded-lg p-6 max-w-md mx-auto">
                <AlertTriangle className="h-8 w-8 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Failed to load blog posts</h3>
                <p className="text-sm mb-4">
                  {retryCount > 0 ? `Retry attempt ${retryCount}/3 failed` : "Unable to fetch latest posts"}
                </p>
                <div className="flex gap-2 justify-center">
                  <Link href="/blog">
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      View All Posts
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts grid with enhanced error handling */}
          <AnimatePresence mode="wait">
            {posts.length === 0 && !loading && !error ? (
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
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {posts.map((post, index) => (
                  <motion.article
                    key={`${post.id}-${updateCount}`} // Include updateCount to force re-render
                    initial={{ opacity: 0, y: 50 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    itemScope
                    itemType="https://schema.org/BlogPosting"
                    itemProp="blogPost"
                  >
                    <Card className="royal-card overflow-hidden h-full transition-all duration-500 hover:shadow-2xl">
                      <div className="relative overflow-hidden">
                        <Image
                          src={post.imageUrls[0] || "/placeholder.svg?height=200&width=400&text=Blog+Post"}
                          alt={post.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                          itemProp="image"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={post.date} itemProp="datePublished">
                              {new Date(post.date).toLocaleDateString()}
                            </time>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span itemProp="timeRequired">{post.readingTime} min read</span>
                          </div>
                        </div>

                        <h3
                          className="text-xl font-bold text-white mb-3 hover:text-yellow-400 transition-colors line-clamp-2"
                          itemProp="headline"
                        >
                          {post.title}
                        </h3>

                        <p className="text-gray-300 mb-4 line-clamp-3" itemProp="abstract">
                          {post.intro}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                              itemProp="keywords"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Link href={`/blog/${post.slug}`} itemProp="url">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              className="w-full btn-royal text-black font-semibold"
                              aria-label={`Read more about ${post.title}`}
                            >
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
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/blog">
              <Button
                size="lg"
                className="btn-royal text-black font-semibold hover:scale-105 transition-transform duration-200"
                aria-label="View all blog posts"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                View All Blogs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
