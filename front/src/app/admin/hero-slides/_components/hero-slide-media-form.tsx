"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon } from "lucide-react";

interface HeroSlideMediaFormProps {
  imageId: string;
  onImageChange: (id: string) => void;
}

export function HeroSlideMediaForm({ imageId, onImageChange }: HeroSlideMediaFormProps) {
  const t = useTranslations("admin");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-crimson/10 p-1.5">
          <ImageIcon className="h-4 w-4 text-crimson-light" />
        </div>
        <div>
          <p className="text-sm font-medium text-offwhite">
            {t("slideImage") || "Background Image"}
          </p>
          <p className="text-[11px] text-slate-body/60">
            {t("slideImageDescription") || "Choose or upload a background image for this slide"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
          <TabsTrigger
            value="library"
            className="data-[state=active]:bg-crimson/20 data-[state=active]:text-crimson-light"
          >
            {t("imageLibrary") || "Library"}
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="data-[state=active]:bg-crimson/20 data-[state=active]:text-crimson-light"
          >
            {t("uploadNew") || "Upload"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-3">
          <div className="rounded-lg border border-white/[0.06] p-3 bg-white/[0.02]">
            <ImagePicker
              value={imageId}
              onChange={(id) => onImageChange(id || "")}
            />
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-3">
          <div className="rounded-lg border border-white/[0.06] p-3 bg-white/[0.02]">
            <FileUploadField
              label=""
              maxFiles={1}
              accept="image/*"
              value={imageId ? [imageId] : []}
              onChange={(ids) => onImageChange(ids[0] || "")}
            />
          </div>
        </TabsContent>
      </Tabs>

      {imageId && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
          <p className="text-xs text-emerald-400 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("imageSelected") || "Image selected"} (ID: {imageId.slice(0, 8)}...)
          </p>
        </div>
      )}
    </div>
  );
}
