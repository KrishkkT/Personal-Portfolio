"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Briefcase, Star, Eye } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import PageHeader from "@/components/page-header"
import { dataStore } from "@/lib/data-store"
import type { Project } from "@/lib/data-store"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await dataStore.getAllProjects(true)
        setProjects(data)
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const categories = ["All", "Web Development", "Cybersecurity", "Mobile App", "Desktop App"]
  const filteredProjects = filter === "All" ? projects : projects.filter((project) => project.category === filter)

  const handleLiveDemo = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank")
    }
  }

  const handleSourceCode = (url: string) => {
    if (url && url !== "#") {
      window.open(url, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen royal-gradient">
        <PageHeader
          title="Projects"
          subtitle="Innovative solutions and applications showcasing technical expertise"
          icon={Briefcase}
        />
        <div className="royal-container py-20">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-300">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen royal-gradient">
      <PageHeader
        title="Projects"
        subtitle="Innovative solutions and applications showcasing technical expertise and creative problem-solving"
        icon={Briefcase}
      />

      <div className="royal-container py-20">
        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              className={
                filter === category
                  ? "btn-royal text-black font-semibold"
                  : "midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10 bg-transparent"
              }
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              className="group"
            >
              <Card className="royal-card overflow-hidden h-full transition-all duration-500 group-hover:shadow-2xl">
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg?height=200&width=400"}
                    alt={`${project.title} - Project Screenshot`}
                    width={400}
                    height={300}
                    className={`w-full h-48 object-cover transition-transform duration-500 ${
                      hoveredProject === index ? "scale-110" : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${
                        project.status === "Live"
                          ? "bg-green-500/20 text-green-400 border-green-400/30"
                          : project.status === "In Development"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-400/30"
                      } backdrop-blur-sm`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 backdrop-blur-sm">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                      hoveredProject === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {project.liveUrl && (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          size="sm"
                          className="midnight-glass text-yellow-400 border-yellow-400/30"
                          onClick={() => handleLiveDemo(project.liveUrl!)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </motion.div>
                    )}
                    {project.githubUrl && (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          size="sm"
                          className="midnight-glass text-yellow-400 border-yellow-400/30"
                          onClick={() => handleSourceCode(project.githubUrl!)}
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl text-white group-hover:text-yellow-400 transition-colors">
                      {project.title}
                    </CardTitle>
                    <Badge variant="outline" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
                      {project.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <p className="text-gray-300 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    {project.liveUrl && (
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          size="sm"
                          className="w-full btn-royal text-black font-semibold"
                          onClick={() => handleLiveDemo(project.liveUrl!)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </Button>
                      </motion.div>
                    )}
                    {project.githubUrl && (
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 bg-transparent"
                          onClick={() => handleSourceCode(project.githubUrl!)}
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Source
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">No projects found</h3>
            <p className="text-gray-300">Try selecting a different category.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
