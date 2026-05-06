"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Experience } from "@/lib/data-store";
import { GraduationCap, Briefcase, ArrowRight, Activity, Diamond } from "lucide-react";
import Link from "next/link";

interface EducationProps {
  data: Experience[];
  isFullPage?: boolean;
}

export default function Education({ data, isFullPage = false }: EducationProps) {
  const [activeTab, setActiveTab] = useState<"Professional" | "Education">("Professional");
  const allItems = data && data.length > 0 ? data : [];
  
  const professional = allItems.filter(item => item.type === "Professional");
  const academic = allItems.filter(item => item.type === "Education");

  const displayProf = isFullPage ? professional : professional.slice(0, 5);
  const displayAcad = isFullPage ? academic : academic.slice(0, 5);

  const hasMoreProf = !isFullPage && professional.length > 5;
  const hasMoreAcad = !isFullPage && academic.length > 5;

  const currentItems = activeTab === "Professional" ? displayProf : displayAcad;
  const hasMoreCurrent = activeTab === "Professional" ? hasMoreProf : hasMoreAcad;
  const linkCurrent = activeTab === "Professional" ? "/experience?type=professional" : "/experience?type=academic";

  return (
    <section className={`${isFullPage ? "pt-32 pb-24" : "py-24"} px-8`} id="experience">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <h2 className="text-xl font-heading flex items-center gap-4">
            <Activity className="w-8 h-8 text-accent" />
            Journey & Expertise
          </h2>

          {/* Tab Controls */}
          <div className="flex p-1 bg-surface/50 border border-border/50 rounded-xl w-fit backdrop-blur-md">
            <button
              onClick={() => setActiveTab("Professional")}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "Professional" ? "text-background" : "text-textSecondary hover:text-textPrimary"}`}
            >
              {activeTab === "Professional" && (
                <motion.div
                  layoutId="activeTabExp"
                  className="absolute inset-0 bg-accent rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Briefcase className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Professional</span>
            </button>
            
            <button
              onClick={() => setActiveTab("Education")}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "Education" ? "text-background" : "text-textSecondary hover:text-textPrimary"}`}
            >
              {activeTab === "Education" && (
                <motion.div
                  layoutId="activeTabExp"
                  className="absolute inset-0 bg-accent rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <GraduationCap className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Academic</span>
            </button>
          </div>
        </div>

        {/* Editorial Sticky Layout */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-12 md:gap-24"
            >
              {currentItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="flex flex-col md:flex-row gap-8 md:gap-16 relative"
                >
                  {/* Left Side: Editorial Typography & Sticky Behavior */}
                  <div className="md:w-1/3 shrink-0">
                    <div className="md:sticky top-32 flex flex-col pt-2">
                      <h3 className="text-[clamp(3rem,10vw,5rem)] md:text-[clamp(4rem,8vw,7rem)] font-black text-transparent bg-clip-text bg-gradient-to-b from-textPrimary to-surface font-heading tracking-tighter leading-none mb-4">
                        {item.year.split("-")[0].trim()}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                          {activeTab === "Professional" ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                        </div>
                        <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
                          {item.year}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-textSecondary uppercase tracking-[0.2em] opacity-60">
                        {item.organization}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Elegant Content Card */}
                  <div className="md:w-2/3">
                    <div className="glass-card p-8 md:p-12 hover:border-accent/40 transition-colors duration-500 bg-surface/30">
                      <h4 className="text-[clamp(1.25rem,4vw,1.75rem)] md:text-[clamp(1.5rem,3vw,2rem)] font-heading text-textPrimary leading-tight mb-8">
                        {item.title}
                      </h4>
                      
                      {item.achievements && item.achievements.length > 0 && (
                        <ul className="space-y-4 mb-10">
                          {item.achievements.map((ach, i) => (
                            <li key={i} className="flex items-start gap-4 text-base text-textSecondary/90 leading-relaxed group">
                              <span className="mt-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-accent/20 ring-1 ring-accent/30 group-hover:bg-accent/40 transition-colors shrink-0">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                              </span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="flex flex-wrap gap-2 pt-8 border-t border-border/40">
                        {item.skills?.map(skill => (
                          <span key={skill} className="text-xs font-mono px-4 py-2 bg-background border border-border/60 rounded-lg text-textTertiary uppercase tracking-widest hover:text-accent hover:border-accent/40 transition-colors shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {currentItems.length === 0 && (
                <div className="text-textSecondary py-20 border border-dashed border-border rounded-2xl text-center">
                  No data available for this section.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {hasMoreCurrent && (
          <div className="mt-20 text-center">
            <Link href={linkCurrent} className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-accent/10 text-sm font-bold uppercase tracking-widest text-accent hover:bg-accent hover:text-background transition-all">
              Explore All {activeTab} <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
