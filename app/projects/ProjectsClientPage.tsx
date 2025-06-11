"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import PageTransitionWrapper from "@/components/page-transition-wrapper"
import { AnimationUtils } from "@/lib/animation-utils"
import anime from "animejs"

const allProjects = [
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

const categories = ["All", "Web App", "Full Stack", "Academic Project", "Cybersecurity"]

export default function ProjectsClientPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  // Force scroll to top on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // Additional force scroll after a brief delay
      setTimeout(() => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 100)
    }

    // Apply animations when component mounts
    AnimationUtils.textReveal(".projects-page-title", { delay: 200 })
    AnimationUtils.staggered(".project-item", "scaleIn", {
      delay: anime.stagger(100, { start: 300 }),
      duration: 800,
    })
  }, [])

  const filteredProjects =
    activeCategory === "All" ? allProjects : allProjects.filter((project) => project.category === activeCategory)

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
    <PageTransitionWrapper namespace="projects">
      <div className="royal-container royal-spacing py-20">
        <h1 className="projects-page-title text-4xl font-bold mb-2 text-center">All Projects</h1>
        <p className="text-center text-gray-400 mb-12">
          Explore my complete collection of projects, from web applications to educational tools, showcasing technical
          expertise and creative problem-solving in cybersecurity and full stack development.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project, index) => (
            <Card key={index} className="project-item royal-card overflow-hidden opacity-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" /> Live
                    </Button>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Github className="h-4 w-4" /> Code
                    </Button>
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageTransitionWrapper>
  )
}
