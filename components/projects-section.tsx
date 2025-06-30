"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Briefcase, Star, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { dataStore } from "@/lib/data-store"
import type { Project } from "@/lib/data-store"

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await dataStore.getAllProjects(true)
        // Show only first 4 projects on homepage
        setProjects(data.slice(0, 4))
      } catch (error) {
        console.error("Error loading projects:", error)
        // Fallback to empty array if loading fails
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="py-20 royal-gradient">
        <div className="royal-container">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-300">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 royal-gradient">
      <div className="royal-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Briefcase className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Innovative solutions and applications showcasing technical expertise and creative problem-solving.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="royal-card h-full transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg?height=160&width=320&text=Project"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`backdrop-blur-sm text-xs ${
                        project.status === "Live"
                          ? "bg-green-500/20 text-green-400 border-green-400/30"
                          : project.status === "In Development"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-400/30"
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 backdrop-blur-sm text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white group-hover:text-yellow-400 transition-colors leading-tight">
                    {project.title}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{project.category}</p>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-gray-400/10 text-gray-400 border-gray-400/20">
                        +{project.technologies.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {project.liveUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10 bg-transparent"
                        onClick={() => window.open(project.liveUrl, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Live
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs midnight-glass text-gray-300 border-gray-400/30 hover:border-gray-400/50 hover:bg-gray-400/10 bg-transparent"
                        onClick={() => window.open(project.githubUrl, "_blank")}
                      >
                        <Github className="h-3 w-3 mr-1" />
                        Code
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/projects">
            <Button size="lg" className="btn-royal text-black font-semibold group">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
