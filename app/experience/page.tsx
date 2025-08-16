"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Diamond, Calendar, Building, User, GraduationCap, Briefcase } from "lucide-react"
import { motion } from "framer-motion"
import PageHeader from "@/components/page-header"
import { dataStore } from "@/lib/data-store"
import type { Experience } from "@/lib/data-store"

export default function ExperiencePage() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExperience = async () => {
      try {
        // Only get visible experience for the public page
        const data = await dataStore.getAllExperience(false)
        setExperience(data)
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
      <div className="min-h-screen royal-gradient">
        <PageHeader title="Experience" subtitle="My professional journey and key milestones" icon={User} />
        <div className="royal-container py-20">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-300">Loading experience...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen royal-gradient">
      <PageHeader
        title="Experience"
        subtitle="Key milestones and experiences that have shaped my professional growth and expertise in technology"
        icon={User}
      />

      <div className="royal-container py-20">
        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-yellow-400/30"></div>

            {experience.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative pl-20 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
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
                          {item.achievements.map((achievement, achievementIndex) => (
                            <motion.li
                              key={achievementIndex}
                              className="flex items-start gap-3 text-gray-300"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
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
                          {item.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {experience.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">No experience data available</h3>
            <p className="text-gray-300">Experience information will be updated soon.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
