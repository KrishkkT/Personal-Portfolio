import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }

  return supabaseInstance
}

// Export the same client for server operations
export function getServerSupabaseClient(): SupabaseClient {
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
      return { success: false, error: `Database connection error: ${error.message}` }
    }

    return { success: true }
  } catch (error) {
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
    return {
      url: "",
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

export const supabase = getSupabaseClient()
