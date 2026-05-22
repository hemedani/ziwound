"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, Globe, Users, Shield, Gavel, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  FileText, Globe, Users, Shield, Gavel,
};

interface CounterItem {
  icon: string;
  end: number;
  label: string;
  suffix?: string;
}

function AnimatedCounter({
  end,
  suffix = "",
  duration = 2,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

interface ImpactCountersProps {
  overline?: string;
  title: string;
  subtitle: string;
  items: CounterItem[];
  className?: string;
}

export function ImpactCounters({
  overline,
  title,
  subtitle,
  items,
  className,
}: ImpactCountersProps) {
  return (
    <section className={cn("relative py-20 md:py-28 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.06)_0%,_transparent_70%)]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="mx-auto w-full max-w-7xl relative px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          {overline && (
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-crimson" />
              <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
                {overline}
              </span>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-4 leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-lg text-slate-body leading-relaxed">{subtitle}</p>}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon] || FileText;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl glass-light border border-white/[0.06]">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-1 tabular-nums">
                  <AnimatedCounter end={item.end} suffix={item.suffix ?? ""} />
                </div>
                <div className="text-sm text-slate-body uppercase tracking-wider">{item.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
