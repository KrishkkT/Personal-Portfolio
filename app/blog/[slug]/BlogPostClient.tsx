"use client"

import { useEffect } from "react"
import { useBlogPost } from "@/hooks/use-blog-updates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import PageTransitionWrapper from "@/components/page-transition-wrapper"
import { AnimationUtils } from "@/lib/animation-utils"

export default function BlogPostClient({ slug }: { slug: string }) {
  const { post, isLoading, error } = useBlogPost(slug)

  useEffect(() => {
    // Apply animations when post loads
    if (!isLoading && post) {
      AnimationUtils.fadeIn(".blog-post-content", { delay: 300 })
      AnimationUtils.textReveal(".blog-post-title", { delay: 200 })
    }
  }, [isLoading, post])

  if (error) {
    return (
      <PageTransitionWrapper namespace="blog-post">
        <div className="royal-container royal-spacing py-20">
          <Link href="/blog" passHref>
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Button>
          </Link>
          <div className="text-center text-red-400 p-8 rounded-lg royal-card">
            <p>Failed to load blog post. Please try again later.</p>
          </div>
        </div>
      </PageTransitionWrapper>
    )
  }

  return (
    <PageTransitionWrapper namespace="blog-post">
      <div className="royal-container royal-spacing py-20">
        <Link href="/blog" passHref>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Button>
        </Link>

        {isLoading ? (
          <Card className="royal-card overflow-hidden">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="flex justify-between text-sm text-gray-400">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ) : post ? (
          <Card className="royal-card overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="blog-post-title text-3xl opacity-0">{post.title}</CardTitle>
              <div className="flex justify-between text-sm text-gray-400 mt-4">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readingTime || "5 min read"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="blog-post-content prose prose-invert max-w-none opacity-0"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PageTransitionWrapper>
  )
}
