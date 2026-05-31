"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";
import { AsyncSelect } from "@/components/form/async-select";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { updateUserRelations } from "@/app/actions/user/updateUserRelations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { userSchema } from "@/types/declarations";

interface UserRelationsFormProps {
  user: userSchema & { province?: { _id?: string }; city?: { _id?: string }; country?: { _id?: string; name?: string; english_name?: string } };
  countries: Array<{ _id: string; name: string; english_name: string }>;
  provinces: Array<{ _id: string; name: string; english_name: string; country?: { _id?: string } }>;
  cities: Array<{ _id: string; name: string; english_name: string; province?: { _id?: string } }>;
}

export function UserRelationsForm({ user, countries, provinces, cities }: UserRelationsFormProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();

  const [avatarId, setAvatarId] = useState<string>(user.avatar?._id || "");
  const [nationalCardId, setNationalCardId] = useState<string>(user.national_card?._id || "");
  const [countryId, setCountryId] = useState<string | string[] | null>(user.country?._id || null);
  const [provinceId, setProvinceId] = useState<string | string[] | null>(user.province?._id || null);
  const [cityId, setCityId] = useState<string | string[] | null>(user.city?._id || null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredProvinces = useMemo(() => {
    if (!countryId || typeof countryId !== "string") return [];
    const filtered = provinces.filter((p) => p.country?._id === countryId);
    if (user.province?._id && !filtered.some((p) => p._id === user.province!._id)) {
      const current = provinces.find((p) => p._id === user.province!._id);
      if (current) filtered.push(current);
    }
    return filtered;
  }, [provinces, countryId, user.province]);

  const filteredCities = useMemo(() => {
    if (!provinceId || typeof provinceId !== "string") return [];
    const filtered = cities.filter((c) => c.province?._id === provinceId);
    if (user.city?._id && !filtered.some((c) => c._id === user.city!._id)) {
      const current = cities.find((c) => c._id === user.city!._id);
      if (current) filtered.push(current);
    }
    return filtered;
  }, [cities, provinceId, user.city]);

  const handleSave = async () => {
    if (!user._id) return;
    setIsLoading(true);

    try {
      const res = await updateUserRelations(
        {
          _id: user._id,
          ...(avatarId ? { avatar: avatarId } : {}),
          ...(nationalCardId ? { national_card: nationalCardId } : {}),
          ...(countryId && typeof countryId === "string" ? { country: countryId } : {}),
          ...(provinceId && typeof provinceId === "string" ? { province: provinceId } : {}),
          ...(cityId && typeof cityId === "string" ? { city: cityId } : {}),
        },
        {
          _id: 1,
          avatar: { _id: 1, name: 1 },
          national_card: { _id: 1, name: 1 },
          country: { _id: 1 },
          province: { _id: 1 },
          city: { _id: 1 },
        },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("relationsUpdated") || "Relations updated successfully.",
        });
        router.push("/admin/users");
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

  return (
    <div className="rounded-2xl glass-light p-6 border border-white/[0.06] space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-offwhite">{t("relations") || "Relations"}</h2>
        <p className="text-sm text-slate-body mt-1">
          {t("userRelationsDescription") || "Manage user avatar, national card, and location"}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-slate-body">{t("avatar") || "Avatar"}</p>
        {user.avatar?._id && (
          <div className="mb-4">
            <p className="text-sm text-slate-body mb-2">{t("currentPhoto") || "Current Photo"}</p>
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-white/[0.06]">
              <Image
                src={getImageUploadUrl(user.avatar.name, "image")}
                alt="Avatar"
                fill
                unoptimized
                sizes="96px"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <Tabs defaultValue={avatarId ? "library" : "upload"}>
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
            <TabsTrigger value="library">{t("imageLibrary") || "Library"}</TabsTrigger>
            <TabsTrigger value="upload">{t("uploadNew") || "Upload"}</TabsTrigger>
          </TabsList>
          <TabsContent value="library" className="mt-3">
            <ImagePicker value={avatarId} onChange={(id) => setAvatarId(id || "")} />
          </TabsContent>
          <TabsContent value="upload" className="mt-3">
            <FileUploadField
              label=""
              maxFiles={1}
              accept="image/*"
              value={avatarId ? [avatarId] : []}
              onChange={(ids) => setAvatarId(ids[0] || "")}
            />
          </TabsContent>
        </Tabs>
        <div className="flex gap-2 pt-2">
          {avatarId && avatarId !== user.avatar?._id && (
            <p className="text-xs text-amber-400">{t("photoChanged") || "Photo has been changed. Save to apply."}</p>
          )}
          {avatarId && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setAvatarId("")} className="text-red-400 hover:text-red-300 h-auto p-1">
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-slate-body">{t("nationalCard") || "National Card"}</p>
        {user.national_card?._id && (
          <div className="mb-4">
            <p className="text-sm text-slate-body mb-2">{t("currentPhoto") || "Current Photo"}</p>
            <div className="relative w-full max-w-sm aspect-[1.586] rounded-lg overflow-hidden border border-white/[0.06]">
              <Image
                src={getImageUploadUrl(user.national_card.name, "image")}
                alt="National Card"
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <FileUploadField
          label=""
          maxFiles={1}
          accept="image/*,.pdf"
          value={nationalCardId ? [nationalCardId] : []}
          onChange={(ids) => setNationalCardId(ids[0] || "")}
        />
        {nationalCardId && nationalCardId !== user.national_card?._id && (
          <p className="text-xs text-amber-400">{t("photoChanged") || "Photo has been changed. Save to apply."}</p>
        )}
        {nationalCardId && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setNationalCardId("")} className="text-red-400 hover:text-red-300 h-auto p-1">
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-body">{t("country") || "Country"}</p>
          <AsyncSelect
            value={countryId}
            onChange={(val) => {
              setCountryId(val);
              setProvinceId(null);
              setCityId(null);
            }}
            options={countries.map((c) => ({ id: c._id, label: c.name, subLabel: c.english_name }))}
            placeholder={t("selectCountry") || "Select a country"}
            searchPlaceholder="Search countries..."
            emptyText="No country found."
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-body">{t("province") || "Province"}</p>
          <AsyncSelect
            value={provinceId}
            onChange={(val) => {
              setProvinceId(val);
              setCityId(null);
            }}
            options={filteredProvinces.map((p) => ({ id: p._id, label: p.name, subLabel: p.english_name }))}
            placeholder={t("selectProvince") || "Select a province"}
            searchPlaceholder="Search provinces..."
            emptyText="No province found."
            disabled={!countryId}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-body">{t("city") || "City"}</p>
          <AsyncSelect
            value={cityId}
            onChange={(val) => setCityId(val)}
            options={filteredCities.map((c) => ({ id: c._id, label: c.name, subLabel: c.english_name }))}
            placeholder={t("selectCity") || "Select a city"}
            searchPlaceholder="Search cities..."
            emptyText="No city found."
            disabled={!provinceId}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={isLoading} className="bg-crimson hover:bg-crimson-light text-white">
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {t("save") || "Save"}
        </Button>
      </div>
    </div>
  );
}
