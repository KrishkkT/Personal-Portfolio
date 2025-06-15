import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/kjt-golb/:path*"],
}
