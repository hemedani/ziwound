"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function WarCriminalsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorState
        title="Failed to load war criminals"
        description="An error occurred while fetching the war criminals database."
        onRetry={reset}
      />
    </div>
  );
}
