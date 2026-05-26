"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GradientInput } from "@/components/form/gradient-input";

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

export const slideMainFormSchema = z.object({
  title: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  subtitle: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  gradient: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  ctaText: z.string().min(1, JSON.stringify({ key: "validation.required" })),
  ctaLink: z.string().min(1, JSON.stringify({ key: "validation.required" })),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
  selected_language: z.string().optional(),
});

export type SlideMainFormValues = z.infer<typeof slideMainFormSchema>;

interface HeroSlideMainFormProps {
  defaultValues?: Partial<SlideMainFormValues>;
  onSubmit: (values: SlideMainFormValues) => Promise<void>;
  isPending: boolean;
  submitLabel: string;
  isEditing: boolean;
  onValuesChange?: (values: Partial<SlideMainFormValues>) => void;
}

export function HeroSlideMainForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  isEditing,
  onValuesChange,
}: HeroSlideMainFormProps) {
  const t = useTranslations("admin");

  const form = useForm<SlideMainFormValues>({
    resolver: zodResolver(slideMainFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      subtitle: defaultValues?.subtitle || "",
      gradient:
        defaultValues?.gradient ||
        "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
      ctaText: defaultValues?.ctaText || "",
      ctaLink: defaultValues?.ctaLink || "",
      secondaryCtaText: defaultValues?.secondaryCtaText || "",
      secondaryCtaLink: defaultValues?.secondaryCtaLink || "",
      order: defaultValues?.order ?? 0,
      isActive: defaultValues?.isActive ?? true,
      selected_language: defaultValues?.selected_language || "all",
    },
  });

  const onValuesChangeRef = useRef(onValuesChange);
  onValuesChangeRef.current = onValuesChange;

  const previewFields = ["title", "subtitle", "gradient", "ctaText", "ctaLink", "secondaryCtaText", "secondaryCtaLink", "isActive"] as const;
  const watchedValues = form.watch([...previewFields]);
  const prevJsonRef = useRef("");

  useEffect(() => {
    const json = JSON.stringify(watchedValues);
    if (json !== prevJsonRef.current) {
      prevJsonRef.current = json;
      const arr = JSON.parse(json) as typeof watchedValues;
      const obj: Record<string, unknown> = {};
      previewFields.forEach((name, i) => {
        obj[name] = arr[i];
      });
      onValuesChangeRef.current?.(obj as Partial<SlideMainFormValues>);
    }
  }, [watchedValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slideTitle") || "Title"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enterSlideTitle") || "Enter slide title"}
                    {...field}
                    className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slideOrder") || "Order"}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("slideSubtitle") || "Subtitle"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("enterSlideSubtitle") || "Enter slide subtitle"}
                  className="resize-none bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gradient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("slideGradient") || "Gradient CSS"}</FormLabel>
              <FormControl>
                <GradientInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("enterSlideGradient") || "Enter CSS gradient"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ctaText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slideCtaText") || "CTA Text"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enterCtaText") || "e.g. Submit Report"}
                    {...field}
                    className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ctaLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slideCtaLink") || "CTA Link"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enterCtaLink") || "e.g. /reports/new"}
                    {...field}
                    className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="secondaryCtaText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slideSecondaryCtaText") || "Secondary CTA Text"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enterSecondaryCtaText") || "Optional"}
                    {...field}
                    className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryCtaLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slideSecondaryCtaLink") || "Secondary CTA Link"}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("enterSecondaryCtaLink") || "Optional"}
                    {...field}
                    className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="selected_language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("language") || "Language"}</FormLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                      <SelectValue placeholder={t("selectLanguage") || "Select language"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass-strong border-white/10">
                    <SelectItem value="all">{t("allLanguages") || "All Languages"}</SelectItem>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5 h-full">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">{t("slideIsActive") || "Active"}</FormLabel>
                  <p className="text-xs text-slate-body">
                    {t("slideIsActiveDescription") || "Show this slide on the homepage"}
                  </p>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="ghost"
            asChild
            className="text-slate-body hover:text-offwhite"
          >
            <Link href="/admin/hero-slides">
              <ArrowLeft className="h-4 w-4 me-1.5" />
              {t("back") || "Back"}
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-crimson hover:bg-crimson-light text-white min-w-[120px]"
          >
            {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
