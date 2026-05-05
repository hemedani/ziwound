"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useMemo } from "react";
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
import { AsyncSelect } from "@/components/form/async-select";

const cityFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  english_name: z.string().min(1, "English name is required"),
  countryId: z.string().min(1, "Country is required"),
  provinceId: z.string().min(1, "Province is required"),
  wars_history: z.string().optional(),
  conflict_timeline: z.string().optional(),
  casualties_info: z.string().optional(),
  notable_battles: z.string().optional(),
  occupation_info: z.string().optional(),
  destruction_level: z.string().optional(),
  civilian_impact: z.string().optional(),
  mass_graves_info: z.string().optional(),
  war_crimes_events: z.string().optional(),
  liberation_info: z.string().optional(),
});

export type CityFormValues = z.infer<typeof cityFormSchema>;

interface CityFormProps {
  onSubmit: (data: CityFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<CityFormValues>;
  isEditing?: boolean;
  countries?: Array<{ _id: string; name: string; english_name: string }>;
  provinces?: Array<{ _id: string; name: string; english_name: string; country?: { _id?: string } }>;
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

export function CityForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
  countries = [],
  provinces = [],
}: CityFormProps) {
  const t = useTranslations("admin");
  const [selectedCountry, setSelectedCountry] = useState<string | string[] | null>(
    defaultValues?.countryId || null
  );

  const form = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues: {
      name: "",
      english_name: "",
      countryId: "",
      provinceId: "",
      wars_history: "",
      conflict_timeline: "",
      casualties_info: "",
      notable_battles: "",
      occupation_info: "",
      destruction_level: "",
      civilian_impact: "",
      mass_graves_info: "",
      war_crimes_events: "",
      liberation_info: "",
      ...defaultValues,
    },
  });

  const filteredProvinces = useMemo(() => {
    if (!selectedCountry || typeof selectedCountry !== "string") return provinces;
    return provinces.filter((p) => p.country?._id === selectedCountry);
  }, [provinces, selectedCountry]);

  const provinceOptions = useMemo(() => {
    return filteredProvinces.map((p) => ({
      id: p._id,
      label: p.name,
      subLabel: p.english_name,
    }));
  }, [filteredProvinces]);

  const countryOptions = useMemo(() => {
    return countries.map((c) => ({
      id: c._id,
      label: c.name,
      subLabel: c.english_name,
    }));
  }, [countries]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("country") || "Country"}</FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val || "");
                      setSelectedCountry(val);
                      form.setValue("provinceId", "");
                    }}
                    options={countryOptions}
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
            name="provinceId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("province") || "Province"}</FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value}
                    onChange={(val) => field.onChange(val || "")}
                    options={provinceOptions}
                    placeholder={t("selectProvince") || "Select a province"}
                    searchPlaceholder="Search provinces..."
                    emptyText="No province found."
                    disabled={!selectedCountry}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
