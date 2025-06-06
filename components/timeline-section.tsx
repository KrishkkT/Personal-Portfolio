"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState } from "react"
import { Diamond } from "lucide-react"

const timelineItems = [
  {
    year: "2023 - 2027",
    title: "B.Tech in Information Technology",
    organization: "Dharmsinh Desai University",
    type: "Education",
    achievements: [
     
    ],
    skills: ["IT"],
  },
  {
    year: "2021",
    title: "Higher Secondary Education",
    organization: "Gyanmanjari Vidyapith",
    type: "Education",
    achievements: [
     
    ],
    skills: ["HSC"],
  },
]

export default function TimelineSection() {
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

  return (
    <section ref={sectionRef} id="journey" className="royal-spacing royal-gradient">
      <div className="royal-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold mb-6 text-white">
            My <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The path that has shaped my skills and experience in the world of technology, marked by continuous growth
            and achievement.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-yellow-400/30"></div>

            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                className="relative pl-20 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-yellow-400 border-4 border-gray-900 shadow-lg"></div>

                <Card className="royal-card">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                          <Badge
                            className={`${
                              item.type === "Education"
                                ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                                : "bg-green-500/20 text-green-400 border-green-400/30"
                            }`}
                          >
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-yellow-400/80 text-lg font-medium">{item.organization}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-lg px-4 py-2 bg-yellow-400/10 text-yellow-400 border-yellow-400/20 mt-4 md:mt-0"
                      >
                        {item.year}
                      </Badge>
                    </div>

                    {/* Achievements in dot format */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-4">{/*Key Achievements: */}</h4>
                      <ul className="space-y-3">
                        {item.achievements.map((achievement, achievementIndex) => (
                          <motion.li
                            key={achievementIndex}
                            className="flex items-start gap-3 text-gray-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isVisible ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: index * 0.2 + achievementIndex * 0.1 + 0.3 }}
                          >
                            <Diamond className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                            <span className="leading-relaxed">{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
