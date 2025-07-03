import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Portal | KT Portfolio",
  description: "Secure admin portal for content management",
  robots: "noindex, nofollow",
}

export default function KjtGolbLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
