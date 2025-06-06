"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, Github, Linkedin, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("https://formspree.io/f/xdkkpeby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setSubmitMessage("Thank you! Your message landed safely — I'll circle back shortly.")
        setFormData({ name: "", email: "", subject: "", message: "" })
        setErrors({})
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage(
        "Your message hit turbulence and didn't send. Please try again or get in touch at kjthakker8@gmail.com.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <section id="contact" className="royal-spacing royal-gradient">
      <div className="royal-container">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-white">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Ready to take your ideas to new heights? Let's chart a course and build something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            className="space-y-6 md:space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-white">Let's Connect</h3>
              <p className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
                Open to boarding new opportunities, collaborating on creative projects, or cruising through casual chats
                on tech and design.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <motion.div
                className="flex items-center gap-3 md:gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-2 md:p-3 bg-blue-100/10 dark:bg-blue-900/20 rounded-lg">
                  <Mail className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm md:text-base">Email</h4>
                  <p className="text-gray-300 text-sm md:text-base">kjthakker8@gmail.com</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 md:gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-2 md:p-3 bg-green-100/10 dark:bg-green-900/20 rounded-lg">
                  <Phone className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm md:text-base">Phone</h4>
                  <p className="text-gray-300 text-sm md:text-base">+91 9429984468</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 md:gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-2 md:p-3 bg-purple-100/10 dark:bg-purple-900/20 rounded-lg">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm md:text-base">Location</h4>
                  <p className="text-gray-300 text-sm md:text-base">Gujarat, India</p>
                </div>
              </motion.div>
            </div>

            <div className="pt-6 md:pt-8">
              <h4 className="font-semibold mb-4 text-white text-sm md:text-base">Follow Me</h4>
              <div className="flex gap-3 md:gap-4">
                <motion.a
                  href="https://github.com/krishkkt"
                  className="p-2 md:p-3 midnight-glass rounded-lg hover:bg-blue-100/10 dark:hover:bg-blue-900/20 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="h-4 w-4 md:h-5 md:w-5 text-gray-300 hover:text-white" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/krishthakker08"
                  className="p-2 md:p-3 midnight-glass rounded-lg hover:bg-blue-100/10 dark:hover:bg-blue-900/20 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5 text-gray-300 hover:text-white" />
                </motion.a>
                <motion.a
                  href="mailto:kjthakker8@gmail.com"
                  className="p-2 md:p-3 midnight-glass rounded-lg hover:bg-blue-100/10 dark:hover:bg-blue-900/20 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-300 hover:text-white" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="royal-card">
              <CardHeader>
                <CardTitle className="text-white text-lg md:text-xl">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-gray-800/50 border-gray-600 text-white text-sm md:text-base ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-red-400 text-xs md:text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-gray-800/50 border-gray-600 text-white text-sm md:text-base ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-xs md:text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full bg-gray-800/50 border-gray-600 text-white text-sm md:text-base ${
                        errors.subject ? "border-red-500" : ""
                      }`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && <p className="text-red-400 text-xs md:text-sm mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full bg-gray-800/50 border-gray-600 text-white text-sm md:text-base ${
                        errors.message ? "border-red-500" : ""
                      }`}
                      placeholder="Tell me about your project or idea..."
                    />
                    {errors.message && <p className="text-red-400 text-xs md:text-sm mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Status */}
                  {submitStatus !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 md:p-4 rounded-lg flex items-center gap-3 ${
                        submitStatus === "success" ? "form-success" : "form-error"
                      }`}
                    >
                      {submitStatus === "success" ? (
                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      )}
                      <p className="text-xs md:text-sm">{submitMessage}</p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full btn-royal text-black font-semibold text-sm md:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
