"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  image?: string;
  gradient?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  brandLabel?: string;
  scrollIndicator?: string;
  autoPlayInterval?: number;
  className?: string;
}

export function HeroSlider({
  slides,
  brandLabel = "ZiWound",
  scrollIndicator = "Scroll",
  autoPlayInterval = 6000,
  className,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (isTransitioning || index === current) return;
      setDirection(dir);
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [current, isTransitioning]
  );

  const next = useCallback(() => {
    const nextIndex = (current + 1) % slides.length;
    goTo(nextIndex, "next");
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    const prevIndex = (current - 1 + slides.length) % slides.length;
    goTo(prevIndex, "prev");
  }, [current, slides.length, goTo]);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, autoPlayInterval, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // Touch / swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <section
      ref={containerRef}
      className={cn("relative h-screen w-full overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero slides"
    >
      {/* Backgrounds */}
      <AnimatePresence>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, filter: "blur(12px)", scale: 1.12 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)", scale: 1.06 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-10"
        >
          {slide.image ? (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
              className="absolute inset-0"
              style={{ background: slide.gradient || "linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%)" }}
            />
          )}
          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 gradient-overlay" />
          <div className="absolute inset-0 gradient-radial-hero" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              initial={{ opacity: 0, x: 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40, filter: "blur(4px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              {/* Subtle accent line */}
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-crimson" />
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
                  {brandLabel}
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 text-4xl font-bold leading-tight tracking-tight text-offwhite sm:text-5xl md:text-6xl lg:text-7xl text-glow-crimson"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8 text-lg leading-relaxed text-slate-body md:text-xl max-w-2xl"
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-4"
              >
                <Button
                  size="lg"
                  asChild
                  className="bg-crimson hover:bg-crimson-light text-white gap-2 px-8 py-6 text-base animate-pulse-glow"
                >
                  <Link href={slide.ctaLink}>
                    {slide.ctaText}
                    <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                  </Link>
                </Button>

                {slide.secondaryCtaText && slide.secondaryCtaLink && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/20 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white gap-2 px-8 py-6 text-base backdrop-blur-sm"
                  >
                    <Link href={slide.secondaryCtaLink}>
                      {slide.secondaryCtaText}
                    </Link>
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute start-4 top-1/2 z-30 -translate-y-1/2 rounded-full glass p-3 text-offwhite transition-all hover:bg-white/10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-crimson"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
          </button>
          <button
            onClick={next}
            className="absolute end-4 top-1/2 z-30 -translate-y-1/2 rounded-full glass p-3 text-offwhite transition-all hover:bg-white/10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-crimson"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 rtl:rotate-180" />
          </button>
        </>
      )}

      {/* Bottom controls: dots + pause */}
      <div className="absolute bottom-8 start-1/2 z-30 flex -translate-x-1/2 items-center gap-6">
        {/* Dots */}
        <div className="flex items-center gap-3" role="tablist" aria-label="Slide navigation">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "relative h-2 rounded-full transition-all duration-500",
                i === current
                  ? "w-10 bg-crimson"
                  : "w-2 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        {/* Pause / play */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="rounded-full glass p-2 text-offwhite transition-all hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-crimson"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 end-8 z-30 hidden md:flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <span className="text-xs uppercase tracking-widest [writing-mode:vertical-lr]">
          {scrollIndicator}
        </span>
        <div className="h-8 w-px bg-white/30" />
      </div>
    </section>
  );
}
