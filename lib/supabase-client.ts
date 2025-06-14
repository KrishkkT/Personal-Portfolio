import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Server-side Supabase client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Get client-side Supabase client
export function getSupabaseClient() {
  return supabase
}

// Get server-side Supabase client
export function getServerSupabaseClient() {
  return supabaseAdmin
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabaseAdmin.from("blog_posts").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Supabase connection test failed:", error)
      return false
    }

    console.log("Supabase connection successful")
    return true
  } catch (error) {
    console.error("Supabase connection error:", error)
    return false
  }
}
