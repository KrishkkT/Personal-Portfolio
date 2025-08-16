"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
} from "@/lib/data-store"

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

  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalCertificates: 0,
    totalProjects: 0,
    totalExperience: 0,
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
      const [postsData, certificatesData, projectsData, experienceData, heroData, aboutData] = await Promise.all([
        blogStoreSupabase.getAllPosts(true),
        dataStore.getAllCertificates(true),
        dataStore.getAllProjects(true),
        dataStore.getAllExperience(true),
        dataStore.getHeroSection(),
        dataStore.getAboutSection(),
      ])

      setPosts(postsData)
      setCertificates(certificatesData)
      setProjects(projectsData)
      setExperience(experienceData)
      setHeroSection(heroData)
      setAboutSection(aboutData)

      // Set form data if sections exist, otherwise keep defaults
      if (heroData) {
        setHeroFormData({
          name: heroData.name,
          title: heroData.title,
          description: heroData.description,
          profileImage: heroData.profileImage,
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
      })
    } catch (error) {
      console.error("Error loading data:", error)
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
      }

      await loadAllData()
      setSubmitStatus({ message: "Visibility updated!", type: "success" })
    } catch (error) {
      console.error("Error toggling visibility:", error)
      toast.error("Failed to update visibility")
      setSubmitStatus({ message: "Failed to update visibility", type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 2000)
  }

  // Order change functions - FIXED VERSION
  const moveItem = async (type: string, id: string, direction: "up" | "down") => {
    try {
      setSubmitStatus({ message: "Updating order...", type: "loading" })

      let items: any[] = []
      if (type === "certificate") {
        items = [...certificates].sort((a, b) => a.order - b.order)
      } else if (type === "project") {
        items = [...projects].sort((a, b) => a.order - b.order)
      } else if (type === "experience") {
        items = [...experience].sort((a, b) => a.order - b.order)
      }

      console.log(`Moving ${type} ${id} ${direction}`)
      console.log(
        "Current items order:",
        items.map((item) => ({ id: item.id, title: item.title, order: item.order })),
      )

      const currentIndex = items.findIndex((item) => item.id === id)
      if (currentIndex === -1) {
        console.error("Item not found in list")
        return
      }

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= items.length) {
        console.log("Cannot move item - already at boundary")
        return
      }

      // Get the two items to swap
      const currentItem = items[currentIndex]
      const targetItem = items[newIndex]

      console.log(
        `Swapping orders: ${currentItem.title} (${currentItem.order}) <-> ${targetItem.title} (${targetItem.order})`,
      )

      // Create the update array with swapped orders
      const updates = [
        { id: currentItem.id, order: targetItem.order },
        { id: targetItem.id, order: currentItem.order },
      ]

      console.log("Updates to apply:", updates)

      // Apply the updates
      if (type === "certificate") {
        await dataStore.updateCertificateOrder(updates)
      } else if (type === "project") {
        await dataStore.updateProjectOrder(updates)
      } else if (type === "experience") {
        await dataStore.updateExperienceOrder(updates)
      }

      // Reload data to reflect changes
      await loadAllData()
      toast.success("Order updated successfully")
      setSubmitStatus({ message: "Order updated!", type: "success" })
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Failed to update order")
      setSubmitStatus({ message: "Failed to update order", type: "error" })
    }

    setTimeout(() => {
      setSubmitStatus({ message: "", type: "" })
    }, 2000)
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
      console.error("Error saving hero section:", error)
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
      console.error("Error saving about section:", error)
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
      console.error("Error saving post:", error)
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
        console.error("Error deleting post:", error)
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
      console.error("Error saving certificate:", error)
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
        console.error("Error deleting certificate:", error)
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
      console.error("Error saving project:", error)
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
        console.error("Error deleting project:", error)
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
      console.error("Error saving experience:", error)
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
        console.error("Error deleting experience:", error)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-300">Loading management dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-200 mb-2">Content Management Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your portfolio content across all sections</p>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {submitStatus.message && (
            <motion.div
              className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl flex items-center justify-center text-center ${
                submitStatus.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-400/30"
                  : submitStatus.type === "error"
                    ? "bg-red-500/10 text-red-400 border border-red-400/30"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30"
              }`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {submitStatus.type === "loading" && (
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 animate-spin" />
              )}
              {submitStatus.type === "success" && <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />}
              {submitStatus.type === "error" && <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />}
              <span className="text-sm sm:text-lg font-medium">{submitStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7 bg-gray-800/50 border border-yellow-400/20 h-auto p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400 text-xs sm:text-sm py-2 sm:py-3 text-gray-300"
            >
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="hero"
              className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400 text-xs sm:text-sm py-2 sm:py-3 text-gray-300"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Hero</span>
              <span className="sm:hidden">Hero</span>
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400 text-xs sm:text-sm py-2 sm:py-3 text-gray-300"
            >
              <UserCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">About</span>
              <span className="sm:hidden">About</span>
            </TabsTrigger>
            <TabsTrigger
              value="blogs"
              className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400 text-xs sm:text-sm py-2 sm:py-3 text-gray-300"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Blogs ({stats.totalPosts})</span>
              <span className="sm:hidden">Blog</span>
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400 text-xs sm:text-sm py-2 sm:py-3 text-gray-300"
            >
              <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Certificates ({stats.totalCertificates})</span>
              <span className="sm:hidden">Cert</span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400 text-xs sm:text-sm py-2 sm:py-3 text-gray-300"
            >
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Projects ({stats.totalProjects})</span>
              <span className="sm:hidden">Proj</span>
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400 text-xs sm:text-sm py-2 sm:py-3 text-gray-300"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Experience ({stats.totalExperience})</span>
              <span className="sm:hidden">Exp</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Total Posts</p>
                      <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.totalPosts}</p>
                    </div>
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Certificates</p>
                      <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.totalCertificates}</p>
                    </div>
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Projects</p>
                      <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.totalProjects}</p>
                    </div>
                    <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Experience</p>
                      <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.totalExperience}</p>
                    </div>
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400/60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200 flex items-center gap-2 text-lg sm:text-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
                <Button
                  onClick={() => setIsHeroDialogOpen(true)}
                  className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/30 text-xs sm:text-sm py-2 sm:py-3"
                  variant="outline"
                >
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Edit Hero</span>
                  <span className="sm:hidden">Hero</span>
                </Button>
                <Button
                  onClick={() => setIsAboutDialogOpen(true)}
                  className="bg-blue-400/20 text-blue-400 border-blue-400/30 hover:bg-blue-400/30 text-xs sm:text-sm py-2 sm:py-3"
                  variant="outline"
                >
                  <UserCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Edit About</span>
                  <span className="sm:hidden">About</span>
                </Button>
                <Button
                  onClick={() => {
                    resetPostForm()
                    setIsDialogOpen(true)
                  }}
                  className="bg-green-400/20 text-green-400 border-green-400/30 hover:bg-green-400/30 text-xs sm:text-sm py-2 sm:py-3"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">New Blog</span>
                  <span className="sm:hidden">Blog</span>
                </Button>
                <Button
                  onClick={() => {
                    resetCertificateForm()
                    setIsCertDialogOpen(true)
                  }}
                  className="bg-purple-400/20 text-purple-400 border-purple-400/30 hover:bg-purple-400/30 text-xs sm:text-sm py-2 sm:py-3"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">New Cert</span>
                  <span className="sm:hidden">Cert</span>
                </Button>
                <Button
                  onClick={() => {
                    resetProjectForm()
                    setIsProjectDialogOpen(true)
                  }}
                  className="bg-orange-400/20 text-orange-400 border-orange-400/30 hover:bg-orange-400/30 text-xs sm:text-sm py-2 sm:py-3"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">New Project</span>
                  <span className="sm:hidden">Proj</span>
                </Button>
                <Button
                  onClick={() => {
                    resetExperienceForm()
                    setIsExpDialogOpen(true)
                  }}
                  className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/30 text-xs sm:text-sm py-2 sm:py-3"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">New Experience</span>
                  <span className="sm:hidden">Exp</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200">Hero Section</h2>
              <Dialog open={isHeroDialogOpen} onOpenChange={setIsHeroDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/30 text-xs sm:text-sm"
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Edit Hero</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800/95 border-yellow-400/20">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200 text-lg sm:text-xl">Edit Hero Section</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitHero} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="hero-name" className="text-gray-300 text-sm">
                          Name *
                        </Label>
                        <Input
                          id="hero-name"
                          value={heroFormData.name}
                          onChange={(e) => setHeroFormData({ ...heroFormData, name: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero-title" className="text-gray-300 text-sm">
                          Title *
                        </Label>
                        <Input
                          id="hero-title"
                          value={heroFormData.title}
                          onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="hero-description" className="text-gray-300 text-sm">
                        Description *
                      </Label>
                      <Textarea
                        id="hero-description"
                        value={heroFormData.description}
                        onChange={(e) => setHeroFormData({ ...heroFormData, description: e.target.value })}
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        rows={3}
                        required
                      />
                    </div>
                    <ImageUpload
                      value={heroFormData.profileImage || ""}
                      onChange={(url) => setHeroFormData({ ...heroFormData, profileImage: url })}
                      label="Profile Image"
                      placeholder="Enter image URL or upload profile image"
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hero-visible"
                        checked={heroFormData.visible}
                        onCheckedChange={(checked) => setHeroFormData({ ...heroFormData, visible: checked })}
                      />
                      <Label htmlFor="hero-visible" className="text-gray-300 text-sm">
                        Visible on website
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/30 text-sm"
                        variant="outline"
                      >
                        Update Hero Section
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsHeroDialogOpen(false)}
                        className="border-gray-600 text-gray-300 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {heroSection && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-200">{heroSection.name}</h3>
                        <Badge
                          variant={heroSection.visible ? "default" : "secondary"}
                          className="w-fit bg-green-500/20 text-green-400 border-green-400/30"
                        >
                          {heroSection.visible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-2 text-sm sm:text-base">{heroSection.title}</p>
                      <p className="text-gray-300 mb-3 text-sm sm:text-base line-clamp-2">{heroSection.description}</p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Updated: {new Date(heroSection.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* About Section Tab */}
          <TabsContent value="about" className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200">About Section</h2>
              <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-400/20 text-blue-400 border-blue-400/30 hover:bg-blue-400/30 text-xs sm:text-sm"
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Edit About</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800/95 border-blue-400/20">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200 text-lg sm:text-xl">Edit About Section</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitAbout} className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="about-title" className="text-gray-300 text-sm">
                        Title *
                      </Label>
                      <Input
                        id="about-title"
                        value={aboutFormData.title}
                        onChange={(e) => setAboutFormData({ ...aboutFormData, title: e.target.value })}
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="about-description" className="text-gray-300 text-sm">
                        Description *
                      </Label>
                      <Textarea
                        id="about-description"
                        value={aboutFormData.description}
                        onChange={(e) => setAboutFormData({ ...aboutFormData, description: e.target.value })}
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        rows={6}
                        required
                      />
                    </div>
                    <ImageUpload
                      value={aboutFormData.profileImage || ""}
                      onChange={(url) => setAboutFormData({ ...aboutFormData, profileImage: url })}
                      label="Profile Image"
                      placeholder="Enter image URL or upload profile image"
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="about-visible"
                        checked={aboutFormData.visible}
                        onCheckedChange={(checked) => setAboutFormData({ ...aboutFormData, visible: checked })}
                      />
                      <Label htmlFor="about-visible" className="text-gray-300 text-sm">
                        Visible on website
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-blue-400/20 text-blue-400 border-blue-400/30 hover:bg-blue-400/30 text-sm"
                        variant="outline"
                      >
                        Update About Section
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAboutDialogOpen(false)}
                        className="border-gray-600 text-gray-300 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {aboutSection && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-200">{aboutSection.title}</h3>
                        <Badge
                          variant={aboutSection.visible ? "default" : "secondary"}
                          className="w-fit bg-green-500/20 text-green-400 border-green-400/30"
                        >
                          {aboutSection.visible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="text-gray-300 mb-3 text-sm sm:text-base line-clamp-3">{aboutSection.description}</p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Updated: {new Date(aboutSection.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200">Blog Posts</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetPostForm()
                      setIsDialogOpen(true)
                    }}
                    className="bg-green-400/20 text-green-400 border-green-400/30 hover:bg-green-400/30 text-xs sm:text-sm"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">New Post</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800/95 border-green-400/20">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200 text-lg sm:text-xl">
                      {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitPost} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="title" className="text-gray-300 text-sm">
                          Title *
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value })
                            // Auto-generate slug if not editing
                            if (!editingPost && !formData.slug) {
                              const slug = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")
                              setFormData((prev) => ({ ...prev, slug }))
                            }
                          }}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug" className="text-gray-300 text-sm">
                          Slug *
                        </Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="intro" className="text-gray-300 text-sm">
                        Introduction *
                      </Label>
                      <Textarea
                        id="intro"
                        value={formData.intro}
                        onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="content" className="text-gray-300 text-sm">
                        Content (Markdown) *
                      </Label>
                      <div className="space-y-4">
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          rows={12}
                          required
                          placeholder="Write your content here... You can use markdown syntax:

# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`Code text`

To add images in content, use:
![Alt text](image-url)

Or use the image upload below to get URLs"
                        />
                        <div className="border-t border-gray-700 pt-4">
                          <Label className="text-gray-300 text-sm mb-2 block">Quick Image Upload (for content)</Label>
                          <ImageUpload
                            value=""
                            onChange={(url) => {
                              if (url) {
                                const imageMarkdown = `\n\n![Image](${url})\n\n`
                                setFormData({
                                  ...formData,
                                  content: formData.content + imageMarkdown,
                                })
                              }
                            }}
                            label=""
                            placeholder="Upload image to insert into content"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            This will add the image markdown to your content automatically
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="tags" className="text-gray-300 text-sm">
                        Tags (comma-separated)
                      </Label>
                      <Input
                        id="tags"
                        value={formData.tags.join(", ")}
                        onChange={(e) => handleTagsChange(e.target.value, (tags) => setFormData({ ...formData, tags }))}
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                      />
                    </div>
                    <ImageUpload
                      value={formData.imageUrls[0] || ""}
                      onChange={(url) => setFormData({ ...formData, imageUrls: url ? [url] : [] })}
                      label="Featured Image"
                      placeholder="Enter image URL or upload a file"
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                      />
                      <Label htmlFor="published" className="text-gray-300 text-sm">
                        Published
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-green-400/20 text-green-400 border-green-400/30 hover:bg-green-400/30 text-sm"
                        variant="outline"
                      >
                        {editingPost ? "Update Post" : "Create Post"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="border-gray-600 text-gray-300 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-200">{post.title}</h3>
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                            className="w-fit bg-green-500/20 text-green-400 border-green-400/30"
                          >
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-3 text-sm sm:text-base line-clamp-2">{post.intro}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-blue-500/20 text-blue-400 border-blue-400/30"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-gray-500/20 text-gray-400 border-gray-400/30"
                            >
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400">
                          Created: {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPost(post)
                            setFormData({
                              title: post.title,
                              slug: post.slug,
                              intro: post.intro,
                              content: post.content,
                              tags: post.tags,
                              imageUrls: post.imageUrls,
                              published: post.published,
                            })
                            setIsDialogOpen(true)
                          }}
                          className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-xs sm:text-sm"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePost(post.slug)}
                          className="border-red-400/30 text-red-400 hover:bg-red-400/10 text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200">Certificates</h2>
              <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetCertificateForm()
                      setIsCertDialogOpen(true)
                    }}
                    className="bg-purple-400/20 text-purple-400 border-purple-400/30 hover:bg-purple-400/30 text-xs sm:text-sm"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">New Certificate</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800/95 border-purple-400/20">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200 text-lg sm:text-xl">
                      {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitCertificate} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="cert-title" className="text-gray-300 text-sm">
                          Title *
                        </Label>
                        <Input
                          id="cert-title"
                          value={certFormData.title}
                          onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cert-issuer" className="text-gray-300 text-sm">
                          Issuer *
                        </Label>
                        <Input
                          id="cert-issuer"
                          value={certFormData.issuer}
                          onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="cert-date" className="text-gray-300 text-sm">
                          Date *
                        </Label>
                        <Input
                          id="cert-date"
                          value={certFormData.date}
                          onChange={(e) => setCertFormData({ ...certFormData, date: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cert-level" className="text-gray-300 text-sm">
                          Level
                        </Label>
                        <Input
                          id="cert-level"
                          value={certFormData.level}
                          onChange={(e) => setCertFormData({ ...certFormData, level: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cert-hours" className="text-gray-300 text-sm">
                          Hours
                        </Label>
                        <Input
                          id="cert-hours"
                          value={certFormData.hours}
                          onChange={(e) => setCertFormData({ ...certFormData, hours: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cert-category" className="text-gray-300 text-sm">
                        Category
                      </Label>
                      <Select
                        value={certFormData.category}
                        onValueChange={(value) => setCertFormData({ ...certFormData, category: value })}
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cert-description" className="text-gray-300 text-sm">
                        Description *
                      </Label>
                      <Textarea
                        id="cert-description"
                        value={certFormData.description}
                        onChange={(e) => setCertFormData({ ...certFormData, description: e.target.value })}
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cert-skills" className="text-gray-300 text-sm">
                        Skills (comma-separated)
                      </Label>
                      <Input
                        id="cert-skills"
                        value={certFormData.skills?.join(", ") || ""}
                        onChange={(e) =>
                          handleTagsChange(e.target.value, (skills) => setCertFormData({ ...certFormData, skills }))
                        }
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                      />
                    </div>
                    <ImageUpload
                      value={certFormData.image || ""}
                      onChange={(url) => setCertFormData({ ...certFormData, image: url })}
                      label="Certificate Image"
                      placeholder="Enter image URL or upload certificate image"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="cert-status" className="text-gray-300 text-sm">
                          Status
                        </Label>
                        <Select
                          value={certFormData.status}
                          onValueChange={(value) => setCertFormData({ ...certFormData, status: value })}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-4 pt-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="cert-verified"
                            checked={certFormData.verified}
                            onCheckedChange={(checked) => setCertFormData({ ...certFormData, verified: checked })}
                          />
                          <Label htmlFor="cert-verified" className="text-gray-300 text-sm">
                            Verified
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="cert-visible"
                            checked={certFormData.visible}
                            onCheckedChange={(checked) => setCertFormData({ ...certFormData, visible: checked })}
                          />
                          <Label htmlFor="cert-visible" className="text-gray-300 text-sm">
                            Visible
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-purple-400/20 text-purple-400 border-purple-400/30 hover:bg-purple-400/30 text-sm"
                        variant="outline"
                      >
                        {editingCertificate ? "Update Certificate" : "Add Certificate"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCertDialogOpen(false)}
                        className="border-gray-600 text-gray-300 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {certificates
                .sort((a, b) => a.order - b.order)
                .map((certificate, index) => (
                  <Card key={certificate.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-200">{certificate.title}</h3>
                            {certificate.verified && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 w-fit">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <Badge variant="outline" className="w-fit bg-blue-500/20 text-blue-400 border-blue-400/30">
                              {certificate.status}
                            </Badge>
                            <Badge
                              variant={certificate.visible ? "default" : "secondary"}
                              className={`w-fit ${
                                certificate.visible
                                  ? "bg-green-500/20 text-green-400 border-green-400/30"
                                  : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                              }`}
                            >
                              {certificate.visible ? "Visible" : "Hidden"}
                            </Badge>
                          </div>
                          <p className="text-gray-400 mb-2 text-sm sm:text-base">{certificate.issuer}</p>
                          <p className="text-gray-300 mb-3 text-sm sm:text-base line-clamp-2">
                            {certificate.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {certificate.skills.slice(0, 3).map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs bg-purple-500/20 text-purple-400 border-purple-400/30"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {certificate.skills.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-500/20 text-gray-400 border-gray-400/30"
                              >
                                +{certificate.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400">
                            Date: {certificate.date} | Level: {certificate.level} | Hours: {certificate.hours} | Order:{" "}
                            {certificate.order}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleVisibility("certificate", certificate.id, certificate.visible)}
                            className={`text-xs sm:text-sm ${
                              certificate.visible
                                ? "border-orange-400/30 text-orange-400 hover:bg-orange-400/10"
                                : "border-green-400/30 text-green-400 hover:bg-green-400/10"
                            }`}
                          >
                            {certificate.visible ? (
                              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveItem("certificate", certificate.id, "up")}
                            disabled={index === 0}
                            className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10 text-xs sm:text-sm disabled:opacity-50"
                          >
                            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveItem("certificate", certificate.id, "down")}
                            disabled={index === certificates.length - 1}
                            className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10 text-xs sm:text-sm disabled:opacity-50"
                          >
                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCertificate(certificate)
                              setCertFormData({
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
                                visible: certificate.visible,
                                order: certificate.order,
                              })
                              setIsCertDialogOpen(true)
                            }}
                            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-xs sm:text-sm"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCertificate(certificate.id)}
                            className="border-red-400/30 text-red-400 hover:bg-red-400/10 text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200">Projects</h2>
              <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetProjectForm()
                      setIsProjectDialogOpen(true)
                    }}
                    className="bg-orange-400/20 text-orange-400 border-orange-400/30 hover:bg-orange-400/30 text-xs sm:text-sm"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">New Project</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800/95 border-orange-400/20">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200 text-lg sm:text-xl">
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitProject} className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="project-title" className="text-gray-300 text-sm">
                        Title *
                      </Label>
                      <Input
                        id="project-title"
                        value={projectFormData.title}
                        onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description" className="text-gray-300 text-sm">
                        Description *
                      </Label>
                      <Textarea
                        id="project-description"
                        value={projectFormData.description}
                        onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="project-category" className="text-gray-300 text-sm">
                          Category
                        </Label>
                        <Input
                          id="project-category"
                          value={projectFormData.category}
                          onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-status" className="text-gray-300 text-sm">
                          Status
                        </Label>
                        <Select
                          value={projectFormData.status}
                          onValueChange={(value) => setProjectFormData({ ...projectFormData, status: value })}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Live">Live</SelectItem>
                            <SelectItem value="In Development">In Development</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="project-live-url" className="text-gray-300 text-sm">
                          Live URL
                        </Label>
                        <Input
                          id="project-live-url"
                          value={projectFormData.liveUrl}
                          onChange={(e) => setProjectFormData({ ...projectFormData, liveUrl: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-github-url" className="text-gray-300 text-sm">
                          GitHub URL
                        </Label>
                        <Input
                          id="project-github-url"
                          value={projectFormData.githubUrl}
                          onChange={(e) => setProjectFormData({ ...projectFormData, githubUrl: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        />
                      </div>
                    </div>
                    <ImageUpload
                      value={projectFormData.image || ""}
                      onChange={(url) => setProjectFormData({ ...projectFormData, image: url })}
                      label="Project Image"
                      placeholder="Enter image URL or upload project screenshot"
                    />
                    <div>
                      <Label htmlFor="project-technologies" className="text-gray-300 text-sm">
                        Technologies (comma-separated)
                      </Label>
                      <Input
                        id="project-technologies"
                        value={projectFormData.technologies?.join(", ") || ""}
                        onChange={(e) =>
                          handleTagsChange(e.target.value, (technologies) =>
                            setProjectFormData({ ...projectFormData, technologies }),
                          )
                        }
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="project-featured"
                          checked={projectFormData.featured}
                          onCheckedChange={(checked) => setProjectFormData({ ...projectFormData, featured: checked })}
                        />
                        <Label htmlFor="project-featured" className="text-gray-300 text-sm">
                          Featured Project
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="project-visible"
                          checked={projectFormData.visible}
                          onCheckedChange={(checked) => setProjectFormData({ ...projectFormData, visible: checked })}
                        />
                        <Label htmlFor="project-visible" className="text-gray-300 text-sm">
                          Visible on website
                        </Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-orange-400/20 text-orange-400 border-orange-400/30 hover:bg-orange-400/30 text-sm"
                        variant="outline"
                      >
                        {editingProject ? "Update Project" : "Add Project"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsProjectDialogOpen(false)}
                        className="border-gray-600 text-gray-300 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {projects
                .sort((a, b) => a.order - b.order)
                .map((project, index) => (
                  <Card key={project.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-200">{project.title}</h3>
                            {project.featured && (
                              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 w-fit">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline" className="w-fit bg-blue-500/20 text-blue-400 border-blue-400/30">
                              {project.status}
                            </Badge>
                            <Badge
                              variant={project.visible ? "default" : "secondary"}
                              className={`w-fit ${
                                project.visible
                                  ? "bg-green-500/20 text-green-400 border-green-400/30"
                                  : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                              }`}
                            >
                              {project.visible ? "Visible" : "Hidden"}
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-3 text-sm sm:text-base line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <Badge
                                key={tech}
                                variant="outline"
                                className="text-xs bg-orange-500/20 text-orange-400 border-orange-400/30"
                              >
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-500/20 text-gray-400 border-gray-400/30"
                              >
                                +{project.technologies.length - 3}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 text-xs sm:text-sm text-gray-400 mb-2">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-yellow-400"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Live Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-yellow-400"
                              >
                                <Github className="h-3 w-3" />
                                Source Code
                              </a>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400">Order: {project.order}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleVisibility("project", project.id, project.visible)}
                            className={`text-xs sm:text-sm ${
                              project.visible
                                ? "border-orange-400/30 text-orange-400 hover:bg-orange-400/10"
                                : "border-green-400/30 text-green-400 hover:bg-green-400/10"
                            }`}
                          >
                            {project.visible ? (
                              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveItem("project", project.id, "up")}
                            disabled={index === 0}
                            className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10 text-xs sm:text-sm disabled:opacity-50"
                          >
                            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveItem("project", project.id, "down")}
                            disabled={index === projects.length - 1}
                            className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10 text-xs sm:text-sm disabled:opacity-50"
                          >
                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProject(project)
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
                                order: project.order,
                              })
                              setIsProjectDialogOpen(true)
                            }}
                            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-xs sm:text-sm"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProject(project.id)}
                            className="border-red-400/30 text-red-400 hover:bg-red-400/10 text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200">Experience</h2>
              <Dialog open={isExpDialogOpen} onOpenChange={setIsExpDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetExperienceForm()
                      setIsExpDialogOpen(true)
                    }}
                    className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/30 text-xs sm:text-sm"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">New Experience</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800/95 border-cyan-400/20">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200 text-lg sm:text-xl">
                      {editingExperience ? "Edit Experience" : "Add New Experience"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitExperience} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="exp-title" className="text-gray-300 text-sm">
                          Title *
                        </Label>
                        <Input
                          id="exp-title"
                          value={expFormData.title}
                          onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="exp-organization" className="text-gray-300 text-sm">
                          Organization *
                        </Label>
                        <Input
                          id="exp-organization"
                          value={expFormData.organization}
                          onChange={(e) => setExpFormData({ ...expFormData, organization: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="exp-year" className="text-gray-300 text-sm">
                          Year/Period *
                        </Label>
                        <Input
                          id="exp-year"
                          value={expFormData.year}
                          onChange={(e) => setExpFormData({ ...expFormData, year: e.target.value })}
                          className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="exp-type" className="text-gray-300 text-sm">
                          Type
                        </Label>
                        <Select
                          value={expFormData.type}
                          onValueChange={(value) => setExpFormData({ ...expFormData, type: value })}
                        >
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Work">Work</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                            <SelectItem value="Project">Project</SelectItem>
                            <SelectItem value="Volunteer">Volunteer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="exp-achievements" className="text-gray-300 text-sm">
                        Achievements (comma-separated)
                      </Label>
                      <Textarea
                        id="exp-achievements"
                        value={expFormData.achievements?.join(", ") || ""}
                        onChange={(e) =>
                          handleTagsChange(e.target.value, (achievements) =>
                            setExpFormData({ ...expFormData, achievements }),
                          )
                        }
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exp-skills" className="text-gray-300 text-sm">
                        Skills (comma-separated)
                      </Label>
                      <Input
                        id="exp-skills"
                        value={expFormData.skills?.join(", ") || ""}
                        onChange={(e) =>
                          handleTagsChange(e.target.value, (skills) => setExpFormData({ ...expFormData, skills }))
                        }
                        className="bg-gray-700/50 border-gray-600 text-gray-200 text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="exp-visible"
                        checked={expFormData.visible}
                        onCheckedChange={(checked) => setExpFormData({ ...expFormData, visible: checked })}
                      />
                      <Label htmlFor="exp-visible" className="text-gray-300 text-sm">
                        Visible on website
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/30 text-sm"
                        variant="outline"
                      >
                        {editingExperience ? "Update Experience" : "Add Experience"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsExpDialogOpen(false)}
                        className="border-gray-600 text-gray-300 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {experience
                .sort((a, b) => a.order - b.order)
                .map((exp, index) => (
                  <Card key={exp.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-200">{exp.title}</h3>
                            <Badge variant="outline" className="w-fit bg-blue-500/20 text-blue-400 border-blue-400/30">
                              {exp.type}
                            </Badge>
                            <Badge
                              variant={exp.visible ? "default" : "secondary"}
                              className={`w-fit ${
                                exp.visible
                                  ? "bg-green-500/20 text-green-400 border-green-400/30"
                                  : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                              }`}
                            >
                              {exp.visible ? "Visible" : "Hidden"}
                            </Badge>
                          </div>
                          <p className="text-gray-400 mb-2 text-sm sm:text-base">{exp.organization}</p>
                          <p className="text-yellow-400 mb-3 text-sm sm:text-base">{exp.year}</p>
                          {exp.achievements.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-gray-300 mb-2">Achievements:</h4>
                              <ul className="space-y-1">
                                {exp.achievements.slice(0, 2).map((achievement, achievementIndex) => (
                                  <li
                                    key={achievementIndex}
                                    className="flex items-start gap-2 text-xs sm:text-sm text-gray-300"
                                  >
                                    <Diamond className="h-3 w-3 text-yellow-400 mt-1 flex-shrink-0" />
                                    {achievement}
                                  </li>
                                ))}
                                {exp.achievements.length > 2 && (
                                  <li className="text-xs sm:text-sm text-gray-400 ml-5">
                                    +{exp.achievements.length - 2} more achievements
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {exp.skills.slice(0, 3).map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs bg-cyan-500/20 text-cyan-400 border-cyan-400/30"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {exp.skills.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-500/20 text-gray-400 border-gray-400/30"
                              >
                                +{exp.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleVisibility("experience", exp.id, exp.visible)}
                            className={`text-xs sm:text-sm ${
                              exp.visible
                                ? "border-orange-400/30 text-orange-400 hover:bg-orange-400/10"
                                : "border-green-400/30 text-green-400 hover:bg-green-400/10"
                            }`}
                          >
                            {exp.visible ? (
                              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveItem("experience", exp.id, "up")}
                            disabled={index === 0}
                            className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10 text-xs sm:text-sm disabled:opacity-50"
                          >
                            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveItem("experience", exp.id, "down")}
                            disabled={index === experience.length - 1}
                            className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10 text-xs sm:text-sm disabled:opacity-50"
                          >
                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingExperience(exp)
                              setExpFormData({
                                year: exp.year,
                                title: exp.title,
                                organization: exp.organization,
                                type: exp.type,
                                achievements: exp.achievements,
                                skills: exp.skills,
                                visible: exp.visible,
                                order: exp.order,
                              })
                              setIsExpDialogOpen(true)
                            }}
                            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-xs sm:text-sm"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteExperience(exp.id)}
                            className="border-red-400/30 text-red-400 hover:bg-red-400/10 text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
