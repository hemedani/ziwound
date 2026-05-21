"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";

const LANGUAGES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"] as const;
type Language = (typeof LANGUAGES)[number];

type LocalizedWarField = Partial<Record<Language, string>>;

const localizedWarFieldSchema = z.object({
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
  name: z.string().min(1, "Name is required"),
  english_name: z.string().min(1, "English name is required"),
  photoId: z.string().optional(),
  wars_history: localizedWarFieldSchema,
  conflict_timeline: localizedWarFieldSchema,
  casualties_info: localizedWarFieldSchema,
  international_response: localizedWarFieldSchema,
  war_crimes_documentation: localizedWarFieldSchema,
  human_rights_violations: localizedWarFieldSchema,
  genocide_info: localizedWarFieldSchema,
  chemical_weapons_info: localizedWarFieldSchema,
  displacement_info: localizedWarFieldSchema,
  reconstruction_status: localizedWarFieldSchema,
  international_sanctions: localizedWarFieldSchema,
  notable_war_events: localizedWarFieldSchema,
});

export type CountryFormValues = z.infer<typeof countryFormSchema>;

interface CountryFormProps {
  onSubmit: (data: CountryFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<CountryFormValues>;
  isEditing?: boolean;
}

const warDescriptionFields = [
  "wars_history",
  "conflict_timeline",
  "casualties_info",
  "international_response",
  "war_crimes_documentation",
  "human_rights_violations",
  "genocide_info",
  "chemical_weapons_info",
  "displacement_info",
  "reconstruction_status",
  "international_sanctions",
  "notable_war_events",
] as const;

type WarFieldName = (typeof warDescriptionFields)[number];

const languageLabels: Record<Language, string> = {
  fa: "فارسی",
  en: "English",
  ar: "العربية",
  zh: "中文",
  pt: "Português",
  es: "Español",
  nl: "Nederlands",
  tr: "Türkçe",
  ru: "Русский",
};

function LocalizedRichTextField({
  control,
  fieldName,
  label,
}: {
  control: ReturnType<typeof useForm<CountryFormValues>>["control"];
  fieldName: WarFieldName;
  label: string;
}) {
  const t = useTranslations("admin");

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Tabs defaultValue="fa">
          <TabsList className="w-full justify-start">
            {LANGUAGES.map((lang) => (
              <TabsTrigger key={lang} value={lang} className="text-xs">
                {languageLabels[lang]}
              </TabsTrigger>
            ))}
          </TabsList>
          {LANGUAGES.map((lang) => (
            <TabsContent key={lang} value={lang} className="mt-2">
              <FormField
                control={control}
                name={`${fieldName}.${lang}` as const}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder={t(`${fieldName}Placeholder`) || `Enter ${fieldName.replace(/_/g, " ")}`}
                  />
                )}
              />
            </TabsContent>
          ))}
        </Tabs>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

export function CountryForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
}: CountryFormProps) {
  const t = useTranslations("admin");
  const [photoId, setPhotoId] = useState<string>(defaultValues?.photoId || "");

  const emptyLocalized: LocalizedWarField = { fa: "", en: "", ar: "", zh: "", pt: "", es: "", nl: "", tr: "", ru: "" };

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countryFormSchema),
    defaultValues: {
      name: "",
      english_name: "",
      photoId: "",
      wars_history: emptyLocalized,
      conflict_timeline: emptyLocalized,
      casualties_info: emptyLocalized,
      international_response: emptyLocalized,
      war_crimes_documentation: emptyLocalized,
      human_rights_violations: emptyLocalized,
      genocide_info: emptyLocalized,
      chemical_weapons_info: emptyLocalized,
      displacement_info: emptyLocalized,
      reconstruction_status: emptyLocalized,
      international_sanctions: emptyLocalized,
      notable_war_events: emptyLocalized,
      ...defaultValues,
    },
    mode: "onChange",
    shouldUnregister: false,
  });

  const handleSubmit = (values: CountryFormValues) => {
    onSubmit({ ...values, photoId: photoId || undefined });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name") || "Name (Local)"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("namePlaceholder") || "Enter name"} />
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
                <FormLabel>{t("englishName") || "Name (English)"}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("englishNamePlaceholder") || "Enter English name"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!isEditing && (
          <FormItem>
            <FormLabel>{t("photo") || "Photo"}</FormLabel>
            <Tabs defaultValue="library">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
                <TabsTrigger value="library">{t("imageLibrary") || "Library"}</TabsTrigger>
                <TabsTrigger value="upload">{t("uploadNew") || "Upload"}</TabsTrigger>
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
            <FormMessage />
          </FormItem>
        )}

        <div className="space-y-6">
          <h4 className="text-sm font-semibold">{t("warDescriptionFields") || "War Description Fields"}</h4>
          <div className="space-y-6">
            {warDescriptionFields.map((fieldName) => (
              <LocalizedRichTextField
                key={fieldName}
                control={form.control}
                fieldName={fieldName}
                label={t(fieldName) || fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel") || "Cancel"}
          </Button>
          <Button type="submit">
            {isEditing
              ? t("update") || "Update"
              : t("create") || "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
