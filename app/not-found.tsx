"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-accent mb-4 opacity-20">404</h1>
          <h2 className="text-2xl font-semibold text-textPrimary mb-2">Page Not Found</h2>
          <p className="text-textSecondary">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-xl">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full border-border text-textSecondary hover:bg-surface h-12 rounded-xl bg-transparent"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 text-[10px] uppercase tracking-widest text-textTertiary font-bold">
          <p>Sequence Terminated: 404</p>
        </div>
      </div>
    </div>
  )
}
