export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          intro: string
          content: string
          date: string
          reading_time: number
          tags: string[]
          image_urls: string[]
          author: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          intro: string
          content: string
          date?: string
          reading_time?: number
          tags?: string[]
          image_urls?: string[]
          author?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          intro?: string
          content?: string
          date?: string
          reading_time?: number
          tags?: string[]
          image_urls?: string[]
          author?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
