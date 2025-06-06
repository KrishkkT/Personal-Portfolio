"use client"

import { motion } from "framer-motion"
import { ArrowLeft, FileText, AlertTriangle, Scale, Globe, Shield, Users } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
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
              <FileText className="h-8 w-8 text-yellow-400" />
              <h1 className="text-5xl font-bold text-white">
                Terms & <span className="gradient-text">Conditions</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our portfolio website and services.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: December 2024</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Scale className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Acceptance of Terms</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>
                    By accessing and using this portfolio website ("the Website"), you accept and agree to be bound by
                    the terms and provision of this agreement. If you do not agree to abide by the above, please do not
                    use this service.
                  </p>
                  <p>
                    These Terms and Conditions govern your use of the Website operated by KT ("we", "us", or "our"). The
                    Website provides portfolio information, project showcases, and interactive tools for educational and
                    professional purposes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Use License</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>
                    Permission is granted to temporarily download one copy of the materials on the Website for personal,
                    non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
                    under this license you may not:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Modify or copy the materials</li>
                    <li>
                      • Use the materials for any commercial purpose or for any public display (commercial or
                      non-commercial)
                    </li>
                    <li>• Attempt to decompile or reverse engineer any software contained on the Website</li>
                    <li>• Remove any copyright or other proprietary notations from the materials</li>
                    <li>• Use automated systems to access or scrape the Website</li>
                  </ul>
                  <p>
                    This license shall automatically terminate if you violate any of these restrictions and may be
                    terminated by us at any time. Upon terminating your viewing of these materials or upon the
                    termination of this license, you must destroy any downloaded materials in your possession whether in
                    electronic or printed format.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interactive CLI Tool */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Interactive CLI Tool</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>
                    Our Website includes an interactive Command Line Interface (CLI) tool that provides information
                    about your device and network connection. By using this tool, you acknowledge and agree that:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>
                      • The CLI tool accesses your IP address and device information for demonstration purposes only
                    </li>
                    <li>• All CLI commands and outputs are processed locally in your browser</li>
                    <li>• No CLI data is stored on our servers or transmitted to third parties</li>
                    <li>• The tool is provided for educational and demonstration purposes</li>
                    <li>• You use the CLI tool at your own risk and discretion</li>
                  </ul>

                  <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-4 mt-6">
                    <p className="text-blue-400 font-semibold">Privacy Note:</p>
                    <p className="text-gray-300 mt-2">
                      The CLI tool uses the ipify.org API to demonstrate IP address lookup functionality. This is a
                      legitimate service used for educational purposes only.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Disclaimer</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>
                    The materials on the Website are provided on an 'as is' basis. To the fullest extent permitted by
                    law, this Company:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Excludes all representations and warranties relating to this Website and its contents</li>
                    <li>
                      • Excludes all liability for damages arising out of or in connection with your use of this Website
                    </li>
                    <li>• Does not warrant that the Website will be constantly available, or available at all</li>
                    <li>
                      • Does not warrant that the information on this Website is complete, true, accurate, or
                      non-misleading
                    </li>
                  </ul>

                  <p>
                    Nothing on this Website constitutes, or is meant to constitute, advice of any kind. If you require
                    advice in relation to any legal, financial, or medical matter you should consult an appropriate
                    professional.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Limitations */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Limitations</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>
                    In no event shall KT or its suppliers be liable for any damages (including, without limitation,
                    damages for loss of data or profit, or due to business interruption) arising out of the use or
                    inability to use the materials on the Website, even if KT or an authorized representative has been
                    notified orally or in writing of the possibility of such damage. Because some jurisdictions do not
                    allow limitations on implied warranties, or limitations of liability for consequential or incidental
                    damages, these limitations may not apply to you.
                  </p>

                  <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mt-6">
                    <p className="text-yellow-400 font-semibold">Important:</p>
                    <p className="text-gray-300 mt-2">
                      This Website is a portfolio showcase and educational platform. Any projects, code samples, or
                      tools demonstrated are for illustrative purposes and should not be used in production environments
                      without proper testing and security review.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Conduct */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">User Conduct</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>You agree not to use the Website to:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• Violate any applicable local, state, national, or international law or regulation</li>
                    <li>
                      • Transmit, or procure the sending of, any advertising or promotional material without our prior
                      written consent
                    </li>
                    <li>
                      • Impersonate or attempt to impersonate the Company, a Company employee, another user, or any
                      other person or entity
                    </li>
                    <li>
                      • Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Website
                    </li>
                    <li>• Use the Website in any manner that could disable, overburden, damage, or impair the site</li>
                    <li>
                      • Use any robot, spider, or other automatic device to access the Website for any purpose without
                      our prior written permission
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="royal-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-6 w-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                </div>

                <div className="space-y-4 text-gray-300">
                  <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
                  <div className="space-y-2 ml-4">
                    <p>Email: kjthakker8@gmail.com</p>
                    <p>Website: kjt.vercel.app</p>
                  </div>

                  <p className="mt-6">
                    These terms and conditions are effective as of December 2024. We reserve the right to update or
                    change our Terms and Conditions at any time without prior notice. Your continued use of the Service
                    after we post any modifications to the Terms and Conditions on this page will constitute your
                    acknowledgment of the modifications and your consent to abide and be bound by the modified Terms and
                    Conditions.
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
