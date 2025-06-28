import { createClient } from "@supabase/supabase-js"

// Types
export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  skills: string[]
  verified: boolean
  status: "Active" | "Expired" | "In Progress"
  image: string
  level: string
  hours?: string
  category?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCertificate {
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
  category?: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  image: string
  status: "Live" | "In Development" | "Completed"
  featured: boolean
  category: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateProject {
  title: string
  description: string
  image?: string
  technologies?: string[]
  category?: string
  featured?: boolean
  liveUrl?: string
  githubUrl?: string
  status?: string
}

export interface Experience {
  id: string
  title: string
  organization: string
  year: string
  type: "Education" | "Work" | "Internship" | "Certification"
  achievements: string[]
  skills: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateExperience {
  year: string
  title: string
  organization: string
  type: string
  achievements?: string[]
  skills?: string[]
}

// Fallback data
const fallbackCertificates: Certificate[] = [
  {
    id: "1",
    title: "Google Professional Cybersecurity",
    issuer: "Google via Coursera",
    date: "2025",
    description:
      "A beginner-friendly, hands-on course that builds foundational cybersecurity skills. It covers essential topics like threat types, risk management, incident response, SIEM tools, and network security.",
    skills: ["Network Security", "SOC Tools", "Python & Linux", "MySQL", "Incident Response"],
    verified: true,
    status: "Active",
    image: "/placeholder.svg?height=200&width=400&text=Google+Cybersecurity",
    level: "Professional",
    hours: "40",
    category: "Cybersecurity",
  },
  {
    id: "2",
    title: "Microsoft Cybersecurity Job Simulation",
    issuer: "Microsoft via Forage",
    date: "2025",
    description:
      "This virtual internship simulates a real-world analyst role. I worked on mock tasks like designing a Phishing email simulation and Interpret a phishing simulation result.",
    skills: ["Phishing Simulation", "Analysis of Simulation Results", "Microsoft Security Tools"],
    verified: true,
    status: "Active",
    image: "/placeholder.svg?height=200&width=400&text=Microsoft+Security",
    level: "Virtual Internship",
    hours: "20",
    category: "Cybersecurity",
  },
  {
    id: "3",
    title: "DSA using Java",
    issuer: "Government-certified (AICTE + NPTEL course)",
    date: "2024",
    description:
      "A comprehensive course that teaches core data structures and algorithms in Java, from arrays and linked lists to trees, graphs, and sorting algorithms.",
    skills: ["Data Structures", "Java Implementation", "Algorithms"],
    verified: true,
    status: "Active",
    image: "/placeholder.svg?height=200&width=400&text=DSA+Java",
    level: "Academic Certification",
    hours: "30",
    category: "Academic",
  },
  {
    id: "4",
    title: "Ethical Hacking",
    issuer: "Government-certified (AICTE + NPTEL course)",
    date: "2024",
    description:
      "An academic course focusing on ethical hacking from a theoretical and applied perspective. Covers system vulnerabilities, reconnaissance, malware, phishing, DoS attacks, network scanning, and cyber laws.",
    skills: ["Reconnaissance", "Offensive Attacks", "Footprinting and Analysis"],
    verified: true,
    status: "Active",
    image: "/placeholder.svg?height=200&width=400&text=Ethical+Hacking",
    level: "Academic Certification",
    hours: "25",
    category: "Cybersecurity",
  },
]

const fallbackProjects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website built with Next.js and TypeScript, featuring smooth animations and a comprehensive management system.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"],
    githubUrl: "https://github.com/username/portfolio",
    liveUrl: "https://kjt.vercel.app",
    image: "/placeholder.svg?height=200&width=400&text=Portfolio+Website",
    status: "Live",
    featured: true,
    category: "Web Development",
  },
  {
    id: "2",
    title: "Cybersecurity Dashboard",
    description:
      "A comprehensive security monitoring dashboard with real-time threat detection and analysis capabilities.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Chart.js"],
    githubUrl: "https://github.com/username/security-dashboard",
    image: "/placeholder.svg?height=200&width=400&text=Security+Dashboard",
    status: "In Development",
    featured: true,
    category: "Cybersecurity",
  },
  {
    id: "3",
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with secure payment processing and inventory management.",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Stripe", "Redis"],
    githubUrl: "https://github.com/username/ecommerce",
    liveUrl: "https://ecommerce-demo.vercel.app",
    image: "/placeholder.svg?height=200&width=400&text=E-commerce+Platform",
    status: "Live",
    featured: false,
    category: "Web Development",
  },
  {
    id: "4",
    title: "Network Scanner Tool",
    description: "A Python-based network scanning tool for security assessment and vulnerability detection.",
    technologies: ["Python", "Nmap", "Scapy", "Tkinter"],
    githubUrl: "https://github.com/username/network-scanner",
    image: "/placeholder.svg?height=200&width=400&text=Network+Scanner",
    status: "Completed",
    featured: false,
    category: "Cybersecurity",
  },
]

