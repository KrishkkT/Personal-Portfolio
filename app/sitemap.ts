import type { MetadataRoute } from "next"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://krishthakker.in"

  // Static routes
  const routes = [
    "",
    "/about",
    "/projects",
    "/experience",
    "/skills",
    "/certificates",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Dynamic blog routes
  try {
    const posts = await blogStoreSupabase.getAllPosts()
    const blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

    return [...routes, ...blogRoutes]
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error)
    return routes
  }
}
