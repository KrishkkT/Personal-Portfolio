"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Award,
  Briefcase,
  User,
  ExternalLink,
  Github,
  CheckCircle,
  Diamond,
  Sparkles,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Home,
  UserCircle,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { blogStoreSupabase } from "@/lib/blog-store-supabase"
import { dataStore } from "@/lib/data-store"
import ImageUpload from "@/components/image-upload"
import type { BlogPost } from "@/types/blog"
import type {
  Certificate,
  CreateCertificate,
  Project,
  CreateProject,
  Experience,
  CreateExperience,
  HeroSection,
  CreateHeroSection,
  AboutSection,
  CreateAboutSection,
  SkillCategory,
  CreateSkillCategory,
} from "@/lib/data-store"
import { GlassCard } from "@/components/ui/GlassCard"
import { GlassButton } from "@/components/ui/GlassButton"
import { Code2, Database, Smartphone, Cloud, Cpu, Globe, Layers, Layout } from "lucide-react"

const ICON_MAP: Record<string, React.ReactNode> = {
  Layout: <Layout className="w-5 h-5 text-accent" />,
  Database: <Database className="w-5 h-5 text-accent" />,
  Smartphone: <Smartphone className="w-5 h-5 text-accent" />,
  Code2: <Code2 className="w-5 h-5 text-accent" />,
  Cloud: <Cloud className="w-5 h-5 text-accent" />,
  Cpu: <Cpu className="w-5 h-5 text-accent" />,
  Globe: <Globe className="w-5 h-5 text-accent" />,
  Layers: <Layers className="w-5 h-5 text-accent" />,
}

