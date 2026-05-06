"use client";

import { motion } from "framer-motion";
import { Code2, Database, Layout, Smartphone, Cloud, Cpu, Globe, Layers } from "lucide-react";
import type { SkillCategory } from "@/lib/data-store";

interface SkillsProps {
  data?: SkillCategory[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Layout: <Layout className="w-5 h-5 text-accent" />,
  Database: <Database className="w-5 h-5 text-accent" />,
  Smartphone: <Smartphone className="w-5 h-5 text-accent" />,
  Code2: <Code2 className="w-5 h-5 text-accent" />,
  Cloud: <Cloud className="w-5 h-5 text-accent" />,
  Cpu: <Cpu className="w-5 h-5 text-accent" />,
  Globe: <Globe className="w-5 h-5 text-accent" />,
  Layers: <Layers className="w-5 h-5 text-accent" />,
};

export default function Skills({ data }: SkillsProps) {
  const fallbackSkills = [
    {
      title: "Frontend Engineering",
      icon: <Layout className="w-5 h-5 text-accent" />,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
      span: "md:col-span-7"
    },
    {
      title: "Backend",
      icon: <Database className="w-5 h-5 text-accent" />,
      skills: ["Node.js", "Express", "Supabase", "PostgreSQL"],
      span: "md:col-span-5"
    },
    {
      title: "Mobile",
      icon: <Smartphone className="w-5 h-5 text-accent" />,
      skills: ["React Native", "Expo", "Android Studio"],
      span: "md:col-span-5"
    },
    {
      title: "Cloud & DevOps",
      icon: <Code2 className="w-5 h-5 text-accent" />,
      skills: ["Git", "Docker", "AWS", "Vercel", "CI/CD", "Kubernetes"],
      span: "md:col-span-7"
    }
  ];

  const skillCategories = data && data.length > 0 
    ? data.map(cat => ({
        title: cat.title,
        icon: ICON_MAP[cat.icon] || <Code2 className="w-5 h-5 text-accent" />,
        skills: cat.skills,
        span: cat.span
      }))
    : fallbackSkills;

  return (
    <section className="py-24 px-8" id="skills">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-heading mb-12 flex items-center gap-3">
          <Code2 className="w-8 h-8 text-accent" />
          Technical Arsenal
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`${category.span}`}
            >
              <div className="glass-card p-8 border-border/50 hover:border-accent/30 transition-all duration-500 h-full group">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-surface rounded-xl group-hover:bg-accent/10 transition-colors">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-heading tracking-tight">{category.title}</h3>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {category.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="text-xs font-mono px-4 py-2 bg-surface border border-border/50 rounded-lg text-textSecondary hover:text-textPrimary hover:border-accent/50 transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
