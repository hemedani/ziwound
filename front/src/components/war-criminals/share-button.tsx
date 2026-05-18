"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export function ShareButton({ profileUrl, label }: { profileUrl: string; label: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10"
      onClick={() => navigator.clipboard.writeText(profileUrl)}
    >
      <Share2 className="me-2 h-4 w-4" />
      {label}
    </Button>
  );
}
