"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface GradientInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PRESET_GRADIENTS = [
  {
    name: "Crimson Glow",
    value: "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
  },
  {
    name: "Midnight",
    value: "linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 50%, #16213e 100%)",
  },
  {
    name: "Blood Moon",
    value: "radial-gradient(ellipse at top, rgba(185,28,28,0.3) 0%, transparent 60%), linear-gradient(to bottom, #1a0a0a, #0a0a0a)",
  },
  {
    name: "Ember",
    value: "linear-gradient(to bottom right, #1a0505, #2d1010, #0a0a0a)",
  },
  {
    name: "Obsidian",
    value: "linear-gradient(to bottom, #171717 0%, #0a0a0a 100%)",
  },
  {
    name: "Steel",
    value: "linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 50%, #1a1a2a 100%)",
  },
  {
    name: "Gold Dust",
    value: "radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.15) 0%, transparent 50%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
  },
  {
    name: "Abyss",
    value: "radial-gradient(ellipse at center, #111111 0%, #0a0a0a 70%, #050505 100%)",
  },
];

export function GradientInput({ value, onChange, placeholder }: GradientInputProps) {
  const t = useTranslations("admin");
  const [previewStyle, setPreviewStyle] = useState<string>(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setPreviewStyle(value);
    setIsValid(true);
  }, [value]);

  const handlePresetSelect = (presetValue: string) => {
    onChange(presetValue);
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "h-24 rounded-lg border transition-all",
          isValid ? "border-white/10" : "border-red-500/50"
        )}
        style={{ background: previewStyle || "#0a0a0a" }}
      />

      <Textarea
        placeholder={placeholder || t("enterSlideGradient") || "Enter CSS gradient"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson font-mono text-sm"
        rows={3}
      />

      <div className="space-y-2">
        <p className="text-xs text-slate-body">{t("presets") || "Presets"}</p>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_GRADIENTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetSelect(preset.value)}
              className={cn(
                "h-10 rounded-md border-2 transition-all hover:scale-105",
                value === preset.value
                  ? "border-crimson ring-2 ring-crimson/30"
                  : "border-white/10 hover:border-white/30"
              )}
              style={{ background: preset.value }}
              title={preset.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
