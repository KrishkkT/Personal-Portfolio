"use client"

import { useEffect } from "react"
import { useBlogPosts } from "@/hooks/use-blog-updates"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Calendar, ArrowRight } from "lucide-react"
import PageTransitionWrapper from "@/components/page-transition-wrapper"
import { AnimationUtils } from "@/lib/animation-utils"
import anime from "animejs"

export default function BlogPageClient() {
  const { posts, isLoading, error } = useBlogPosts()

  useEffect(() => {
    // Apply animations when component mounts
    if (!isLoading && posts.length > 0) {
      AnimationUtils.staggered(".blog-post-card", "fadeIn", {
        delay: anime.stagger(100, { start: 300 }),
        duration: 800,
      })

      AnimationUtils.textReveal(".blog-page-title", { delay: 200 })
    }
  }, [isLoading, posts])

  if (error) {
    return (
      <PageTransitionWrapper namespace="blog">
        <div className="royal-container royal-spacing py-20">
          <h1 className="text-3xl font-bold mb-8 text-center">Blog</h1>
          <div className="text-center text-red-400 p-8 rounded-lg royal-card">
            <p>Failed to load blog posts. Please try again later.</p>
          </div>
        </div>
      </PageTransitionWrapper>
    )
  }

  return (
    <PageTransitionWrapper namespace="blog">
      <div className="royal-container royal-spacing py-20">
        <h1 className="blog-page-title text-4xl font-bold mb-2 text-center">Blog</h1>
        <p className="text-center text-gray-400 mb-12">Insights, tutorials, and thoughts</p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="royal-card overflow-hidden">
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="flex justify-between text-sm text-gray-400">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="blog-post-card royal-card overflow-hidden opacity-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readingTime || "5 min read"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/blog/${post.slug}`} passHref>
                    <Button variant="link" className="text-primary hover:text-primary/80 p-0">
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransitionWrapper>
  )
}
