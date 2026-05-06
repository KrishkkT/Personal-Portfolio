"use client";

import { motion } from "framer-motion";
import type { Certificate } from "@/lib/data-store";
import { Award, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CertificationsProps {
  data: Certificate[];
  isFullPage?: boolean;
}

export default function Certifications({ data, isFullPage = false }: CertificationsProps) {
  const allCerts = data && data.length > 0 ? data : [];
  // Limit to 3 for home page, show all for full page
  const certs = isFullPage ? allCerts : allCerts.slice(0, 3);
  const hasMore = !isFullPage && allCerts.length > 3;

  return (
    <section className={`${isFullPage ? "pt-32 pb-24" : "py-24"} px-8`} id="certifications">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-xl font-heading flex items-center gap-3">
            <Award className="w-8 h-8 text-accent" />
            Certifications
          </h2>
          {hasMore && (
            <Link href="/certificates" className="hidden md:flex items-center gap-2 text-sm font-medium text-accent hover:underline">
              View all certificates <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card overflow-hidden group hover:border-accent/30 transition-all duration-500 flex flex-col h-full"
            >
              {/* Image Header */}
              <div className="aspect-[16/10] relative overflow-hidden bg-surface border-b border-border/30">
                <img 
                  src={cert.image || "/placeholder.svg?text=Certificate"} 
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 p-2 bg-background/60 backdrop-blur-md rounded-full text-accent border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <Award size={20} />
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-accent/10 text-accent border-none rounded-md text-[10px] py-0 uppercase tracking-widest">{cert.category}</Badge>
                  {cert.image && (
                    <a href={cert.providerUrl || cert.image} target="_blank" className="text-textTertiary hover:text-accent transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                
                <h3 className="text-lg font-heading mb-2 leading-tight group-hover:text-accent transition-colors">{cert.title}</h3>
                <p className="text-xs text-textSecondary mb-6 font-medium tracking-wide">{cert.issuer}</p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                  <span className="text-[10px] font-mono text-textTertiary uppercase tracking-widest">{cert.date}</span>
                  {cert.verified && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center md:hidden">
            <Link href="/certificates" className="inline-flex items-center gap-2 text-sm font-medium text-accent">
              View all certificates <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {certs.length === 0 && (
          <div className="col-span-full text-center py-12 text-textSecondary border border-dashed border-border rounded-xl">
            No certifications listed.
          </div>
        )}
      </div>
    </section>
  );
}
