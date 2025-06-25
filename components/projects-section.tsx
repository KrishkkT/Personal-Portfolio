"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Eye, Star, Diamond } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

const projects = [
  {
    title: "SpiceSafari - Simple Travel Website",
    description:
      "SpiceSafari is a sleek and responsive travel website developed by a team of three college students as part of a collaborative academic project. It showcases curated travel destinations, immersive guides, and teamwork with a focus on visual appeal and user engagement.",
    image:
      "https://images.unsplash.com/photo-1749192715605-2c3f74f1e46b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NHx8fGVufDB8fHx8fA%3D%3D",
    technologies: ["HTML5", "CSS3", "Tailwind CSS", "Vercel"],
    category: "Web App",
    featured: false,
    liveUrl: "https://spice-safari.vercel.app",
    githubUrl: "https://github.com/KrishkkT/SpiceSafari",
    status: "Live",
  },
  {
    title: "Thakker & Associates - A Law Firm Website",
    description:
      "Thakker & Associates is a professional legal website developed to establish a strong digital presence for Advocate Jaymin Thakker. The platform provides information on core legal services, areas of practice, and client engagement channels. It reflects a clean, trustworthy design tailored for the legal domain, with a focus on accessibility, SEO, and performance.",
    image:
      "https://images.unsplash.com/photo-1749192511700-9bad608be0c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mnx8fGVufDB8fHx8fA%3D%3D",
    technologies: ["Next.js", "TypeScript", "Node.js", "Formspree", "Vercel", "SEO Optimization"],
    category: "Web App",
    featured: false,
    liveUrl: "https://jayminthakkerlaw.com",
    githubUrl: "#",
    status: "Live",
  },
  {
    title: "SPARSH - An Ecommerce Website",
    description:
      "Sparsh is a modern e-commerce web application built for selling natural hair care products online. Designed to deliver a seamless shopping experience, it features a clean UI, secure payment integration, and intuitive product browsing. Developed as part of a collaborative project, Sparsh blends functionality with elegance to support small wellness businesses going digital.",
    image:
      "https://images.unsplash.com/photo-1749192511760-92eac746260b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D",
    technologies: [
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "TypeScript",
      "Supabase",
      "Authentication",
      "Formspree",
      "Razorpay",
      "SEO and Custom Domain",
    ],
    category: "Full Stack",
    featured: false,
    liveUrl: "https://sparshnaturals.shop",
    githubUrl: "https://github.com/KrishkkT/SPARSH---Ecommerce-Store",
    status: "Live",
  },
  {
    title: "Quick Sort Visualizer - A Java based",
    description:
      "An interactive tool that visually illustrates the Quick Sort algorithm's sorting process. It helps users understand how Quick Sort partitions and sorts elements by animating each step in real-time, making algorithm learning intuitive and engaging.",
    image:
      "https://images.unsplash.com/photo-1749192859407-e85d4a8bd441?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
    technologies: ["Java", "Data Structure - Quick Sort"],
    category: "Academic Project",
    featured: false,
    liveUrl: "https://quick-sort-visualizer.vercel.app/",
    githubUrl: "https://github.com/KrishkkT/QuickSort-Visualizer",
    status: "Live",
  },
]

const categories = ["All", "Full Stack", "Academic Project", "Web App", "Cybersecurity"]

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory)

  const handleLiveDemo = (url: string) => {
    if (url !== "#") {
      window.open(url, "_blank")
    }
  }

  const handleSourceCode = (url: string) => {
    if (url !== "#") {
      window.open(url, "_blank")
    }
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="royal-spacing royal-gradient"
      aria-labelledby="projects-heading"
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      <div className="royal-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
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
              aria-hidden="true"
            >
              <Diamond className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <h2 id="projects-heading" className="text-5xl font-bold text-white" itemProp="name">
              <span className="gradient-text">Projects</span>
            </h2>
            <motion.div
              animate={{
                rotate: [0, -180, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              aria-hidden="true"
            >
              <Diamond className="h-6 w-6 text-yellow-400" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed" itemProp="description">
            Showcasing recent web development and cybersecurity projects that reflect my technical craft and creative
            edge.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          role="tablist"
          aria-label="Project categories"
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
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              role="tab"
              aria-selected={activeCategory === category}
              aria-controls={`${category.toLowerCase()}-projects`}
              id={`${category.toLowerCase()}-tab`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div
          className="grid md:grid-cols-2 gap-8"
          id={`${activeCategory.toLowerCase()}-projects`}
          role="tabpanel"
          aria-labelledby={`${activeCategory.toLowerCase()}-tab`}
          itemScope
          itemType="https://schema.org/ItemList"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              itemScope
              itemType="https://schema.org/SoftwareApplication"
              itemProp="itemListElement"
            >
              <Card className="royal-card overflow-hidden h-full transition-all duration-500 group-hover:shadow-2xl">
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={`${project.title} - Project Screenshot`}
                    width={400}
                    height={300}
                    className={`w-full h-48 object-cover transition-transform duration-500 ${
                      hoveredProject === index ? "scale-110" : "scale-100"
                    }`}
                    itemProp="image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${
                        project.status === "Live"
                          ? "bg-green-500/20 text-green-400 border-green-400/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                      } backdrop-blur-sm`}
                      itemProp="applicationCategory"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 backdrop-blur-sm">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                      hoveredProject === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        className="midnight-glass text-yellow-400 border-yellow-400/30"
                        onClick={() => handleLiveDemo(project.liveUrl)}
                        aria-label={`Preview ${project.title}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        className="midnight-glass text-yellow-400 border-yellow-400/30"
                        onClick={() => handleSourceCode(project.githubUrl)}
                        aria-label={`View source code for ${project.title}`}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle
                      className="text-xl text-white group-hover:text-yellow-400 transition-colors"
                      itemProp="name"
                    >
                      {project.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                      itemProp="applicationSubCategory"
                    >
                      {project.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <p className="text-gray-300 leading-relaxed" itemProp="description">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                        itemProp="keywords"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="sm"
                        className="w-full btn-royal text-black font-semibold"
                        onClick={() => handleLiveDemo(project.liveUrl)}
                        aria-label={`View live demo of ${project.title}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span itemProp="url">Live Demo</span>
                      </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50"
                        onClick={() => handleSourceCode(project.githubUrl)}
                        aria-label={`View source code for ${project.title}`}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Source
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/projects">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="btn-royal text-black font-semibold" aria-label="View all projects">
                View All Projects
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
