"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, className, variant = "primary", ...props }, ref) => {
    const baseClasses = cn(
      "relative flex items-center justify-center px-8 py-3.5 rounded-full font-semibold overflow-hidden group",
      "transition-all duration-300",
      className
    );

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        whileHover={{
          scale: 1.02,
          boxShadow: variant === "primary" ? "0 0 20px 2px rgba(96, 165, 250, 0.4)" : "0 0 15px 2px rgba(255, 255, 255, 0.1)",
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          ...(variant === "primary" && {
            background: "linear-gradient(135deg, var(--color-accent) 0%, #3B82F6 100%)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }),
          ...(variant === "secondary" && {
            background: "var(--color-surface)",
            backdropFilter: "saturate(150%) blur(20px)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
          }),
          ...(variant === "ghost" && {
            background: "transparent",
            color: "var(--color-text-secondary)",
          }),
        }}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2.5">{children}</span>
        {variant !== "ghost" && (
          <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white" />
        )}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
