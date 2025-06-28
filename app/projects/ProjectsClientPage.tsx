"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Briefcase, Calendar, Star, Code } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import PageHeader from "@/components/page-header"
import { dataStore } from "@/lib/data-store"
import type { Project } from "@/lib/data-store"

const categories = ["All", "Web Development", "Cybersecurity", "Mobile", "Desktop", "AI/ML"]

export default function ProjectsClientPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await dataStore.getAllProjects(true)
        setProjects(data)
      } catch (error) {
        console.error("Error loading projects:", error)
        setError("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory)

  if (loading) {
    return (
      <div className="min-h-screen royal-gradient flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-300">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen royal-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="btn-royal text-black font-semibold">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen royal-gradient">
      <PageHeader
        icon={Briefcase}
        title="Featured"
        subtitle="Projects"
        description="A showcase of innovative web applications, cybersecurity tools, and full-stack solutions that demonstrate my technical expertise and problem-solving capabilities."
      />

      <div className="royal-container pb-20">
        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "btn-royal text-black"
                  : "midnight-glass text-gray-300 hover:text-white border border-yellow-400/20 hover:border-yellow-400/40"
              }`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="royal-card h-full transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg?height=200&width=400"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`backdrop-blur-sm ${
                        project.status === "Live"
                          ? "bg-green-500/20 text-green-400 border-green-400/30"
                          : project.status === "In Development"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-400/30"
                      }`}
                    >
                      {project.status === "In Development" && <Code className="h-3 w-3 mr-1" />}
                      {project.status}
                    </Badge>
                  </div>

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 backdrop-blur-sm">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg text-white group-hover:text-yellow-400 transition-colors leading-tight">
                        {project.title}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{project.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <p className="text-gray-300 leading-relaxed text-sm">{project.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge variant="outline" className="text-xs bg-gray-400/10 text-gray-400 border-gray-400/20">
                        +{project.technologies.length - 4}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10 bg-transparent"
                          onClick={() => window.open(project.liveUrl, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live Demo
                        </Button>
                      </motion.div>
                    )}
                    {project.githubUrl && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full midnight-glass text-gray-300 border-gray-400/30 hover:border-gray-400/50 hover:bg-gray-400/10 bg-transparent"
                          onClick={() => window.open(project.githubUrl, "_blank")}
                        >
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="royal-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{projects.length}</div>
              <div className="text-sm text-gray-300">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="royal-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {projects.filter((p) => p.status === "Live").length}
              </div>
              <div className="text-sm text-gray-300">Live Projects</div>
            </CardContent>
          </Card>
          <Card className="royal-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{projects.filter((p) => p.featured).length}</div>
              <div className="text-sm text-gray-300">Featured Projects</div>
            </CardContent>
          </Card>
          <Card className="royal-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {Array.from(new Set(projects.flatMap((p) => p.technologies))).length}
              </div>
              <div className="text-sm text-gray-300">Technologies Used</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
