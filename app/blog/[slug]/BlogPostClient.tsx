"use client"

import type React from "react"

import { useEffect } from "react"
import { useVisitorTracking } from "@/hooks/use-analytics"

interface BlogPostClientProps {
  post: {
    slug: string
    title: string
    content: string
  }
}

const BlogPostClient: React.FC<BlogPostClientProps> = ({ post }) => {
  const { trackVisitor, trackBlogEvent } = useVisitorTracking()

  useEffect(() => {
    if (post) {
      // Track page visit
      trackVisitor(window.location.href, document.referrer)

      // Track blog view
      trackBlogEvent(post.slug, post.title, "view")

      // Track blog read after 30 seconds
      const readTimer = setTimeout(() => {
        trackBlogEvent(post.slug, post.title, "read")
      }, 30000)

      return () => clearTimeout(readTimer)
    }
  }, [post, trackVisitor, trackBlogEvent])

  const handleLinkClick = (href: string) => {
    if (post) {
      trackBlogEvent(post.slug, post.title, "click", { link: href })
    }
  }

  // Function to render the blog content with click tracking on links
  const renderBlogContent = () => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        onClick={(e) => {
          const target = e.target as HTMLAnchorElement
          if (target.tagName === "A") {
            handleLinkClick(target.href)
          }
        }}
      />
    )
  }

  return (
    <div>
      <h1>{post.title}</h1>
      {renderBlogContent()}
    </div>
  )
}

export default BlogPostClient
