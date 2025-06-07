"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Award, Calendar, ArrowLeft, CheckCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const allCertificates = [
  {
    title: "Google Professional Cybersecurity",
    issuer: "Google via Coursera",
    date: "2025",
    description:
      "A beginner-friendly, hands-on course that builds foundational cybersecurity skills. It covers essential topics like threat types, risk management, incident response, SIEM tools, and network security. Includes practical labs with Python, Linux, and tools like Wireshark and Chronicle.",
    skills: ["Network Security", "SOC Tools", "Python & Linux", "MySQL", "Incident Response"],
    verified: true,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1749188413538-feffa77e73ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
    level: "Professional",
    hours: "40+",
  },
  {
    title: "Microsoft Cybersecurity Job Simulation",
    issuer: "Microsoft via Forage",
    date: "2025",
    description:
      "This virtual internship simulates a real-world analyst role. I worked on mock tasks like designing a Phishing email simulation and Interpret a phishing simulation result It mimics what Microsoft analysts do and offers experience with a company environment. Not a full internship but great for skill showcase and resume.",
    skills: ["Phishing Simulation", "Analysis of Simulation Results", "Microsoft Security Tools"],
    verified: true,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1749188622851-3c9ffdcf96e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NXx8fGVufDB8fHx8fA%3D%3D",
    level: "Virtual Internship",
    hours: "20+",
  },
  {
    title: "DSA using Java",
    issuer: "Government-certified (AICTE + NPTEL course)",
    date: "2024",
    description:
      "A comprehensive course that teaches core data structures and algorithms in Java, from arrays and linked lists to trees, graphs, and sorting algorithms. Includes weekly assignments and a final proctored exam.",
    skills: ["Data Structures", "Java Implementation", "Algorithms"],
    verified: true,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1749188760192-c8e5106b0b0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D",
    level: "Academic Certification",
    hours: "30+",
  },
  {
    title: "Ethical Hacking",
    issuer: "Government-certified (AICTE + NPTEL course)",
    date: "2024",
    description:
      "An academic course focusing on ethical hacking from a theoretical and applied perspective. Covers system vulnerabilities, reconnaissance, malware, phishing, DoS attacks, network scanning, and cyber laws.",
    skills: ["Reconnaissance", "Offensive Attacks", "Footprinting and Analysis"],
    verified: true,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1749188838339-5e1ea7c6572e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mnx8fGVufDB8fHx8fA%3D%3D",
    level: "Academic Certification",
    hours: "25+",
  },
  {
    title: "Ethical Hacking by Zsecurity",
    issuer: "Zsecurity via Udemy",
    date: "2024",
    description:
      "A practical, tool-based course that teaches how to ethically hack systems using Kali Linux, Metasploit, Wireshark, Nmap, Burp Suite, etc. Ideal for beginners who want real hacking exposure in a sandboxed environment.",
    skills: ["Kali Linux and Tools", "Web App Security", "Social engineering basics", "Exploitation techniques"],
    verified: true,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1749188519942-cb9d3ffa9f61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NHx8fGVufDB8fHx8fA%3D%3D",
    level: "Online Course",
    hours: "35+",
  },
]

const categories = ["All", "Cloud Computing", "Web Development", "Cybersecurity", "Virtual Internship", "Academic"]

const handleViewCertificate = (imageUrl: string) => {
  window.open(imageUrl, "_blank")
}

export default function CertificatesPage() {
  const [activeCategory, setActiveCategory] = useState("All")

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
  }, [])

  const filteredCertificates =
    activeCategory === "All" ? allCertificates : allCertificates.filter((cert) => cert.category === activeCategory)

  // Calculate total study hours
  const totalStudyHours = allCertificates.reduce((total, cert) => {
    // Extract the number from the hours string (e.g., "40+" becomes 40)
    const hours = Number.parseInt(cert.hours || "0")
    return total + hours
  }, 0)

  return (
    <div className="min-h-screen royal-gradient">
      <div className="royal-container py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8 mt-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>

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
            <h1 className="text-6xl font-bold text-white">
              All <span className="gradient-text">Certificates</span>
            </h1>
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

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="royal-card h-full transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={cert.image || "/placeholder.svg"}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                  {/* Status badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {cert.verified && (
                      <motion.div
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
                    <Badge
                      className={`backdrop-blur-sm ${
                        cert.status === "Active"
                          ? "bg-green-500/20 text-green-400 border-green-400/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
                      }`}
                    >
                      {cert.status === "In Progress" && <Clock className="h-3 w-3 mr-1" />}
                      {cert.status}
                    </Badge>
                  </div>

                  {/* Level badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 backdrop-blur-sm">
                      {cert.level}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-2 bg-yellow-400/10 rounded-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Award className="h-5 w-5 text-yellow-400" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg text-white group-hover:text-yellow-400 transition-colors leading-tight">
                          {cert.title}
                        </CardTitle>
                        <p className="text-sm text-gray-400">{cert.issuer}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Issued {cert.date}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <p className="text-gray-300 leading-relaxed text-sm">{cert.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 4).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {cert.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs bg-gray-400/10 text-gray-400 border-gray-400/20">
                        +{cert.skills.length - 4}
                      </Badge>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10"
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

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="royal-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{allCertificates.length}</div>
              <div className="text-sm text-gray-300">Total Certificates</div>
            </CardContent>
          </Card>
          <Card className="royal-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {allCertificates.filter((c) => c.status === "Active").length}
              </div>
              <div className="text-sm text-gray-300">Active Certificates</div>
            </CardContent>
          </Card>
          <Card className="royal-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {allCertificates.filter((c) => c.verified).length}
              </div>
              <div className="text-sm text-gray-300">Verified Certificates</div>
            </CardContent>
          </Card>
          <Card className="royal-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{totalStudyHours}+</div>
              <div className="text-sm text-gray-300">Study Hours</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
