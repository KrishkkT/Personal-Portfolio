import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, Users, Lock, Eye, AlertTriangle, Mail, Scale } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | KT Portfolio",
  description: "Terms of service and conditions for using KT Portfolio website and services.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="h-8 w-8 text-gray-900" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-300 text-lg">Please read these terms carefully before using our services</p>
            <p className="text-gray-400 text-sm mt-2">Last updated: January 2024</p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <FileText className="h-6 w-6 text-yellow-400" />
                  1. Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  By accessing and using KT Portfolio ("the Service"), you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
                <p>
                  These Terms of Service constitute a legally binding agreement between you and KT Portfolio regarding
                  your use of the Service.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Shield className="h-6 w-6 text-blue-400" />
                  2. Use License
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Permission is granted to temporarily access the materials on KT Portfolio for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a transfer of title, and under this
                  license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p>
                  This license shall automatically terminate if you violate any of these restrictions and may be
                  terminated by KT Portfolio at any time.
                </p>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Users className="h-6 w-6 text-green-400" />
                  3. User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>As a user of this Service, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the Service only for lawful purposes</li>
                  <li>Not interfere with or disrupt the Service or servers</li>
                  <li>Not attempt to gain unauthorized access to any part of the Service</li>
                  <li>Respect the intellectual property rights of others</li>
                  <li>Not engage in any activity that could harm or impair the Service</li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Lock className="h-6 w-6 text-purple-400" />
                  4. Privacy and Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our
                  Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </p>
                <p>
                  For detailed information about how we handle your data, please review our{" "}
                  <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300 underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>

            {/* Content and Intellectual Property */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Eye className="h-6 w-6 text-indigo-400" />
                  5. Content and Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  All content on KT Portfolio, including but not limited to text, graphics, logos, images, and software,
                  is the property of KT Portfolio or its content suppliers and is protected by copyright and other
                  intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly
                  perform, republish, download, store, or transmit any of the material on our Service without prior
                  written consent.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                  6. Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by
                  law, KT Portfolio excludes all representations, warranties, conditions and terms whether express or
                  implied.
                </p>
                <p>
                  KT Portfolio shall not be liable for any damages arising from the use or inability to use the
                  materials on its website, even if KT Portfolio or an authorized representative has been notified
                  orally or in writing of the possibility of such damage.
                </p>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  7. Modifications to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  KT Portfolio may revise these Terms of Service at any time without notice. By using this Service, you
                  are agreeing to be bound by the then current version of these Terms of Service.
                </p>
                <p>
                  We recommend that you periodically review these Terms to stay informed of any changes. Your continued
                  use of the Service after any modifications indicates your acceptance of the modified terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Mail className="h-6 w-6 text-red-400" />
                  8. Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about these Terms of Service, please contact us through the contact form on
                  our website or via email.
                </p>
                <p>
                  We will make every effort to respond to your inquiries in a timely manner and address any concerns you
                  may have regarding these terms.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
