"use client";

import { useTranslations } from "next-intl";

interface CategoryPreviewProps {
  icon?: string;
  name?: string;
  color?: string;
}

export function CategoryPreview({ icon, name, color }: CategoryPreviewProps) {
  const t = useTranslations("admin");
  const bgColor = color || "#6b7280";

  return (
    <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] text-center space-y-3">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gold block">
        {t("preview") || "Preview"}
      </span>
      <div className="flex justify-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
          style={{
            backgroundColor: `${bgColor}20`,
            color: bgColor,
            border: `1px solid ${bgColor}40`,
          }}
        >
          {icon && <span className="text-base leading-none">{icon}</span>}
          {name || t("categoryName") || "category name"}
        </span>
      </div>
      <p className="text-xs text-slate-body/60">
        {t("categoryPreviewDescription") || "This is how the category will appear on cards and lists."}
      </p>
    </div>
  );
}
