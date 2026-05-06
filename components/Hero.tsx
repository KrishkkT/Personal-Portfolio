"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroSection } from "@/lib/data-store";

export default function Hero({ data }: { data: HeroSection | null }) {
  const [firstName, lastName] = data?.name?.split(" ") || ["Krish", "Thakker"];

  return (
    <section className="min-h-screen flex items-center px-8 sm:px-12 relative overflow-hidden" id="home">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10 pt-28 pb-20">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7 flex flex-col items-start"
        >
          <h1 className="text-display-sm md:text-[9.5rem] font-heading leading-[0.85] tracking-tighter flex flex-col mb-10 text-textPrimary">
            <span className="inline-block opacity-95">{firstName}</span>
            {lastName && (
              <span className="inline-block opacity-100 mt-[-0.05em]">
                {lastName}
              </span>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-textSecondary leading-[1.8] max-w-[500px] font-body mb-10 font-light tracking-wide"
          >
            {data?.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/projects" className="min-w-[180px] text-center bg-textPrimary text-background hover:opacity-90 font-bold px-8 py-4 rounded-none transition-all duration-300 shadow-xl uppercase tracking-widest text-[0.7rem]">
              View Portfolio
            </Link>
            <Link href="/contact" className="min-w-[180px] text-center border border-border text-textPrimary hover:bg-surface font-bold px-8 py-4 rounded-none transition-all duration-300 uppercase tracking-widest text-[0.7rem]">
              Connect
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Content - Visual Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex md:col-span-5 relative justify-center md:justify-end mt-12 md:mt-0"
        >
          <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[350px] md:max-w-[400px]">
            {/* Abstract Architectural Tech Frame */}
            <div className="absolute inset-0 border border-textPrimary/10 rounded-2xl rotate-3" />
            <div className="absolute inset-0 border border-textPrimary/5 rounded-2xl -rotate-3" />
            <div className="absolute inset-4 sm:inset-10 bg-gradient-to-br from-textPrimary/5 to-transparent rounded-full blur-2xl sm:blur-3xl" />

            <div className="relative z-10 flex flex-col justify-center h-full p-8 sm:p-12 space-y-6 sm:space-y-8">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.3em] text-textTertiary">{data?.statTitle1 || "Infrastructure"}</p>
                <div className="h-[1px] sm:h-[2px] w-full bg-border/50" />
                <p className="text-lg sm:text-xl font-heading text-textPrimary/80 tracking-tight leading-tight">{data?.statValue1 || "Cloud Native Architecture"}</p>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.3em] text-textTertiary">{data?.statTitle2 || "Stack Selection"}</p>
                <div className="h-[1px] sm:h-[2px] w-full bg-border/50" />
                <p className="text-lg sm:text-xl font-heading text-textPrimary/80 tracking-tight leading-tight">{data?.statValue2 || "Full Stack Excellence"}</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
