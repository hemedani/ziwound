"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, FileText, MapPin, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ReadonlyMap = dynamic(
  () => import("@/components/map/readonly-map").then((mod) => mod.ReadonlyMap),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-white/5" />,
  },
);

interface FeaturedItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  mediaType?: "image" | "video" | "map" | "none";
  mediaSrc?: string;
  lat?: number;
  lng?: number;
  date: string;
  location?: string;
  category?: string;
  href: string;
}

interface FeaturedReportsProps {
  overline?: string;
  title: string;
  subtitle: string;
  readMore?: string;
  items: FeaturedItem[];
  className?: string;
}

export function FeaturedReports({
  overline = "Featured",
  title,
  subtitle,
  readMore = "Read More",
  items,
  className,
}: FeaturedReportsProps) {
  return (
    <section className={cn("py-20 md:py-28", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-10 bg-crimson" />
            <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
              {overline}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-slate-body leading-relaxed">{subtitle}</p>
        </motion.div>

        {/* Empty state */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center rounded-2xl glass-light border border-white/[0.06] py-16 px-6 text-center"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson/10 border border-crimson/20">
              <FileText className="h-7 w-7 text-crimson-light" />
            </div>
            <p className="text-lg font-medium text-offwhite mb-1">
              No featured reports yet
            </p>
            <p className="text-sm text-slate-body max-w-sm">
              Check back soon for the latest documented reports and stories.
            </p>
          </motion.div>
        )}

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={item.href} className="group block">
                <article className="relative overflow-hidden rounded-2xl glass-light transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_-12px_rgba(153,27,27,0.3)] border border-white/[0.06]">
                  {/* Media */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {item.mediaType === "image" && item.mediaSrc ? (
                      <Image
                        src={item.mediaSrc}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : item.mediaType === "video" && item.mediaSrc ? (
                      <>
                        <video
                          src={item.mediaSrc}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-crimson/90 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                            <Play className="h-5 w-5 ms-0.5" fill="white" />
                          </div>
                        </div>
                      </>
                    ) : item.mediaType === "map" &&
                      item.lat !== undefined &&
                      item.lng !== undefined ? (
                      <div className="h-full w-full">
                        <ReadonlyMap
                          latitude={item.lat}
                          longitude={item.lng}
                          zoom={13}
                          hideControls
                          className="h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                        <FileText className="h-10 w-10 text-slate-body/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {item.category && (
                      <span className="absolute top-4 start-4 rounded-full bg-crimson/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-slate-body">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.location}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-2 text-lg font-semibold text-offwhite transition-colors group-hover:text-gold line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-body line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-crimson transition-colors group-hover:text-gold">
                      <span>{readMore}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
