"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";
import { Loader2, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { updateRelations } from "@/app/actions/country/updateRelations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { countrySchema } from "@/types/declarations";

interface CountryRelationsFormProps {
  country: countrySchema;
}

export function CountryRelationsForm({ country }: CountryRelationsFormProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [photoId, setPhotoId] = useState<string>(country.photo?._id || "");
  const [isLoading, setIsLoading] = useState(false);

  const hasExistingPhoto = !!country.photo?._id;

  const handleSave = async () => {
    if (!country._id) return;
    setIsLoading(true);

    try {
      const res = await updateRelations(
        { _id: country._id, photo: photoId || undefined },
        { _id: 1, photo: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 } },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("relationsUpdated") || "Relations updated successfully.",
        });
        router.refresh();
        router.push("/admin/countries");
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description: res?.error || res?.body?.message || t("failedToUpdateRelations") || "Failed to update relations.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setPhotoId("");
  };

  return (
    <div className="rounded-2xl glass-strong p-6 border border-white/[0.06] space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-offwhite flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-crimson" />
          {t("photo") || "Photo"}
        </h2>
        <p className="text-sm text-slate-body mt-1">
          {t("countryPhotoDescription") || "Manage the country photo"}
        </p>
      </div>

      {hasExistingPhoto && (
        <div className="space-y-2">
          <p className="text-xs text-slate-body">{t("currentPhoto") || "Current Photo"}</p>
          <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
            <Image
              src={getImageUploadUrl(country.photo!.name, "image")}
              alt={country.photo!.alt_text || country.name || "Country photo"}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <Tabs defaultValue={photoId ? "library" : "upload"}>
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
          <TabsTrigger value="library" className="text-xs data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
            {t("imageLibrary") || "Library"}
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
            {t("uploadNew") || "Upload"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="library" className="mt-3">
          <ImagePicker
            value={photoId}
            onChange={(id) => setPhotoId(id || "")}
          />
        </TabsContent>
        <TabsContent value="upload" className="mt-3">
          <FileUploadField
            label=""
            maxFiles={1}
            accept="image/*"
            value={photoId ? [photoId] : []}
            onChange={(ids) => setPhotoId(ids[0] || "")}
          />
        </TabsContent>
      </Tabs>

      {photoId && photoId !== country.photo?._id && (
        <p className="text-xs text-amber-400">
          {t("photoChanged") || "Photo has been changed. Save to apply."}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={handleSave}
          disabled={isLoading || !photoId}
          className="bg-crimson hover:bg-crimson-light text-white"
        >
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {t("save") || "Save"}
        </Button>
        {photoId && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            disabled={isLoading}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="me-2 h-4 w-4" />
            {t("removePhoto") || "Remove Photo"}
          </Button>
        )}
      </div>
    </div>
  );
}
