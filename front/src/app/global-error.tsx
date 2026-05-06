"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#0a0a0a]">
        <div className="flex h-screen flex-col items-center justify-center p-4">
          <div className="space-y-6 text-center max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-crimson/10 border border-crimson/20">
              <Shield className="h-8 w-8 text-crimson-light" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-offwhite">
                Something went wrong
              </h1>
              <p className="text-slate-body mt-3">
                A critical error occurred. We apologize for the inconvenience. Our team has been notified.
              </p>
            </div>
            {error.digest && (
              <p className="text-xs text-slate-body/60 mt-2 font-mono bg-white/5 px-3 py-1.5 rounded-lg inline-block">
                Error ID: {error.digest}
              </p>
            )}
            <div className="pt-2">
              <Button onClick={() => reset()} className="bg-crimson hover:bg-crimson-light text-white">
                Try again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
