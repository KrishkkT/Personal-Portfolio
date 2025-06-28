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
      certificates: {
        Row: {
          id: string
          title: string
          issuer: string
          date: string
          description: string
          skills: string[]
          verified: boolean
          status: string
          image: string
          level: string
          hours: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          issuer: string
          date: string
          description: string
          skills?: string[]
          verified?: boolean
          status?: string
          image?: string
          level?: string
          hours?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          issuer?: string
          date?: string
          description?: string
          skills?: string[]
          verified?: boolean
          status?: string
          image?: string
          level?: string
          hours?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image: string
          technologies: string[]
          category: string
          featured: boolean
          live_url: string
          github_url: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image?: string
          technologies?: string[]
          category?: string
          featured?: boolean
          live_url?: string
          github_url?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image?: string
          technologies?: string[]
          category?: string
          featured?: boolean
          live_url?: string
          github_url?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          year: string
          title: string
          organization: string
          type: string
          achievements: string[]
          skills: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          year: string
          title: string
          organization: string
          type?: string
          achievements?: string[]
          skills?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          year?: string
          title?: string
          organization?: string
          type?: string
          achievements?: string[]
          skills?: string[]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