const fallbackExperience: Experience[] = [
  {
    id: "1",
    title: "B.Tech in Information Technology",
    organization: "Dharmsinh Desai University",
    year: "2023-2027",
    type: "Education",
    achievements: [
      "Specialized in Computer Science and Cybersecurity",
      "Completed multiple industry-relevant projects",
      "Participated in cybersecurity competitions and workshops",
    ],
    skills: ["Computer Science Fundamentals", "Programming", "Cybersecurity", "Database Management"],
  },
  {
    id: "2",
    title: "Full Stack Development Intern",
    organization: "Tech Startup",
    year: "2024",
    type: "Internship",
    achievements: [
      "Developed responsive web applications using React and Node.js",
      "Implemented secure authentication and authorization systems",
      "Collaborated with cross-functional teams in an agile environment",
    ],
    skills: ["React", "Node.js", "MongoDB", "Express.js", "JWT Authentication"],
  },
  {
    id: "3",
    title: "Cybersecurity Research Project",
    organization: "University Research Lab",
    year: "2024",
    type: "Certification",
    achievements: [
      "Conducted research on modern cybersecurity threats",
      "Developed security protocols for web applications",
      "Published findings in university research journal",
    ],
    skills: ["Security Research", "Vulnerability Assessment", "Penetration Testing", "Security Protocols"],
  },
  {
    id: "4",
    title: "Web Development Freelancer",
    organization: "Self-Employed",
    year: "2023-Present",
    type: "Work",
    achievements: [
      "Built and deployed 10+ client websites",
      "Maintained 99% client satisfaction rate",
      "Implemented SEO strategies resulting in 200% traffic increase",
    ],
    skills: ["React", "Next.js", "WordPress", "SEO", "Client Communication"],
  },
]

