import { blogStoreSupabase } from "./blog-store-supabase"

export async function checkDeploymentIntegrity() {
  try {
    console.log("🔍 Checking deployment integrity...")

    // Check if database schema exists
    const schemaInitialized = await blogStoreSupabase.initializeSchema()
    if (!schemaInitialized) {
      console.error("❌ Database schema initialization failed")
      return false
    }

    // Check if we can fetch posts (don't initialize sample data)
    const posts = await blogStoreSupabase.getAllPosts(true)
    console.log(`✅ Found ${posts.length} blog posts in database`)

    // Perform health check
    const healthCheck = await blogStoreSupabase.performHealthCheck()
    console.log(`📊 Health check status: ${healthCheck.status}`)

    if (healthCheck.issues.length > 0) {
      console.warn("⚠️ Health check issues:", healthCheck.issues)
    }

    return true
  } catch (error) {
    console.error("❌ Deployment integrity check failed:", error)
    return false
  }
}

// Run deployment check on server startup
if (typeof window === "undefined") {
  checkDeploymentIntegrity()
}
