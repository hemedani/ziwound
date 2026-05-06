"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Loader2, SmilePlus } from "lucide-react";
import { categorySchema } from "@/types/declarations";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

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
  const [isPending, startTransition] = useTransition();
  const [iconOpen, setIconOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      color: initialData?.color || "#3b82f6",
      icon: initialData?.icon || "🏷️",
    },
  });

  const handleSubmit = (values: CategoryFormValues) => {
    startTransition(async () => {
      await onSubmit(values);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("categoryName") || "Category Name"}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterCategoryName") || "e.g. Urgent"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
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
              <FormLabel>{t("description") || "Description"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    t("enterCategoryDescription") || "Describe what this category is used for"
                  }
                  className="resize-none bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("color") || "Color"}</FormLabel>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Input type="color" className="w-12 h-10 p-1 cursor-pointer bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" {...field} />
                  </FormControl>
                  <FormControl>
                    <Input placeholder="#000000" {...field} className="flex-1 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                  </FormControl>
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
                <FormLabel>{t("iconName") || "Icon"}</FormLabel>
                <Popover open={iconOpen} onOpenChange={setIconOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-between font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                      >
                        {field.value ? (
                          <span className="text-xl leading-none">{field.value}</span>
                        ) : (
                          <span>{t("selectIcon") || "Select Icon"}</span>
                        )}
                        <SmilePlus className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="top">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        field.onChange(emojiData.emoji);
                        setIconOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
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
