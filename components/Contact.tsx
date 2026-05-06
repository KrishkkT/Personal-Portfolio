"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Github, Linkedin, Send, MapPin, Globe, FileText, MessageSquare, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ContactProps {
  minimal?: boolean;
}

export default function Contact({ minimal = false }: ContactProps) {
  const [activeMode, setActiveMode] = useState<"form" | "email" | "resume">("form");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/xdkkpeby", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const contactInfo = [
    { icon: <Mail size={20} />, label: "Email", value: "contact@krishthakker.in", href: "mailto:contact@krishthakker.in" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", value: "krishthakker08", href: "https://linkedin.com/in/krishthakker08" },
    { icon: <Github size={20} />, label: "GitHub", value: "krishkkt", href: "https://github.com/krishkkt" },
    { icon: <FileText size={20} />, label: "Resume", value: "Download PDF", href: "https://drive.google.com/file/d/1Ex764PTAOCZuOvqjde0kAF2XitHkfRR8/view?usp=sharing" },
  ];

  if (minimal) {
    return (
      <section className="py-24 px-8 relative overflow-hidden" id="contact">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-black text-textPrimary">
              Let's Build Something <span className="text-accent">Legendary</span>.
            </h2>
            <p className="text-lg text-textSecondary max-w-2xl mx-auto leading-relaxed">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link href="/contact" className="btn-primary px-10 py-4 flex items-center gap-2">
              <MessageSquare size={18} />
              Get In Touch
            </Link>
            <a
              href="https://drive.google.com/file/d/1Ex764PTAOCZuOvqjde0kAF2XitHkfRR8/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 border border-border hover:bg-surface transition-colors rounded-none font-bold uppercase tracking-widest text-[0.7rem] flex items-center gap-2"
            >
              <Download size={18} />
              Download Resume
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-36 pb-24 px-8 relative overflow-hidden" id="contact">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-accent/5 via-transparent to-transparent -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-16"
        >
          {/* Left Side: Contact Cards */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-heading font-black text-textPrimary leading-tight">
                Connect With <span className="text-accent">Me</span>.
              </h2>
              <p className="text-textSecondary leading-relaxed">
                Choose your preferred way to reach out. I'm usually active on LinkedIn and check my email daily.
              </p>
            </div>

            <div className="grid gap-4">
              {contactInfo.map((info, i) => (
                <a
                  key={i}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 flex items-center gap-6 hover:border-accent/40 hover:bg-surface/60 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-textTertiary font-bold mb-1">{info.label}</div>
                    <div className="text-base font-bold text-textPrimary">{info.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="space-y-6">
            <div className="p-1 bg-surface/50 border border-border/50 rounded-2xl w-fit backdrop-blur-md">
              <div className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <MessageSquare size={14} />
                Send a Message
              </div>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-8 md:p-10 flex flex-col space-y-6"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="bg-surface/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className="bg-surface/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors w-full"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  required
                  className="w-full bg-surface/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={6}
                  required
                  className="w-full bg-surface/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className={`btn-primary w-full flex items-center justify-center gap-2 transition-all ${status === "success" ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                {status === "idle" && <><Send size={18} /> Send Message</>}
                {status === "submitting" && <>Sending...</>}
                {status === "success" && <>Sent Successfully!</>}
                {status === "error" && <>Error! Try Again</>}
              </button>
              {status === "success" && (
                <p className="text-center text-xs text-green-500 font-bold animate-pulse">
                  Thank you! Your message has been received.
                </p>
              )}
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
