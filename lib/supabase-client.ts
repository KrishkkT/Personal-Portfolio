import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Singleton pattern for Supabase client
let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
        console.warn("Supabase environment variables are missing. Some features may not work.")
    }
    return null
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
    return supabaseInstance
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    return null
  }
}

// Server-side Supabase client
export function getServerSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Missing Supabase server environment variables")
    return null
  }

  try {
      return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
  } catch (error) {
    console.error("Failed to initialize Server Supabase client:", error)
    return null
  }
}

// Test Supabase connection
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return { success: false, error: "Environment variables missing" }
    const { error } = await supabase.from("_connection_test").select("*").limit(0)
    // We ignore error if it's just 'table not found' as long as we reached Supabase
    if (error && error.code !== "PGRST116" && error.code !== "42P01") {
        return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Export a getter to prevent top-level execution crash
export const supabase = getSupabaseClient();
