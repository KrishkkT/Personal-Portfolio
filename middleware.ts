import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
  )
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Blog management authentication
  if (request.nextUrl.pathname.startsWith("/kjt-golb")) {
    const authHeader = request.headers.get("authorization")
    const adminToken = process.env.BLOG_ADMIN_TOKEN || "secure-admin-token-2024"

    if (!authHeader || !isValidAuthHeader(authHeader, adminToken)) {
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

function isValidAuthHeader(authHeader: string, expectedToken: string): boolean {
  if (!authHeader.startsWith("Basic ")) return false

  const base64Credentials = authHeader.split(" ")[1]
  if (!base64Credentials) return false

  try {
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8")
    const [username, password] = credentials.split(":")
    return username === "thekjt" && password === expectedToken
  } catch {
    return false
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/kjt-golb/:path*"],
}
