import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of bots to block (aggressive scrapers/spam bots)
const BLOCKED_BOTS = [
  "ahrefsbot",
  "semrushbot",
  "dotbot",
  "mj12bot",
  "megaindex.ru",
  "zoominfobot",
  "mail.ru_bot",
  "petalbot",
  "criteobot",
  "rogerbot",
  "proximic",
  "webmeup-crawler",
  "exabot",
  "meanpathbot",
  "pubnub",
]

// AI and Search Engines to explicitly allow (even if they seem like scrapers)
const ALLOWED_BOTS = [
  "googlebot",
  "bingbot",
  "gptbot",
  "chatgpt-user",
  "claude-web",
  "ccbot",
  "perplexitybot",
  "applebot",
  "yandexbot",
  "baiduspider",
  "duckduckbot",
]

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || ""

  // 1. Bot Protection Logic
  const isAllowedBot = ALLOWED_BOTS.some((bot) => userAgent.includes(bot))
  const isBlockedBot = BLOCKED_BOTS.some((bot) => userAgent.includes(bot))

  // Block identified malicious bots unless they are in the allowed list (unlikely overlap but safe)
  if (isBlockedBot && !isAllowedBot) {
    return new NextResponse("Access Denied: Bot Traffic Blocked", { status: 403 })
  }

  // Block empty user agents as they are often used in simple bot scripts
  if (!userAgent || userAgent.length < 10) {
    // Only block if it's not a common system request (like internal Vercel health checks)
    if (!request.nextUrl.pathname.includes("_next")) {
      return new NextResponse("Access Denied: Invalid User Agent", { status: 403 })
    }
  }

  const response = NextResponse.next()

  // Security headers
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
    "connect-src 'self' https://*.supabase.co https://vercel.live wss://*.supabase.co https://api.ipify.org https://formspree.io",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://formspree.io",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")

  response.headers.set("Content-Security-Policy", csp)

  // Cache Control
  if (
    request.nextUrl.pathname.startsWith("/images/") ||
    request.nextUrl.pathname.startsWith("/icons/") ||
    request.nextUrl.pathname.startsWith("/fonts/") ||
    request.nextUrl.pathname.startsWith("/audio/")
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, max-age=0")
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
}
