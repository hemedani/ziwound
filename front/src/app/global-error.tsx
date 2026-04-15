"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
          <div className="space-y-4 text-center max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <span className="text-2xl font-bold text-destructive">!</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong!</h1>
            <p className="text-muted-foreground">
              A critical error occurred. We apologize for the inconvenience. Our team has been notified.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
            <div className="pt-4">
              <Button onClick={() => reset()}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
