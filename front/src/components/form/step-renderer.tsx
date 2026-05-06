"use client";

import { useTranslations } from "next-intl";
import { Control, UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagSelector } from "@/components/form/tag-selector";
import { AsyncSelect, AsyncSelectLoadResult } from "@/components/form/async-select";
import { FileUploadField } from "@/components/form/file-upload-field";
import { DocumentFormField } from "@/components/form/document-list-field";
import dynamic from "next/dynamic";
import { REPORT_LANGUAGES, REPORT_PRIORITY, LANGUAGE_MAP } from "@/types/report-schema";
import { getFieldMetadata } from "@/lib/declaration-parser";
import type { reportFormSchema } from "@/types/report-schema";
import { ReqType } from "@/types/declarations";
import { gets as getCountries } from "@/app/actions/country/gets";
import { gets as getProvinces } from "@/app/actions/province/gets";
import { gets as getCities } from "@/app/actions/city/gets";

const LocationPicker = dynamic(
  () => import("@/components/form/location-picker").then((mod) => mod.LocationPicker),
  { ssr: false, loading: () => <div className="h-20 w-full animate-pulse rounded-xl bg-white/5 border border-white/[0.06]" /> },
);

type FormData = z.infer<typeof reportFormSchema>;

interface StepRendererProps {
  step: number;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
  categories: { _id: string; name: string }[];
  availableTags: { id: string; name: string }[];
  disabled?: boolean;
  locale?: string;
}

