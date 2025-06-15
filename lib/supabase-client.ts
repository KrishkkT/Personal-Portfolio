import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Client-side Supabase client
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    // Server-side: return null, use server client instead
    return null
  }

  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return null
    }

    try {
      supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Disable auth for blog functionality
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

// Server-side Supabase client
let serverSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getServerSupabaseClient() {
  if (!serverSupabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase server environment variables")
      return null
    }

    try {
      serverSupabaseClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        db: {
          schema: "public",
        },
        global: {
          headers: {
            "X-Client-Info": "blog-server",
          },
        },
      })
    } catch (error) {
      console.error("Failed to create Supabase server client:", error)
      return null
    }
  }

  return serverSupabaseClient
}

// Test connection function
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getServerSupabaseClient()
    if (!client) {
      return { success: false, error: "Failed to initialize Supabase client" }
    }

    // Test with a simple query
    const { error } = await client.from("blog_posts").select("count", { count: "exact", head: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown connection error",
    }
  }
}
