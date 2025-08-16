"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Diamond, Calendar, Building, User, GraduationCap, Briefcase, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { dataStore } from "@/lib/data-store"
import type { Experience } from "@/lib/data-store"

export default function TimelineSection() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const loadExperience = async () => {
      try {
        // Remove the 'true' parameter to only get visible experience
        const data = await dataStore.getAllExperience()
        setExperience(data.slice(0, 4)) // Show only first 4 items
      } catch (error) {
        console.error("Error loading experience:", error)
      } finally {
        setLoading(false)
      }
    }

    loadExperience()
  }, [])

  if (loading) {
    return (
      <section ref={sectionRef} id="journey" className="py-20 royal-gradient">
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
              >
                <Diamond className="h-6 w-6 text-yellow-400" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                My <span className="gradient-text">Journey</span>
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Key milestones and experiences that have shaped my professional growth
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-yellow-400/30"></div>
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="relative pl-20 pb-12 last:pb-0 animate-pulse"
                  initial={{ opacity: 0, x: -50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-gray-700 border-4 border-gray-900"></div>
                  <div className="royal-card">
                    <div className="p-8">
                      <div className="bg-gray-700/50 h-6 rounded w-3/4 mb-4"></div>
                      <div className="bg-gray-700/50 h-4 rounded w-1/2 mb-6"></div>
                      <div className="space-y-2">
                        <div className="bg-gray-700/50 h-4 rounded"></div>
                        <div className="bg-gray-700/50 h-4 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="journey" className="py-20 royal-gradient">
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
            >
              <Diamond className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              My <span className="gradient-text">Journey</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Key milestones and experiences that have shaped my professional growth and expertise in technology
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-yellow-400/30"></div>

            {experience.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative pl-20 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <motion.div
                  className="absolute left-6 top-6 w-4 h-4 rounded-full bg-yellow-400 border-4 border-gray-900 shadow-lg"
                  whileHover={{ scale: 1.2 }}
                />

                <Card className="royal-card hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {item.type === "Education" ? (
                            <GraduationCap className="h-6 w-6 text-blue-400" />
                          ) : (
                            <Briefcase className="h-6 w-6 text-green-400" />
                          )}
                          <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                            {item.title}
                          </h3>
                          <Badge
                            className={`${
                              item.type === "Education"
                                ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                                : item.type === "Work"
                                  ? "bg-green-500/20 text-green-400 border-green-400/30"
                                  : item.type === "Internship"
                                    ? "bg-purple-500/20 text-purple-400 border-purple-400/30"
                                    : "bg-orange-500/20 text-orange-400 border-orange-400/30"
                            }`}
                          >
                            {item.type}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Building className="h-5 w-5 text-yellow-400" />
                          <p className="text-yellow-400/80 text-lg font-medium">{item.organization}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Calendar className="h-5 w-5 text-yellow-400" />
                        <Badge
                          variant="outline"
                          className="text-lg px-4 py-2 bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                        >
                          {item.year}
                        </Badge>
                      </div>
                    </div>

                    {/* Achievements */}
                    {item.achievements.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Diamond className="h-5 w-5 text-yellow-400" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-3">
                          {item.achievements.slice(0, 2).map((achievement, achievementIndex) => (
                            <motion.li
                              key={achievementIndex}
                              className="flex items-start gap-3 text-gray-300"
                              initial={{ opacity: 0, x: -20 }}
                              animate={isVisible ? { opacity: 1, x: 0 } : {}}
                              transition={{ duration: 0.4, delay: index * 0.1 + achievementIndex * 0.1 + 0.3 }}
                            >
                              <Diamond className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                              <span className="leading-relaxed">{achievement}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Skills */}
                    {item.skills.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Skills & Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.skills.slice(0, 4).map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {item.skills.length > 4 && (
                            <Badge variant="outline" className="bg-gray-400/10 text-gray-400 border-gray-400/20">
                              +{item.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View More Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/experience">
            <Button size="lg" className="btn-royal text-black font-semibold group">
              <User className="mr-2 h-5 w-5" />
              View Full Journey
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
