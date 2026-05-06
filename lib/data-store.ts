import { getSupabaseClient } from "./supabase-client"

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
  providerUrl?: string
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
  providerUrl?: string
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
  statTitle1?: string
  statValue1?: string
  statTitle2?: string
  statValue2?: string
  visible: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateHeroSection {
  name: string
  title: string
  description: string
  profileImage: string
  statTitle1?: string
  statValue1?: string
  statTitle2?: string
  statValue2?: string
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

export interface SkillCategory {
  id: string
  title: string
  icon: string
  skills: string[]
  span: string
  visible: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateSkillCategory {
  title: string
  icon: string
  skills: string[]
  span: string
  visible?: boolean
  order?: number
}

class DataStore {
  private get supabase() {
    return getSupabaseClient()
  }

  // Fix order values function
  async fixOrderValues(): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    try {
      // Fix certificates
      const { data: certificates } = await supabase
        .from("certificates")
        .select("id")
        .order("created_at", { ascending: true })

      if (certificates) {
        for (let i = 0; i < certificates.length; i++) {
          await supabase.from("certificates").update({ order: i }).eq("id", certificates[i].id)
        }
      }

      // Fix projects
      const { data: projects } = await supabase.from("projects").select("id").order("created_at", { ascending: true })

      if (projects) {
        for (let i = 0; i < projects.length; i++) {
          await supabase.from("projects").update({ order: i }).eq("id", projects[i].id)
        }
      }

      // Fix experience
      const { data: experience } = await supabase
        .from("experience")
        .select("id")
        .order("created_at", { ascending: true })

      if (experience) {
        for (let i = 0; i < experience.length; i++) {
          await supabase.from("experience").update({ order: i }).eq("id", experience[i].id)
        }
      }

      // Fix skills
      const { data: skills } = await supabase
        .from("skill_categories")
        .select("id")
        .order("created_at", { ascending: true })

      if (skills) {
        for (let i = 0; i < skills.length; i++) {
          await supabase.from("skill_categories").update({ order: i }).eq("id", skills[i].id)
        }
      }
    } catch (error) {
      throw error
    }
  }

  // Certificates
  async getAllCertificates(includeAll = false): Promise<Certificate[]> {
    const supabase = this.supabase
    if (!supabase) return []
    try {
      let query = supabase.from("certificates").select("*")

      if (!includeAll) {
        query = query.eq("visible", true)
      }

      const { data, error } = await query.order("order", { ascending: true }).order("created_at", { ascending: false })

      if (error) {
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
          providerUrl: cert.provider_url || "",
        })) || []
      )
    } catch (error) {
      return []
    }
  }

  async addCertificate(certificate: CreateCertificate): Promise<Certificate> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
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
        category: certificate.category,
        visible: certificate.visible ?? true,
        order: certificate.order ?? nextOrder,
        provider_url: certificate.providerUrl || "",
      }

      const { data, error } = await supabase.from("certificates").insert([insertData]).select().single()

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
        providerUrl: data.provider_url || "",
      }
    } catch (error) {
      throw error
    }
  }

  async updateCertificate(id: string, certificate: Partial<CreateCertificate>): Promise<Certificate> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
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
      if (certificate.providerUrl !== undefined) updateData.provider_url = certificate.providerUrl

      const { data, error } = await supabase.from("certificates").update(updateData).eq("id", id).select().single()

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
        providerUrl: data.provider_url || "",
      }
    } catch (error) {
      throw error
    }
  }

  async updateCertificateOrder(items: { id: string; order: number }[]): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    try {
      // Process updates one by one to ensure they complete
      for (const item of items) {
        const { data, error } = await supabase
          .from("certificates")
          .update({
            order: item.order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
          .select()

        if (error) {
          throw new Error(`Failed to update certificate order: ${error.message}`)
        }
      }
    } catch (error) {
      throw error
    }
  }

  async deleteCertificate(id: string): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    const { error } = await supabase.from("certificates").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete certificate: ${error.message}`)
    }
  }

  // Projects
  async getAllProjects(includeAll = false): Promise<Project[]> {
    const supabase = this.supabase
    if (!supabase) return []
    try {
      let query = supabase.from("projects").select("*")

      if (!includeAll) {
        query = query.eq("visible", true)
      }

      const { data, error } = await query.order("order", { ascending: true }).order("created_at", { ascending: false })

      if (error) {
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
      return []
    }
  }

  async addProject(project: CreateProject): Promise<Project> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
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
      throw error
    }
  }

  async updateProject(id: string, project: Partial<CreateProject>): Promise<Project> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
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
      throw error
    }
  }

  async updateProjectOrder(items: { id: string; order: number }[]): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    try {
      // Process updates one by one to ensure they complete
      for (const item of items) {
        const { data, error } = await supabase
          .from("projects")
          .update({
            order: item.order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
          .select()

        if (error) {
          throw new Error(`Failed to update project order: ${error.message}`)
        }
      }
    } catch (error) {
      throw error
    }
  }

  async deleteProject(id: string): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
    }
  }

  // Experience
  async getAllExperience(includeAll = false): Promise<Experience[]> {
    const supabase = this.supabase
    if (!supabase) return []
    try {
      let query = supabase.from("experience").select("*")

      if (!includeAll) {
        query = query.eq("visible", true)
      }

      const { data, error } = await query.order("order", { ascending: true }).order("created_at", { ascending: false })

      if (error) {
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
      return []
    }
  }

  async addExperience(experience: CreateExperience): Promise<Experience> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
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
      throw error
    }
  }

  async updateExperience(id: string, experience: Partial<CreateExperience>): Promise<Experience> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
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
      throw error
    }
  }

  async updateExperienceOrder(items: { id: string; order: number }[]): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    try {
      // Process updates one by one to ensure they complete
      for (const item of items) {
        const { data, error } = await supabase
          .from("experience")
          .update({
            order: item.order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
          .select()

        if (error) {
          throw new Error(`Failed to update experience order: ${error.message}`)
        }
      }
    } catch (error) {
      throw error
    }
  }

  async deleteExperience(id: string): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    const { error } = await supabase.from("experience").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete experience: ${error.message}`)
    }
  }

  // Hero Section
  async getHeroSection(): Promise<HeroSection | null> {
    const supabase = this.supabase
    if (!supabase) return null
    try {
      const { data, error } = await supabase
        .from("hero_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
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
        statTitle1: hero.stat_title_1,
        statValue1: hero.stat_value_1,
        statTitle2: hero.stat_title_2,
        statValue2: hero.stat_value_2,
        visible: hero.visible,
        createdAt: hero.created_at,
        updatedAt: hero.updated_at,
      }
    } catch (error) {
      return null
    }
  }

  async updateHeroSection(hero: CreateHeroSection): Promise<HeroSection> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
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
            stat_title_1: hero.statTitle1,
            stat_value_1: hero.statValue1,
            stat_title_2: hero.statTitle2,
            stat_value_2: hero.statValue2,
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
            stat_title_1: hero.statTitle1,
            stat_value_1: hero.statValue1,
            stat_title_2: hero.statTitle2,
            stat_value_2: hero.statValue2,
            visible: hero.visible ?? true,
          },
          ])
          .select()
          .single()

        data = result.data
        error = result.error
      }

      if (error) {
        console.error("Supabase Error Updating Hero:", error)
        throw new Error(`Failed to update hero section: ${error.message}`)
      }

      if (!data) {
        throw new Error("No data returned from updateHeroSection")
      }

      return {
        id: data.id,
        name: data.name,
        title: data.title,
        description: data.description,
        profileImage: data.profile_image,
        statTitle1: data.stat_title_1,
        statValue1: data.stat_value_1,
        statTitle2: data.stat_title_2,
        statValue2: data.stat_value_2,
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
    const supabase = this.supabase
    if (!supabase) return null
    try {
      const { data, error } = await supabase
        .from("about_section")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
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
      return null
    }
  }

  async updateAboutSection(about: CreateAboutSection): Promise<AboutSection> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
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
        console.error("Supabase Error Updating About:", error)
        throw new Error(`Failed to update about section: ${error.message}`)
      }

      if (!data) {
        throw new Error("No data returned from updateAboutSection")
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

  // Skill Categories
  async getAllSkillCategories(includeAll = false): Promise<SkillCategory[]> {
    const supabase = this.supabase
    if (!supabase) return []
    try {
      let query = supabase.from("skill_categories").select("*")

      if (!includeAll) {
        query = query.eq("visible", true)
      }

      const { data, error } = await query.order("order", { ascending: true }).order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase Error Fetching Skills:", error)
        return []
      }

      return (
        data?.map((cat) => ({
          id: cat.id,
          title: cat.title,
          icon: cat.icon || "Layout",
          skills: cat.skills || [],
          span: cat.span || "md:col-span-6",
          visible: cat.visible ?? true,
          order: cat.order ?? 0,
          createdAt: cat.created_at,
          updatedAt: cat.updated_at,
        })) || []
      )
    } catch (error) {
      console.error("Error in getAllSkillCategories:", error)
      return []
    }
  }

  async addSkillCategory(category: CreateSkillCategory): Promise<SkillCategory> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
    try {
      const { data: maxOrderData } = await supabase
        .from("skill_categories")
        .select("order")
        .order("order", { ascending: false })
        .limit(1)

      const nextOrder = (maxOrderData?.[0]?.order ?? -1) + 1

      const { data, error } = await supabase
        .from("skill_categories")
        .insert([
          {
            title: category.title,
            icon: category.icon,
            skills: category.skills,
            span: category.span,
            visible: category.visible ?? true,
            order: category.order ?? nextOrder,
          },
        ])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to add skill category: ${error.message}`)
      }

      return {
        id: data.id,
        title: data.title,
        icon: data.icon,
        skills: data.skills || [],
        span: data.span,
        visible: data.visible ?? true,
        order: data.order ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      throw error
    }
  }

  async updateSkillCategory(id: string, category: Partial<CreateSkillCategory>): Promise<SkillCategory> {
    const supabase = this.supabase
    if (!supabase) throw new Error("Supabase client not available")
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (category.title !== undefined) updateData.title = category.title
      if (category.icon !== undefined) updateData.icon = category.icon
      if (category.skills !== undefined) updateData.skills = category.skills
      if (category.span !== undefined) updateData.span = category.span
      if (category.visible !== undefined) updateData.visible = category.visible
      if (category.order !== undefined) updateData.order = category.order

      const { data, error } = await supabase.from("skill_categories").update(updateData).eq("id", id).select().single()

      if (error) {
        throw new Error(`Failed to update skill category: ${error.message}`)
      }

      return {
        id: data.id,
        title: data.title,
        icon: data.icon,
        skills: data.skills || [],
        span: data.span,
        visible: data.visible ?? true,
        order: data.order ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      throw error
    }
  }

  async updateSkillCategoryOrder(items: { id: string; order: number }[]): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    try {
      for (const item of items) {
        await supabase
          .from("skill_categories")
          .update({
            order: item.order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id)
      }
    } catch (error) {
      throw error
    }
  }

  async deleteSkillCategory(id: string): Promise<void> {
    const supabase = this.supabase
    if (!supabase) return
    const { error } = await supabase.from("skill_categories").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete skill category: ${error.message}`)
    }
  }
}

export const dataStore = new DataStore()
