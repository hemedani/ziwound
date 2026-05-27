"use client";

import { FileIcon, FileImageIcon, FileVideoIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTypeIconProps {
  mimeType?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

const typeConfig: Record<
  string,
  { icon: React.ElementType; bg: string; color: string }
> = {
  image: {
    icon: FileImageIcon,
    bg: "bg-blue-500/10",
    color: "text-blue-400",
  },
  video: {
    icon: FileVideoIcon,
    bg: "bg-purple-500/10",
    color: "text-purple-400",
  },
  pdf: {
    icon: FileText,
    bg: "bg-red-500/10",
    color: "text-red-400",
  },
  document: {
    icon: FileText,
    bg: "bg-amber-500/10",
    color: "text-amber-400",
  },
  archive: {
    icon: FileIcon,
    bg: "bg-green-500/10",
    color: "text-green-400",
  },
  code: {
    icon: FileIcon,
    bg: "bg-cyan-500/10",
    color: "text-cyan-400",
  },
  default: {
    icon: FileIcon,
    bg: "bg-white/5",
    color: "text-slate-body",
  },
};

function getFileCategory(mimeType?: string): string {
  if (!mimeType) return "default";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.includes("pdf")) return "pdf";
  if (
    mimeType.includes("document") ||
    mimeType.includes("sheet") ||
    mimeType.includes("presentation")
  )
    return "document";
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar") ||
    mimeType.includes("gzip")
  )
    return "archive";
  if (mimeType.includes("json") || mimeType.includes("xml") || mimeType.includes("javascript"))
    return "code";
  return "default";
}

export function FileTypeIcon({ mimeType, className, size = "md" }: FileTypeIconProps) {
  const category = getFileCategory(mimeType);
  const config = typeConfig[category] || typeConfig.default;
  const Icon = config.icon;
  const sizeClass = sizeMap[size];

  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center shrink-0",
        config.bg,
        size === "sm" ? "p-1" : size === "md" ? "p-2" : "p-3",
        className,
      )}
    >
      <Icon className={cn(sizeClass, config.color)} />
    </div>
  );
}
