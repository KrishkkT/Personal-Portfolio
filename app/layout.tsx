import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import EnhancedPreloader from "@/components/enhanced-preloader"
import Navigation from "@/components/navigation"
import { Toaster } from "sonner"
import ErrorBoundary from "@/components/error-boundary"

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://kjt.vercel.app"),
  title: {
    default: "KT - Cybersecurity Aspiring Professional",
    template: "%s | KT Portfolio",
  },
  description:
    "Krish Thakker - It started with curiosity—how do systems work, and how can they break? Now, I'm focused on turning that curiosity into action by combining cybersecurity with automation to build things that are both secure and meaningful.",
  keywords: keywords,
  authors: [{ name: "Krish Thakker", url: "https://krishthakker.tech" }],
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
    title: "KT - Passionate About Cybersecurity & Innovation",
    description:
      "Krish Thakker - It started with curiosity—how do systems work, and how can they break? Now, I'm focused on turning that curiosity into action by combining cybersecurity with automation to build things that are both secure and meaningful.",
    url: "https://krishthakker.tech",
    siteName: "KT Portfolio",
    images: [
      {
        url: "/icon",
        width: 1200,
        height: 630,
        alt: "Krish Thakker - Passionate About Cybersecurity & Innovation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KT - Passionate About Cybersecurity & Innovation",
    description:
      "It started with curiosity—how do systems work, and how can they break? Now, I'm focused on turning that curiosity into action by combining cybersecurity with automation to build things that are both secure and meaningful.",
    images: ["/icon"],
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
  verification: {
    google: "QaiaeL9bLstYRJQ2d81_Boxs22j9QRYvEifbC8cQ5i0",
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
                if (typeof window !== 'undefined') {
                  window.history.scrollRestoration = 'manual';
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                  if (document.body) document.body.scrollTop = 0;
                }
              })();
            `,
          }}
        />
        <link rel="preload" href="/fonts/Inter-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KT Portfolio" />
        <meta name="application-name" content="KT Portfolio" />
        <meta name="msapplication-TileColor" content="#111827" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <EnhancedPreloader />
          <div data-barba="wrapper">
            <Navigation />
            <main className="relative z-10">{children}</main>
          </div>
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

          <Script
            id="schema-person"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Krish Thakker",
                url: "https://krishthakker.tech",
                image: "https://krishthakker.tech/icon",
                sameAs: ["https://github.com/krishkkt", "https://linkedin.com/in/krishthakker08"],
                jobTitle: "Passionate About Cybersecurity & Innovation",
                worksFor: {
                  "@type": "Organization",
                  name: "Independent Professional",
                },
                description:
                  "It started with curiosity—how do systems work, and how can they break? Now, I'm focused on turning that curiosity into action by combining cybersecurity with automation to build things that are both secure and meaningful.",
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

          <Script
            id="schema-website"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                url: "https://krishthakker.tech",
                name: "KT - Passionate about Cybersecurity & Innovation",
                description:
                  "It started with curiosity—how do systems work, and how can they break? Now, I'm focused on turning that curiosity into action by combining cybersecurity with automation to build things that are both secure and meaningful.",
                author: {
                  "@type": "Person",
                  name: "Krish Thakker",
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://krishthakker.tech/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  )
}
