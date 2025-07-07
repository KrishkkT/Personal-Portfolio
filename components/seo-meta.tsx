"use client"

import Head from "next/head"
import { usePathname } from "next/navigation"

interface SeoMetaProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  twitterCard?: string
  noIndex?: boolean
  canonicalPath?: string
}

export default function SeoMeta({
  title = "Krish Thakker - Cybersecurity & AI developer",
  description = "Krish Thakker - Cybersecurity, AI & Cloud Enthusiast with expertise in Development. Delivering secure, scalable web applications with React, Next.js, and modern security practices.",
  keywords = [],
  ogImage = "/images/profile.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
  canonicalPath,
}: SeoMetaProps) {
  const pathname = usePathname()
  const baseUrl = "https://krishthakker.tech"
  const canonicalUrl = canonicalPath ? `${baseUrl}${canonicalPath}` : `${baseUrl}${pathname}`

  const defaultKeywords = [
    "Krish Thakker",
    "Full Stack Developer",
    "Cybersecurity Specialist",
    "Cloud Computing",
    "Web Development",
    "React Developer",
    "Next.js",
    "TypeScript",
    "UI/UX Design",
    "Portfolio",
  ]

  const allKeywords = [...defaultKeywords, ...keywords].join(", ")

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
    </Head>
  )
}
