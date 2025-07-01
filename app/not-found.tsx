import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-yellow-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Error Code: 404</p>
        </div>
      </div>
    </div>
  )
}
