"use client"

import { Github, Linkedin, Mail, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Script from "next/script"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/krishkkt",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/krishthakker08",
      icon: Linkedin,
    },
    {
      name: "Email",
      href: "mailto:kjthakker8@gmail.com",
      icon: Mail,
    },
  ]

  return (
    <footer
      className="relative bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/90 to-purple-900/95 z-10"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1691257891879-284b02471d50?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGFpcmxpbmV8ZW58MHwwfDB8fHwy")`,
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        ></div>

        {/* Floating Code Elements */}
        <div className="absolute inset-0 z-5" aria-hidden="true">
          <motion.div
            className="absolute top-20 left-20 text-yellow-400/10"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {/* Code icon here */}
          </motion.div>

          <motion.div
            className="absolute top-40 right-32 text-yellow-400/10"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            {/* Sparkles icon here */}
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-1/3 text-yellow-400/10"
            animate={{
              y: [0, -25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
          >
            {/* Shield icon here */}
          </motion.div>
        </div>
      </div>

      <div className="relative z-20 py-12">
        <div className="royal-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Logo and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-lg font-bold text-xl">
                  KT
                </div>
                <span className="text-xl font-bold text-white">Portfolio</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs" itemProp="description">
                Cybersecurity Specialist & Full Stack Developer passionate about building secure, innovative solutions.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex justify-center gap-6"
            >
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-yellow-400/50 transition-all duration-300"
                  aria-label={link.name}
                  itemProp="sameAs"
                >
                  <link.icon className="h-5 w-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-yellow-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center md:text-right"
            >
              <p className="text-gray-400 text-sm flex items-center justify-center md:justify-end gap-1">
                © {currentYear} Made with <Heart className="h-4 w-4 text-red-500" /> by Krish Thakker
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Structured data for LocalBusiness */}
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "KT - Full Stack Development & Cybersecurity Services",
            description:
              "Professional Full Stack Development and Cybersecurity services by Krish Thakker, specializing in secure web applications, cloud solutions, and ethical hacking.",
            url: "https://kjt.vercel.app",
            logo: "https://kjt.vercel.app/images/favicon.jpg",
            image: "https://kjt.vercel.app/images/profile.jpg",
            address: {
              "@type": "PostalAddress",
              addressRegion: "Gujarat",
              addressCountry: "India",
            },
            email: "kjthakker8@gmail.com",
            founder: {
              "@type": "Person",
              name: "Krish Thakker",
              jobTitle: "Full Stack Developer & Cybersecurity Specialist",
            },
            sameAs: ["https://github.com/krishkkt", "https://linkedin.com/in/krishthakker08"],
            knowsAbout: [
              "Full Stack Development",
              "Cybersecurity",
              "Cloud Computing",
              "React",
              "Next.js",
              "TypeScript",
              "Ethical Hacking",
            ],
            makesOffer: [
              {
                "@type": "Offer",
                name: "Web Development Services",
                description: "Custom web application development using React, Next.js, and TypeScript",
              },
              {
                "@type": "Offer",
                name: "Cybersecurity Services",
                description: "Security audits, penetration testing, and secure application development",
              },
            ],
          }),
        }}
      />
    </footer>
  )
}
