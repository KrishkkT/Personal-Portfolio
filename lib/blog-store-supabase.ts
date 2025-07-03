import { createClient } from "@supabase/supabase-js"
import type { BlogPost } from "@/types/blog"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export const blogStoreSupabase = {
  async getAllPosts(includeUnpublished = false): Promise<BlogPost[]> {
    try {
      let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

      if (!includeUnpublished) {
        query = query.eq("published", true)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching posts:", error)
        return []
      }

      return (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        intro: post.intro,
        content: post.content,
        tags: post.tags || [],
        imageUrls: post.image_urls || [],
        published: post.published,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        author: post.author || "KT",
        date: post.created_at,
        readingTime: Math.ceil(post.content?.split(" ").length / 200) || 5,
      }))
    } catch (error) {
      console.error("Error in getAllPosts:", error)
      return []
    }
  },

  async getPosts(limit?: number): Promise<BlogPost[]> {
    try {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching posts:", error)
        return []
      }

      return (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        intro: post.intro,
        content: post.content,
        tags: post.tags || [],
        imageUrls: post.image_urls || [],
        published: post.published,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        author: post.author || "KT",
        date: post.created_at,
        readingTime: Math.ceil(post.content?.split(" ").length / 200) || 5,
      }))
    } catch (error) {
      console.error("Error in getPosts:", error)
      return []
    }
  },

  async getPost(slug: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single()

      if (error) {
        console.error("Error fetching post:", error)
        return null
      }

      if (!data) return null

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        intro: data.intro,
        content: data.content,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        published: data.published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        author: data.author || "KT",
        date: data.created_at,
        readingTime: Math.ceil(data.content?.split(" ").length / 200) || 5,
      }
    } catch (error) {
      console.error("Error in getPost:", error)
      return null
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.getPost(slug)
  },

  async addPost(postData: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: postData.title,
          slug: postData.slug,
          intro: postData.intro,
          content: postData.content,
          tags: postData.tags || [],
          image_urls: postData.imageUrls || [],
          published: postData.published ?? true,
          author: postData.author || "KT",
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding post:", error)
        return null
      }

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        intro: data.intro,
        content: data.content,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        published: data.published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        author: data.author || "KT",
        date: data.created_at,
        readingTime: Math.ceil(data.content?.split(" ").length / 200) || 5,
      }
    } catch (error) {
      console.error("Error in addPost:", error)
      return null
    }
  },

  async updatePost(slug: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const updateData: any = {}
      if (postData.title) updateData.title = postData.title
      if (postData.intro) updateData.intro = postData.intro
      if (postData.content) updateData.content = postData.content
      if (postData.tags) updateData.tags = postData.tags
      if (postData.imageUrls) updateData.image_urls = postData.imageUrls
      if (postData.published !== undefined) updateData.published = postData.published
      if (postData.author) updateData.author = postData.author

      const { data, error } = await supabase.from("blog_posts").update(updateData).eq("slug", slug).select().single()

      if (error) {
        console.error("Error updating post:", error)
        return null
      }

      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        intro: data.intro,
        content: data.content,
        tags: data.tags || [],
        imageUrls: data.image_urls || [],
        published: data.published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        author: data.author || "KT",
        date: data.created_at,
        readingTime: Math.ceil(data.content?.split(" ").length / 200) || 5,
      }
    } catch (error) {
      console.error("Error in updatePost:", error)
      return null
    }
  },

  async deletePost(slug: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("slug", slug)

      if (error) {
        console.error("Error deleting post:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in deletePost:", error)
      return false
    }
  },
}
