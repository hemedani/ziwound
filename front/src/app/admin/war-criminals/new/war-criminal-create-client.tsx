"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WarCriminalForm, WarCriminalFormValues } from "../_components/war-criminal-form";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface WarCriminalCreateClientProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export function WarCriminalCreateClient({ onSubmit }: WarCriminalCreateClientProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleFormSubmit = async (data: WarCriminalFormValues) => {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("data", JSON.stringify(data));
      await onSubmit(formData);
    } catch {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
          <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/admin/war-criminals"
                  className="text-slate-body hover:text-offwhite transition-colors"
                >
                  <BackArrow className="h-4 w-4" />
                </Link>
                <div className="h-px w-8 bg-crimson" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                  {t("adminPanel")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
                {t("addWarCriminal") || "Add War Criminal"}
              </h1>
              <p className="text-slate-body mt-1 text-sm">
                {t("addWarCriminalDescription") || "Create a new war criminal record"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
              >
                <Link href="/admin/war-criminals">
                  {t("cancel") || "Cancel"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        className="rounded-2xl glass-light border border-white/[0.06] p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <WarCriminalForm
          onSubmit={handleFormSubmit}
          onCancel={() => router.push("/admin/war-criminals")}
        />
      </motion.div>
    </motion.div>
  );
}
