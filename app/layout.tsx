import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import LoadingFallback from "@/components/loading-fallback"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Krish Thakker - Cybersecurity Specialist & Full Stack Developer",
  description:
    "Building secure, scalable digital solutions through cybersecurity expertise and innovative development.",
  keywords: ["cybersecurity", "full stack developer", "web development", "security", "portfolio"],
  authors: [{ name: "Krish Thakker" }],
  creator: "Krish Thakker",
  publisher: "Krish Thakker",
  openGraph: {
    title: "Krish Thakker - Cybersecurity Specialist & Full Stack Developer",
    description:
      "Building secure, scalable digital solutions through cybersecurity expertise and innovative development.",
    url: "https://krishthakker.com",
    siteName: "Krish Thakker Portfolio",
    images: [
      {
        url: "/images/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Krish Thakker - Cybersecurity Specialist & Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Thakker - Cybersecurity Specialist & Full Stack Developer",
    description:
      "Building secure, scalable digital solutions through cybersecurity expertise and innovative development.",
    images: ["/images/profile.jpg"],
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
    generator: 'v0.dev'
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
