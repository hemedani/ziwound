"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadField } from "@/components/form/file-upload-field";
import { ImagePicker } from "@/components/form/image-picker";
import { TagSelector } from "@/components/form/tag-selector";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { DatePickerField } from "@/components/form/date-picker-field";
import { useToast } from "@/components/ui/use-toast";
import { update } from "@/app/actions/warCriminal/update";
import { updateRelations } from "@/app/actions/warCriminal/updateRelations";
import { gets as getTags } from "@/app/actions/tag/gets";
import { Hash, ImageIcon, ArrowLeft, ArrowRight, Save, Loader2, BookOpen, Link2 } from "lucide-react";
import Link from "next/link";

const LANGUAGES = [
  { code: "fa", name: "فارسی" },
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "pt", name: "Português" },
  { code: "es", name: "Español" },
  { code: "nl", name: "Nederlands" },
  { code: "tr", name: "Türkçe" },
  { code: "ru", name: "Русский" },
];

interface WarCriminalData {
  _id: string;
  fullName: string;
  aliases?: string[];
  dateOfBirth?: Date | string;
  nationality?: string[];
  affiliation?: string;
  rankOrPosition?: string;
  knownFor?: Record<string, string>;
  biography?: Record<string, string>;
  description?: Record<string, string>;
  status: string;
  convictionDetails?: Record<string, string>;
  isEntity: boolean;
  photo?: { _id: string; name?: string };
  tags?: Array<{ _id: string; name: string }>;
}

interface WarCriminalEditClientProps {
  wc: WarCriminalData;
}

