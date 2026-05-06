"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Globe, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
}

interface ImpactStatsProps {
  reports?: string;
  countries?: string;
  documents?: string;
  locations?: string;
  reportsLabel?: string;
  countriesLabel?: string;
  documentsLabel?: string;
  locationsLabel?: string;
  className?: string;
}

export function ImpactStats({
  reports = "12,400+",
  countries = "47",
  documents = "85,200+",
  locations = "1,120",
  reportsLabel = "Reports Documented",
  countriesLabel = "Countries",
  documentsLabel = "Documents Archived",
  locationsLabel = "Locations Mapped",
  className,
}: ImpactStatsProps) {
  const stats: StatItem[] = [
    { icon: FileText, value: reports, label: reportsLabel },
    { icon: Globe, value: countries, label: countriesLabel },
    { icon: MapPin, value: locations, label: locationsLabel },
    { icon: Users, value: documents, label: documentsLabel },
  ];

  return (
    <section className={cn("relative py-16 md:py-20 overflow-hidden", className)}>
      {/* Subtle top border glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />

      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl glass-light">
                <stat.icon className="h-6 w-6 text-gold" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-offwhite mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-body uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subtle bottom border glow */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
