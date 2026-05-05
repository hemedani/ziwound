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
import { RichTextEditor } from "@/components/form/rich-text-editor";

const cityFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  english_name: z.string().min(1, "English name is required"),
  province_id: z.string().min(1, "Province is required"),
  wars_history: z.string().optional(),
  conflict_timeline: z.string().optional(),
  casualties_info: z.string().optional(),
  international_response: z.string().optional(),
  war_crimes_documentation: z.string().optional(),
  human_rights_violations: z.string().optional(),
  genocide_info: z.string().optional(),
  chemical_weapons_info: z.string().optional(),
  displacement_info: z.string().optional(),
  reconstruction_status: z.string().optional(),
  international_sanctions: z.string().optional(),
  notable_war_events: z.string().optional(),
});

export type CityFormValues = z.infer<typeof cityFormSchema>;

interface CityFormProps {
  onSubmit: (data: CityFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<CityFormValues>;
  isEditing?: boolean;
  provinces?: Array<{ _id: string; name: string; english_name: string }>;
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

export function CityForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
  provinces = [],
}: CityFormProps) {
  const t = useTranslations("admin");

  const form = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: "",
      english_name: "",
      province_id: "",
      wars_history: "",
      conflict_timeline: "",
      casualties_info: "",
      international_response: "",
      war_crimes_documentation: "",
      human_rights_violations: "",
      genocide_info: "",
      chemical_weapons_info: "",
      displacement_info: "",
      reconstruction_status: "",
      international_sanctions: "",
      notable_war_events: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="province_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("province") || "Province"}</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">{t("selectProvince") || "Select a province"}</option>
                    {provinces.map((province) => (
                      <option key={province._id} value={province._id}>
                        {province.name} ({province.english_name})
                      </option>
                    ))}
                  </select>
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
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(fieldName) || fieldName.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder={t(`${fieldName}Placeholder`) || `Enter ${fieldName.replace(/_/g, " ")}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
