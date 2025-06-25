"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  Calendar,
  CheckCircle,
  BookOpen,
  Zap,
  BarChart,
  Award,
  Code,
  Briefcase,
  Settings,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Certificate, Project, Skill } from "@/types/portfolio"
import { toast } from "sonner"
import { useBlogPosts } from "@/hooks/use-blog-updates"
import { useCertificates, useProjects, useSkills } from "@/hooks/use-portfolio"
import BlogManagement from "./BlogManagement"

type ManagementSection = "overview" | "blogs" | "certificates" | "projects" | "skills"

export default function PortfolioManagement() {
  const [currentSection, setCurrentSection] = useState<ManagementSection>("overview")

  // Fetch data for overview
  const { posts: blogPosts } = useBlogPosts()
  const { certificates } = useCertificates()
  const { projects } = useProjects()
  const { skills } = useSkills()

  const stats = {
    totalBlogPosts: blogPosts.length,
    totalCertificates: certificates.length,
    totalProjects: projects.length,
    totalSkills: skills.length,
  }

  const sections = [
    {
      id: "overview" as ManagementSection,
      title: "Overview",
      icon: BarChart,
      description: "Portfolio statistics and overview",
    },
    {
      id: "blogs" as ManagementSection,
      title: "Blog Posts",
      icon: BookOpen,
      description: "Manage blog posts and articles",
    },
    {
      id: "certificates" as ManagementSection,
      title: "Certificates",
      icon: Award,
      description: "Manage certificates and achievements",
    },
    {
      id: "projects" as ManagementSection,
      title: "Projects",
      icon: Code,
      description: "Manage portfolio projects",
    },
    {
      id: "skills" as ManagementSection,
      title: "Skills",
      icon: Settings,
      description: "Manage technical skills",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
      <div className="royal-container">
        {/* Hero Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 mb-6">
            <Briefcase className="h-10 w-10 text-gray-900" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">Portfolio Management</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive management system for your entire portfolio
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                currentSection === section.id
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                  : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
              }`}
              onClick={() => setCurrentSection(section.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <section.icon className="h-5 w-5" />
              {section.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {currentSection === "overview" && <OverviewSection key="overview" stats={stats} />}
          {currentSection === "blogs" && <BlogManagement key="blogs" />}
          {currentSection === "certificates" && <CertificatesManagement key="certificates" />}
          {currentSection === "projects" && <ProjectsManagement key="projects" />}
          {currentSection === "skills" && <SkillsManagement key="skills" />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Overview Section Component
function OverviewSection({ stats }: { stats: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="midnight-glass border-yellow-400/20">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{stats.totalBlogPosts}</div>
            <div className="text-sm text-gray-300">Blog Posts</div>
          </CardContent>
        </Card>

        <Card className="midnight-glass border-yellow-400/20">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{stats.totalCertificates}</div>
            <div className="text-sm text-gray-300">Certificates</div>
          </CardContent>
        </Card>

        <Card className="midnight-glass border-yellow-400/20">
          <CardContent className="p-6 text-center">
            <Code className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{stats.totalProjects}</div>
            <div className="text-sm text-gray-300">Projects</div>
          </CardContent>
        </Card>

        <Card className="midnight-glass border-yellow-400/20">
          <CardContent className="p-6 text-center">
            <Settings className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{stats.totalSkills}</div>
            <div className="text-sm text-gray-300">Skills</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="midnight-glass border-yellow-400/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2 bg-blue-500/20 text-blue-400 border border-blue-400/30 hover:bg-blue-500/30">
              <Plus className="h-6 w-6" />
              <span>New Blog Post</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2 bg-green-500/20 text-green-400 border border-green-400/30 hover:bg-green-500/30">
              <Plus className="h-6 w-6" />
              <span>Add Certificate</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2 bg-purple-500/20 text-purple-400 border border-purple-400/30 hover:bg-purple-500/30">
              <Plus className="h-6 w-6" />
              <span>New Project</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2 bg-orange-500/20 text-orange-400 border border-orange-400/30 hover:bg-orange-500/30">
              <Plus className="h-6 w-6" />
              <span>Add Skill</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Certificates Management Component
function CertificatesManagement() {
  const { certificates, loading, createCertificate, updateCertificate, deleteCertificate } = useCertificates()
  const [isEditing, setIsEditing] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    skills: "",
    verified: false,
    status: "Active",
    image_url: "",
    level: "",
    hours: "",
    category: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const certificateData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }

      if (editingCertificate) {
        await updateCertificate(editingCertificate.id, certificateData)
        toast.success("Certificate updated successfully")
      } else {
        await createCertificate(certificateData)
        toast.success("Certificate created successfully")
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save certificate")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      date: "",
      description: "",
      skills: "",
      verified: false,
      status: "Active",
      image_url: "",
      level: "",
      hours: "",
      category: "",
    })
    setEditingCertificate(null)
    setIsEditing(false)
  }

  const startEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      date: certificate.date,
      description: certificate.description,
      skills: certificate.skills.join(", "),
      verified: certificate.verified,
      status: certificate.status,
      image_url: certificate.image_url || "",
      level: certificate.level || "",
      hours: certificate.hours || "",
      category: certificate.category || "",
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCertificate(id)
      toast.success("Certificate deleted successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete certificate")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Certificates Management</h2>
          <p className="text-gray-400">Manage your professional certificates and achievements</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
        >
          {isEditing ? <Eye className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {isEditing ? "View Certificates" : "Add Certificate"}
        </Button>
      </div>

      {isEditing ? (
        /* Certificate Form */
        <Card className="midnight-glass border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer" className="text-white">
                    Issuer *
                  </Label>
                  <Input
                    id="issuer"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-white">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level" className="text-white">
                    Level
                  </Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="e.g., Professional, Academic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours" className="text-white">
                    Hours
                  </Label>
                  <Input
                    id="hours"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="e.g., 40+"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-white">
                    Skills (comma-separated)
                  </Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="React, Node.js, Python"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="e.g., Cybersecurity, Web Development"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="text-white">
                    Image URL
                  </Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="https://example.com/certificate.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-white">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 text-white rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="rounded border-gray-600 bg-gray-800"
                />
                <Label htmlFor="verified" className="text-white">
                  Verified Certificate
                </Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editingCertificate ? "Update Certificate" : "Create Certificate"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Certificates List */
        <div className="space-y-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="midnight-glass rounded-xl p-6 h-64 border border-gray-700/30">
                    <div className="bg-gray-700/50 h-6 rounded mb-4"></div>
                    <div className="bg-gray-700/50 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-700/50 h-4 rounded w-1/2 mb-4"></div>
                    <div className="bg-gray-700/50 h-20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <Card className="midnight-glass border-yellow-400/20 text-center py-12">
              <CardContent>
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No certificates found</h3>
                <p className="text-gray-400 mb-4">Start by adding your first certificate</p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Certificate
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate, index) => (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 h-full group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{certificate.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{certificate.issuer}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                            <Calendar className="h-3 w-3" />
                            <span>{certificate.date}</span>
                            {certificate.verified && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{certificate.description}</p>

                      {certificate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {certificate.skills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {certificate.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-400/10 text-gray-400">
                              +{certificate.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => startEdit(certificate)}
                          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(certificate.id)}
                          className="bg-red-500/10 text-red-400 border border-red-400/30 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// Projects Management Component
function ProjectsManagement() {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects()
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    technologies: "",
    category: "",
    featured: false,
    live_url: "",
    github_url: "",
    status: "Live",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }

      if (editingProject) {
        await updateProject(editingProject.id, projectData)
        toast.success("Project updated successfully")
      } else {
        await createProject(projectData)
        toast.success("Project created successfully")
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save project")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      technologies: "",
      category: "",
      featured: false,
      live_url: "",
      github_url: "",
      status: "Live",
    })
    setEditingProject(null)
    setIsEditing(false)
  }

  const startEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || "",
      technologies: project.technologies.join(", "),
      category: project.category,
      featured: project.featured,
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      status: project.status,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id)
      toast.success("Project deleted successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Projects Management</h2>
          <p className="text-gray-400">Manage your portfolio projects and showcase work</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
        >
          {isEditing ? <Eye className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {isEditing ? "View Projects" : "Add Project"}
        </Button>
      </div>

      {isEditing ? (
        /* Project Form */
        <Card className="midnight-glass border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{editingProject ? "Edit Project" : "Add New Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Category *
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 text-white rounded-md"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Web App">Web App</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Academic Project">Academic Project</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-white">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 text-white rounded-md"
                  >
                    <option value="Live">Live</option>
                    <option value="In Development">In Development</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies" className="text-white">
                  Technologies (comma-separated) *
                </Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="React, Node.js, TypeScript, MongoDB"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="live_url" className="text-white">
                    Live URL
                  </Label>
                  <Input
                    id="live_url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url" className="text-white">
                    GitHub URL
                  </Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-white">
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-600 bg-gray-800"
                />
                <Label htmlFor="featured" className="text-white">
                  Featured Project
                </Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Projects List */
        <div className="space-y-6">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="midnight-glass rounded-xl p-6 h-80 border border-gray-700/30">
                    <div className="bg-gray-700/50 h-6 rounded mb-4"></div>
                    <div className="bg-gray-700/50 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-700/50 h-4 rounded w-1/2 mb-4"></div>
                    <div className="bg-gray-700/50 h-20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Card className="midnight-glass border-yellow-400/20 text-center py-12">
              <CardContent>
                <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-gray-400 mb-4">Start by adding your first project</p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 h-full group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-white line-clamp-1">{project.title}</h3>
                            {project.featured && (
                              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-400/10 text-blue-400 border-blue-400/20"
                            >
                              {project.category}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                project.status === "Live"
                                  ? "bg-green-500/20 text-green-400 border-green-400/30"
                                  : "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                              }`}
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs bg-gray-400/10 text-gray-400">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => startEdit(project)}
                          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(project.id)}
                          className="bg-red-500/10 text-red-400 border border-red-400/30 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// Skills Management Component
function SkillsManagement() {
  const { skills, loading, createSkill, updateSkill, deleteSkill } = useSkills()
  const [isEditing, setIsEditing] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    icon_name: "",
    color: "#3B82F6",
    category: "",
  })

  const skillCategories = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Cloud",
    "AI/Automation",
    "Security",
    "Tools",
    "Mobile",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, formData)
        toast.success("Skill updated successfully")
      } else {
        await createSkill(formData)
        toast.success("Skill created successfully")
      }

      resetForm()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save skill")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      icon_name: "",
      color: "#3B82F6",
      category: "",
    })
    setEditingSkill(null)
    setIsEditing(false)
  }

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      icon_name: skill.icon_name,
      color: skill.color,
      category: skill.category,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id)
      toast.success("Skill deleted successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete skill")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Skills Management</h2>
          <p className="text-gray-400">Manage your technical skills and expertise</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
        >
          {isEditing ? <Eye className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {isEditing ? "View Skills" : "Add Skill"}
        </Button>
      </div>

      {isEditing ? (
        /* Skill Form */
        <Card className="midnight-glass border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{editingSkill ? "Edit Skill" : "Add New Skill"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Skill Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="e.g., React, Python, Docker"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon_name" className="text-white">
                    Icon Name *
                  </Label>
                  <Input
                    id="icon_name"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    placeholder="e.g., SiReact, SiPython, SiDocker"
                    required
                  />
                  <p className="text-xs text-gray-400">Use Simple Icons names (Si prefix) or Lucide React icon names</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Category *
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 text-white rounded-md"
                    required
                  >
                    <option value="">Select Category</option>
                    {skillCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-white">
                    Color *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10 bg-gray-800/50 border-gray-600 rounded-md"
                      required
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 bg-gray-800/50 border-gray-600 text-white"
                      placeholder="#3B82F6"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editingSkill ? "Update Skill" : "Create Skill"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Skills List */
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="midnight-glass rounded-xl p-4 h-24 border border-gray-700/30">
                    <div className="bg-gray-700/50 h-8 w-8 rounded mb-2 mx-auto"></div>
                    <div className="bg-gray-700/50 h-3 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : skills.length === 0 ? (
            <Card className="midnight-glass border-yellow-400/20 text-center py-12">
              <CardContent>
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No skills found</h3>
                <p className="text-gray-400 mb-4">Start by adding your first skill</p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 group relative">
                    <CardContent className="p-4 text-center">
                      <div
                        className="text-3xl mb-2 mx-auto w-12 h-12 flex items-center justify-center rounded-lg"
                        style={{ color: skill.color, backgroundColor: `${skill.color}20` }}
                      >
                        {/* Icon placeholder - in real implementation, you'd dynamically import the icon */}
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: skill.color }}></div>
                      </div>
                      <h3 className="text-sm font-medium text-white mb-1 line-clamp-1">{skill.name}</h3>
                      <Badge variant="outline" className="text-xs bg-gray-700/50 text-gray-300 border-gray-600">
                        {skill.category}
                      </Badge>

                      {/* Action buttons - shown on hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(skill)}
                          className="h-6 w-6 p-0 bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(skill.id)}
                          className="h-6 w-6 p-0 bg-red-400/20 text-red-400 hover:bg-red-400/30"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
