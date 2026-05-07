"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { heroSlideSchema } from "@/types/declarations";
import { FileUploadField } from "@/components/form/file-upload-field";
import { Checkbox } from "@/components/ui/checkbox";

const slideFormSchema = z.object({
  title: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  subtitle: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  gradient: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  ctaText: z.string().min(1, JSON.stringify({ key: "validation.required" })),
  ctaLink: z.string().min(1, JSON.stringify({ key: "validation.required" })),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
  image: z.string().optional(),
});

export type SlideFormValues = z.infer<typeof slideFormSchema>;

interface SlideFormProps {
  initialData?: Partial<heroSlideSchema>;
  onSubmit: (data: SlideFormValues) => Promise<void>;
  onCancel: () => void;
}

export function SlideForm({ initialData, onSubmit, onCancel }: SlideFormProps) {
  const t = useTranslations("admin");
  const [isPending, startTransition] = useTransition();
  const [imageId, setImageId] = useState<string>(initialData?.image?._id || "");

  const form = useForm<SlideFormValues>({
    resolver: zodResolver(slideFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      gradient: initialData?.gradient || "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(153,27,27,0.25) 0%, #0a0a0a 60%), linear-gradient(to bottom, #0f0f0f, #0a0a0a)",
      ctaText: initialData?.ctaText || "",
      ctaLink: initialData?.ctaLink || "",
      secondaryCtaText: initialData?.secondaryCtaText || "",
      secondaryCtaLink: initialData?.secondaryCtaLink || "",
      order: initialData?.order ?? 0,
      isActive: initialData?.isActive ?? true,
      image: initialData?.image?._id || "",
    },
  });

  const handleSubmit = (values: SlideFormValues) => {
    startTransition(async () => {
      await onSubmit({ ...values, image: imageId || undefined });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("slideTitle") || "Title"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterSlideTitle") || "Enter slide title"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
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
                  <Input type="number" {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
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
                <Textarea
                  placeholder={t("enterSlideGradient") || "Enter CSS gradient"}
                  className="resize-none bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  rows={3}
                  {...field}
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
                  <Input placeholder={t("enterCtaText") || "e.g. Submit Report"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
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
                  <Input placeholder={t("enterCtaLink") || "e.g. /reports/new"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
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
                  <Input placeholder={t("enterSecondaryCtaText") || "Optional"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
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
                  <Input placeholder={t("enterSecondaryCtaLink") || "Optional"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormItem>
            <FormLabel>{t("slideImage") || "Background Image"}</FormLabel>
            <FileUploadField
              label=""
              maxFiles={1}
              accept="image/*"
              value={imageId ? [imageId] : []}
              onChange={(ids) => setImageId(ids[0] || "")}
            />
          </FormItem>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{t("slideIsActive") || "Active"}</FormLabel>
                  <p className="text-sm text-slate-body">{t("slideIsActiveDescription") || "Show this slide on the homepage"}</p>
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            {t("cancel") || "Cancel"}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {t("save") || "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
