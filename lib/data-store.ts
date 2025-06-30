import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Certificate {
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
  createdAt: string
  updatedAt: string
}

export interface CreateCertificate {
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
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  featured: boolean
  liveUrl: string
  githubUrl: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateProject {
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  featured: boolean
  liveUrl: string
  githubUrl: string
  status: string
}

export interface Experience {
  id: string
  year: string
  title: string
  organization: string
  type: string
  achievements: string[]
  skills: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateExperience {
  year: string
  title: string
  organization: string
  type: string
  achievements: string[]
  skills: string[]
}

class DataStore {
  // Certificates
  async getAllCertificates(includeAll = false): Promise<Certificate[]> {
    try {
      const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching certificates:", error)
        return []
      }

      return (
        data?.map((cert) => ({
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          date: cert.date,
          description: cert.description,
          skills: cert.skills || [],
          verified: cert.verified,
          status: cert.status,
          image: cert.image || "/placeholder.svg?height=200&width=400&text=Certificate",
          level: cert.level || "",
          hours: cert.hours || "",
          createdAt: cert.created_at,
          updatedAt: cert.updated_at,
        })) || []
      )
    } catch (error) {
      console.error("Error in getAllCertificates:", error)
      return []
    }
  }

  async addCertificate(certificate: CreateCertificate): Promise<Certificate> {
    const { data, error } = await supabase
      .from("certificates")
      .insert([
        {
          title: certificate.title,
          issuer: certificate.issuer,
          date: certificate.date,
          description: certificate.description,
          skills: certificate.skills,
          verified: certificate.verified,
          status: certificate.status,
          image: certificate.image,
          level: certificate.level,
          hours: certificate.hours,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add certificate: ${error.message}`)
    }

    return {
      id: data.id,
      title: data.title,
      issuer: data.issuer,
      date: data.date,
      description: data.description,
      skills: data.skills || [],
      verified: data.verified,
      status: data.status,
      image: data.image,
      level: data.level,
      hours: data.hours,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async updateCertificate(id: string, certificate: CreateCertificate): Promise<Certificate> {
    const { data, error } = await supabase
      .from("certificates")
      .update({
        title: certificate.title,
        issuer: certificate.issuer,
        date: certificate.date,
        description: certificate.description,
        skills: certificate.skills,
        verified: certificate.verified,
        status: certificate.status,
        image: certificate.image,
        level: certificate.level,
        hours: certificate.hours,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update certificate: ${error.message}`)
    }

    return {
      id: data.id,
      title: data.title,
      issuer: data.issuer,
      date: data.date,
      description: data.description,
      skills: data.skills || [],
      verified: data.verified,
      status: data.status,
      image: data.image,
      level: data.level,
      hours: data.hours,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async deleteCertificate(id: string): Promise<void> {
    const { error } = await supabase.from("certificates").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete certificate: ${error.message}`)
    }
  }

  // Projects
  async getAllProjects(includeAll = false): Promise<Project[]> {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        return []
      }

      return (
        data?.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          image: project.image || "/placeholder.svg?height=200&width=400&text=Project",
          technologies: project.technologies || [],
          category: project.category || "",
          featured: project.featured || false,
          liveUrl: project.live_url || "",
          githubUrl: project.github_url || "",
          status: project.status || "Live",
          createdAt: project.created_at,
          updatedAt: project.updated_at,
        })) || []
      )
    } catch (error) {
      console.error("Error in getAllProjects:", error)
      return []
    }
  }

  async addProject(project: CreateProject): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title: project.title,
          description: project.description,
          image: project.image,
          technologies: project.technologies,
          category: project.category,
          featured: project.featured,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          status: project.status,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add project: ${error.message}`)
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      technologies: data.technologies || [],
      category: data.category,
      featured: data.featured,
      liveUrl: data.live_url,
      githubUrl: data.github_url,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async updateProject(id: string, project: CreateProject): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update({
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies,
        category: project.category,
        featured: project.featured,
        live_url: project.liveUrl,
        github_url: project.githubUrl,
        status: project.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`)
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      technologies: data.technologies || [],
      category: data.category,
      featured: data.featured,
      liveUrl: data.live_url,
      githubUrl: data.github_url,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
    }
  }

  // Experience
  async getAllExperience(includeAll = false): Promise<Experience[]> {
    try {
      const { data, error } = await supabase.from("experience").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching experience:", error)
        return []
      }

      return (
        data?.map((exp) => ({
          id: exp.id,
          year: exp.year,
          title: exp.title,
          organization: exp.organization,
          type: exp.type,
          achievements: exp.achievements || [],
          skills: exp.skills || [],
          createdAt: exp.created_at,
          updatedAt: exp.updated_at,
        })) || []
      )
    } catch (error) {
      console.error("Error in getAllExperience:", error)
      return []
    }
  }

  async addExperience(experience: CreateExperience): Promise<Experience> {
    const { data, error } = await supabase
      .from("experience")
      .insert([
        {
          year: experience.year,
          title: experience.title,
          organization: experience.organization,
          type: experience.type,
          achievements: experience.achievements,
          skills: experience.skills,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add experience: ${error.message}`)
    }

    return {
      id: data.id,
      year: data.year,
      title: data.title,
      organization: data.organization,
      type: data.type,
      achievements: data.achievements || [],
      skills: data.skills || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async updateExperience(id: string, experience: CreateExperience): Promise<Experience> {
    const { data, error } = await supabase
      .from("experience")
      .update({
        year: experience.year,
        title: experience.title,
        organization: experience.organization,
        type: experience.type,
        achievements: experience.achievements,
        skills: experience.skills,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update experience: ${error.message}`)
    }

    return {
      id: data.id,
      year: data.year,
      title: data.title,
      organization: data.organization,
      type: data.type,
      achievements: data.achievements || [],
      skills: data.skills || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async deleteExperience(id: string): Promise<void> {
    const { error } = await supabase.from("experience").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete experience: ${error.message}`)
    }
  }
}

export const dataStore = new DataStore()