export default function BlogManagement() {
  // Blog state
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    intro: "",
    content: "",
    tags: [] as string[],
    imageUrls: [] as string[],
    published: true,
  })

  // Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [certFormData, setCertFormData] = useState<CreateCertificate>({
    title: "",
    issuer: "",
    date: "",
    description: "",
    skills: [],
    verified: true,
    status: "Active",
    image: "",
    level: "",
    hours: "",
    category: "Professional",
    visible: true,
    order: 0,
    providerUrl: "",
  })

  // Projects state
  const [projects, setProjects] = useState<Project[]>([])
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectFormData, setProjectFormData] = useState<CreateProject>({
    title: "",
    description: "",
    image: "",
    technologies: [],
    category: "",
    featured: false,
    liveUrl: "",
    githubUrl: "",
    status: "Live",
    visible: true,
    order: 0,
  })

  // Experience state
  const [experience, setExperience] = useState<Experience[]>([])
  const [isExpDialogOpen, setIsExpDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [expFormData, setExpFormData] = useState<CreateExperience>({
    year: "",
    title: "",
    organization: "",
    type: "Education",
    achievements: [],
    skills: [],
    visible: true,
    order: 0,
  })

  // Hero section state
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null)
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false)
  const [heroFormData, setHeroFormData] = useState<CreateHeroSection>({
    name: "Krish Thakker",
    title: "Cybersecurity Specialist & Full Stack Developer",
    description:
      "Building secure, scalable digital solutions through cybersecurity expertise and innovative development.",
    profileImage: "/images/profile.jpg",
    visible: true,
  })

  // About section state
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null)
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false)
  const [aboutFormData, setAboutFormData] = useState<CreateAboutSection>({
    title: "About Me",
    description:
      "I am a passionate Cybersecurity Specialist and Full Stack Developer with expertise in penetration testing, cloud security, and modern web development. I love creating secure, innovative solutions that make a difference.",
    profileImage: "/images/profile.jpg",
    visible: true,
  })

  // Skills state
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<SkillCategory | null>(null)
  const [skillFormData, setSkillFormData] = useState<CreateSkillCategory>({
    title: "",
    icon: "Layout",
    skills: [],
    span: "md:col-span-6",
    visible: true,
    order: 0,
  })

  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalCertificates: 0,
    totalProjects: 0,
    totalExperience: 0,
    totalSkills: 0,
  })
  const [submitStatus, setSubmitStatus] = useState<{
    message: string
    type: "success" | "error" | "loading" | ""
  }>({ message: "", type: "" })

  // Load all data
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setIsLoading(true)
    try {
      const [postsData, certificatesData, projectsData, experienceData, heroData, aboutData, skillsData] = await Promise.all([
        blogStoreSupabase.getAllPosts(true),
        dataStore.getAllCertificates(true),
        dataStore.getAllProjects(true),
        dataStore.getAllExperience(true),
        dataStore.getHeroSection(),
        dataStore.getAboutSection(),
        dataStore.getAllSkillCategories(true),
      ])

      // Sort the data by order before setting state
      certificatesData.sort((a, b) => a.order - b.order)
      projectsData.sort((a, b) => a.order - b.order)
      experienceData.sort((a, b) => a.order - b.order)

      setPosts(postsData)
      setCertificates(certificatesData)
      setProjects(projectsData)
      setExperience(experienceData)
      setHeroSection(heroData)
      setAboutSection(aboutData)
      setSkillCategories(skillsData)

      // Set form data if sections exist, otherwise keep defaults
      if (heroData) {
        setHeroFormData({
          name: heroData.name,
          title: heroData.title,
          description: heroData.description,
          profileImage: heroData.profileImage,
          statTitle1: heroData.statTitle1 || "",
          statValue1: heroData.statValue1 || "",
          statTitle2: heroData.statTitle2 || "",
          statValue2: heroData.statValue2 || "",
          visible: heroData.visible,
        })
      }

      if (aboutData) {
        setAboutFormData({
          title: aboutData.title,
          description: aboutData.description,
          profileImage: aboutData.profileImage,
          visible: aboutData.visible,
        })
      }

      setStats({
        totalPosts: postsData.length,
        publishedPosts: postsData.filter((p) => p.published).length,
        totalCertificates: certificatesData.length,
        totalProjects: projectsData.length,
        totalExperience: experienceData.length,
        totalSkills: skillsData.length,
      })
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  // Visibility toggle functions
  const toggleVisibility = async (type: string, id: string, currentVisibility: boolean) => {
    try {
      setSubmitStatus({ message: "Updating visibility...", type: "loading" })

      if (type === "certificate") {
        await dataStore.updateCertificate(id, { visible: !currentVisibility })
        toast.success(`Certificate ${!currentVisibility ? "shown" : "hidden"} on website`)
      } else if (type === "project") {
        await dataStore.updateProject(id, { visible: !currentVisibility })
        toast.success(`Project ${!currentVisibility ? "shown" : "hidden"} on website`)
      } else if (type === "experience") {
        await dataStore.updateExperience(id, { visible: !currentVisibility })
        toast.success(`Experience ${!currentVisibility ? "shown" : "hidden"} on website`)
      } else if (type === "skills") {
        await dataStore.updateSkillCategory(id, { visible: !currentVisibility })
        toast.success(`Skill category ${!currentVisibility ? "shown" : "hidden"} on website`)
      }

      await loadAllData()
      setSubmitStatus({ message: "Visibility updated!", type: "success" })
    } catch (error) {
      toast.error("Failed to update visibility")
      setSubmitStatus({ message: "Failed to update visibility", type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 2000)
  }

  // Order management function
  const moveItem = async (type: string, id: string, direction: "up" | "down") => {
    try {
      setSubmitStatus({ message: "Reordering items...", type: "loading" })

      // Get the current items based on type
      let items: any[] = []
      if (type === "certificate") {
        items = [...certificates]
      } else if (type === "project") {
        items = [...projects]
      } else if (type === "experience") {
        items = [...experience]
      } else if (type === "skills") {
        items = [...skillCategories]
      }

      // Sort by current order to get the correct sequence
      items.sort((a, b) => a.order - b.order)

      const currentIndex = items.findIndex((item) => item.id === id)
      if (currentIndex === -1) {
        toast.error("Item not found")
        setSubmitStatus({ message: "", type: "" })
        return
      }

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= items.length) {
        toast.info(`Cannot move ${direction} - already at ${direction === "up" ? "top" : "bottom"}`)
        setSubmitStatus({ message: "", type: "" })
        return
      }

      // Get the two items to swap
      const currentItem = items[currentIndex]
      const targetItem = items[newIndex]

      // Check if orders are the same (this is the problem!)
      if (currentItem.order === targetItem.order) {
        toast.error("Order values need to be fixed. Please run the database fix script first.")
        setSubmitStatus({ message: "Order values need to be fixed", type: "error" })
        return
      }

      // Swap the orders directly in the database
      const currentNewOrder = targetItem.order
      const targetNewOrder = currentItem.order

      // Update both items in the database
      if (type === "certificate") {
        await dataStore.updateCertificate(currentItem.id, { order: currentNewOrder })
        await dataStore.updateCertificate(targetItem.id, { order: targetNewOrder })
      } else if (type === "project") {
        await dataStore.updateProject(currentItem.id, { order: currentNewOrder })
        await dataStore.updateProject(targetItem.id, { order: targetNewOrder })
      } else if (type === "experience") {
        await dataStore.updateExperience(currentItem.id, { order: currentNewOrder })
        await dataStore.updateExperience(targetItem.id, { order: targetNewOrder })
      } else if (type === "skills") {
        await dataStore.updateSkillCategory(currentItem.id, { order: currentNewOrder })
        await dataStore.updateSkillCategory(targetItem.id, { order: targetNewOrder })
      }

      // Force reload data to reflect changes
      await loadAllData()

      toast.success(`${type} order updated successfully`)
      setSubmitStatus({ message: "Order updated!", type: "success" })
    } catch (error) {
      toast.error("Failed to update order")
      setSubmitStatus({ message: "Failed to update order", type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 2000)
  }

  // Function to fix order values
  const fixOrderValues = async () => {
    try {
      setSubmitStatus({ message: "Fixing order values...", type: "loading" })

      await dataStore.fixOrderValues()
      await loadAllData()

      toast.success("Order values fixed successfully!")
      setSubmitStatus({ message: "Order values fixed!", type: "success" })
    } catch (error) {
      toast.error("Failed to fix order values")
      setSubmitStatus({ message: "Failed to fix order values", type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 3000)
  }

  // Hero section functions
  const handleSubmitHero = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!heroFormData.name.trim() || !heroFormData.title.trim()) {
      toast.error("Name and title are required")
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      await dataStore.updateHeroSection(heroFormData)
      await loadAllData()
      setIsHeroDialogOpen(false)
      toast.success("Hero section updated successfully")
      setSubmitStatus({ message: "Success!", type: "success" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save hero section"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 3000)
  }

  // About section functions
  const handleSubmitAbout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aboutFormData.title.trim() || !aboutFormData.description.trim()) {
      toast.error("Title and description are required")
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      await dataStore.updateAboutSection(aboutFormData)
      await loadAllData()
      setIsAboutDialogOpen(false)
      toast.success("About section updated successfully")
      setSubmitStatus({ message: "Success!", type: "success" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save about section"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 3000)
  }

  // Blog functions
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required")
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      if (editingPost) {
        await blogStoreSupabase.updatePost(editingPost.slug, formData)
        toast.success("Post updated successfully")
      } else {
        // Generate slug if not provided
        if (!formData.slug) {
          formData.slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        }
        await blogStoreSupabase.addPost(formData)
        toast.success("Post created successfully")
      }
      await loadAllData()
      resetPostForm()
      setIsDialogOpen(false)
      setSubmitStatus({ message: "Success!", type: "success" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save post"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 3000)
  }

  const handleDeletePost = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setSubmitStatus({ message: "Deleting...", type: "loading" })
      try {
        await blogStoreSupabase.deletePost(slug)
        await loadAllData()
        toast.success("Post deleted successfully")
        setSubmitStatus({ message: "Deleted successfully!", type: "success" })
      } catch (error) {
        toast.error("Failed to delete post")
        setSubmitStatus({ message: "Failed to delete post", type: "error" })
      }

      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    }
  }

  const resetPostForm = () => {
    setFormData({
      title: "",
      slug: "",
      intro: "",
      content: "",
      tags: [],
      imageUrls: [],
      published: true,
    })
    setEditingPost(null)
  }

  // Certificate functions
  const handleSubmitCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certFormData.title.trim() || !certFormData.issuer.trim()) {
      toast.error("Title and issuer are required")
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      if (editingCertificate) {
        await dataStore.updateCertificate(editingCertificate.id, certFormData)
        toast.success("Certificate updated successfully")
      } else {
        await dataStore.addCertificate(certFormData)
        toast.success("Certificate added successfully")
      }
      await loadAllData()
      resetCertificateForm()
      setIsCertDialogOpen(false)
      setSubmitStatus({ message: "Success!", type: "success" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save certificate"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 3000)
  }

  const handleDeleteCertificate = async (id: string) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      setSubmitStatus({ message: "Deleting...", type: "loading" })
      try {
        await dataStore.deleteCertificate(id)
        await loadAllData()
        toast.success("Certificate deleted successfully")
        setSubmitStatus({ message: "Deleted successfully!", type: "success" })
      } catch (error) {
        toast.error("Failed to delete certificate")
        setSubmitStatus({ message: "Failed to delete certificate", type: "error" })
      }

      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    }
  }

  const resetCertificateForm = () => {
    setCertFormData({
      title: "",
      issuer: "",
      date: "",
      description: "",
      skills: [],
      verified: true,
      status: "Active",
      image: "",
      level: "",
      hours: "",
      category: "Professional",
      visible: true,
      order: 0,
    })
    setEditingCertificate(null)
  }

  // Project functions
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectFormData.title.trim() || !projectFormData.description.trim()) {
      toast.error("Title and description are required")
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      if (editingProject) {
        await dataStore.updateProject(editingProject.id, projectFormData)
        toast.success("Project updated successfully")
      } else {
        await dataStore.addProject(projectFormData)
        toast.success("Project added successfully")
      }
      await loadAllData()
      resetProjectForm()
      setIsProjectDialogOpen(false)
      setSubmitStatus({ message: "Success!", type: "success" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save project"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 3000)
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setSubmitStatus({ message: "Deleting...", type: "loading" })
      try {
        await dataStore.deleteProject(id)
        await loadAllData()
        toast.success("Project deleted successfully")
        setSubmitStatus({ message: "Deleted successfully!", type: "success" })
      } catch (error) {
        toast.error("Failed to delete project")
        setSubmitStatus({ message: "Failed to delete project", type: "error" })
      }

      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    }
  }

  const resetProjectForm = () => {
    setProjectFormData({
      title: "",
      description: "",
      image: "",
      technologies: [],
      category: "",
      featured: false,
      liveUrl: "",
      githubUrl: "",
      status: "Live",
      visible: true,
      order: 0,
    })
    setEditingProject(null)
  }

  // Experience functions
  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expFormData.title.trim() || !expFormData.organization.trim()) {
      toast.error("Title and organization are required")
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      if (editingExperience) {
        await dataStore.updateExperience(editingExperience.id, expFormData)
        toast.success("Experience updated successfully")
      } else {
        await dataStore.addExperience(expFormData)
        toast.success("Experience added successfully")
      }
      await loadAllData()
      resetExperienceForm()
      setIsExpDialogOpen(false)
      setSubmitStatus({ message: "Success!", type: "success" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save experience"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 3000)
  }

  const handleDeleteExperience = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      setSubmitStatus({ message: "Deleting...", type: "loading" })
      try {
        await dataStore.deleteExperience(id)
        await loadAllData()
        toast.success("Experience deleted successfully")
        setSubmitStatus({ message: "Deleted successfully!", type: "success" })
      } catch (error) {
        toast.error("Failed to delete experience")
        setSubmitStatus({ message: "Failed to delete experience", type: "error" })
      }

      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    }
  }

  const resetExperienceForm = () => {
    setExpFormData({
      year: "",
      title: "",
      organization: "",
      type: "Education",
      achievements: [],
      skills: [],
      visible: true,
      order: 0,
    })
    setEditingExperience(null)
  }

  // Skill Category functions
  const handleSubmitSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skillFormData.title.trim()) {
      toast.error("Category title is required")
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      if (editingSkill) {
        await dataStore.updateSkillCategory(editingSkill.id, skillFormData)
        toast.success("Skill category updated successfully")
      } else {
        await dataStore.addSkillCategory(skillFormData)
        toast.success("Skill category added successfully")
      }
      await loadAllData()
      resetSkillForm()
      setIsSkillDialogOpen(false)
      setSubmitStatus({ message: "Success!", type: "success" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save skill category"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 3000)
  }

  const handleDeleteSkill = async (id: string) => {
    if (confirm("Are you sure you want to delete this skill category?")) {
      setSubmitStatus({ message: "Deleting...", type: "loading" })
      try {
        await dataStore.deleteSkillCategory(id)
        await loadAllData()
        toast.success("Skill category deleted successfully")
        setSubmitStatus({ message: "Deleted successfully!", type: "success" })
      } catch (error) {
        toast.error("Failed to delete skill category")
        setSubmitStatus({ message: "Failed to delete skill category", type: "error" })
      }

      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    }
  }

  const resetSkillForm = () => {
    setSkillFormData({
      title: "",
      icon: "Layout",
      skills: [],
      span: "md:col-span-6",
      visible: true,
      order: 0,
    })
    setEditingSkill(null)
  }

  // Utility functions
  const handleTagsChange = (value: string, setter: (tags: string[]) => void) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    setter(tags)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <p className="text-textSecondary font-medium tracking-tight">Accessing digital core...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-textPrimary tracking-tight mb-2 font-heading uppercase">Management</h1>
            <p className="text-textSecondary font-medium font-body opacity-70">Synchronize your digital footprint across the ecosystem.</p>
          </div>
          <div className="flex items-center gap-3">
            <GlassButton variant="secondary" onClick={() => window.open("/", "_blank")} className="px-6 py-2">
              <ExternalLink className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">View Live</span>
            </GlassButton>
            <GlassButton
              variant="primary"
              className="px-6 py-2 text-xs"
              onClick={() => {
                sessionStorage.removeItem("blog-auth")
                window.location.reload()
              }}
            >
              Sign Out
            </GlassButton>
          </div>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {submitStatus.message && (
            <motion.div
              className={`mb-8 p-4 rounded-xl flex items-center shadow-lg border backdrop-blur-xl ${submitStatus.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : submitStatus.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-accent/10 border-accent/20 text-accent font-medium"
                }`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {submitStatus.type === "loading" && (
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              )}
              {submitStatus.type === "success" && <CheckCircle className="h-5 w-5 mr-3" />}
              {submitStatus.type === "error" && <AlertCircle className="h-5 w-5 mr-3" />}
              <span className="text-sm uppercase tracking-wider font-bold">{submitStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="flex items-center gap-2 bg-surface backdrop-blur-2xl border border-border p-1.5 rounded-2xl w-full sm:w-fit overflow-x-auto overflow-y-hidden no-scrollbar">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-textPrimary data-[state=active]:text-background rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-textSecondary transition-all"
            >
              <BarChart3 className="h-3.5 w-3.5 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="hero"
              className="data-[state=active]:bg-textPrimary data-[state=active]:text-background rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-textSecondary transition-all"
            >
              <Home className="h-3.5 w-3.5 mr-2" />
              Hero
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-textPrimary data-[state=active]:text-background rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-textSecondary transition-all"
            >
              <UserCircle className="h-3.5 w-3.5 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger
              value="blogs"
              className="data-[state=active]:bg-textPrimary data-[state=active]:text-background rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-textSecondary transition-all"
            >
              <FileText className="h-3.5 w-3.5 mr-2" />
              Blogs ({stats.totalPosts})
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className="data-[state=active]:bg-textPrimary data-[state=active]:text-background rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-textSecondary transition-all"
            >
              <Award className="h-3.5 w-3.5 mr-2" />
              Certs ({stats.totalCertificates})
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-textPrimary data-[state=active]:text-background rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-textSecondary transition-all"
            >
              <Briefcase className="h-3.5 w-3.5 mr-2" />
              Work ({stats.totalProjects})
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="data-[state=active]:bg-textPrimary data-[state=active]:text-background rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-textSecondary transition-all"
            >
              <User className="h-3.5 w-3.5 mr-2" />
              Life ({stats.totalExperience})
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-textPrimary data-[state=active]:text-background rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-textSecondary transition-all"
            >
              <Code2 className="h-3.5 w-3.5 mr-2" />
              Skills ({stats.totalSkills})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-textSecondary mb-1">Total Blogs</p>
                    <p className="text-3xl font-bold text-textPrimary">{stats.totalPosts}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-textSecondary mb-1">Certificates</p>
                    <p className="text-3xl font-bold text-textPrimary">{stats.totalCertificates}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-textSecondary mb-1">Projects</p>
                    <p className="text-3xl font-bold text-textPrimary">{stats.totalProjects}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-textSecondary mb-1">Skills</p>
                    <p className="text-3xl font-bold text-textPrimary">{stats.totalSkills}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" gradient>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-textSecondary mb-1">Experience</p>
                    <p className="text-3xl font-bold text-textPrimary">{stats.totalExperience}</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-textPrimary">Hero Identity</h2>
                <p className="text-textSecondary text-sm">Configure your primary digital introduction.</p>
              </div>
              <GlassButton variant="primary" onClick={() => setIsHeroDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </GlassButton>
            </div>

            {heroSection && (
              <div className="space-y-6">
                {!isHeroDialogOpen ? (
                  <GlassCard className="p-8 border-border/50">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden border border-border shrink-0">
                        <img src={heroSection.profileImage} alt={heroSection.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <h3 className="text-2xl font-bold text-textPrimary">{heroSection.name}</h3>
                          <Badge className={heroSection.visible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                            {heroSection.visible ? "LIVE" : "HIDDEN"}
                          </Badge>
                        </div>
                        <p className="text-accent font-mono text-sm uppercase tracking-widest">{heroSection.title}</p>
                        <p className="text-textSecondary leading-relaxed max-w-2xl">{heroSection.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background/80 backdrop-blur-3xl border border-border/50 shadow-2xl rounded-[2rem] p-10 mesh-gradient-subtle"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-textPrimary text-2xl font-heading uppercase tracking-[0.2em] font-black">
                          Identity Profile
                        </h3>
                      </div>
                      <p className="text-textSecondary text-xs uppercase tracking-widest font-bold opacity-60 ml-1">
                        Update your primary presence and professional narrative.
                      </p>
                    </div>
                    <form onSubmit={handleSubmitHero} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                            Legal Name <span className="text-accent">*</span>
                          </Label>
                          <Input
                            value={heroFormData.name}
                            onChange={(e) => setHeroFormData({ ...heroFormData, name: e.target.value })}
                            className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                            placeholder="Krish Thakker"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                            Professional Title <span className="text-accent">*</span>
                          </Label>
                          <Input
                            value={heroFormData.title}
                            onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                            className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                            placeholder="Cybersecurity Specialist"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                          Core Narrative <span className="text-accent">*</span>
                        </Label>
                        <Textarea
                          value={heroFormData.description}
                          onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                          className="bg-surface/50 border-border/40 text-textPrimary rounded-3xl p-6 focus:ring-accent/20 focus:border-accent/30 transition-all leading-relaxed"
                          rows={5}
                          placeholder="Synthesizing complex technical architectures into secure digital solutions..."
                        />
                      </div>
                      <div className="bg-surface/30 p-8 rounded-[2rem] border border-border/20">
                        <ImageUpload
                          value={heroFormData.profileImage || ""}
                          onChange={(url) => setHeroFormData({ ...heroFormData, profileImage: url })}
                          label="Identity Asset (Profile Image)"
                        />
                      </div>
                      <div className="flex items-center justify-between p-6 bg-accent/5 rounded-2xl border border-accent/10 group hover:bg-accent/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                            <Eye className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <Label className="text-textPrimary text-xs font-black uppercase tracking-[0.1em]">Public Status</Label>
                            <p className="text-[10px] text-textSecondary uppercase tracking-widest opacity-60">Visibility on global interface</p>
                          </div>
                        </div>
                        <Switch
                          checked={heroFormData.visible}
                          onCheckedChange={(checked) => setHeroFormData({ ...heroFormData, visible: checked })}
                          className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20 border border-white/10"
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <GlassButton type="submit" className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]" variant="primary">
                          Commit Node
                        </GlassButton>
                        <GlassButton type="button" variant="secondary" onClick={() => setIsHeroDialogOpen(false)} className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]">
                          Abort
                        </GlassButton>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-textPrimary">About Narrative</h2>
                <p className="text-textSecondary text-sm">Craft your professional story and expertise.</p>
              </div>
              <GlassButton variant="primary" onClick={() => setIsAboutDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Narrative
              </GlassButton>
            </div>

            {aboutSection && (
              <div className="space-y-6">
                {!isAboutDialogOpen ? (
                  <GlassCard className="p-8 border-border/50">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-textPrimary">{aboutSection.title}</h3>
                        <Badge className={aboutSection.visible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                          {aboutSection.visible ? "LIVE" : "HIDDEN"}
                        </Badge>
                      </div>
                      <p className="text-textSecondary leading-relaxed whitespace-pre-wrap">{aboutSection.description}</p>
                    </div>
                  </GlassCard>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background/80 backdrop-blur-3xl border border-border/50 shadow-2xl rounded-[2rem] p-10 mesh-gradient-subtle"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-textPrimary text-2xl font-heading uppercase tracking-[0.2em] font-black">
                          Narrative Core
                        </h3>
                      </div>
                      <p className="text-textSecondary text-xs uppercase tracking-widest font-bold opacity-60 ml-1">
                        Refine your professional journey and expertise highlights.
                      </p>
                    </div>
                    <form onSubmit={handleSubmitAbout} className="space-y-10">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                          Section Title <span className="text-accent">*</span>
                        </Label>
                        <Input
                          value={aboutFormData.title}
                          onChange={(e) => setAboutFormData({ ...aboutFormData, title: e.target.value })}
                          className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                          placeholder="The Technical Odyssey"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                          Professional Story <span className="text-accent">*</span>
                        </Label>
                        <Textarea
                          value={aboutFormData.description}
                          onChange={(e) => setAboutFormData({ ...aboutFormData, description: e.target.value })}
                          className="bg-surface/50 border-border/40 text-textPrimary rounded-3xl p-6 focus:ring-accent/20 focus:border-accent/30 transition-all leading-relaxed"
                          rows={10}
                          placeholder="My journey began with a fascination for secure systems..."
                          required
                        />
                      </div>
                      <div className="bg-surface/30 p-8 rounded-[2rem] border border-border/20">
                        <ImageUpload
                          value={aboutFormData.profileImage || ""}
                          onChange={(url) => setAboutFormData({ ...aboutFormData, profileImage: url })}
                          label="Narrative Visual Asset"
                        />
                      </div>
                      <div className="flex items-center justify-between p-6 bg-accent/5 rounded-2xl border border-accent/10 group hover:bg-accent/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                            <Eye className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <Label className="text-textPrimary text-xs font-black uppercase tracking-[0.1em]">Public Visibility</Label>
                            <p className="text-[10px] text-textSecondary uppercase tracking-widest opacity-60">Display on about section</p>
                          </div>
                        </div>
                        <Switch
                          checked={aboutFormData.visible}
                          onCheckedChange={(checked) => setAboutFormData({ ...aboutFormData, visible: checked })}
                          className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20 border border-white/10"
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <GlassButton type="submit" className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]" variant="primary">
                          Push Changes
                        </GlassButton>
                        <GlassButton type="button" variant="secondary" onClick={() => setIsAboutDialogOpen(false)} className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]">
                          Cancel
                        </GlassButton>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            {!isDialogOpen ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-textPrimary">Knowledge Base</h2>
                    <p className="text-textSecondary text-sm">Manage your technical publications and insights.</p>
                  </div>
                  <GlassButton variant="primary" onClick={() => { resetPostForm(); setIsDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Draft Post
                  </GlassButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <GlassCard key={post.id} className="group overflow-hidden flex flex-col border-border/50">
                      <div className="aspect-video relative overflow-hidden bg-surface border-b border-border/30">
                        <img src={post.imageUrls?.[0] || "/placeholder.svg"} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 backdrop-blur-md bg-background/40"
                            onClick={() => {
                              setEditingPost(post);
                              setFormData({
                                title: post.title,
                                slug: post.slug,
                                intro: post.intro,
                                content: post.content,
                                tags: post.tags,
                                imageUrls: post.imageUrls || [],
                                published: post.published ?? true
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8 backdrop-blur-md bg-red-500/10 text-red-500 hover:bg-red-500/20" onClick={() => handleDeletePost(post.slug)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={post.published ? "bg-accent/10 text-accent" : "bg-textTertiary/10 text-textTertiary"}>
                            {post.published ? "PUBLISHED" : "DRAFT"}
                          </Badge>
                          <span className="text-[10px] font-mono text-textTertiary uppercase tracking-widest">{new Date(post.createdAt || "").toLocaleDateString("en-US")}</span>
                        </div>
                        <h3 className="font-bold text-textPrimary mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-textSecondary text-xs line-clamp-3 mb-4">{post.intro}</p>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-surface rounded border border-border/30 text-textTertiary">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/80 backdrop-blur-3xl border border-border shadow-2xl rounded-[2rem] p-8 mesh-gradient-subtle"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-textPrimary text-2xl font-heading uppercase tracking-widest font-bold">
                      {editingPost ? "Refine Article" : "Compose New Insight"}
                    </h3>
                  </div>
                  <GlassButton variant="secondary" onClick={() => setIsDialogOpen(false)} className="h-10 px-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Library
                  </GlassButton>
                </div>
                <form onSubmit={handleSubmitPost} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">Article Title</Label>
                      <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-surface/50 border-border text-textPrimary h-12 rounded-xl" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">URL Identifier (Slug)</Label>
                      <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="bg-surface/50 border-border text-textPrimary h-12 rounded-xl" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">Editorial Introduction</Label>
                    <Textarea value={formData.intro} onChange={(e) => setFormData({ ...formData, intro: e.target.value })} className="bg-surface/50 border-border text-textPrimary rounded-xl p-4" rows={3} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">Full Content (Markdown Optimized)</Label>
                    <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="bg-surface/50 border-border text-textPrimary rounded-xl p-4 font-mono text-sm" rows={15} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload value={formData.imageUrls?.[0] || ""} onChange={(url) => setFormData({ ...formData, imageUrls: url ? [url] : [] })} label="Featured Asset" />
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">Classification Tags (Comma separated)</Label>
                      <Input value={formData.tags.join(", ")} onChange={(e) => handleTagsChange(e.target.value, (tags) => setFormData({ ...formData, tags }))} className="bg-surface/50 border-border text-textPrimary h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-accent/5 rounded-xl border border-accent/10">
                    <Switch
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                      className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20 border border-white/10"
                    />
                    <Label className="text-textPrimary text-xs font-bold uppercase tracking-wider">Published & Searchable</Label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <GlassButton type="submit" className="flex-1 h-12" variant="primary">Deploy Content</GlassButton>
                    <GlassButton type="button" variant="secondary" onClick={() => setIsDialogOpen(false)} className="flex-1 h-12">Cancel</GlassButton>
                  </div>
                </form>
              </motion.div>
            )}
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            {!isCertDialogOpen ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-textPrimary">Digital Credentials</h2>
                    <p className="text-textSecondary text-sm">Manage your verified certifications and honors.</p>
                  </div>
                  <GlassButton variant="primary" onClick={() => { resetCertificateForm(); setIsCertDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certificate
                  </GlassButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certificates.map((cert) => (
                    <GlassCard key={cert.id} className="p-4 border-border/50 group">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className="bg-accent/10 text-accent border-none rounded-md text-[10px] py-0 uppercase tracking-widest">{cert.category}</Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveItem("certificate", cert.id, "up")}>
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveItem("certificate", cert.id, "down")}>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => {
                              setEditingCertificate(cert);
                              setCertFormData({
                                title: cert.title,
                                issuer: cert.issuer,
                                date: cert.date,
                                description: cert.description,
                                skills: cert.skills,
                                verified: cert.verified,
                                status: cert.status,
                                image: cert.image,
                                level: cert.level,
                                hours: cert.hours,
                                category: cert.category,
                                visible: cert.visible,
                                order: cert.order,
                                providerUrl: cert.providerUrl || "",
                              });
                              setIsCertDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => handleDeleteCertificate(cert.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-bold text-textPrimary text-sm mb-1">{cert.title}</h4>
                      <p className="text-[10px] text-textSecondary uppercase tracking-widest mb-3">{cert.issuer}</p>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={cert.visible}
                          onCheckedChange={() => toggleVisibility("certificate", cert.id, cert.visible)}
                          className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20 border border-white/10"
                        />
                        <span className="text-[10px] uppercase tracking-widest text-textTertiary">Public</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/80 backdrop-blur-3xl border border-border/50 shadow-2xl rounded-[2rem] p-10 mesh-gradient-subtle"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-textPrimary text-2xl font-heading uppercase tracking-widest font-bold">
                      Digital Credential
                    </h3>
                  </div>
                  <GlassButton variant="secondary" onClick={() => setIsCertDialogOpen(false)} className="h-10 px-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Gallery
                  </GlassButton>
                </div>
                <form onSubmit={handleSubmitCertificate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                        Credential Title <span className="text-accent">*</span>
                      </Label>
                      <Input value={certFormData.title} onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })} className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6" required />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                        Issuing Authority <span className="text-accent">*</span>
                      </Label>
                      <Input value={certFormData.issuer} onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })} className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">Date Issued</Label>
                      <Input value={certFormData.date} onChange={(e) => setCertFormData({ ...certFormData, date: e.target.value })} className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6" required />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">Proficiency Level</Label>
                      <Input value={certFormData.level} onChange={(e) => setCertFormData({ ...certFormData, level: e.target.value })} className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">Category</Label>
                      <Select value={certFormData.category} onValueChange={(value) => setCertFormData({ ...certFormData, category: value })}>
                        <SelectTrigger className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">Live Provider URL (Optional)</Label>
                    <Input value={certFormData.providerUrl || ""} onChange={(e) => setCertFormData({ ...certFormData, providerUrl: e.target.value })} className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">Skill Tags (Comma separated)</Label>
                    <Input value={certFormData.skills?.join(", ") || ""} onChange={(e) => setCertFormData({ ...certFormData, skills: e.target.value.split(",").map(s => s.trim()) })} className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6" />
                  </div>
                  <div className="bg-surface/30 p-8 rounded-[2rem] border border-border/20">
                    <ImageUpload value={certFormData.image || ""} onChange={(url) => setCertFormData({ ...certFormData, image: url })} label="Verification Document/Image" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <GlassButton type="submit" className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]" variant="primary">Archive Credential</GlassButton>
                    <GlassButton type="button" variant="secondary" onClick={() => setIsCertDialogOpen(false)} className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]">Abort</GlassButton>
                  </div>
                </form>
              </motion.div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            {!isProjectDialogOpen ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-textPrimary">Engineering Portfolio</h2>
                    <p className="text-textSecondary text-sm">Manage your technical projects and deployments.</p>
                  </div>
                  <GlassButton variant="primary" onClick={() => { resetProjectForm(); setIsProjectDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Initialize Project
                  </GlassButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <GlassCard key={project.id} className="group overflow-hidden flex flex-col border-border/50">
                      <div className="aspect-video relative overflow-hidden bg-surface border-b border-border/30">
                        <img src={project.image || "/placeholder.svg"} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 backdrop-blur-md bg-background/40"
                            onClick={() => {
                              setEditingProject(project);
                              setProjectFormData({
                                title: project.title,
                                description: project.description,
                                image: project.image,
                                technologies: project.technologies,
                                category: project.category,
                                featured: project.featured,
                                liveUrl: project.liveUrl,
                                githubUrl: project.githubUrl,
                                status: project.status,
                                visible: project.visible,
                                order: project.order
                              });
                              setIsProjectDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8 backdrop-blur-md bg-red-500/10 text-red-500" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="flex flex-col gap-1">
                            <Button size="icon" variant="secondary" className="h-3.5 w-8 backdrop-blur-md" onClick={() => moveItem("project", project.id, "up")}>
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="secondary" className="h-3.5 w-8 backdrop-blur-md" onClick={() => moveItem("project", project.id, "down")}>
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-blue-500/10 text-blue-500 border-none uppercase tracking-widest text-[9px]">{project.category || "Development"}</Badge>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={project.visible}
                              onCheckedChange={() => toggleVisibility("project", project.id, project.visible)}
                              className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20 border border-white/10"
                            />
                            <span className="text-[9px] uppercase tracking-widest text-textTertiary">Public</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-textPrimary mb-2">{project.title}</h3>
                        <p className="text-textSecondary text-xs line-clamp-2 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 4).map(tech => (
                            <span key={tech} className="text-[9px] px-1.5 py-0.5 bg-surface rounded border border-border/30 text-textTertiary">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/80 backdrop-blur-3xl border border-border/50 shadow-2xl rounded-[2rem] p-10 mesh-gradient-subtle"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-textPrimary text-2xl font-heading uppercase tracking-widest font-bold">
                      Project Architecture
                    </h3>
                  </div>
                  <GlassButton variant="secondary" onClick={() => setIsProjectDialogOpen(false)} className="h-10 px-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Portfolio
                  </GlassButton>
                </div>
                <form onSubmit={handleSubmitProject} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                        Project Name <span className="text-accent">*</span>
                      </Label>
                      <Input
                        value={projectFormData.title}
                        onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                        className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">
                        Industry Classification
                      </Label>
                      <Input
                        value={projectFormData.category}
                        onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                        className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                      Technical Brief <span className="text-accent">*</span>
                    </Label>
                    <Textarea
                      value={projectFormData.description}
                      onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                      className="bg-surface/50 border-border/40 text-textPrimary rounded-3xl p-6 focus:ring-accent/20 focus:border-accent/30 transition-all leading-relaxed"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">Repository URL</Label>
                      <Input
                        value={projectFormData.githubUrl}
                        onChange={(e) => setProjectFormData({ ...projectFormData, githubUrl: e.target.value })}
                        className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">Production Endpoint</Label>
                      <Input
                        value={projectFormData.liveUrl}
                        onChange={(e) => setProjectFormData({ ...projectFormData, liveUrl: e.target.value })}
                        className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">Tech Stack (Comma separated)</Label>
                    <Input
                      value={projectFormData.technologies.join(", ")}
                      onChange={(e) => setProjectFormData({ ...projectFormData, technologies: e.target.value.split(",").map(s => s.trim()) })}
                      className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                    />
                  </div>
                  <div className="bg-surface/30 p-8 rounded-[2rem] border border-border/20">
                    <ImageUpload value={projectFormData.image || ""} onChange={(url) => setProjectFormData({ ...projectFormData, image: url })} label="Project Visualization Asset" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <GlassButton type="submit" className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]" variant="primary">Deploy Node</GlassButton>
                    <GlassButton type="button" variant="secondary" onClick={() => setIsProjectDialogOpen(false)} className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]">Abort</GlassButton>
                  </div>
                </form>
              </motion.div>
            )}
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-8">
            {!isExpDialogOpen ? (
              <div className="space-y-12">
                {/* Professional Experience Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-textPrimary">Professional Experience</h3>
                      <p className="text-sm text-textSecondary">Manage your career timeline and work history.</p>
                    </div>
                    <GlassButton
                      variant="primary"
                      onClick={() => {
                        resetExperienceForm()
                        setExpFormData((prev) => ({ ...prev, type: "Professional" }))
                        setIsExpDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </GlassButton>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {experience
                      .filter((e) => e.type === "Professional")
                      .map((exp, index) => (
                        <GlassCard key={exp.id} className="p-6 border-border/50 group">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-textPrimary text-lg">{exp.title}</h4>
                                <Badge
                                  className={
                                    exp.visible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                  }
                                >
                                  {exp.visible ? "LIVE" : "HIDDEN"}
                                </Badge>
                              </div>
                              <p className="text-accent font-medium">{exp.organization}</p>
                              <p className="text-textSecondary text-sm font-mono">{exp.year}</p>
                              {exp.achievements.length > 0 && (
                                <ul className="mt-3 space-y-1">
                                  {exp.achievements.slice(0, 2).map((achievement, i) => (
                                    <li key={i} className="text-xs text-textSecondary flex items-start gap-2">
                                      <Diamond className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                                      {achievement}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9"
                                onClick={() => {
                                  setEditingExperience(exp)
                                  setExpFormData({
                                    year: exp.year,
                                    title: exp.title,
                                    organization: exp.organization,
                                    type: exp.type as "Professional" | "Education",
                                    achievements: exp.achievements,
                                    skills: exp.skills,
                                    visible: exp.visible,
                                    order: exp.order
                                  })
                                  setIsExpDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-red-400"
                                onClick={() => handleDeleteExperience(exp.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="flex flex-col gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-9"
                                  onClick={() => moveItem("experience", exp.id, "up")}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-9"
                                  onClick={() => moveItem("experience", exp.id, "down")}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                  </div>
                </div>

                {/* Education Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-textPrimary">Academic Background</h3>
                      <p className="text-sm text-textSecondary">Manage your degrees and educational milestones.</p>
                    </div>
                    <GlassButton
                      variant="primary"
                      onClick={() => {
                        resetExperienceForm()
                        setExpFormData((prev) => ({ ...prev, type: "Education" }))
                        setIsExpDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </GlassButton>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {experience
                      .filter((e) => e.type === "Education")
                      .map((exp) => (
                        <GlassCard key={exp.id} className="p-6 border-border/50 group">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-textPrimary text-lg">{exp.title}</h4>
                                <Badge
                                  className={
                                    exp.visible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                  }
                                >
                                  {exp.visible ? "LIVE" : "HIDDEN"}
                                </Badge>
                              </div>
                              <p className="text-accent font-medium">{exp.organization}</p>
                              <p className="text-textSecondary text-sm font-mono">{exp.year}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9"
                                onClick={() => {
                                  setEditingExperience(exp)
                                  setExpFormData({
                                    year: exp.year,
                                    title: exp.title,
                                    organization: exp.organization,
                                    type: exp.type as "Professional" | "Education",
                                    achievements: exp.achievements,
                                    skills: exp.skills,
                                    visible: exp.visible,
                                    order: exp.order
                                  })
                                  setIsExpDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-red-400"
                                onClick={() => handleDeleteExperience(exp.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="flex flex-col gap-1">
                                <Button size="icon" variant="ghost" className="h-4 w-9" onClick={() => moveItem("experience", exp.id, "up")}>
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-4 w-9" onClick={() => moveItem("experience", exp.id, "down")}>
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/80 backdrop-blur-3xl border border-border/50 shadow-2xl rounded-[2rem] p-10 mesh-gradient-subtle"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-textPrimary text-2xl font-heading uppercase tracking-widest font-bold">
                      Lifecycle Node
                    </h3>
                  </div>
                  <GlassButton variant="secondary" onClick={() => setIsExpDialogOpen(false)} className="h-10 px-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Timeline
                  </GlassButton>
                </div>
                <form onSubmit={handleSubmitExperience} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                        Node Title <span className="text-accent">*</span>
                      </Label>
                      <Input
                        value={expFormData.title}
                        onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
                        className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                        placeholder="e.g. Senior Security Researcher"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                        Organization <span className="text-accent">*</span>
                      </Label>
                      <Input
                        value={expFormData.organization}
                        onChange={(e) => setExpFormData({ ...expFormData, organization: e.target.value })}
                        className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                        placeholder="e.g. CyberGuard Solutions"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">
                        Temporal Range
                      </Label>
                      <Input
                        value={expFormData.year}
                        onChange={(e) => setExpFormData({ ...expFormData, year: e.target.value })}
                        className="bg-surface border-border text-textPrimary h-12 rounded-xl"
                        placeholder="e.g. 2021 - Present"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">
                        Node Classification
                      </Label>
                      <Select
                        value={expFormData.type}
                        onValueChange={(value: "Professional" | "Education") =>
                          setExpFormData({ ...expFormData, type: value })
                        }
                      >
                        <SelectTrigger className="bg-surface border-border text-textPrimary h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">
                      Key Accomplishments (One per line)
                    </Label>
                    <Textarea
                      value={expFormData.achievements.join("\n")}
                      onChange={(e) =>
                        setExpFormData({ ...expFormData, achievements: e.target.value.split("\n").filter(Boolean) })
                      }
                      className="bg-surface border-border text-textPrimary rounded-xl p-4"
                      rows={5}
                      placeholder="• Optimized cloud infrastructure security by 40%..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold text-textSecondary ml-1">
                      Skillset Utilization (Comma separated)
                    </Label>
                    <Input
                      value={expFormData.skills.join(", ")}
                      onChange={(e) =>
                        setExpFormData({
                          ...expFormData,
                          skills: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="bg-surface border-border text-textPrimary h-12 rounded-xl"
                      placeholder="Pentesting, AWS, Next.js..."
                    />
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-accent/5 rounded-xl border border-accent/10">
                    <Switch
                      checked={expFormData.visible}
                      onCheckedChange={(checked) => setExpFormData({ ...expFormData, visible: checked })}
                      className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20 border border-white/10"
                    />
                    <Label className="text-textPrimary text-xs font-bold uppercase tracking-wider">
                      Sync to Public Timeline
                    </Label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <GlassButton type="submit" className="flex-1 h-12" variant="primary">
                      Commit Node
                    </GlassButton>
                    <GlassButton
                      type="button"
                      variant="secondary"
                      onClick={() => setIsExpDialogOpen(false)}
                      className="flex-1 h-12"
                    >
                      Abort
                    </GlassButton>
                  </div>
                </form>
              </motion.div>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-8">
            {!isSkillDialogOpen ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-textPrimary uppercase tracking-tighter">Technical Arsenal</h3>
                    <p className="text-sm text-textSecondary">Manage your skill categories and technical expertise.</p>
                  </div>
                  <GlassButton
                    variant="primary"
                    onClick={() => {
                      resetSkillForm()
                      setIsSkillDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                  </GlassButton>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {skillCategories.map((category) => (
                    <GlassCard key={category.id} className="p-6 border-border/50 group">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-surface rounded-lg">
                              {ICON_MAP[category.icon] || <Code2 className="h-4 w-4 text-accent" />}
                            </div>
                            <h4 className="font-bold text-textPrimary text-lg">{category.title}</h4>
                            <Badge className={category.visible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                              {category.visible ? "LIVE" : "HIDDEN"}
                            </Badge>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9"
                              onClick={() => {
                                setEditingSkill(category)
                                setSkillFormData({
                                  title: category.title,
                                  icon: category.icon,
                                  skills: category.skills,
                                  span: category.span,
                                  visible: category.visible,
                                  order: category.order
                                })
                                setIsSkillDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 text-red-400"
                              onClick={() => handleDeleteSkill(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="flex flex-col gap-1">
                              <Button size="icon" variant="ghost" className="h-4 w-9" onClick={() => moveItem("skills", category.id, "up")}>
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-4 w-9" onClick={() => moveItem("skills", category.id, "down")}>
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill, i) => (
                            <span key={i} className="text-[10px] px-2 py-1 bg-surface border border-border/30 rounded-md text-textSecondary">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={category.visible}
                            onCheckedChange={() => toggleVisibility("skills", category.id, category.visible)}
                            className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20 border border-white/10"
                          />
                          <span className="text-[9px] uppercase tracking-widest text-textTertiary">Public</span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/80 backdrop-blur-3xl border border-border/50 shadow-2xl rounded-[2rem] p-10 mesh-gradient-subtle"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-textPrimary text-2xl font-heading uppercase tracking-widest font-bold">
                      Skill Configuration
                    </h3>
                  </div>
                  <GlassButton variant="secondary" onClick={() => setIsSkillDialogOpen(false)} className="h-10 px-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Arsenal
                  </GlassButton>
                </div>

                <form onSubmit={handleSubmitSkill} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1 flex items-center gap-2">
                        Category Title <span className="text-accent">*</span>
                      </Label>
                      <Input
                        value={skillFormData.title}
                        onChange={(e) => setSkillFormData({ ...skillFormData, title: e.target.value })}
                        className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                        placeholder="e.g. Frontend Engineering"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">
                        Display Icon
                      </Label>
                      <Select
                        value={skillFormData.icon}
                        onValueChange={(value) => setSkillFormData({ ...skillFormData, icon: value })}
                      >
                        <SelectTrigger className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          <SelectItem value="Layout">Layout (Frontend)</SelectItem>
                          <SelectItem value="Database">Database (Backend)</SelectItem>
                          <SelectItem value="Smartphone">Smartphone (Mobile)</SelectItem>
                          <SelectItem value="Code2">Code (General)</SelectItem>
                          <SelectItem value="Cloud">Cloud (DevOps)</SelectItem>
                          <SelectItem value="Cpu">CPU (Hardware/Core)</SelectItem>
                          <SelectItem value="Globe">Globe (Web)</SelectItem>
                          <SelectItem value="Layers">Layers (Fullstack)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">
                        Layout Span (Grid)
                      </Label>
                      <Select
                        value={skillFormData.span}
                        onValueChange={(value) => setSkillFormData({ ...skillFormData, span: value })}
                      >
                        <SelectTrigger className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          <SelectItem value="md:col-span-12">Full Width (12)</SelectItem>
                          <SelectItem value="md:col-span-8">Large (8)</SelectItem>
                          <SelectItem value="md:col-span-7">Medium-Large (7)</SelectItem>
                          <SelectItem value="md:col-span-6">Half Width (6)</SelectItem>
                          <SelectItem value="md:col-span-5">Medium-Small (5)</SelectItem>
                          <SelectItem value="md:col-span-4">One Third (4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-accent/5 rounded-2xl border border-accent/10 mt-6 h-14">
                      <Switch
                        checked={skillFormData.visible}
                        onCheckedChange={(checked) => setSkillFormData({ ...skillFormData, visible: checked })}
                        className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20 border border-white/10"
                      />
                      <Label className="text-textPrimary text-xs font-bold uppercase tracking-wider">
                        Sync to Arsenal
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-textSecondary ml-1">
                      Skillset (Comma separated)
                    </Label>
                    <Input
                      value={skillFormData.skills.join(", ")}
                      onChange={(e) =>
                        setSkillFormData({
                          ...skillFormData,
                          skills: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="bg-surface/50 border-border/40 text-textPrimary h-14 rounded-2xl focus:ring-accent/20 focus:border-accent/30 transition-all px-6"
                      placeholder="React, TypeScript, Next.js..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <GlassButton type="submit" className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]" variant="primary">
                      Synchronize Skills
                    </GlassButton>
                    <GlassButton
                      type="button"
                      variant="secondary"
                      onClick={() => setIsSkillDialogOpen(false)}
                      className="flex-1 h-14 font-black uppercase tracking-[0.2em] text-[10px]"
                    >
                      Abort
                    </GlassButton>
                  </div>
                </form>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
