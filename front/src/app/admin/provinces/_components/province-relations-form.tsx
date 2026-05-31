"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";
import { AsyncSelect } from "@/components/form/async-select";
import { Loader2, Trash2, ImageIcon, Globe } from "lucide-react";
import Image from "next/image";
import { updateRelations } from "@/app/actions/province/updateRelations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { provinceSchema } from "@/types/declarations";

interface ProvinceRelationsFormProps {
  province: provinceSchema & { country?: { _id?: string; name?: string; english_name?: string } };
  countries: Array<{ _id: string; name: string; english_name: string }>;
}

export function ProvinceRelationsForm({ province, countries }: ProvinceRelationsFormProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [photoId, setPhotoId] = useState<string>(province.photo?._id || "");
  const [countryId, setCountryId] = useState<string | string[] | null>(province.country?._id || null);
  const [isLoading, setIsLoading] = useState(false);

  const hasExistingPhoto = !!province.photo?._id;

  const handleSave = async () => {
    if (!province._id) return;
    setIsLoading(true);

    try {
      const res = await updateRelations(
        {
          _id: province._id,
          ...(countryId && typeof countryId === "string" ? { country: countryId } : {}),
          ...(photoId ? { photo: photoId } : {}),
        },
        { _id: 1, country: { _id: 1 }, photo: { _id: 1, name: 1, mimeType: 1, type: 1, alt_text: 1 } },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("relationsUpdated") || "Relations updated successfully.",
        });
        router.push("/admin/provinces");
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

  const handleRemovePhoto = () => {
    setPhotoId("");
  };

  return (
    <div className="rounded-2xl glass-strong p-6 border border-white/[0.06] space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-offwhite flex items-center gap-2">
          <Globe className="h-5 w-5 text-crimson" />
          {t("relations") || "Relations"}
        </h2>
        <p className="text-sm text-slate-body mt-1">
          {t("provinceRelationsDescription") || "Manage province country and photo"}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-offwhite">{t("country") || "Country"}</label>
        <AsyncSelect
          value={countryId}
          onChange={(val) => setCountryId(val)}
          isClearable={false}
          options={countries.map((c) => ({
            id: c._id,
            label: c.name,
            subLabel: c.english_name,
          }))}
          placeholder={t("selectCountry") || "Select a country"}
          searchPlaceholder="Search countries..."
          emptyText="No country found."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-offwhite flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-crimson" />
          {t("photo") || "Photo"}
        </label>

        {hasExistingPhoto && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-slate-body">{t("currentPhoto") || "Current Photo"}</p>
            <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
              <Image
                src={getImageUploadUrl(province.photo!.name, "image")}
                alt={province.photo!.alt_text || province.name || "Province photo"}
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
      </div>

      {photoId !== province.photo?._id && (
        <p className="text-xs text-amber-400">
          {t("photoChanged") || "Photo has been changed. Save to apply."}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-crimson hover:bg-crimson-light text-white"
        >
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {t("save") || "Save"}
        </Button>
        {photoId && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemovePhoto}
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
