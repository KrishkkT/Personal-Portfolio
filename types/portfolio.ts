export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  skills: string[]
  verified: boolean
  status: string
  image_url?: string
  level?: string
  hours?: string
  category?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  technologies: string[]
  category: string
  featured: boolean
  live_url?: string
  github_url?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  icon_name: string
  color: string
  category: string
  created_at: string
  updated_at: string
}

export interface PortfolioStats {
  totalCertificates: number
  totalProjects: number
  totalSkills: number
  totalBlogPosts: number
}
