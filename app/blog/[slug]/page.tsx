import type { Metadata } from "next"
import BlogPostClient from "./BlogPostClient"

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blog/${params.slug}`,
    )

    if (!response.ok) {
      return {
        title: "Blog Post Not Found - KT Portfolio",
        description: "The requested blog post could not be found.",
      }
    }

    const post = await response.json()

    return {
      title: `${post.title} - KT Portfolio`,
      description: post.intro,
      keywords: post.tags.join(", "),
      openGraph: {
        title: post.title,
        description: post.intro,
        url: `https://kjt.vercel.app/blog/${post.slug}`,
        type: "article",
        images: post.imageUrls.length > 0 ? [post.imageUrls[0]] : [],
        publishedTime: post.date,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.intro,
        images: post.imageUrls.length > 0 ? [post.imageUrls[0]] : [],
      },
    }
  } catch (error) {
    return {
      title: "Blog Post Not Found - KT Portfolio",
      description: "The requested blog post could not be found.",
    }
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPostClient slug={params.slug} />
}
