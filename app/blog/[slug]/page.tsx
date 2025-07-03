import { Suspense } from "react"
import type { Metadata } from "next"
import BlogPostClient from "./BlogPostClient"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await blogStoreSupabase.getPost(params.slug)

    if (!post) {
      return {
        title: "Post Not Found | KT Portfolio",
        description: "The requested blog post could not be found.",
      }
    }

    return {
      title: `${post.title} | KT Portfolio`,
      description: post.intro,
      keywords: post.tags,
      openGraph: {
        title: post.title,
        description: post.intro,
        type: "article",
        images: post.imageUrls?.[0] ? [post.imageUrls[0]] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog Post | KT Portfolio",
      description: "Read the latest blog post from KT Portfolio.",
    }
  }
}

function BlogPostLoading() {
  return (
    <div className="min-h-screen royal-gradient">
      <div className="royal-container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading article...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<BlogPostLoading />}>
      <BlogPostClient slug={params.slug} />
    </Suspense>
  )
}
