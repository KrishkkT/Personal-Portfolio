import type { Metadata } from "next"
import BlogPageClient from "./BlogPageClient"

export const metadata: Metadata = {
  title: "Blog - KT Portfolio",
  description:
    "Read the latest insights, tutorials, and thoughts on technology, development, and cybersecurity by Krish Thakker.",
  keywords: "blog, technology, development, cybersecurity, tutorials, insights, programming",
  openGraph: {
    title: "Blog - KT Portfolio",
    description: "Read the latest insights, tutorials, and thoughts on technology, development, and cybersecurity.",
    url: "https://kjt.vercel.app/blog",
    type: "website",
  },
}

export default function BlogPage() {
  return <BlogPageClient />
}