export function StepRenderer({
  step,
  control,
  errors,
  setValue,
  watch,
  categories,
  availableTags,
  disabled = false,
  locale = "en",
}: StepRendererProps) {
  const t = useTranslations();

  // Async load functions for countries, provinces, and cities
  const loadCountries = async (inputValue: string): Promise<AsyncSelectLoadResult> => {
    const query: ReqType["main"]["country"]["gets"]["set"] = {
      page: 1,
      limit: 50,
    };
    if (inputValue) {
      query.search = inputValue;
    }
    const result = await getCountries(query, { _id: 1, name: 1 });
    if (result.success && result.body) {
      return {
        options: result.body.map((c: { _id: string; name: string }) => ({
          id: c._id,
          label: c.name,
        })),
        hasMore: false,
      };
    }
    return { options: [], hasMore: false };
  };

  const loadProvinces = async (inputValue: string): Promise<AsyncSelectLoadResult> => {
    const query: ReqType["main"]["province"]["gets"]["set"] = {
      page: 1,
      limit: 50,
    };
    if (inputValue) {
      query.search = inputValue;
    }
    const result = await getProvinces(query, { _id: 1, name: 1 });
    if (result.success && result.body) {
      return {
        options: result.body.map((p: { _id: string; name: string }) => ({
          id: p._id,
          label: p.name,
        })),
        hasMore: false,
      };
    }
    return { options: [], hasMore: false };
  };

  const loadCities = async (inputValue: string): Promise<AsyncSelectLoadResult> => {
    const query: ReqType["main"]["city"]["gets"]["set"] = {
      page: 1,
      limit: 50,
    };
    if (inputValue) {
      query.search = inputValue;
    }
    const result = await getCities(query, { _id: 1, name: 1 });
    if (result.success && result.body) {
      return {
        options: result.body.map((c: { _id: string; name: string }) => ({
          id: c._id,
          label: c.name,
        })),
        hasMore: false,
      };
    }
    return { options: [], hasMore: false };
  };
  const fieldComponents: Record<number, string[]> = {
    1: ["title", "description", "selected_language"],
    2: ["crime_occurred_at", "priority", "tags", "category"],
    3: [
      "location",
      "address",
      "hostileCountryIds",
      "attackedCountryIds",
      "attackedProvinceIds",
      "attackedCityIds",
    ],
    4: ["documents"],
  };

  const fields = fieldComponents[step] || [];

  const getFieldLabel = (fieldName: string) => {
    const labels: Record<string, string> = {
      title: t("report.reportTitle"),
      description: t("report.description"),
      selected_language: t("report.language"),
      crime_occurred_at: t("report.crimeOccurredAt"),
      priority: t("report.priority"),
      location: t("report.location"),
      address: t("report.address"),
      country: t("report.country"),
      city: t("report.city"),
      documents: t("report.documents"),
      tags: t("report.tags"),
      category: t("report.category"),
    };
    return labels[fieldName] || fieldName;
  };

  const isRequired = (fieldName: string) => {
    const metadata = getFieldMetadata(fieldName);
    return metadata?.required || false;
  };

  const renderField = (fieldName: string) => {
    const metadata = getFieldMetadata(fieldName);

    switch (fieldName) {
      case "title":
        return (
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("report.reportTitlePlaceholder")}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "description":
        return (
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("report.descriptionPlaceholder")}
                    rows={5}
                    disabled={disabled}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0} / 10000 {t("common.characters")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "selected_language":
        return (
          <FormField
            control={control}
            name="selected_language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("report.selectLanguage")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(REPORT_LANGUAGES as readonly string[]).map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {LANGUAGE_MAP[lang as keyof typeof LANGUAGE_MAP]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "crime_occurred_at":
        return (
          <FormField
            control={control}
            name="crime_occurred_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "priority":
        return (
          <FormField
            control={control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("report.selectPriority")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REPORT_PRIORITY.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {t(`report.priority${priority}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "location":
        return (
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <LocationPicker
                  label={getFieldLabel(fieldName)}
                  value={field.value}
                  onChange={field.onChange}
                  showMap={true}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "address":
        return (
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("report.addressPlaceholder")} disabled={disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "hostileCountryIds":
        return (
          <FormField
            control={control}
            name="hostileCountryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("report.hostileCountries") || "Hostile Countries"}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value || []}
                    onChange={(value) => field.onChange(value)}
                    isMulti
                    async
                    loadOptions={loadCountries}
                    placeholder={t("report.selectHostileCountries") || "Select hostile countries..."}
                    searchPlaceholder={t("report.searchCountries") || "Search countries..."}
                    emptyText={t("report.noCountriesFound") || "No countries found."}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "attackedCountryIds":
        return (
          <FormField
            control={control}
            name="attackedCountryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("report.attackedCountries") || "Attacked Countries"}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value || []}
                    onChange={(value) => field.onChange(value)}
                    isMulti
                    async
                    loadOptions={loadCountries}
                    placeholder={t("report.selectAttackedCountries") || "Select attacked countries..."}
                    searchPlaceholder={t("report.searchCountries") || "Search countries..."}
                    emptyText={t("report.noCountriesFound") || "No countries found."}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "attackedProvinceIds":
        return (
          <FormField
            control={control}
            name="attackedProvinceIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("report.attackedProvinces") || "Attacked Provinces"}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value || []}
                    onChange={(value) => field.onChange(value)}
                    isMulti
                    async
                    loadOptions={loadProvinces}
                    placeholder={t("report.selectAttackedProvinces") || "Select attacked provinces..."}
                    searchPlaceholder={t("report.searchProvinces") || "Search provinces..."}
                    emptyText={t("report.noProvincesFound") || "No provinces found."}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "attackedCityIds":
        return (
          <FormField
            control={control}
            name="attackedCityIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("report.attackedCities") || "Attacked Cities"}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value || []}
                    onChange={(value) => field.onChange(value)}
                    isMulti
                    async
                    loadOptions={loadCities}
                    placeholder={t("report.selectAttackedCities") || "Select attacked cities..."}
                    searchPlaceholder={t("report.searchCities") || "Search cities..."}
                    emptyText={t("report.noCitiesFound") || "No cities found."}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "documents":
        return (
          <FormField
            control={control}
            name="documents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <DocumentFormField
                  value={field.value || []}
                  onChange={field.onChange}
                  locale={locale}
                />
                <FormDescription>{t("report.documentsDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "tags":
        return (
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <TagSelector
                  label={getFieldLabel(fieldName)}
                  availableTags={availableTags}
                  selectedTags={(field.value || []).map((id) => {
                    const tag = availableTags.find((t) => t.id === id);
                    return { id, name: tag ? tag.name : id };
                  })}
                  onChange={(tags) => field.onChange(tags.map((t) => t.id))}
                  creatable={true}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "category":
        return (
          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {getFieldLabel(fieldName)}{" "}
                  {isRequired(fieldName) && <span className="text-destructive">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("report.selectCategory")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {fields.map((fieldName) => (
        <div key={fieldName}>{renderField(fieldName)}</div>
      ))}
    </div>
  );
}
