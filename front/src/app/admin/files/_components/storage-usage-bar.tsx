"use client";

import { useTranslations } from "next-intl";

interface StorageUsageBarProps {
  totalBytes: number;
  breakdown?: { type: string; bytes: number }[];
}

const typeColors: Record<string, string> = {
  image: "bg-blue-500",
  video: "bg-purple-500",
  docs: "bg-amber-500",
};

const typeKeys: Record<string, string> = {
  image: "image",
  video: "video",
  docs: "documents",
};

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function StorageUsageBar({ totalBytes, breakdown }: StorageUsageBarProps) {
  const t = useTranslations("admin");

  if (totalBytes === 0) return null;

  return (
    <div className="rounded-xl glass-strong p-4 border border-white/[0.06] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.1em] text-gold">
          {t("storageUsage") || "Storage Usage"}
        </span>
        <span className="text-xs text-slate-body">{formatSize(totalBytes)}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden flex">
        {(breakdown || []).map((item) => {
          const pct = totalBytes > 0 ? (item.bytes / totalBytes) * 100 : 0;
          if (pct < 0.5) return null;
          return (
            <div
              key={item.type}
              className={`${typeColors[item.type] || "bg-white/10"} transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${t(typeKeys[item.type] || item.type) || typeKeys[item.type] || item.type}: ${formatSize(item.bytes)}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      {(breakdown || []).length > 0 && (
        <div className="flex flex-wrap gap-3">
          {(breakdown || []).map((item) => {
            const pct = totalBytes > 0 ? (item.bytes / totalBytes) * 100 : 0;
            return (
              <div key={item.type} className="flex items-center gap-1.5 text-xs text-slate-body">
                <span className={`h-2 w-2 rounded-full ${typeColors[item.type] || "bg-white/10"}`} />
                <span>{t(typeKeys[item.type] || item.type) || typeKeys[item.type] || item.type}</span>
                <span className="text-slate-body/50">{pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
