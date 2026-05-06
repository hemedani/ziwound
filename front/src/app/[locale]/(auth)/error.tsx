"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial-hero opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-crimson/10 border border-crimson/20">
          <AlertTriangle className="h-8 w-8 text-crimson-light" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-offwhite">
            {t("error") || "Authentication Error"}
          </h1>
          <p className="text-slate-body text-sm leading-relaxed">
            {t("unexpectedError") || "An unexpected error occurred. Please try again."}
          </p>
        </div>

        {/* Error Details */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-left overflow-auto max-h-32">
          <p className="font-mono text-xs text-slate-body/80 break-words">
            {error.message || "Unknown error occurred."}
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-slate-body/60 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            asChild
            className="border-white/10 bg-white/5 text-offwhite hover:bg-white/[0.08] hover:text-offwhite"
          >
            <Link href="/">
              <Home className="h-4 w-4 me-2" />
              {t("back") || "Home"}
            </Link>
          </Button>
          <Button
            onClick={() => reset()}
            className="bg-crimson hover:bg-crimson-light text-white"
          >
            <RotateCcw className="h-4 w-4 me-2" />
            {t("tryAgain") || "Try again"}
          </Button>
        </div>
      </div>
    </div>
  );
}
