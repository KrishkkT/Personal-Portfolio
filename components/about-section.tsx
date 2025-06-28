"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShieldCheck, Brain, Cloud, Sparkles, Star, LayoutDashboard } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function AboutSection() {
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
    <section
      ref={sectionRef}
      id="about"
      className="royal-spacing royal-gradient"
      aria-labelledby="about-heading"
      itemScope
      itemType="https://schema.org/AboutPage"
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
              <Star className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <h2 id="about-heading" className="text-5xl font-bold text-white" itemProp="headline">
              About <span className="gradient-text">Me</span>
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
              <Star className="h-6 w-6 text-yellow-400" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed" itemProp="description">
            Explore the craft, skill, and commitment behind building thoughtful digital experiences that make a real
            difference in cybersecurity and web development.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative">
              {/* Royal Aura */}
              <motion.div
                className="absolute inset-0 royal-accent rounded-full blur-2xl opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              />

              {/* Floating Icon */}
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                <Sparkles className="h-12 w-12 text-yellow-400" />
              </motion.div>

              {/* Orbiting Elements */}
              <motion.div
                className="absolute top-1/4 -right-8 w-4 h-4 royal-accent rounded-full"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute bottom-1/4 -left-8 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                aria-hidden="true"
              />

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="royal-border">
                <Image
                  src="/images/profile.jpg"
                  alt="Krish Thakker - Cybersecurity Specialist and Full Stack Developer"
                  width={450}
                  height={450}
                  className="relative rounded-full border-4 border-yellow-400/30 shadow-2xl"
                  priority
                  itemProp="image"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div itemProp="mainContentOfPage">
              <h3 className="text-4xl font-bold mb-6 text-white">Wings of Progress</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                I'm Krish Thakker, Cybersecurity, Cloud & Software Development Specialist | Red & Blue Team Expert.{" "}
                <br />
                My work bridges creative vision and technical precision to craft digital experiences that stand out and
                perform securely.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Passionate about Penetration Testing, Cloud Security, and Cybersecurity, with growing experience in Full
                Stack Development. Currently exploring Web Development, Ethical Hacking, Cloud Technologies, and Bug
                Bounty, while pursuing certifications. <br />I bring a strong foundation in cybersecurity tools,
                AI-driven security frameworks, and modern web development, aiming to build secure, scalable, and
                impactful digital solutions.
              </p>
            </div>

            
          </motion.div>
        </div>
      </div>
    </section>
  )
}
