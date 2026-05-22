"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Eye, PlusCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface SuccessScreenProps {
  reportId?: string;
  locale: string;
}

function ConfettiParticles() {
  const COLORS = ["#991b1b80", "#d4af3780", "#f1f5f980", "#b91c1c80", "#fbbf2480"];
  const SIZES = [4, 5, 6, 7, 8];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-fall"
          style={{
            left: `${((i * 37 + 13) % 100)}%`,
            top: -10 - (i * 4),
            width: SIZES[i % SIZES.length],
            height: SIZES[i % SIZES.length],
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}

export function SuccessScreen({ reportId, locale }: SuccessScreenProps) {
  const t = useTranslations("report");
  const isRtl = locale === "fa" || locale === "ar";

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden">
      <ConfettiParticles />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md"
        >
          <div className="rounded-2xl glass-strong p-10 text-center border border-white/[0.06]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.15,
              }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl font-bold text-offwhite mb-2"
            >
              {t("successTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-slate-body mb-8"
            >
              {t("successDescription")}
            </motion.p>

            {reportId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mb-8 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3"
              >
                <span className="text-xs text-slate-body/50 uppercase tracking-widest">
                  {t("reportId")}
                </span>
                <p className="mt-0.5 font-mono text-sm text-offwhite">{reportId}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className={cn(
                "flex flex-col gap-3 sm:flex-row sm:justify-center",
                isRtl && "sm:flex-row-reverse",
              )}
            >
              <Button
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
              >
                <Link href="/reports/my">
                  <Eye className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                  {t("myReports")}
                </Link>
              </Button>
              <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
                <Link href="/reports/new">
                  <PlusCircle className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                  {t("submitAnother")}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="mt-6"
            >
              <Button variant="link" asChild className="text-slate-body/50 hover:text-offwhite text-xs">
                <Link href="/">
                  <ArrowLeft className={cn("h-3 w-3", isRtl ? "ml-1.5" : "mr-1.5")} />
                  {t("backToHome")}
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
