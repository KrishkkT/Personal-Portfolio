import { Suspense } from "react"
import BlogPageClient from "./BlogPageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | KT Portfolio",
  description: "Insights, tutorials, and thoughts on web development, cybersecurity, and modern technology trends.",
  keywords: ["blog", "web development", "cybersecurity", "technology", "tutorials"],
  openGraph: {
    title: "Blog | KT Portfolio",
    description: "Insights, tutorials, and thoughts on web development, cybersecurity, and modern technology trends.",
    type: "website",
  },
}

function BlogPageLoading() {
  return (
    <div className="min-h-screen royal-gradient">
      <div className="royal-container py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-700/50 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-700/30 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid gap-8 md:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="royal-card animate-pulse p-8">
                <div className="h-6 bg-gray-700/50 rounded mb-4"></div>
                <div className="h-4 bg-gray-700/30 rounded mb-2"></div>
                <div className="h-4 bg-gray-700/30 rounded mb-6 w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-700/30 rounded w-16"></div>
                  <div className="h-6 bg-gray-700/30 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogPageLoading />}>
      <BlogPageClient />
    </Suspense>
  )
}
