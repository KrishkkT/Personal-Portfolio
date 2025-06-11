import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import EnhancedPreloader from "@/components/enhanced-preloader"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"], display: "swap" })

// Define keywords for SEO
const keywords = [
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
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Gujarat Developer",
  "India Tech",
  "Ethical Hacking",
  "Cloud Security",
  "Web Security",
  "Professional Portfolio",
]

export const metadata: Metadata = {
  metadataBase: new URL("https://kjt.vercel.app"),
  title: {
    default: "KT - Full Stack Developer & Cybersecurity Enthusiast and Specialist",
    template: "%s | KT Portfolio",
  },
  description:
    "Krish Thakker - Cybersecurity, Cloud & Full Stack Development Enthusiast. Delivering secure, scalable web applications with React, Next.js, and modern security practices.",
  keywords: keywords,
  authors: [{ name: "Krish Thakker", url: "https://kjt.vercel.app" }],
  creator: "Krish Thakker",
  publisher: "Krish Thakker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "KT - Full Stack Developer & Cybersecurity Enthusiast and Specialist",
    description:
      "Krish Thakker - Cybersecurity, Cloud & Full Stack Development Enthusiast. Delivering secure, scalable web applications with React, Next.js, and modern security practices.",
    url: "https://kjt.vercel.app",
    siteName: "KT Portfolio",
    images: [
      {
        url: "/images/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Krish Thakker - Full Stack Developer & Cybersecurity Specialist",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KT - Full Stack Developer & Cybersecurity Enthusiast &Specialist",
    description:
      "Cybersecurity, Cloud & Full Stack Development Enthusiast. Delivering secure, scalable web applications with React, Next.js, and modern security practices.",
    images: ["/images/profile.jpg"],
    creator: "@krishthakker08",
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
  icons: {
    icon: "/images/favicon.jpg",
    shortcut: "/images/favicon.jpg",
    apple: "/images/favicon.jpg",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/images/favicon.jpg",
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code when available
  },
  category: "technology",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Immediate scroll prevention
                if (typeof window !== 'undefined') {
                  window.history.scrollRestoration = 'manual';
                  
                  // Force scroll to top immediately
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                  if (document.body) document.body.scrollTop = 0;
                }
              })();
            `,
          }}
        />
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/Inter-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <EnhancedPreloader />
        <div data-barba="wrapper">{children}</div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgb(31 41 55)",
              color: "rgb(243 244 246)",
              border: "1px solid rgb(75 85 99)",
            },
          }}
        />

        {/* Structured data for Person */}
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Krish Thakker",
              url: "https://kjt.vercel.app",
              image: "https://kjt.vercel.app/images/profile.jpg",
              sameAs: ["https://github.com/krishkkt", "https://linkedin.com/in/krishthakker08"],
              jobTitle: "Full Stack Developer & Cybersecurity Enthusiast & Specialist",
              worksFor: {
                "@type": "Organization",
                name: "Independent Professional",
              },
              description:
                "Cybersecurity, Cloud & Full Stack Development Enthusiast. Delivering secure, scalable web applications with React, Next.js, and modern security practices.",
              knowsAbout: [
                "Full Stack Development",
                "Cybersecurity",
                "Cloud Computing",
                "React",
                "Next.js",
                "TypeScript",
                "Ethical Hacking",
              ],
            }),
          }}
        />

        {/* Structured data for WebSite */}
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://kjt.vercel.app",
              name: "KT - Full Stack Developer & Cybersecurity Specialist",
              description:
                "Professional portfolio of Krish Thakker, showcasing expertise in Full Stack Development, Cybersecurity, and Cloud Computing.",
              author: {
                "@type": "Person",
                name: "Krish Thakker",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://kjt.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
