"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { AsyncSelect, AsyncSelectOption } from "@/components/form/async-select";

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

const provinceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  english_name: z.string().min(1, "English name is required"),
  countryId: z.string().min(1, "Country is required"),
  wars_history: localizedWarFieldSchema,
  conflict_timeline: localizedWarFieldSchema,
  casualties_info: localizedWarFieldSchema,
  notable_battles: localizedWarFieldSchema,
  occupation_info: localizedWarFieldSchema,
  destruction_level: localizedWarFieldSchema,
  civilian_impact: localizedWarFieldSchema,
  mass_graves_info: localizedWarFieldSchema,
  war_crimes_events: localizedWarFieldSchema,
  liberation_info: localizedWarFieldSchema,
});

export type ProvinceFormValues = z.infer<typeof provinceFormSchema>;

interface ProvinceFormProps {
  onSubmit: (data: ProvinceFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<ProvinceFormValues>;
  isEditing?: boolean;
  countries?: Array<{ _id: string; name: string; english_name: string }>;
}

const warDescriptionFields = [
  "wars_history",
  "conflict_timeline",
  "casualties_info",
  "notable_battles",
  "occupation_info",
  "destruction_level",
  "civilian_impact",
  "mass_graves_info",
  "war_crimes_events",
  "liberation_info",
] as const;

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

type WarFieldName = (typeof warDescriptionFields)[number];

function LocalizedRichTextField({
  control,
  fieldName,
  label,
}: {
  control: ReturnType<typeof useForm<ProvinceFormValues>>["control"];
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
                name={`${fieldName}.${lang}` as `${typeof fieldName}.${Language}`}
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

export function ProvinceForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
  countries = [],
}: ProvinceFormProps) {
  const t = useTranslations("admin");

  const emptyLocalized: LocalizedWarField = { fa: "", en: "", ar: "", zh: "", pt: "", es: "", nl: "", tr: "", ru: "" };

  const form = useForm<ProvinceFormValues>({
    resolver: zodResolver(provinceFormSchema),
    defaultValues: {
      name: "",
      english_name: "",
      countryId: "",
      wars_history: emptyLocalized,
      conflict_timeline: emptyLocalized,
      casualties_info: emptyLocalized,
      notable_battles: emptyLocalized,
      occupation_info: emptyLocalized,
      destruction_level: emptyLocalized,
      civilian_impact: emptyLocalized,
      mass_graves_info: emptyLocalized,
      war_crimes_events: emptyLocalized,
      liberation_info: emptyLocalized,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("country") || "Country"}</FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value}
                    onChange={(val) => field.onChange(val || "")}
                    options={countries.map((c) => ({
                      id: c._id,
                      label: c.name,
                      subLabel: c.english_name,
                    }))}
                    placeholder={t("selectCountry") || "Select a country"}
                    searchPlaceholder="Search countries..."
                    emptyText="No country found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>

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
