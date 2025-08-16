"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Calendar, CheckCircle, ExternalLink, Building, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import PageHeader from "@/components/page-header"
import { dataStore } from "@/lib/data-store"
import type { Certificate } from "@/lib/data-store"

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        // Only get visible certificates for the public page
        const data = await dataStore.getAllCertificates(false)
        setCertificates(data)
      } catch (error) {
        console.error("Error loading certificates:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCertificates()
  }, [])

  const categories = ["All", "Cybersecurity", "Academic", "Professional"]
  const filteredCertificates = filter === "All" ? certificates : certificates.filter((cert) => cert.category === filter)

  const handleViewCertificate = (imageUrl: string) => {
    window.open(imageUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen royal-gradient">
        <PageHeader
          title="Certificates"
          subtitle="Professional certifications and achievements that validate my expertise"
          icon={Award}
        />
        <div className="royal-container py-20">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-300">Loading certificates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen royal-gradient">
      <PageHeader
        title="Certificates"
        subtitle="Professional certifications and achievements that validate my expertise and commitment to continuous learning"
        icon={Award}
      />

      <div className="royal-container py-20">
        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              className={
                filter === category
                  ? "btn-royal text-black font-semibold"
                  : "midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10 bg-transparent"
              }
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="royal-card h-full transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={cert.image || "/placeholder.svg?height=200&width=400"}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Verified badge */}
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
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 backdrop-blur-sm">
                      {cert.level}
                    </Badge>
                  </div>
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
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Building className="h-4 w-4" />
                          <span>{cert.issuer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <p className="text-gray-300 leading-relaxed">{cert.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Issued in {cert.date}</span>
                    </div>
                    {cert.hours && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{cert.hours} hours</span>
                      </div>
                    )}
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
                      className="w-full midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10 bg-transparent"
                      onClick={() => handleViewCertificate(cert.image)}
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

        {filteredCertificates.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">No certificates found</h3>
            <p className="text-gray-300">Try selecting a different category.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
