"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function SceneBackground() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  // State for parallax coordinates
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-700 bg-background">
      
      {/* 1. Base Gradient Layer - Lightly tinted for depth visibility */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        isDark ? "bg-[#0a0a0c]" : "bg-[#f8f8fa]"
      }`} />

      {/* 2. Generative Mesh / Noise Flow Layer 
          Increased opacity and refined base frequency for better visibility 
      */}
      <div className={`absolute inset-0 ${isDark ? "opacity-[0.15]" : "opacity-[0.08]"} pointer-events-none`}>
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.5" 
              numOctaves="4" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* 3. Interactive Lighting Layer - Brightened for Deniability */}
      <motion.div 
        className="absolute inset-0 z-[1]"
        animate={{ 
          x: mousePosition.x * -60, 
          y: mousePosition.y * -60 
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        <div className={`absolute inset-0 ${
          isDark 
            ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_60%)]" 
            : "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_0%,transparent_60%)]"
        }`} />
      </motion.div>

      {/* 4. Structural Grid - Refined and made slightly more visible */}
      <div 
        className={`absolute inset-0 z-[2] ${
          isDark ? "opacity-[0.05]" : "opacity-[0.08]"
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px), 
                            linear-gradient(to bottom, ${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
        }}
      />

      {/* 5. Depth Overlays - Vignettes */}
      <div className={`absolute inset-0 z-[3] ${
        isDark 
          ? "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" 
          : "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_100%)]"
      }`} />
      
    </div>
  );
}
