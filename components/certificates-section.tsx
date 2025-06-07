"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Award, Calendar, Sparkles, Diamond } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const certificates = [
  {
    title: "Google Professional Cybersecurity",
    issuer: "Google via Coursera",
    date: "2025",
    description:
      "A beginner-friendly, hands-on course that builds foundational cybersecurity skills. It covers essential topics like threat types, risk management, incident response, SIEM tools, and network security. Includes practical labs with Python, Linux, and tools like Wireshark and Chronicle.",
    skills: ["Network Security", "SOC Tools", "Python & Linux", "MySQL", "Incident Response"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1749188413538-feffa77e73ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
    level: "Professional",
  },
  {
    title: "Microsoft Cybersecurity Job Simulation",
    issuer: "Microsoft via Forage",
    date: "2025",
    description:
      "This virtual internship simulates a real-world analyst role. I worked on mock tasks like designing a Phishing email simulation and Interpret a phishing simulation result It mimics what Microsoft analysts do and offers experience with a company environment. Not a full internship but great for skill showcase and resume.",
    skills: ["Phishing Simulation", "Analysis of Simulation Results", "Microsoft Security Tools"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1749188622851-3c9ffdcf96e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NXx8fGVufDB8fHx8fA%3D%3D",
    level: "Virtual Internship",
  },
  {
    title: "AWS Academy Cloud Foundations",
    issuer: "Amazon Web Services Training and Certification)",
    date: "2025",
    description:
      "Successfully completed the foundational AWS certification, demonstrating a solid understanding of cloud concepts, AWS core services, security, pricing, and support. This certification validates my ability to effectively leverage AWS cloud technology in practical scenarios.",
    skills: ["AWS Cloud", "AWS Core Services", "AWS Architecture", "AWS Foundations"],
    verified: true,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1749281348848-ae1e7215005d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D",
    level: "Cloud Computing",
  },
  {
    title: "DSA using Java",
    issuer: "Government-certified (AICTE + NPTEL course)",
    date: "2024",
    description:
      "A comprehensive course that teaches core data structures and algorithms in Java, from arrays and linked lists to trees, graphs, and sorting algorithms. Includes weekly assignments and a final proctored exam.",
    skills: ["Data Structures", "Java Implementation", "Algorithms"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1749188760192-c8e5106b0b0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D",
    level: "Academic Certification",
  },
  {
    title: "Ethical Hacking",
    issuer: "Government-certified (AICTE + NPTEL course)",
    date: "2024",
    description:
      "An academic course focusing on ethical hacking from a theoretical and applied perspective. Covers system vulnerabilities, reconnaissance, malware, phishing, DoS attacks, network scanning, and cyber laws.",
    skills: ["Reconnaissance", "Offensive Attacks", "Footprinting and Analysis"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1749188838339-5e1ea7c6572e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mnx8fGVufDB8fHx8fA%3D%3D",
    level: "Academic Certification",
  },
  {
    title: "Ethical Hacking by Zsecurity",
    issuer: "Zsecurity via Udemy",
    date: "2024",
    description:
      "A practical, tool-based course that teaches how to ethically hack systems using Kali Linux, Metasploit, Wireshark, Nmap, Burp Suite, etc. Ideal for beginners who want real hacking exposure in a sandboxed environment.",
    skills: ["Kali Linux and Tools", "Web App Security", "Social engineering basics", "Exploitation techniques"],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1749188519942-cb9d3ffa9f61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NHx8fGVufDB8fHx8fA%3D%3D",
    level: "Online Course",
  },
]

const handleViewCertificate = (imageUrl: string) => {
  window.open(imageUrl, "_blank")
}

export default function CertificatesSection() {
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
              key={cert.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Card className="royal-card h-full transition-all duration-300 group-hover:shadow-2xl overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={cert.image || "/placeholder.svg"}
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
                        <Diamond className="h-3 w-3 mr-1" />
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
