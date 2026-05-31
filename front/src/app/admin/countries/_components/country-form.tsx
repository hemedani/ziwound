"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useState, useTransition, useEffect } from "react";
import { useLocale } from "next-intl";
import { Loader2, ImageIcon } from "lucide-react";
import { countrySchema } from "@/types/declarations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
] as const;

const WAR_FIELDS: { id: WarFieldName; labelKey: string }[] = [
  { id: "wars_history", labelKey: "wars_history" },
  { id: "conflict_timeline", labelKey: "conflict_timeline" },
  { id: "casualties_info", labelKey: "casualties_info" },
  { id: "international_response", labelKey: "international_response" },
  { id: "war_crimes_documentation", labelKey: "war_crimes_documentation" },
  { id: "human_rights_violations", labelKey: "human_rights_violations" },
  { id: "genocide_info", labelKey: "genocide_info" },
  { id: "chemical_weapons_info", labelKey: "chemical_weapons_info" },
  { id: "displacement_info", labelKey: "displacement_info" },
  { id: "reconstruction_status", labelKey: "reconstruction_status" },
  { id: "international_sanctions", labelKey: "international_sanctions" },
  { id: "notable_war_events", labelKey: "notable_war_events" },
];

type WarFieldName = "wars_history" | "conflict_timeline" | "casualties_info" | "international_response" | "war_crimes_documentation" | "human_rights_violations" | "genocide_info" | "chemical_weapons_info" | "displacement_info" | "reconstruction_status" | "international_sanctions" | "notable_war_events";

const EMPTY_LOCALIZED = { fa: "", en: "", ar: "", zh: "", pt: "", es: "", nl: "", tr: "", ru: "" };

const localizedFieldSchema = z.object({
  fa: z.string().optional(),
  en: z.string().optional(),
  ar: z.string().optional(),
  zh: z.string().optional(),
  pt: z.string().optional(),
  es: z.string().optional(),
  nl: z.string().optional(),
  tr: z.string().optional(),
  ru: z.string().optional(),
}).optional();

const countryFormSchema = z.object({
  name: z.string().min(1, JSON.stringify({ key: "validation.required", values: {} })),
  english_name: z.string().min(1, JSON.stringify({ key: "validation.required", values: {} })),
  wars_history: localizedFieldSchema,
  conflict_timeline: localizedFieldSchema,
  casualties_info: localizedFieldSchema,
  international_response: localizedFieldSchema,
  war_crimes_documentation: localizedFieldSchema,
  human_rights_violations: localizedFieldSchema,
  genocide_info: localizedFieldSchema,
  chemical_weapons_info: localizedFieldSchema,
  displacement_info: localizedFieldSchema,
  reconstruction_status: localizedFieldSchema,
  international_sanctions: localizedFieldSchema,
  notable_war_events: localizedFieldSchema,
});

export type CountryFormValues = z.infer<typeof countryFormSchema>;

function LocalizedRichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

function WarInfoField({
  control,
  fieldName,
  label,
}: {
  control: ReturnType<typeof useForm<CountryFormValues>>["control"];
  fieldName: WarFieldName;
  label: string;
}) {
  const [activeLang, setActiveLang] = useState("fa");

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-offwhite">{label}</label>
      <Tabs value={activeLang} onValueChange={setActiveLang}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-white/5 border-white/10">
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
            <FormField
              control={control}
              name={`${fieldName}.${lang.code}` as const}
              render={({ field }) => (
                <LocalizedRichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={`${label} (${lang.name})`}
                />
              )}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export type CountryFormSubmitData = CountryFormValues & { photoId?: string };

interface CountryFormProps {
  initialData?: Partial<countrySchema>;
  onSubmit: (data: CountryFormSubmitData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function CountryForm({ initialData, onSubmit, onCancel, isEditing = false }: CountryFormProps) {
  const t = useTranslations("admin");
  const [isPending, startTransition] = useTransition();
  const [photoId, setPhotoId] = useState<string>(
    (initialData as Record<string, { _id?: string }> | undefined)?.photo?._id || ""
  );

  const extractFieldValue = (field: Record<string, string> | string | undefined, langCode: string): string => {
    if (typeof field === "object" && field !== null) return field[langCode] || "";
    if (typeof field === "string") return langCode === "en" ? field : "";
    return "";
  };

  const buildDefaultLocalized = (fieldName: string) => ({
    fa: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "fa"),
    en: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "en"),
    ar: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "ar"),
    zh: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "zh"),
    pt: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "pt"),
    es: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "es"),
    nl: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "nl"),
    tr: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "tr"),
    ru: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "ru"),
  });

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      english_name: initialData?.english_name || "",
      wars_history: buildDefaultLocalized("wars_history"),
      conflict_timeline: buildDefaultLocalized("conflict_timeline"),
      casualties_info: buildDefaultLocalized("casualties_info"),
      international_response: buildDefaultLocalized("international_response"),
      war_crimes_documentation: buildDefaultLocalized("war_crimes_documentation"),
      human_rights_violations: buildDefaultLocalized("human_rights_violations"),
      genocide_info: buildDefaultLocalized("genocide_info"),
      chemical_weapons_info: buildDefaultLocalized("chemical_weapons_info"),
      displacement_info: buildDefaultLocalized("displacement_info"),
      reconstruction_status: buildDefaultLocalized("reconstruction_status"),
      international_sanctions: buildDefaultLocalized("international_sanctions"),
      notable_war_events: buildDefaultLocalized("notable_war_events"),
    },
  });

  const handleSubmit = (values: CountryFormValues) => {
    startTransition(async () => {
      await onSubmit({ ...values, photoId: photoId || undefined });
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
              <GlobeIcon className="h-3.5 w-3.5" />
              {t("basicInfo") || "Basic Information"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-offwhite text-sm">{t("name") || "Name (Local)"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("namePlaceholder") || "Enter local name"}
                        {...field}
                        dir="auto"
                        className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="english_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-offwhite text-sm">{t("englishName") || "Name (English)"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("englishNamePlaceholder") || "Enter English name"}
                        {...field}
                        className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Photo */}
          {!isEditing && (
            <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" />
                {t("photo") || "Photo"}
              </h3>
              <Tabs defaultValue="library">
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
          )}

          {/* War Information */}
          <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
              <WarIcon className="h-3.5 w-3.5" />
              {t("warDescriptionFields") || "War Information"}
            </h3>
            <p className="text-xs text-slate-body/60">
              {t("warInfoDescription") || "Document war-related information in multiple languages"}
            </p>

            <Accordion type="multiple" className="space-y-2">
              {WAR_FIELDS.map((field) => {
                const label = t(field.labelKey) || field.id.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
                return (
                  <AccordionItem
                    key={field.id}
                    value={field.id}
                    className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.02]"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-white/[0.02] text-sm font-medium text-offwhite">
                      {label}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2">
                      <WarInfoField
                        control={form.control}
                        fieldName={field.id}
                        label={label}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10"
            >
              {t("cancel") || "Cancel"}
            </Button>
            <Button type="submit" disabled={isPending} className="bg-crimson hover:bg-crimson-light text-white">
              {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {isEditing ? (t("update") || "Update") : (t("create") || "Create")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function WarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
