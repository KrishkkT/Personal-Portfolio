import type { Metadata } from "next"
import BlogPageClient from "./BlogPageClient"

export const metadata: Metadata = {
  title: "Blog - KT Portfolio | Technology Insights & Tutorials",
  description:
    "Explore comprehensive guides and insights on web development, cybersecurity, cloud computing, and modern technology trends. Stay updated with the latest best practices and industry knowledge.",
  keywords: [
    "blog",
    "web development",
    "cybersecurity",
    "cloud computing",
    "Next.js",
    "React",
    "AWS",
    "technology tutorials",
    "programming guides",
    "tech insights",
  ],
  openGraph: {
    title: "Blog - KT Portfolio | Technology Insights & Tutorials",
    description:
      "Explore comprehensive guides and insights on web development, cybersecurity, cloud computing, and modern technology trends.",
    url: "https://kjt.vercel.app/blog",
    type: "website",
    images: [
      {
        url: "/images/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "KT Portfolio Blog - Technology Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - KT Portfolio | Technology Insights & Tutorials",
    description:
      "Explore comprehensive guides and insights on web development, cybersecurity, cloud computing, and modern technology trends.",
    images: ["/images/blog-og.jpg"],
  },
  alternates: {
    canonical: "https://kjt.vercel.app/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function BlogPage() {
  return <BlogPageClient />
}
