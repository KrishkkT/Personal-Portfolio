"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import Head from "next/head"

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | KT - Full Stack Developer & Cybersecurity Specialist</title>
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center dark-gradient text-white">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-8xl font-bold gradient-text">404</h1>
            <h2 className="text-3xl font-semibold">Page Not Found</h2>
            <p className="text-gray-300 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/" aria-label="Return to homepage">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
