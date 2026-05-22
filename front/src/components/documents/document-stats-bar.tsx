"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, FolderOpen, Globe, Link2 } from "lucide-react";

interface StatItem {
  icon: "documents" | "files" | "languages" | "reports";
  value: number;
  label: string;
}

const iconMap: Record<string, React.ElementType> = {
  documents: FileText,
  files: FolderOpen,
  languages: Globe,
  reports: Link2,
};

function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useRef(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      if (current !== count.current) {
        count.current = current;
        setDisplay(current);
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

interface DocumentStatsBarProps {
  totalDocuments: number;
  totalFiles: number;
  languagesCovered: number;
  reportsLinked: number;
  translations: Record<string, string>;
}

export function DocumentStatsBar({
  totalDocuments,
  totalFiles,
  languagesCovered,
  reportsLinked,
  translations,
}: DocumentStatsBarProps) {
  const items: StatItem[] = [
    { icon: "documents", value: totalDocuments, label: translations.totalDocuments },
    { icon: "files", value: totalFiles, label: translations.totalFiles },
    { icon: "languages", value: languagesCovered, label: translations.languagesCovered },
    { icon: "reports", value: reportsLinked, label: translations.reportsLinked },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.04)_0%,_transparent_70%)]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="container relative px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon] || FileText;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-offwhite mb-0.5 tabular-nums">
                  <AnimatedCounter end={item.value} duration={2 + i * 0.2} />
                </div>
                <div className="text-xs text-slate-body/60 uppercase tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
