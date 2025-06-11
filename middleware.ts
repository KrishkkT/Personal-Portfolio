import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Only apply to /kjt-golb routes
  if (path.startsWith("/kjt-golb")) {
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

  return NextResponse.next()
}

function isValidAuthHeader(authHeader: string): boolean {
  if (!authHeader.startsWith("Basic ")) return false

  // Extract the base64 encoded credentials
  const base64Credentials = authHeader.split(" ")[1]
  if (!base64Credentials) return false

  // Decode the credentials
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8")
  const [username, password] = credentials.split(":")

  // Check against hardcoded credentials
  return username === "thekjt" && password === "passissecret"
}

export const config = {
  matcher: "/kjt-golb/:path*",
}
