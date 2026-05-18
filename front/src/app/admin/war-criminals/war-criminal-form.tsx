"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations, useLocale } from "next-intl";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { warCriminalSchema } from "@/types/declarations";
import { FileUploadField } from "@/components/form/file-upload-field";
import { DatePickerField } from "@/components/form/date-picker-field";

const LANGUAGES = ["en", "fa", "ar"] as const;
type Language = (typeof LANGUAGES)[number];

const languageLabels: Record<Language, string> = {
  en: "English",
  fa: "فارسی",
  ar: "العربية",
};

const localizedFieldSchema = z.object({
  en: z.string().optional(),
  fa: z.string().optional(),
  ar: z.string().optional(),
}).optional();

const warCriminalFormSchema = z.object({
  fullName: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  aliases: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  affiliation: z.enum(["Military", "Paramilitary", "Government", "Rebel Group", "Private Military Company", "Political", "Other"]).optional(),
  rankOrPosition: z.string().optional(),
  knownFor: localizedFieldSchema,
  biography: localizedFieldSchema,
  description: localizedFieldSchema,
  status: z.enum(["Accused", "Indicted", "Convicted", "At Large", "Deceased", "Unknown", "Sanctioned"]),
  convictionDetails: localizedFieldSchema,
  isEntity: z.boolean().default(false),
  photoId: z.string().optional(),
});

export type WarCriminalFormValues = z.infer<typeof warCriminalFormSchema>;

interface WarCriminalFormProps {
  initialData?: Partial<warCriminalSchema> & { photoId?: string };
  onSubmit: (data: WarCriminalFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

function LocalizedTextareaField({
  control,
  fieldName,
  label,
}: {
  control: ReturnType<typeof useForm<WarCriminalFormValues>>["control"];
  fieldName: "knownFor" | "biography" | "description" | "convictionDetails";
  label: string;
}) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Tabs defaultValue="en">
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
                  <Textarea
                    value={field.value || ""}
                    onChange={field.onChange}
                    className="resize-none bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                    rows={4}
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

export function WarCriminalForm({ initialData, onSubmit, onCancel, isEditing = false }: WarCriminalFormProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [photoIds, setPhotoIds] = useState<string[]>(initialData?.photoId ? [initialData.photoId] : []);

  const emptyLocalized = { en: "", fa: "", ar: "" };

  const form = useForm<WarCriminalFormValues>({
    resolver: zodResolver(warCriminalFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      aliases: initialData?.aliases ? initialData.aliases.join(", ") : "",
      dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split("T")[0] : "",
      nationality: initialData?.nationality ? initialData.nationality.join(", ") : "",
      affiliation: initialData?.affiliation || undefined,
      rankOrPosition: initialData?.rankOrPosition || "",
      knownFor: (initialData?.knownFor as Record<string, string> | undefined) ? { en: initialData?.knownFor?.en || "", fa: initialData?.knownFor?.fa || "", ar: initialData?.knownFor?.ar || "" } : emptyLocalized,
      biography: (initialData?.biography as Record<string, string> | undefined) ? { en: initialData?.biography?.en || "", fa: initialData?.biography?.fa || "", ar: initialData?.biography?.ar || "" } : emptyLocalized,
      description: (initialData?.description as Record<string, string> | undefined) ? { en: initialData?.description?.en || "", fa: initialData?.description?.fa || "", ar: initialData?.description?.ar || "" } : emptyLocalized,
      status: initialData?.status || "Unknown",
      convictionDetails: (initialData?.convictionDetails as Record<string, string> | undefined) ? { en: initialData?.convictionDetails?.en || "", fa: initialData?.convictionDetails?.fa || "", ar: initialData?.convictionDetails?.ar || "" } : emptyLocalized,
      isEntity: initialData?.isEntity || false,
      photoId: initialData?.photoId || "",
    },
  });

  const handleSubmit = (values: WarCriminalFormValues) => {
    startTransition(async () => {
      await onSubmit(values);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fullName") || "Full Name"}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterFullName") || "Enter full name"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="aliases"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("aliases") || "Aliases"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("aliasesPlaceholder") || "Comma-separated aliases"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dateOfBirth") || "Date of Birth"}</FormLabel>
                <FormControl>
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                    locale={locale}
                    placeholder={t("dateOfBirth") || "Date of Birth"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nationality") || "Nationality"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("nationalityPlaceholder") || "Comma-separated nationalities"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affiliation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("affiliation") || "Affiliation"}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
                      <SelectValue placeholder={t("selectAffiliation") || "Select affiliation"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass-strong border-white/10">
                    <SelectItem value="Military">{t("Military") || "Military"}</SelectItem>
                    <SelectItem value="Paramilitary">{t("Paramilitary") || "Paramilitary"}</SelectItem>
                    <SelectItem value="Government">{t("Government") || "Government"}</SelectItem>
                    <SelectItem value="Rebel Group">{t("rebelGroup") || "Rebel Group"}</SelectItem>
                    <SelectItem value="Private Military Company">{t("privateMilitaryCompany") || "Private Military Company"}</SelectItem>
                    <SelectItem value="Political">{t("Political") || "Political"}</SelectItem>
                    <SelectItem value="Other">{t("Other") || "Other"}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="rankOrPosition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("rankOrPosition") || "Rank/Position"}</FormLabel>
              <FormControl>
                <Input placeholder={t("rankOrPositionPlaceholder") || "Enter rank or position"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("status") || "Status"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
                    <SelectValue placeholder={t("selectStatus") || "Select status"} />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isEntity"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-crimson focus:ring-crimson"
                />
              </FormControl>
              <FormLabel className="!mb-0">{t("isEntity") || "Is Entity (Organization)"} </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-offwhite">{t("photo") || "Photo"}</h4>
          <FileUploadField
            label=""
            maxFiles={1}
            maxSize={5 * 1024 * 1024}
            accept="image/*"
            value={photoIds}
            onChange={(ids) => {
              setPhotoIds(ids);
              form.setValue("photoId", ids[0] || "");
            }}
          />
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-offwhite">{t("localizedFields") || "Localized Fields"}</h4>
          <LocalizedTextareaField control={form.control} fieldName="knownFor" label={t("knownFor") || "Known For"} />
          <LocalizedTextareaField control={form.control} fieldName="biography" label={t("biography") || "Biography"} />
          <LocalizedTextareaField control={form.control} fieldName="description" label={t("description") || "Description"} />
          <LocalizedTextareaField control={form.control} fieldName="convictionDetails" label={t("convictionDetails") || "Conviction Details"} />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            {t("cancel") || "Cancel"}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {isEditing ? t("update") || "Update" : t("create") || "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
