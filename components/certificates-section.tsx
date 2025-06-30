"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Calendar, CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { dataStore } from "@/lib/data-store"
import type { Certificate } from "@/lib/data-store"

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const data = await dataStore.getAllCertificates(true)
        // Show only first 4 certificates on homepage
        setCertificates(data.slice(0, 4))
      } catch (error) {
        console.error("Error loading certificates:", error)
        // Fallback to empty array if loading fails
        setCertificates([])
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

  if (loading) {
    return (
      <section id="certificates" className="py-20 royal-gradient">
        <div className="royal-container">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-300">Loading certificates...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certificates" className="py-20 royal-gradient">
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
              <Award className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Professional <span className="gradient-text">Certificates</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Validated expertise through industry-recognized certifications and continuous learning achievements.
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
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
                    src={cert.image || "/placeholder.svg?height=160&width=320&text=Certificate"}
                    alt={cert.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105 p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Verified badge */}
                  {cert.verified && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30 backdrop-blur-sm text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white group-hover:text-yellow-400 transition-colors leading-tight">
                    {cert.title}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{cert.issuer}</p>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{cert.date}</span>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{cert.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 2).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {cert.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-gray-400/10 text-gray-400 border-gray-400/20">
                        +{cert.skills.length - 2}
                      </Badge>
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
          <Link href="/certificates">
            <Button size="lg" className="btn-royal text-black font-semibold group">
              View All Certificates
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
