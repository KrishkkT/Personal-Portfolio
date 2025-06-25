"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Award, Calendar, Sparkles, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useCertificates } from "@/hooks/use-portfolio"

const handleViewCertificate = (imageUrl: string) => {
  window.open(imageUrl, "_blank")
}

export default function CertificatesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { certificates, loading } = useCertificates(5) // Show only 5 certificates on homepage

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

  if (loading) {
    return (
      <section ref={sectionRef} id="certificates" className="royal-spacing royal-gradient">
        <div className="royal-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="h-6 w-6 text-yellow-400" />
              <h2 className="text-5xl font-bold text-white">
                <span className="gradient-text">Certificates</span> & Achievements
              </h2>
              <Award className="h-6 w-6 text-yellow-400" />
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Professional certifications and achievements that validate my expertise and commitment to continuous
              learning in cutting-edge technologies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="royal-card h-96 overflow-hidden">
                  <div className="bg-gray-700/50 h-48 mb-4"></div>
                  <div className="p-6">
                    <div className="bg-gray-700/50 h-6 rounded mb-2"></div>
                    <div className="bg-gray-700/50 h-4 rounded w-3/4 mb-4"></div>
                    <div className="bg-gray-700/50 h-20 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="certificates" className="royal-spacing royal-gradient">
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
              <Award className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <h2 className="text-5xl font-bold text-white">
              <span className="gradient-text">Certificates</span> & Achievements
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
              <Award className="h-6 w-6 text-yellow-400" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional certifications and achievements that validate my expertise and commitment to continuous
            learning in cutting-edge technologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="royal-card h-full transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={cert.image_url || "/placeholder.svg?height=200&width=400&text=Certificate"}
                    alt={cert.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Floating verification badge */}
                  {cert.verified && (
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30 backdrop-blur-sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </motion.div>
                  )}

                  {/* Level badge */}
                  {cert.level && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 backdrop-blur-sm">
                        {cert.level}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-2 bg-yellow-400/10 rounded-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Award className="h-6 w-6 text-yellow-400" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg text-white group-hover:text-yellow-400 transition-colors">
                          {cert.title}
                        </CardTitle>
                        <p className="text-sm text-gray-400">{cert.issuer}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <p className="text-gray-300 leading-relaxed">{cert.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Issued in {cert.date}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10"
                      onClick={() => handleViewCertificate(cert.image_url || "")}
                    >
                      View Certificate
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
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
          <Card className="royal-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <h3 className="text-2xl font-semibold text-white">Continuous Learning</h3>
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Always expanding my knowledge and staying current with industry trends and emerging technologies.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/certificates">
                  <Button className="btn-royal text-black font-semibold">
                    View All Achievements
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
