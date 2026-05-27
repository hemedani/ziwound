"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { Loader2, SmilePlus } from "lucide-react";
import { categorySchema } from "@/types/declarations";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CategoryPreview } from "./category-preview";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const COLOR_PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6",
  "#6366f1", "#a855f7", "#ec4899", "#6b7280", "#991b1b",
  "#d97706", "#059669", "#0284c7", "#7c3aed", "#be185d",
];

const categoryFormSchema = z.object({
  name: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialData?: Partial<categorySchema>;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const [isPending, startTransition] = useTransition();
  const [iconOpen, setIconOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      color: initialData?.color || "#3b82f6",
      icon: initialData?.icon || "",
    },
  });

  const watchColor = form.watch("color");
  const watchIcon = form.watch("icon");
  const watchName = form.watch("name");

  const handleSubmit = (values: CategoryFormValues) => {
    startTransition(async () => {
      await onSubmit(values);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite">{t("categoryName") || "Category Name"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterCategoryName") || "e.g. Infrastructure"}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite">{t("description") || "Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("enterCategoryDescription") || "Describe what this category is used for"}
                      className="resize-none bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite">{t("color") || "Color"}</FormLabel>
                  <div className="flex gap-2 items-start">
                    <FormControl>
                      <Input
                        type="color"
                        className="w-12 h-10 p-0.5 cursor-pointer bg-white/5 border-white/10 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex-1 space-y-2">
                      <FormControl>
                        <Input
                          placeholder="#000000"
                          {...field}
                          className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                        />
                      </FormControl>
                      <div className="flex flex-wrap gap-1.5">
                        {COLOR_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => field.onChange(preset)}
                            className={`h-6 w-6 rounded-full border transition-all duration-200 ${
                              field.value === preset
                                ? "ring-2 ring-offset-2 ring-offset-background ring-crimson scale-110"
                                : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: preset }}
                            title={preset}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite">{t("icon") || "Icon"}</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl>
                      <Input
                        placeholder={t("selectIcon") || "Select Icon"}
                        {...field}
                        readOnly
                        className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson cursor-pointer"
                        onClick={() => setIconOpen(true)}
                      />
                    </FormControl>
                    <Popover open={iconOpen} onOpenChange={setIconOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite shrink-0"
                        >
                          <SmilePlus className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align={isRtl ? "end" : "start"} side="top">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            field.onChange(emojiData.emoji);
                            setIconOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-slate-body hover:text-offwhite"
                        onClick={() => field.onChange("")}
                      >
                        {t("clear") || "Clear"}
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.06]">
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
                {initialData?._id ? (t("update") || "Update") : (t("create") || "Create")}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-6 space-y-4">
          <CategoryPreview icon={watchIcon} name={watchName} color={watchColor} />
        </div>
      </div>
    </div>
  );
}
