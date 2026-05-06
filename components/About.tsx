"use client";

import { motion } from "framer-motion";
import type { AboutSection } from "@/lib/data-store";
import { Target, Rocket, Award } from "lucide-react";
import Image from "next/image";

export default function About({ data }: { data: AboutSection | null }) {
  const stats = [
    { icon: <Rocket size={20} />, label: "Passion", value: "Innovation" },
    { icon: <Target size={20} />, label: "Focus", value: "Scalability" },
    { icon: <Award size={20} />, label: "Commitment", value: "Quality" },
  ];

  return (
    <section className="pt-36 pb-24 px-8 relative overflow-hidden" id="about">
      {/* Decorative Background Element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid lg:grid-cols-12 gap-16 items-center"
        >
          {/* Image Side */}
          <div className="lg:col-span-5 relative group">
            <div className="relative z-10 rounded-3xl overflow-hidden aspect-[4/5] bg-surface border border-border p-3 shadow-2xl transition-transform duration-500 group-hover:-rotate-2">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface">
                <Image
                  src={data?.profileImage || "/profile.jpg"}
                  alt={data?.title || "Krish Thakker - Full Stack Cloud Developer"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            {/* Decorative frames */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-4 border-r-4 border-accent/20 rounded-tr-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-4 border-l-4 border-accent/20 rounded-bl-3xl -z-10" />
          </div>

          {/* Text Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-heading font-black text-textPrimary leading-tight">
                {data?.title || "The Story Behind The Code"}
              </h2>
            </div>

            <p className="text-lg text-textSecondary leading-relaxed font-body whitespace-pre-line max-w-2xl">
              {data?.description || "I design and build digital experiences that feel intentional. Currently focused on React, WebGL, and animation libraries that make interfaces feel alive without overwhelming users."}
            </p>

            {/* Quick Stats Grid
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card p-6 flex flex-col items-center text-center gap-3 hover:border-accent/40 transition-colors group">
                  <div className="text-accent group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-textTertiary font-bold">{stat.label}</div>
                    <div className="text-sm font-bold text-textPrimary">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
