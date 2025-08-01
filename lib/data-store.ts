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
  visible: boolean
  order: number
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
  visible?: boolean
  order?: number
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
  visible: boolean
  order: number
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
  visible?: boolean
  order?: number
}

export interface Experience {
  id: string
  year: string
  title: string
  organization: string
  type: string
  achievements: string[]
  skills: string[]
  visible: boolean
  order: number
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
  visible?: boolean
  order?: number
}

export interface HeroSection {
  id: string
  name: string
  title: string
  description: string
  profileImage: string
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateHeroSection {
  name: string
  title: string
  description: string
  profileImage: string
  visible?: boolean
}

export interface AboutSection {
  id: string
  title: string
  description: string
  profileImage: string
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAboutSection {
  title: string
  description: string
  profileImage: string
  visible?: boolean
}

class DataStore {
  // Certificates
  async getAllCertificates(includeAll = false): Promise<Certificate[]> {
    try {
      let query = supabase.from("certificates").select("*")

      if (!includeAll) {
        query = query.eq("visible", true)
      }

      const { data, error } = await query.order("order", { ascending: true }).order("created_at", { ascending: false })

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
          visible: cert.visible ?? true,
          order: cert.order ?? 0,
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
    // Get the next order number
    const { data: maxOrderData } = await supabase
      .from("certificates")
      .select("order")
      .order("order", { ascending: false })
      .limit(1)

    const nextOrder = (maxOrderData?.[0]?.order ?? -1) + 1

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
          visible: certificate.visible ?? true,
          order: certificate.order ?? nextOrder,
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
      visible: data.visible,
      order: data.order,
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
        visible: certificate.visible,
        order: certificate.order,
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
      visible: data.visible,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async updateCertificateOrder(items: { id: string; order: number }[]): Promise<void> {
    try {
      // Use Promise.allSettled to handle individual failures
      const results = await Promise.allSettled(
        items.map((item) =>
          supabase
            .from("certificates")
            .update({ order: item.order, updated_at: new Date().toISOString() })
            .eq("id", item.id),
        ),
      )

      // Check for any failures
      const failures = results.filter((result) => result.status === "rejected")
      if (failures.length > 0) {
        console.error("Some certificate order updates failed:", failures)
        throw new Error(`Failed to update ${failures.length} certificate orders`)
      }
    } catch (error) {
      console.error("Error updating certificate order:", error)
      throw new Error("Failed to update certificate order")
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
      let query = supabase.from("projects").select("*")

      if (!includeAll) {
        query = query.eq("visible", true)
      }

      const { data, error } = await query.order("order", { ascending: true }).order("created_at", { ascending: false })

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
          visible: project.visible ?? true,
          order: project.order ?? 0,
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
    // Get the next order number
    const { data: maxOrderData } = await supabase
      .from("projects")
      .select("order")
      .order("order", { ascending: false })
      .limit(1)

    const nextOrder = (maxOrderData?.[0]?.order ?? -1) + 1

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
          visible: project.visible ?? true,
          order: project.order ?? nextOrder,
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
      visible: data.visible,
      order: data.order,
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
        visible: project.visible,
        order: project.order,
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
      visible: data.visible,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async updateProjectOrder(items: { id: string; order: number }[]): Promise<void> {
    try {
      // Use Promise.allSettled to handle individual failures
      const results = await Promise.allSettled(
        items.map((item) =>
          supabase
            .from("projects")
            .update({ order: item.order, updated_at: new Date().toISOString() })
            .eq("id", item.id),
        ),
      )

      // Check for any failures
      const failures = results.filter((result) => result.status === "rejected")
      if (failures.length > 0) {
        console.error("Some project order updates failed:", failures)
        throw new Error(`Failed to update ${failures.length} project orders`)
      }
    } catch (error) {
      console.error("Error updating project order:", error)
      throw new Error("Failed to update project order")
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
      let query = supabase.from("experience").select("*")

      if (!includeAll) {
        query = query.eq("visible", true)
      }

      const { data, error } = await query.order("order", { ascending: true }).order("created_at", { ascending: false })

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
          visible: exp.visible ?? true,
          order: exp.order ?? 0,
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
    // Get the next order number
    const { data: maxOrderData } = await supabase
      .from("experience")
      .select("order")
      .order("order", { ascending: false })
      .limit(1)

    const nextOrder = (maxOrderData?.[0]?.order ?? -1) + 1

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
          visible: experience.visible ?? true,
          order: experience.order ?? nextOrder,
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
      visible: data.visible,
      order: data.order,
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
        visible: experience.visible,
        order: experience.order,
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
      visible: data.visible,
      order: data.order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async updateExperienceOrder(items: { id: string; order: number }[]): Promise<void> {
    try {
      // Use Promise.allSettled to handle individual failures
      const results = await Promise.allSettled(
        items.map((item) =>
          supabase
            .from("experience")
            .update({ order: item.order, updated_at: new Date().toISOString() })
            .eq("id", item.id),
        ),
      )

      // Check for any failures
      const failures = results.filter((result) => result.status === "rejected")
      if (failures.length > 0) {
        console.error("Some experience order updates failed:", failures)
        throw new Error(`Failed to update ${failures.length} experience orders`)
      }
    } catch (error) {
      console.error("Error updating experience order:", error)
      throw new Error("Failed to update experience order")
    }
  }

  async deleteExperience(id: string): Promise<void> {
    const { error } = await supabase.from("experience").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete experience: ${error.message}`)
    }
  }

  // Hero Section
  async getHeroSection(): Promise<HeroSection | null> {
    try {
      const { data, error } = await supabase
        .from("hero_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Error fetching hero section:", error)
        return null
      }

      if (!data || data.length === 0) {
        return null
      }

      const hero = data[0]
      return {
        id: hero.id,
        name: hero.name,
        title: hero.title,
        description: hero.description,
        profileImage: hero.profile_image,
        visible: hero.visible,
        createdAt: hero.created_at,
        updatedAt: hero.updated_at,
      }
    } catch (error) {
      console.error("Error in getHeroSection:", error)
      return null
    }
  }

  async updateHeroSection(hero: CreateHeroSection): Promise<HeroSection> {
    // First try to get existing hero section
    const { data: existing } = await supabase
      .from("hero_section")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)

    let data, error

    if (existing && existing.length > 0) {
      // Update existing
      const result = await supabase
        .from("hero_section")
        .update({
          name: hero.name,
          title: hero.title,
          description: hero.description,
          profile_image: hero.profileImage,
          visible: hero.visible ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing[0].id)
        .select()
        .single()

      data = result.data
      error = result.error
    } else {
      // Create new
      const result = await supabase
        .from("hero_section")
        .insert([
          {
            name: hero.name,
            title: hero.title,
            description: hero.description,
            profile_image: hero.profileImage,
            visible: hero.visible ?? true,
          },
        ])
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      throw new Error(`Failed to update hero section: ${error.message}`)
    }

    return {
      id: data.id,
      name: data.name,
      title: data.title,
      description: data.description,
      profileImage: data.profile_image,
      visible: data.visible,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  // About Section
  async getAboutSection(): Promise<AboutSection | null> {
    try {
      const { data, error } = await supabase
        .from("about_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Error fetching about section:", error)
        return null
      }

      if (!data || data.length === 0) {
        return null
      }

      const about = data[0]
      return {
        id: about.id,
        title: about.title,
        description: about.description,
        profileImage: about.profile_image,
        visible: about.visible,
        createdAt: about.created_at,
        updatedAt: about.updated_at,
      }
    } catch (error) {
      console.error("Error in getAboutSection:", error)
      return null
    }
  }

  async updateAboutSection(about: CreateAboutSection): Promise<AboutSection> {
    // First try to get existing about section
    const { data: existing } = await supabase
      .from("about_section")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)

    let data, error

    if (existing && existing.length > 0) {
      // Update existing
      const result = await supabase
        .from("about_section")
        .update({
          title: about.title,
          description: about.description,
          profile_image: about.profileImage,
          visible: about.visible ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing[0].id)
        .select()
        .single()

      data = result.data
      error = result.error
    } else {
      // Create new
      const result = await supabase
        .from("about_section")
        .insert([
          {
            title: about.title,
            description: about.description,
            profile_image: about.profileImage,
            visible: about.visible ?? true,
          },
        ])
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      throw new Error(`Failed to update about section: ${error.message}`)
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      profileImage: data.profile_image,
      visible: data.visible,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }
}

export const dataStore = new DataStore()
