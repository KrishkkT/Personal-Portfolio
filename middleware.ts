import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Comprehensive security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://vercel.live wss://*.supabase.co",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")

  response.headers.set("Content-Security-Policy", csp)

  // Cache Control for different resource types
  if (
    request.nextUrl.pathname.startsWith("/images/") ||
    request.nextUrl.pathname.startsWith("/icons/") ||
    request.nextUrl.pathname.startsWith("/fonts/")
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  }

  // API Routes Cache Control
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, max-age=0")
  }

  // Handle blog management authentication
  if (request.nextUrl.pathname.startsWith("/kjt-golb")) {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !isValidAuthHeader(authHeader)) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Blog Management", charset="UTF-8"',
        },
      })
    }
  }

  return response
}

function isValidAuthHeader(authHeader: string): boolean {
  if (!authHeader.startsWith("Basic ")) return false

  const base64Credentials = authHeader.split(" ")[1]
  if (!base64Credentials) return false

  try {
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8")
    const [username, password] = credentials.split(":")
    return username === "thekjt" && password === "passissecret"
  } catch {
    return false
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)", "/kjt-golb/:path*"],
}
