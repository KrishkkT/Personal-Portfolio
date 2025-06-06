"use client"

import { Github, Linkedin, Mail, Heart, Shield, Zap, Code, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Script from "next/script"

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" itemScope itemType="https://schema.org/WPFooter">
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
            <Code className="h-16 w-16" />
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
            <Sparkles className="h-12 w-12" />
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
            <Shield className="h-20 w-20" />
          </motion.div>
        </div>
      </div>

      <div className="relative z-20 py-16">
        <div className="royal-container">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <motion.div
              className="space-y-6 md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              itemScope
              itemType="https://schema.org/Organization"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <motion.div
                    className="absolute -top-2 -right-2"
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
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                </div>
                <span className="text-3xl font-bold gradient-text" itemProp="name">
                  KT
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md" itemProp="description">
                Cybersecurity & Cloud Enthusiast | Red & Blue Team Learner | Crafting extraordinary digital experiences
                that set new industry standards
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                <span>Built on a runway of trusted, premium security practices</span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Code className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                Quick Links
              </h3>
              <nav aria-label="Footer Navigation">
                <div className="space-y-3">
                  {[
                    { name: "About", href: "#about" },
                    { name: "Skills", href: "#skills" },
                    { name: "Projects", href: "/projects" },
                    { name: "Certificates", href: "/certificates" },
                    { name: "Contact", href: "#contact" },
                  ].map((link, index) => (
                    <motion.div key={link.name} whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                      <Link
                        href={link.href}
                        className="block text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                        aria-label={`Navigate to ${link.name} section`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>
            </motion.div>

            {/* Contact & Social */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              itemScope
              itemType="https://schema.org/Person"
            >
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                Connect
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                  <span itemProp="email">kjthakker8@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Shield className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                  <span itemProp="address">Gujarat, India</span>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-4 text-white">Follow the Journey</h4>
                <div className="flex gap-4">
                  <motion.a
                    href="https://github.com/krishkkt"
                    className="p-3 midnight-glass rounded-lg hover:bg-yellow-400/10 transition-colors group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="GitHub Profile"
                    itemProp="sameAs"
                  >
                    <Github className="h-5 w-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/in/krishthakker08"
                    className="p-3 midnight-glass rounded-lg hover:bg-yellow-400/10 transition-colors group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="LinkedIn Profile"
                    itemProp="sameAs"
                  >
                    <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </motion.a>
                  <motion.a
                    href="mailto:kjthakker8@gmail.com"
                    className="p-3 midnight-glass rounded-lg hover:bg-yellow-400/10 transition-colors group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Send Email"
                  >
                    <Mail className="h-5 w-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-yellow-400/20 mt-12 pt-8">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 flex items-center gap-2 flex-wrap">
                Crafted with
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  aria-hidden="true"
                >
                  <Heart className="h-4 w-4 text-red-500" />
                </motion.span>
                <Zap className="h-4 w-4 text-yellow-500" aria-hidden="true" />& secured with
                <Shield className="h-4 w-4 text-blue-500" aria-hidden="true" />
                by KT
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>© {new Date().getFullYear()} All rights reserved.</span>
                <div className="flex items-center gap-4">
                  <Link href="/privacy" className="hover:text-yellow-400 transition-colors" aria-label="Privacy Policy">
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-yellow-400 transition-colors"
                    aria-label="Terms & Conditions"
                  >
                    Terms & Conditions
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-yellow-400" aria-hidden="true" />
                  <span className="text-yellow-400">Navigator's Select</span>
                </div>
              </div>
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