class DataStore {
  private static instance: DataStore
  private supabase: any = null
  private cachedCertificates: Certificate[] = []
  private cachedProjects: Project[] = []
  private cachedExperience: Experience[] = []
  private lastFetched = { certificates: 0, projects: 0, experience: 0 }
  private readonly CACHE_TTL = 30000 // 30 seconds cache

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore()
    }
    return DataStore.instance
  }

  constructor() {
    this.initializeSupabase()
  }

  private initializeSupabase() {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseKey) {
        this.supabase = createClient(supabaseUrl, supabaseKey)
        console.log("Supabase initialized successfully")
      } else {
        console.warn("Supabase environment variables not found, using fallback data")
      }
    } catch (error) {
      console.error("Failed to initialize Supabase:", error)
    }
  }

  // Certificates
  async getAllCertificates(forceRefresh = false): Promise<Certificate[]> {
    try {
      const now = Date.now()
      if (!forceRefresh && this.cachedCertificates.length > 0 && now - this.lastFetched.certificates < this.CACHE_TTL) {
        return [...this.cachedCertificates]
      }

      if (!this.supabase) {
        return fallbackCertificates
      }

      const { data, error } = await this.supabase.from("certificates").select("*").order("date", { ascending: false })

      if (error) {
        console.error("Error fetching certificates:", error)
        return fallbackCertificates
      }

      const certificates: Certificate[] = (data || []).map((cert: any) => ({
        id: cert.id,
        title: cert.title,
        issuer: cert.issuer,
        date: cert.date,
        description: cert.description,
        skills: cert.skills || [],
        verified: cert.verified !== false,
        status: cert.status || "Active",
        image: cert.image || "/placeholder.svg?height=200&width=400",
        level: cert.level || "",
        hours: cert.hours || "",
        category: cert.category || "",
        createdAt: cert.created_at,
        updatedAt: cert.updated_at,
      }))

      this.cachedCertificates = certificates
      this.lastFetched.certificates = now

      return certificates.length > 0 ? certificates : fallbackCertificates
    } catch (error) {
      console.error("Error in getAllCertificates:", error)
      return fallbackCertificates
    }
  }

  async addCertificate(certificate: CreateCertificate): Promise<Certificate | null> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const now = new Date().toISOString()
      const insertData = {
        id: crypto.randomUUID(),
        title: certificate.title,
        issuer: certificate.issuer,
        date: certificate.date,
        description: certificate.description,
        skills: certificate.skills || [],
        verified: certificate.verified !== false,
        status: certificate.status || "Active",
        image: certificate.image || "",
        level: certificate.level || "",
        hours: certificate.hours || "",
        category: certificate.category || "",
        created_at: now,
        updated_at: now,
      }

      const { data, error } = await this.supabase.from("certificates").insert(insertData).select().single()

      if (error) {
        console.error("Error inserting certificate:", error)
        throw error
      }

      const newCertificate: Certificate = {
        id: data.id,
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        description: data.description,
        skills: data.skills || [],
        verified: data.verified !== false,
        status: data.status || "Active",
        image: data.image || "",
        level: data.level || "",
        hours: data.hours || "",
        category: data.category || "",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      this.cachedCertificates = [newCertificate, ...this.cachedCertificates.filter((c) => c.id !== newCertificate.id)]
      return newCertificate
    } catch (error) {
      console.error("Error adding certificate:", error)
      throw error
    }
  }

  async updateCertificate(id: string, updates: Partial<CreateCertificate>): Promise<Certificate | null> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const now = new Date().toISOString()
      const updateData = {
        ...updates,
        updated_at: now,
      }

      const { data, error } = await this.supabase.from("certificates").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Error updating certificate:", error)
        throw error
      }

      const updatedCertificate: Certificate = {
        id: data.id,
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        description: data.description,
        skills: data.skills || [],
        verified: data.verified !== false,
        status: data.status || "Active",
        image: data.image || "",
        level: data.level || "",
        hours: data.hours || "",
        category: data.category || "",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      this.cachedCertificates = this.cachedCertificates.map((cert) =>
        cert.id === updatedCertificate.id ? updatedCertificate : cert,
      )
      return updatedCertificate
    } catch (error) {
      console.error("Error updating certificate:", error)
      throw error
    }
  }

  async deleteCertificate(id: string): Promise<boolean> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const { error } = await this.supabase.from("certificates").delete().eq("id", id)

      if (error) {
        console.error("Error deleting certificate:", error)
        throw error
      }

      this.cachedCertificates = this.cachedCertificates.filter((cert) => cert.id !== id)
      return true
    } catch (error) {
      console.error("Error deleting certificate:", error)
      throw error
    }
  }

  // Projects
  async getAllProjects(forceRefresh = false): Promise<Project[]> {
    try {
      const now = Date.now()
      if (!forceRefresh && this.cachedProjects.length > 0 && now - this.lastFetched.projects < this.CACHE_TTL) {
        return [...this.cachedProjects]
      }

      if (!this.supabase) {
        return fallbackProjects
      }

      const { data, error } = await this.supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        return fallbackProjects
      }

      const projects: Project[] = (data || []).map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image || "/placeholder.svg?height=200&width=400",
        technologies: project.technologies || [],
        category: project.category || "",
        featured: project.featured !== false,
        liveUrl: project.live_url || "",
        githubUrl: project.github_url || "",
        status: project.status || "Live",
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }))

      this.cachedProjects = projects
      this.lastFetched.projects = now

      return projects.length > 0 ? projects : fallbackProjects
    } catch (error) {
      console.error("Error in getAllProjects:", error)
      return fallbackProjects
    }
  }

  async addProject(project: CreateProject): Promise<Project | null> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const now = new Date().toISOString()
      const insertData = {
        id: crypto.randomUUID(),
        title: project.title,
        description: project.description,
        image: project.image || "",
        technologies: project.technologies || [],
        category: project.category || "",
        featured: project.featured !== false,
        live_url: project.liveUrl || "",
        github_url: project.githubUrl || "",
        status: project.status || "Live",
        created_at: now,
        updated_at: now,
      }

      const { data, error } = await this.supabase.from("projects").insert(insertData).select().single()

      if (error) {
        console.error("Error inserting project:", error)
        throw error
      }

      const newProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image || "",
        technologies: data.technologies || [],
        category: data.category || "",
        featured: data.featured !== false,
        liveUrl: data.live_url || "",
        githubUrl: data.github_url || "",
        status: data.status || "Live",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      this.cachedProjects = [newProject, ...this.cachedProjects.filter((p) => p.id !== newProject.id)]
      return newProject
    } catch (error) {
      console.error("Error adding project:", error)
      throw error
    }
  }

  async updateProject(id: string, updates: Partial<CreateProject>): Promise<Project | null> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const now = new Date().toISOString()
      const updateData = {
        title: updates.title,
        description: updates.description,
        image: updates.image,
        technologies: updates.technologies,
        category: updates.category,
        featured: updates.featured,
        live_url: updates.liveUrl,
        github_url: updates.githubUrl,
        status: updates.status,
        updated_at: now,
      }

      const { data, error } = await this.supabase.from("projects").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Error updating project:", error)
        throw error
      }

      const updatedProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image || "",
        technologies: data.technologies || [],
        category: data.category || "",
        featured: data.featured !== false,
        liveUrl: data.live_url || "",
        githubUrl: data.github_url || "",
        status: data.status || "Live",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      this.cachedProjects = this.cachedProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      )
      return updatedProject
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const { error } = await this.supabase.from("projects").delete().eq("id", id)

      if (error) {
        console.error("Error deleting project:", error)
        throw error
      }

      this.cachedProjects = this.cachedProjects.filter((project) => project.id !== id)
      return true
    } catch (error) {
      console.error("Error deleting project:", error)
      throw error
    }
  }

  // Experience
  async getAllExperience(forceRefresh = false): Promise<Experience[]> {
    try {
      const now = Date.now()
      if (!forceRefresh && this.cachedExperience.length > 0 && now - this.lastFetched.experience < this.CACHE_TTL) {
        return [...this.cachedExperience]
      }

      if (!this.supabase) {
        return fallbackExperience
      }

      const { data, error } = await this.supabase.from("experience").select("*").order("year", { ascending: false })

      if (error) {
        console.error("Error fetching experience:", error)
        return fallbackExperience
      }

      const experience: Experience[] = (data || []).map((exp: any) => ({
        id: exp.id,
        year: exp.year,
        title: exp.title,
        organization: exp.organization,
        type: exp.type,
        achievements: exp.achievements || [],
        skills: exp.skills || [],
        createdAt: exp.created_at,
        updatedAt: exp.updated_at,
      }))

      this.cachedExperience = experience
      this.lastFetched.experience = now

      return experience.length > 0 ? experience : fallbackExperience
    } catch (error) {
      console.error("Error in getAllExperience:", error)
      return fallbackExperience
    }
  }

  async addExperience(experience: CreateExperience): Promise<Experience | null> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const now = new Date().toISOString()
      const insertData = {
        id: crypto.randomUUID(),
        year: experience.year,
        title: experience.title,
        organization: experience.organization,
        type: experience.type,
        achievements: experience.achievements || [],
        skills: experience.skills || [],
        created_at: now,
        updated_at: now,
      }

      const { data, error } = await this.supabase.from("experience").insert(insertData).select().single()

      if (error) {
        console.error("Error inserting experience:", error)
        throw error
      }

      const newExperience: Experience = {
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

      this.cachedExperience = [newExperience, ...this.cachedExperience.filter((e) => e.id !== newExperience.id)]
      return newExperience
    } catch (error) {
      console.error("Error adding experience:", error)
      throw error
    }
  }

  async updateExperience(id: string, updates: Partial<CreateExperience>): Promise<Experience | null> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const now = new Date().toISOString()
      const updateData = {
        ...updates,
        updated_at: now,
      }

      const { data, error } = await this.supabase.from("experience").update(updateData).eq("id", id).select().single()

      if (error) {
        console.error("Error updating experience:", error)
        throw error
      }

      const updatedExperience: Experience = {
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

      this.cachedExperience = this.cachedExperience.map((exp) =>
        exp.id === updatedExperience.id ? updatedExperience : exp,
      )
      return updatedExperience
    } catch (error) {
      console.error("Error updating experience:", error)
      throw error
    }
  }

  async deleteExperience(id: string): Promise<boolean> {
    try {
      if (!this.supabase) {
        throw new Error("Supabase not initialized")
      }

      const { error } = await this.supabase.from("experience").delete().eq("id", id)

      if (error) {
        console.error("Error deleting experience:", error)
        throw error
      }

      this.cachedExperience = this.cachedExperience.filter((exp) => exp.id !== id)
      return true
    } catch (error) {
      console.error("Error deleting experience:", error)
      throw error
    }
  }
}

export const dataStore = DataStore.getInstance()
