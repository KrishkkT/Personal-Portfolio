"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data-store";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectsProps {
  data: Project[];
  isFullPage?: boolean;
}

export default function Projects({ data, isFullPage = false }: ProjectsProps) {
  const allProjects = data && data.length > 0 ? data : [];
  // Slice to 6 for home page, show all for full page
  const projects = isFullPage ? allProjects : allProjects.slice(0, 6);
  const hasMore = !isFullPage && allProjects.length > 6;

  return (
    <section className={`${isFullPage ? "pt-32 pb-24" : "py-24"} px-8`} id="projects">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-xl font-heading">{isFullPage ? "All Projects" : "Selected Work"}</h2>
          {hasMore && (
            <Link href="/projects" className="hidden md:flex items-center gap-2 text-sm font-medium text-accent hover:underline">
              View all projects <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px] md:auto-rows-[350px]">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-2xl block bg-surface border border-border ${
                i === 0 && !isFullPage ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className="absolute inset-0 bg-surface -z-10" />
              <Image
                src={project.image || "/placeholder.svg?text=Project"}
                alt={`${project.title} - ${project.description.slice(0, 50)}...`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              
              <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/70" />
              
              <motion.div 
                className="absolute inset-x-0 bottom-0 p-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/90 to-transparent"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base md:text-lg font-heading text-white">{project.title}</h3>
                  <div className="flex gap-3 text-white/70">
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" className="hover:text-white transition-colors"><Github size={18} /></a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" className="hover:text-white transition-colors"><ExternalLink size={18} /></a>}
                  </div>
                </div>
                <p className="text-xs text-white/70 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map(tag => (
                    <span key={tag} className="text-[9px] font-mono px-2 py-1 bg-white/10 rounded-md text-white/90 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center md:hidden">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-accent">
              View all projects <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-textSecondary border border-dashed border-border rounded-xl">
            No projects found.
          </div>
        )}
      </div>
    </section>
  );
}
