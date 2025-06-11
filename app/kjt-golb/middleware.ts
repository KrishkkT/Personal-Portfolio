import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for the blog management page
  if (request.nextUrl.pathname.startsWith("/kjt-golb")) {
    const basicAuth = request.headers.get("authorization")

    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1]
      const [user, pwd] = atob(authValue).split(":")

      if (user === "thekjt" && pwd === "passissecret") {
        return NextResponse.next()
      }
    }

    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Blog Management"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/kjt-golb/:path*",
}
