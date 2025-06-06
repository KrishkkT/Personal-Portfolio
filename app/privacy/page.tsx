"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen royal-gradient">
      <div className="royal-container py-20">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <Link href="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>

            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-yellow-400" />
              <h1 className="text-5xl font-bold text-white">
                Privacy <span className="gradient-text">Policy</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we handle your information when you visit our
              portfolio website.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: December 2024</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Information We Collect */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Automatically Collected Information</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• IP address (only when using the CLI tool)</li>
                      <li>• Browser type and version</li>
                      <li>• Operating system information</li>
                      <li>• Device type (mobile, tablet, desktop)</li>
                      <li>• Pages visited and time spent on site</li>
                      <li>• Referring website information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Information You Provide</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• Contact form submissions (name, email, message)</li>
                      <li>• CLI commands you enter (processed locally, not stored)</li>
                      <li>• Any other information you voluntarily provide</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>We use the collected information for the following purposes:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• To respond to your inquiries and contact form submissions</li>
                    <li>• To provide CLI functionality (IP address lookup, device information)</li>
                    <li>• To improve our website's performance and user experience</li>
                    <li>• To analyze website traffic and usage patterns</li>
                    <li>• To ensure website security and prevent abuse</li>
                  </ul>

                  <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mt-6">
                    <p className="text-yellow-400 font-semibold">Important Note:</p>
                    <p className="text-gray-300 mt-2">
                      CLI commands and their outputs are processed entirely in your browser and are not stored on our
                      servers. When you close the website, all CLI data is permanently deleted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Storage and Security */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Data Storage and Security</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Data Storage</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• Contact form submissions are stored securely via Formspree</li>
                      <li>• CLI data is processed locally and never stored</li>
                      <li>• No persistent user sessions or tracking cookies</li>
                      <li>• Website analytics through standard web server logs</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Security Measures</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• HTTPS encryption for all data transmission</li>
                      <li>• Secure hosting infrastructure</li>
                      <li>• Regular security updates and monitoring</li>
                      <li>• No storage of sensitive personal information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Third-Party Services</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>This website uses the following third-party services:</p>
                  <ul className="space-y-3 ml-4">
                    <li>
                      <strong className="text-white">Formspree:</strong> For contact form processing.
                      <a
                        href="https://formspree.io/legal/privacy-policy"
                        className="text-yellow-400 hover:underline ml-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View their privacy policy
                      </a>
                    </li>
                    <li>
                      <strong className="text-white">ipify API:</strong> For IP address lookup in CLI tool.
                      <a
                        href="https://www.ipify.org/"
                        className="text-yellow-400 hover:underline ml-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more
                      </a>
                    </li>
                    <li>
                      <strong className="text-white">Vercel:</strong> For website hosting and deployment.
                      <a
                        href="https://vercel.com/legal/privacy-policy"
                        className="text-yellow-400 hover:underline ml-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View their privacy policy
                      </a>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Your Rights</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="space-y-2 ml-4">
                    <li>
                      • <strong className="text-white">Access:</strong> Request information about data we have collected
                    </li>
                    <li>
                      • <strong className="text-white">Correction:</strong> Request correction of inaccurate information
                    </li>
                    <li>
                      • <strong className="text-white">Deletion:</strong> Request deletion of your personal information
                    </li>
                    <li>
                      • <strong className="text-white">Portability:</strong> Request a copy of your data in a portable
                      format
                    </li>
                    <li>
                      • <strong className="text-white">Objection:</strong> Object to processing of your personal
                      information
                    </li>
                  </ul>

                  <p className="mt-4">
                    To exercise any of these rights, please contact us using the information provided below.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                  <div className="space-y-3 ml-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-yellow-400" />
                      <span>Email: kjthakker8@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-yellow-400" />
                      <span>Website: kjt.vercel.app</span>
                    </div>
                  </div>

                  <p className="mt-6">We will respond to your inquiry within 48 hours during business days.</p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Changes to This Policy</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other
                    operational, legal, or regulatory reasons. We will notify you of any material changes by:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Posting the updated policy on this page</li>
                    <li>• Updating the "Last updated" date at the top of this policy</li>
                    <li>• Providing notice through our website or other appropriate means</li>
                  </ul>

                  <p className="mt-4">
                    Your continued use of our website after any changes indicates your acceptance of the updated Privacy
                    Policy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
