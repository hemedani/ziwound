"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Scale, Quote, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface QuoteItem {
  text: string;
  attribution?: string;
}

interface QuoteBannerProps {
  quotes: QuoteItem[];
  className?: string;
}

export function QuoteBanner({ quotes, className }: QuoteBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback((index: number, dir: "next" | "prev") => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setDirection("next");
    setCurrent((c) => (c + 1) % quotes.length);
  }, [quotes.length]);

  const prev = useCallback(() => {
    setDirection("prev");
    setCurrent((c) => (c - 1 + quotes.length) % quotes.length);
  }, [quotes.length]);

  useEffect(() => {
    if (quotes.length <= 1 || isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [quotes.length, isPaused, next]);

  if (!quotes.length) return null;

  const slideVariants = {
    enter: (dir: "next" | "prev") => ({
      opacity: 0,
      y: dir === "next" ? 40 : -40,
    }),
    center: { opacity: 1, y: 0 },
    exit: (dir: "next" | "prev") => ({
      opacity: 0,
      y: dir === "next" ? -40 : 40,
    }),
  };

  return (
    <section
      className={cn("relative py-24 md:py-32 overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-crimson/[0.02] via-crimson/[0.04] to-crimson/[0.02]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Faint background icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.015]">
        <Quote className="h-80 w-80 text-offwhite" />
      </div>

      {/* Navigation arrows */}
      {quotes.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute start-6 top-1/2 z-10 -translate-y-1/2 rounded-full glass p-2.5 text-offwhite/60 transition-all hover:bg-white/10 hover:text-offwhite focus-visible:ring-2 focus-visible:ring-crimson"
            aria-label="Previous quote"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </button>
          <button
            onClick={next}
            className="absolute end-6 top-1/2 z-10 -translate-y-1/2 rounded-full glass p-2.5 text-offwhite/60 transition-all hover:bg-white/10 hover:text-offwhite focus-visible:ring-2 focus-visible:ring-crimson"
            aria-label="Next quote"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        </>
      )}

      <div className="mx-auto w-full max-w-5xl relative px-4 md:px-8">
        {/* Accent bar */}
        <div className="mx-auto mb-10 h-1 w-20 rounded-full bg-gradient-to-r from-crimson via-gold to-crimson" />

        <div className="relative min-h-[240px] md:min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center w-full"
            >
              {/* Opening quotation mark */}
              <div className="mb-6 text-6xl md:text-8xl font-serif leading-none text-crimron/25 select-none">
                &ldquo;
              </div>

              <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-offwhite leading-relaxed md:leading-relaxed max-w-4xl mx-auto px-4">
                {quotes[current].text}
              </blockquote>

              <div className="mx-auto mt-6 h-px w-16 bg-gold/50" />

              {quotes[current].attribution && (
                <p className="mt-6 text-sm text-slate-body/60 uppercase tracking-[0.2em]">
                  &mdash; {quotes[current].attribution}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots + pause */}
        {quotes.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2.5" role="tablist" aria-label="Quote navigation">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? "next" : "prev")}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to quote ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === current ? "w-8 bg-crimson" : "w-1.5 bg-white/20 hover:bg-white/40",
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="rounded-full glass p-1.5 text-offwhite/50 transition-all hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-crimson"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