function TabBasicInfo({ wc }: { wc: WarCriminalData }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState(wc.fullName || "");
  const [aliases, setAliases] = useState(wc.aliases?.join(", ") || "");
  const [nationality, setNationality] = useState(wc.nationality?.join(", ") || "");
  const [rankOrPosition, setRankOrPosition] = useState(wc.rankOrPosition || "");
  const [affiliation, setAffiliation] = useState<string>(wc.affiliation || "none");
  const [status, setStatus] = useState(wc.status || "Unknown");
  const [isEntity, setIsEntity] = useState(wc.isEntity || false);
  const [dateOfBirth, setDateOfBirth] = useState(
    wc.dateOfBirth ? new Date(wc.dateOfBirth).toISOString().split("T")[0] : "",
  );

  async function handleSave() {
    if (!fullName.trim() || fullName.trim().length < 2) {
      toast({ variant: "destructive", title: t("error") || "Error", description: t("fullNameRequired") || "Full name must be at least 2 characters" });
      return;
    }

    setIsLoading(true);
    try {
      const aliasesArr = aliases ? aliases.split(",").map((a) => a.trim()).filter(Boolean) : undefined;
      const nationalityArr = nationality ? nationality.split(",").map((n) => n.trim()).filter(Boolean) : undefined;
      const dob = dateOfBirth ? new Date(dateOfBirth) : undefined;

      // Preserve existing localized fields when updating
      const knownFor = wc.knownFor || undefined;
      const biography = wc.biography || undefined;
      const description = wc.description || undefined;
      const convictionDetails = wc.convictionDetails || undefined;

      const res = await update(
        {
          _id: wc._id,
          fullName: fullName.trim(),
          ...(aliasesArr && aliasesArr.length > 0 ? { aliases: aliasesArr } : {}),
          ...(dob ? { dateOfBirth: dob } : {}),
          ...(nationalityArr && nationalityArr.length > 0 ? { nationality: nationalityArr } : {}),
          ...(affiliation !== "none" ? { affiliation: affiliation as "Military" | "Paramilitary" | "Government" | "Rebel Group" | "Private Military Company" | "Political" | "Other" } : {}),
          ...(rankOrPosition ? { rankOrPosition } : {}),
          ...(knownFor ? { knownFor } : {}),
          ...(biography ? { biography } : {}),
          ...(description ? { description } : {}),
          status: status as "Accused" | "Indicted" | "Convicted" | "At Large" | "Deceased" | "Unknown" | "Sanctioned",
          ...(convictionDetails ? { convictionDetails } : {}),
          isEntity,
        },
        { _id: 1, fullName: 1 },
      );

      if (!res.success) {
        throw new Error(res.error || res.body?.message || "Failed to update");
      }

      toast({
        title: t("success") || "Success",
        description: t("warCriminalUpdated") || "War criminal updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Core Fields */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-5">
        <div>
          <label className="block text-sm font-semibold text-offwhite mb-1.5">
            {t("fullName") || "Full Name"} <span className="text-crimson-light">*</span>
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("enterFullName") || "Enter full name"}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-offwhite mb-1.5">{t("aliases") || "Aliases"}</label>
            <Input
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              placeholder={t("aliasesPlaceholder") || "Comma-separated"}
              className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>

          <div>
            <label className="block text-sm text-offwhite mb-1.5">{t("dateOfBirth") || "Date of Birth"}</label>
            <DatePickerField
              value={dateOfBirth}
              onChange={setDateOfBirth}
              locale={locale}
              placeholder={t("dateOfBirth") || "Date of Birth"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-offwhite mb-1.5">{t("nationality") || "Nationality"}</label>
            <Input
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder={t("nationalityPlaceholder") || "Comma-separated"}
              className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>

          <div>
            <label className="block text-sm text-offwhite mb-1.5">{t("rankOrPosition") || "Rank/Position"}</label>
            <Input
              value={rankOrPosition}
              onChange={(e) => setRankOrPosition(e.target.value)}
              placeholder={t("rankOrPositionPlaceholder") || "Enter rank or position"}
              className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>
        </div>
      </div>

      {/* Status & Affiliation */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {t("classification") || "Classification"}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-offwhite mb-1.5">{t("affiliation") || "Affiliation"}</label>
            <Select value={affiliation} onValueChange={setAffiliation}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("selectAffiliation") || "Select affiliation"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="none">{t("none") || "None"}</SelectItem>
                <SelectItem value="Military">{t("Military") || "Military"}</SelectItem>
                <SelectItem value="Paramilitary">{t("Paramilitary") || "Paramilitary"}</SelectItem>
                <SelectItem value="Government">{t("Government") || "Government"}</SelectItem>
                <SelectItem value="Rebel Group">{t("rebelGroup") || "Rebel Group"}</SelectItem>
                <SelectItem value="Private Military Company">{t("privateMilitaryCompany") || "Private Military Company"}</SelectItem>
                <SelectItem value="Political">{t("Political") || "Political"}</SelectItem>
                <SelectItem value="Other">{t("Other") || "Other"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-offwhite mb-1.5">{t("status") || "Status"}</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("selectStatus") || "Select status"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="Accused">{t("Accused") || "Accused"}</SelectItem>
                <SelectItem value="Indicted">{t("Indicted") || "Indicted"}</SelectItem>
                <SelectItem value="Convicted">{t("Convicted") || "Convicted"}</SelectItem>
                <SelectItem value="At Large">{t("atLarge") || "At Large"}</SelectItem>
                <SelectItem value="Deceased">{t("Deceased") || "Deceased"}</SelectItem>
                <SelectItem value="Unknown">{t("Unknown") || "Unknown"}</SelectItem>
                <SelectItem value="Sanctioned">{t("Sanctioned") || "Sanctioned"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-start space-x-3 space-y-0 rtl:space-x-reverse">
          <Checkbox
            id="isEntity"
            checked={isEntity}
            onCheckedChange={(v) => setIsEntity(!!v)}
            className="border-white/20 data-[state=checked]:bg-crimson data-[state=checked]:border-crimson"
          />
          <div className="space-y-1 leading-none">
            <label htmlFor="isEntity" className="text-offwhite text-sm cursor-pointer">
              {t("isEntity") || "Is Entity (Organization)"}
            </label>
            <p className="text-slate-body/60 text-[11px]">
              {t("isEntityDescription") || "Check if this is an organization rather than an individual"}
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="bg-crimson hover:bg-crimson-light text-white h-10 px-8"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t("saveChanges") || "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

type LocalizedFieldName = "knownFor" | "biography" | "description" | "convictionDetails";

function LocalizedRichTextSection({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}) {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0].code);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-offwhite">{label}</label>
      <Tabs value={activeLang} onValueChange={setActiveLang}>
        <TabsList className="w-full justify-start bg-white/5 border-white/10">
          {LANGUAGES.map((lang) => (
            <TabsTrigger
              key={lang.code}
              value={lang.code}
              className="text-xs data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body"
            >
              {lang.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code} className="mt-2">
            <RichTextEditor
              value={value[lang.code] || ""}
              onChange={(val) => onChange({ ...value, [lang.code]: val || "" })}
              placeholder={`${label} (${lang.name})`}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function TabLocalized({ wc }: { wc: WarCriminalData }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [knownFor, setKnownFor] = useState<Record<string, string>>(wc.knownFor || {});
  const [biography, setBiography] = useState<Record<string, string>>(wc.biography || {});
  const [description, setDescription] = useState<Record<string, string>>(wc.description || {});
  const [convictionDetails, setConvictionDetails] = useState<Record<string, string>>(wc.convictionDetails || {});

  const buildLocalizedObject = (values: Record<string, string>) => {
    const obj: Record<string, string> = {};
    for (const lang of LANGUAGES) {
      const val = values[lang.code];
      if (val?.trim()) obj[lang.code] = val;
    }
    return Object.keys(obj).length > 0 ? obj : undefined;
  };

  async function handleSave() {
    setIsLoading(true);
    try {
      const res = await update(
        {
          _id: wc._id,
          fullName: wc.fullName,
          ...(buildLocalizedObject(knownFor) ? { knownFor: buildLocalizedObject(knownFor) } : {}),
          ...(buildLocalizedObject(biography) ? { biography: buildLocalizedObject(biography) } : {}),
          ...(buildLocalizedObject(description) ? { description: buildLocalizedObject(description) } : {}),
          ...(buildLocalizedObject(convictionDetails) ? { convictionDetails: buildLocalizedObject(convictionDetails) } : {}),
          status: wc.status as "Accused" | "Indicted" | "Convicted" | "At Large" | "Deceased" | "Unknown" | "Sanctioned",
          isEntity: wc.isEntity,
        },
        { _id: 1, fullName: 1 },
      );

      if (!res.success) {
        throw new Error(res.error || res.body?.message || "Failed to update");
      }

      toast({
        title: t("success") || "Success",
        description: t("localizedFieldsUpdated") || "Localized content updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {t("localizedFields") || "Localized Fields"}
        </h3>

        <LocalizedRichTextSection
          label={t("knownFor") || "Known For"}
          value={knownFor}
          onChange={setKnownFor}
        />
        <LocalizedRichTextSection
          label={t("biography") || "Biography"}
          value={biography}
          onChange={setBiography}
        />
        <LocalizedRichTextSection
          label={t("description") || "Description"}
          value={description}
          onChange={setDescription}
        />
        <LocalizedRichTextSection
          label={t("convictionDetails") || "Conviction Details"}
          value={convictionDetails}
          onChange={setConvictionDetails}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="bg-crimson hover:bg-crimson-light text-white h-10 px-8"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t("saveChanges") || "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function TabRelations({ wc }: { wc: WarCriminalData }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [photoId, setPhotoId] = useState<string>(wc.photo?._id || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    wc.tags?.map((tag) => tag._id).filter(Boolean) as string[] || [],
  );
  const [availableTags, setAvailableTags] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await getTags({ page: 1, limit: 100 }, { _id: 1, name: 1 });
        if (res?.success) {
          const data = (res.body as { _id: string; name: string }[]) || [];
          setAvailableTags(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchTags();
  }, []);

  const initialTagIds = wc.tags?.map((tag) => tag._id).filter(Boolean) as string[] || [];

  async function handleSave() {
    setIsLoading(true);
    try {
      const tagsToAdd = selectedTagIds.filter((id) => !initialTagIds.includes(id));
      const tagsToRemove = initialTagIds.filter((id) => !selectedTagIds.includes(id));
      const photoChanged = photoId !== (wc.photo?._id || "");

      if (!photoChanged && tagsToAdd.length === 0 && tagsToRemove.length === 0) {
        toast({
          title: t("success") || "Success",
          description: t("noChanges") || "No changes",
        });
        return;
      }

      const payload: {
        _id: string;
        tagIds?: string[];
        tagIdsToRemove?: string[];
        photoId?: string;
      } = { _id: wc._id };
      if (photoChanged) payload.photoId = photoId || undefined;
      if (tagsToAdd.length > 0) payload.tagIds = tagsToAdd;
      if (tagsToRemove.length > 0) payload.tagIdsToRemove = tagsToRemove;

      const res = await updateRelations(payload, {
        _id: 1,
        fullName: 1,
        photo: { _id: 1, name: 1 },
        tags: { _id: 1, name: 1 },
      });

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("relationsUpdated") || "Relations updated successfully.",
        });
        router.refresh();
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
  }

  return (
    <div className="space-y-6">
      {/* Photo */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" />
          {t("photo") || "Photo"}
        </h3>
        <Tabs defaultValue={photoId ? "library" : "upload"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
            <TabsTrigger value="library" className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
              {t("imageLibrary") || "Library"}
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
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

      {/* Tags */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5" />
          {t("tags") || "Tags"}
        </h3>
        <TagSelector
          label=""
          availableTags={availableTags.map((t) => ({ id: t._id, name: t.name }))}
          selectedTags={availableTags
            .filter((tag) => selectedTagIds.includes(tag._id))
            .map((t) => ({ id: t._id, name: t.name }))}
          onChange={(tags) => setSelectedTagIds(tags.map((t) => t.id))}
        />
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="bg-crimson hover:bg-crimson-light text-white h-10 px-8"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t("saveChanges") || "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export function WarCriminalEditClient({ wc }: WarCriminalEditClientProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
          <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={`/admin/war-criminals/${wc._id}`}
                  className="text-slate-body hover:text-offwhite transition-colors"
                >
                  <BackArrow className="h-4 w-4" />
                </Link>
                <div className="h-px w-8 bg-crimson" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                  {t("adminPanel")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
                {t("editWarCriminal") || "Edit War Criminal"}
              </h1>
              <p className="text-slate-body mt-1 text-sm">
                {t("editWarCriminalDescription") || "Update the details of this war criminal"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
              >
                <Link href={`/admin/war-criminals/${wc._id}`}>
                  {t("cancel") || "Cancel"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="max-w-5xl"
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="glass-strong border border-white/[0.06] p-1 w-full sm:w-auto inline-flex h-auto gap-1">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite px-4 py-2 rounded-lg text-sm transition-all"
            >
              <Hash className="h-4 w-4 me-2" />
              {t("basicInformation") || "Basic Info"}
            </TabsTrigger>
            <TabsTrigger
              value="localized"
              className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite px-4 py-2 rounded-lg text-sm transition-all"
            >
              <BookOpen className="h-4 w-4 me-2" />
              {t("localizedContent") || "Localized"}
            </TabsTrigger>
            <TabsTrigger
              value="relations"
              className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite px-4 py-2 rounded-lg text-sm transition-all"
            >
              <Link2 className="h-4 w-4 me-2" />
              {t("relations") || "Relations"}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="basic" className="mt-0">
              <TabBasicInfo wc={wc} />
            </TabsContent>
            <TabsContent value="localized" className="mt-0">
              <TabLocalized wc={wc} />
            </TabsContent>
            <TabsContent value="relations" className="mt-0">
              <TabRelations wc={wc} />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}
