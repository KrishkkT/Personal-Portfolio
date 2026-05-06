"use client";

import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { CredlyIcon } from "./CredlyIcon";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-6 border-t border-border bg-background mt-24">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,#1A1A2E_0%,transparent_70%)] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="font-heading font-bold text-2xl mb-2">Krish Thakker<span className="text-accent">.</span></h2>
          <p className="text-textSecondary text-sm font-body">Building elegant interfaces that feel alive.</p>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://github.com/krishkkt" className="p-3 glass-card hover:text-accent transition-colors"><Github size={20} /></a>
          <a href="https://linkedin.com/in/krishthakker08" className="p-3 glass-card hover:text-accent transition-colors"><Linkedin size={20} /></a>
          <a href="https://www.credly.com/users/kjt08" className="p-3 glass-card hover:text-accent transition-colors"><CredlyIcon width={20} height={20} /></a>
          <a href="mailto:contact@krishthakker.in" className="p-3 glass-card hover:text-accent transition-colors"><Mail size={20} /></a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-textTertiary">
        <p>&copy; {currentYear} Krish Thakker. All rights reserved.</p>
        <p>Designed with intentionality.</p>
      </div>
    </footer>
  );
}
