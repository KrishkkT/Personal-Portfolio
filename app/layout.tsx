import type React from "react"
import type { Metadata } from "next"
import { Inter, Syne, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"
import SmoothScroll from "@/components/SmoothScroll"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BackToTop from "@/components/BackToTop"
import dynamic from "next/dynamic"
import "./globals.css"

const SceneBackground = dynamic(() => import("@/components/SceneBackground"), { ssr: false })

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap"
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap"
})

import Script from "next/script"

export const metadata: Metadata = {
  title: "Krish Thakker | Cloud Engineer & Full-Stack Developer",
  description: "Official portfolio of Krish Thakker — a cloud-focused full-stack developer building scalable applications, modern web experiences, and infrastructure-driven digital solutions. Gujarat, India.",
  keywords: ["Krish Thakker", "Full Stack Developer", "Cloud Developer", "AWS", "Next.js Portfolio", "Cybersecurity Specialist", "Krish Thakker Portfolio", "krishthakker.in", "Krish Thakkar", "Amazon Web Service", "Google Cloud", "Microsoft Azure", "Python", "React", "Next.js", "AWS", "Cybersecurity", "React Native", "Web Development", "Cloud Computing", "Infrastructure Automation", "Machine Learning", "Artificial Intelligence", "Data Science", "Full Stack Development", "Cloud Engineering", "Cloud Architecture", "Cloud Security", "Cloud Operations", "Cloud Administration", "Cloud Migration", "Cloud Native", "Cloud Agnostic", "Cloud Service Provider", "Cloud Platform", "Cloud Solution Architect", "Cloud Professional", "Cloud Practitioner", "Cloud Architect", "Cloud Developer", "Cloud Engineer", "Cloud Administrator", "Cloud Consultant", "Cloud Specialist", "Cloud Expert", "Cloud Guru", "Cloud Master"],
  authors: [{ name: "Krish Thakker" }],
  creator: "Krish Thakker",
  metadataBase: new URL("https://krishthakker.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://krishthakker.in",
    title: "Krish Thakker | Cloud & Full-Stack Developer",
    description: "Building scalable applications, cloud-native systems, and modern digital experiences with a focus on performance, usability, and clean design.",
    siteName: "Krish Thakker Portfolio",
    images: [{
      url: "/og-image.png", // Ensure this exists or I should tell user to add it
      width: 1200,
      height: 630,
      alt: "Krish Thakker Portfolio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Thakker | Cloud & Full-Stack Developer",
    description: "Building scalable applications, cloud-native systems, and modern digital experiences.",
    creator: "@krishthakker08", // assuming based on linkedin handle
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Krish Thakker",
    "url": "https://krishthakker.in",
    "image": "https://krishthakker.in/profile.jpg",
    "jobTitle": "Cloud & Full-Stack Developer",
    "sameAs": [
      "https://github.com/krishkkt",
      "https://linkedin.com/in/krishthakker08",
    ],
    "description": "Cloud-focused full-stack developer building scalable applications, infrastructure-driven systems, and modern web experiences.",
    "knowsAbout": ["AWS", "Google Cloud", "Microsoft Azure", "Python", "React", "Next.js", "AWS", "Cybersecurity", "React Native", "Web Development", "Cloud Computing", "Infrastructure Automation", "Machine Learning", "Artificial Intelligence", "Data Science", "Full Stack Development", "Cloud Engineering", "Cloud Architecture", "Cloud Security", "Cloud Operations", "Cloud Administration", "Cloud Migration", "Cloud Native", "Cloud Agnostic", "Cloud Service Provider", "Cloud Platform", "Cloud Solution Architect", "Cloud Professional", "Cloud Practitioner", "Cloud Architect", "Cloud Developer", "Cloud Engineer", "Cloud Administrator", "Cloud Consultant", "Cloud Specialist", "Cloud Expert", "Cloud Guru", "Cloud Master"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Gujarat",
      "addressCountry": "IN"
    }
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-body transition-colors duration-500 bg-background text-textPrimary selection:bg-accent/30 selection:text-textPrimary">
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <SceneBackground />
            <Navbar />
            <main className="relative z-10 w-full min-h-screen">
              {children}
            </main>
            <BackToTop />
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
