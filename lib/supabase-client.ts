import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Single Supabase client that works in both client and server environments
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables:", {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey,
      })
      return null
    }

    try {
      supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
        db: {
          schema: "public",
        },
        global: {
          headers: {
            "X-Client-Info": "blog-client",
          },
        },
      })
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      return null
    }
  }

  return supabaseClient
}

// Use the same client for server operations since we only have public keys
export function getServerSupabaseClient() {
  return getSupabaseClient()
}

// Test connection function
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      return { success: false, error: "Failed to initialize Supabase client - check environment variables" }
    }

    // Test with a simple query to blog_posts table
    const { error } = await client.from("blog_posts").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: `Database connection error: ${error.message}` }
    }

    return { success: true }
  } catch (error) {
    console.error("Supabase connection test exception:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown connection error",
    }
  }
}

// Image upload function using Vercel Blob
export async function uploadImage(file: File): Promise<{ url: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Upload failed")
    }

    const data = await response.json()
    return { url: data.url }
  } catch (error) {
    console.error("Image upload error:", error)
    return {
      url: "",
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}
