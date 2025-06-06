"use client"

import { useState, useEffect, useRef } from "react"
import { SiCss3 } from "react-icons/si"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
// React Icons from 'react-icons/si' (Simple Icons)
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiTailwindcss,
  SiTensorflow,
  SiDialogflow,
  SiDocker,
  SiDigitalocean,
  SiLinux,
  SiWireshark,
  SiHackerone,
  SiHackthebox,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiPostman,
  SiVercel,
} from "react-icons/si"
import { FaProjectDiagram, FaCode } from "react-icons/fa"
import { Shield, Star, Diamond, Sparkles, Cloud } from "lucide-react"

const skills = [
  // Core Tech & Development
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", category: "Frontend" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "Frontend" },
  { name: "React", icon: SiReact, color: "#61DAFB", category: "Frontend" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000", category: "Frontend" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", category: "Backend" },
  { name: "Python", icon: SiPython, color: "#3776AB", category: "Backend" },
  { name: "HTML and CSS", icon: SiCss3, color: "#264de4", category: "Frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", category: "Frontend" },

  // AI & Automation
  { name: "AI", icon: SiTensorflow, color: "#FF6F00", category: "AI/Automation" },
  { name: "Chatbots", icon: SiDialogflow, color: "#4285F4", category: "AI/Automation" },
  { name: "Workflow Automation (n8n)", icon: FaProjectDiagram, color: "#0099FF", category: "AI/Automation" },
  { name: "Scripting & Automation", icon: SiPython, color: "#3776AB", category: "AI/Automation" },

  // Cloud & Deployment
  { name: "Docker", icon: SiDocker, color: "#2496ED", category: "DevOps" },
  { name: "AWS", icon: Cloud, color: "#FF9900", category: "Cloud" },
  { name: "VPS Deployment", icon: SiDigitalocean, color: "#0080FF", category: "DevOps" },
  { name: "Render | Railway | Vercel", icon: SiVercel, color: "#343434", category: "Deployments" },

  // Cybersecurity & Ethical Hacking
  { name: "Kali Linux Tools", icon: SiLinux, color: "#557C94", category: "Security" },
  { name: "Wireshark", icon: SiWireshark, color: "#0055FF", category: "Security" },
  { name: "Bug Bounty", icon: SiHackerone, color: "#FA7453", category: "Security" },
  { name: "Ethical Hacking", icon: SiHackthebox, color: "#F5A623", category: "Security" },
  { name: "Cybersecurity", icon: Shield, color: "#c9b037", category: "Security" },

  // Databases
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", category: "Database" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#336791", category: "Database" },

  // Tools & Version Control
  { name: "Git & Github", icon: SiGit, color: "#F05032", category: "Tools" },
  { name: "VSCode", icon: FaCode, color: "#007ACC", category: "Tools" },
  { name: "Postman", icon: SiPostman, color: "#FF6C37", category: "Tools" },
]

const categories = ["All", "Frontend", "Backend", "Database", "DevOps", "Cloud", "AI/Automation", "Security", "Tools"]

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("All")
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

  const filteredSkills = activeCategory === "All" ? skills : skills.filter((skill) => skill.category === activeCategory)

  return (
    <section ref={sectionRef} id="skills" className="royal-spacing royal-gradient">
      <div className="royal-container">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
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
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              <span className="gradient-text">Skills</span>
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
            >
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
            </motion.div>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            A comprehensive mastery of advanced technologies and tools, honed through years of precise navigation and
            relentless pursuit of peak performance.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${
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
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
              whileHover={{
                scale: 1.1,
                y: -10,
              }}
            >
              <Card className="royal-card h-full transition-all duration-300 group-hover:shadow-2xl">
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 h-full">
                  <motion.div
                    className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 transition-all duration-300"
                    style={{ color: skill.color }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <skill.icon />
                  </motion.div>
                  <span className="text-xs md:text-sm font-medium text-gray-200 text-center group-hover:text-white transition-colors">
                    {skill.name}
                  </span>

                  {/* Premium indicator for special skills */}
                  {(skill.name === "React" || skill.name === "Next.js" || skill.name === "TypeScript") && (
                    <motion.div
                      className="mt-2"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Star className="h-3 w-3 text-yellow-400" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="royal-card max-w-2xl mx-auto">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
                <Diamond className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
                <h3 className="text-xl md:text-2xl font-semibold text-white">Continuous Excellence</h3>
                <Diamond className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
              </div>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                As technology ascends, so do my skills. I stay aligned with emerging trends and refine proven tools to
                deliver solutions that are precise, reliable, and ready for takeoff.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
