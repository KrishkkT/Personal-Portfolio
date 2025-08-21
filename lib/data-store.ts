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
  category: string
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
  category: string
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
          verified: cert.verified ?? true,
          status: cert.status || "Active",
          image: cert.image || "/placeholder.svg?height=200&width=400&text=Certificate",
          level: cert.level || "",
          hours: cert.hours || "",
          category: cert.category || "Professional",
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
    try {
      // Get the next order number
      const { data: maxOrderData } = await supabase
        .from("certificates")
        .select("order")
        .order("order", { ascending: false })
        .limit(1)

      const nextOrder = (maxOrderData?.[0]?.order ?? -1) + 1

      const insertData: any = {
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
      }

      // Only add category if it's provided
      if (certificate.category) {
        insertData.category = certificate.category
      }

      const { data, error } = await supabase.from("certificates").insert([insertData]).select().single()

      if (error) {
        console.error("Database error:", error)
        throw new Error(`Failed to add certificate: ${error.message}`)
      }

      return {
        id: data.id,
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        description: data.description,
        skills: data.skills || [],
        verified: data.verified ?? true,
        status: data.status || "Active",
        image: data.image,
        level: data.level || "",
        hours: data.hours || "",
        category: data.category || "Professional",
        visible: data.visible ?? true,
        order: data.order ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error in addCertificate:", error)
      throw error
    }
  }

  async updateCertificate(id: string, certificate: Partial<CreateCertificate>): Promise<Certificate> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (certificate.title !== undefined) updateData.title = certificate.title
      if (certificate.issuer !== undefined) updateData.issuer = certificate.issuer
      if (certificate.date !== undefined) updateData.date = certificate.date
      if (certificate.description !== undefined) updateData.description = certificate.description
      if (certificate.skills !== undefined) updateData.skills = certificate.skills
      if (certificate.verified !== undefined) updateData.verified = certificate.verified
      if (certificate.status !== undefined) updateData.status = certificate.status
      if (certificate.image !== undefined) updateData.image = certificate.image
      if (certificate.level !== undefined) updateData.level = certificate.level
      if (certificate.hours !== undefined) updateData.hours = certificate.hours
      if (certificate.category !== undefined) updateData.category = certificate.category
      if (certificate.visible !== undefined) updateData.visible = certificate.visible
      if (certificate.order !== undefined) updateData.order = certificate.order

      const { data, error } = await supabase.from("certificates").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Database error:", error)
        throw new Error(`Failed to update certificate: ${error.message}`)
      }

      return {
        id: data.id,
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        description: data.description,
        skills: data.skills || [],
        verified: data.verified ?? true,
        status: data.status || "Active",
        image: data.image,
        level: data.level || "",
        hours: data.hours || "",
        category: data.category || "Professional",
        visible: data.visible ?? true,
        order: data.order ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error in updateCertificate:", error)
      throw error
    }
  }

  async updateCertificateOrder(items: { id: string; order: number }[]): Promise<void> {
    try {
      console.log("Starting certificate order update:", items)

      for (const item of items) {
        console.log(`Updating certificate ${item.id} to order ${item.order}`)

        const { error } = await supabase
          .from("certificates")
          .update({
            order: item.order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        if (error) {
          console.error(`Failed to update certificate ${item.id}:`, error)
          throw new Error(`Failed to update certificate order: ${error.message}`)
        }

        // Add a small delay to prevent race conditions
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      console.log("Certificate order update completed successfully")
    } catch (error) {
      console.error("Error updating certificate order:", error)
      throw error
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
    try {
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
        console.error("Database error:", error)
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
        visible: data.visible ?? true,
        order: data.order ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error in addProject:", error)
      throw error
    }
  }

  async updateProject(id: string, project: Partial<CreateProject>): Promise<Project> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (project.title !== undefined) updateData.title = project.title
      if (project.description !== undefined) updateData.description = project.description
      if (project.image !== undefined) updateData.image = project.image
      if (project.technologies !== undefined) updateData.technologies = project.technologies
      if (project.category !== undefined) updateData.category = project.category
      if (project.featured !== undefined) updateData.featured = project.featured
      if (project.liveUrl !== undefined) updateData.live_url = project.liveUrl
      if (project.githubUrl !== undefined) updateData.github_url = project.githubUrl
      if (project.status !== undefined) updateData.status = project.status
      if (project.visible !== undefined) updateData.visible = project.visible
      if (project.order !== undefined) updateData.order = project.order

      const { data, error } = await supabase.from("projects").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Database error:", error)
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
        visible: data.visible ?? true,
        order: data.order ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error in updateProject:", error)
      throw error
    }
  }

  async updateProjectOrder(items: { id: string; order: number }[]): Promise<void> {
    try {
      console.log("Starting project order update:", items)

      for (const item of items) {
        console.log(`Updating project ${item.id} to order ${item.order}`)

        const { error } = await supabase
          .from("projects")
          .update({
            order: item.order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        if (error) {
          console.error(`Failed to update project ${item.id}:`, error)
          throw new Error(`Failed to update project order: ${error.message}`)
        }

        // Add a small delay to prevent race conditions
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      console.log("Project order update completed successfully")
    } catch (error) {
      console.error("Error updating project order:", error)
      throw error
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
    try {
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
        console.error("Database error:", error)
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
        visible: data.visible ?? true,
        order: data.order ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error in addExperience:", error)
      throw error
    }
  }

  async updateExperience(id: string, experience: Partial<CreateExperience>): Promise<Experience> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (experience.year !== undefined) updateData.year = experience.year
      if (experience.title !== undefined) updateData.title = experience.title
      if (experience.organization !== undefined) updateData.organization = experience.organization
      if (experience.type !== undefined) updateData.type = experience.type
      if (experience.achievements !== undefined) updateData.achievements = experience.achievements
      if (experience.skills !== undefined) updateData.skills = experience.skills
      if (experience.visible !== undefined) updateData.visible = experience.visible
      if (experience.order !== undefined) updateData.order = experience.order

      const { data, error } = await supabase.from("experience").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Database error:", error)
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
        visible: data.visible ?? true,
        order: data.order ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error in updateExperience:", error)
      throw error
    }
  }

  async updateExperienceOrder(items: { id: string; order: number }[]): Promise<void> {
    try {
      console.log("Starting experience order update:", items)

      for (const item of items) {
        console.log(`Updating experience ${item.id} to order ${item.order}`)

        const { error } = await supabase
          .from("experience")
          .update({
            order: item.order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        if (error) {
          console.error(`Failed to update experience ${item.id}:`, error)
          throw new Error(`Failed to update experience order: ${error.message}`)
        }

        // Add a small delay to prevent race conditions
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      console.log("Experience order update completed successfully")
    } catch (error) {
      console.error("Error updating experience order:", error)
      throw error
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
    try {
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
        console.error("Database error:", error)
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
    } catch (error) {
      console.error("Error in updateHeroSection:", error)
      throw error
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
    try {
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
        console.error("Database error:", error)
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
    } catch (error) {
      console.error("Error in updateAboutSection:", error)
      throw error
    }
  }
}

export const dataStore = new DataStore()
