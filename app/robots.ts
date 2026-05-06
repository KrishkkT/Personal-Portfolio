import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://krishthakker.in"
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/kjt-golb/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
