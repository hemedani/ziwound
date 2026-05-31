"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { add as addBlogPost } from "@/app/actions/blogPost/add";
import { update as updateBlogPost } from "@/app/actions/blogPost/update";
import { updateRelations } from "@/app/actions/blogPost/updateRelations";
import { gets as getTags } from "@/app/actions/tag/gets";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { FileUploadField } from "@/components/form/file-upload-field";
import { TagSelector } from "@/components/form/tag-selector";
import { Loader2, ArrowLeft, BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

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

const formSchema = z.object({
  title: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  slug: z.string().min(2, JSON.stringify({ key: "validation.minLength", values: { min: 2 } })),
  content: z.string().min(10, JSON.stringify({ key: "validation.minLength", values: { min: 10 } })),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  coverImage: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  selected_language: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
  initialData?: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    isFeatured: boolean;
    coverImage?: { _id: string; name?: string };
    tags?: Array<{ _id: string; name: string }>;
    selected_language?: string;
  };
}

export function BlogPostForm({ initialData }: BlogPostFormProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await getTags({ page: 1, limit: 100 }, { _id: 1, name: 1 });
        if (res?.success) {
          const data = (res.body as { _id: string; name: string }[]) || [];
          setAvailableTags(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchTags();
  }, []);

  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      isPublished: initialData?.isPublished || false,
      isFeatured: initialData?.isFeatured || false,
      coverImage: initialData?.coverImage ? [initialData.coverImage._id] : [],
      tags: initialData?.tags?.map((t) => t._id) || [],
      selected_language: initialData?.selected_language || "all",
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    form.setValue("title", newTitle);

    if (!isEditing && !form.formState.dirtyFields.slug) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  async function onSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      const coverImageId =
        data.coverImage && data.coverImage.length > 0 ? data.coverImage[0] : undefined;
      const tagIds = data.tags && data.tags.length > 0 ? data.tags : undefined;

      if (isEditing && initialData) {
        const updateRes = await updateBlogPost({
          _id: initialData._id,
          title: data.title,
          slug: data.slug,
          content: data.content,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
          ...(data.selected_language && data.selected_language !== "all" ? { selected_language: data.selected_language as "fa" | "en" | "ar" | "zh" | "pt" | "es" | "nl" | "tr" | "ru" | "id" | "hi" | "fr" | "ja" | "pa" | "de" | "te" | "mr" | "ta" | "vi" | "ko" | "it" | "sv" | "pl" | "uk" | "ro" } : {}),
        });

        if (!updateRes.success) {
          throw new Error(updateRes.error || updateRes.body?.message || "Failed to update blog post");
        }

        const currentCover = initialData.coverImage?._id;
        const newCover = coverImageId;
        const coverChanged = currentCover !== newCover;

        const currentTags = initialData.tags?.map((t) => t._id) || [];
        const newTags = tagIds || [];
        const tagsToAdd = newTags.filter((id) => !currentTags.includes(id));
        const tagsToRemove = currentTags.filter((id) => !newTags.includes(id));

        if (coverChanged || tagsToAdd.length > 0 || tagsToRemove.length > 0) {
          const relationRes = await updateRelations({
            _id: initialData._id,
            coverImage: newCover,
            tags: tagsToAdd.length > 0 ? tagsToAdd : undefined,
            removeTags: tagsToRemove.length > 0 ? tagsToRemove : undefined,
          });

          if (!relationRes.success) {
            throw new Error(
              relationRes.error || relationRes.body?.message || "Failed to update relations",
            );
          }
        }

        toast({
          title: tCommon("success"),
          description: t("blogPostUpdated") || "Blog post updated successfully",
        });
      } else {
        const addRes = await addBlogPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
          coverImage: coverImageId,
          tags: tagIds,
          ...(data.selected_language && data.selected_language !== "all" ? { selected_language: data.selected_language as "fa" | "en" | "ar" | "zh" | "pt" | "es" | "nl" | "tr" | "ru" | "id" | "hi" | "fr" | "ja" | "pa" | "de" | "te" | "mr" | "ta" | "vi" | "ko" | "it" | "sv" | "pl" | "uk" | "ro" } : {}),
        });

        if (!addRes.success) {
          throw new Error(addRes.error || addRes.body?.message || "Failed to create blog post");
        }

        toast({
          title: tCommon("success"),
          description: t("blogPostCreated") || "Blog post created successfully",
        });
      }

      router.push("/admin/blog");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: tCommon("error"),
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
          <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/admin/blog"
                  className="text-slate-body hover:text-offwhite transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="h-px w-8 bg-crimson" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                  {t("adminPanel")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
                {isEditing ? (t("editPost") || "Edit Blog Post") : (t("addPost") || "New Blog Post")}
              </h1>
              <p className="text-slate-body mt-1 text-sm">
                {isEditing
                  ? (t("editPostDescription") || "Update your blog article details")
                  : (t("addPostDescription") || "Write a new article for your blog")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
              >
                <Link href="/admin/blog">
                  {tCommon("cancel")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="max-w-5xl"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl glass-light p-5 border border-white/[0.06] space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-offwhite text-sm font-semibold">
                          {t("title")} <span className="text-crimson-light">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("titlePlaceholder") || "Enter post title"}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e);
                            }}
                            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-offwhite text-sm font-semibold">
                          {t("slug") || "Slug (URL)"} <span className="text-crimson-light">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("slugPlaceholder") || "my-awesome-post"}
                            {...field}
                            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson font-mono text-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-body/60 text-xs">
                          {t("slugDescription") || "The URL-friendly version of the title. Must be unique."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Content */}
                <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-offwhite text-sm font-semibold">
                          {t("content") || "Content"} <span className="text-crimson-light">*</span>
                        </FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t("contentPlaceholder") || "Write your blog post content here..."}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                {/* Settings Card */}
                <div className="rounded-2xl glass-light p-5 border border-white/[0.06] space-y-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {t("settings") || "Settings"}
                  </h3>

                  <FormField
                    control={form.control}
                    name="selected_language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-offwhite text-sm">{t("language") || "Language"}</FormLabel>
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

                  <div className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-white/20 data-[state=checked]:bg-crimson data-[state=checked]:border-crimson" />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-offwhite text-sm cursor-pointer">{t("published") || "Published"}</FormLabel>
                            <FormDescription className="text-slate-body/60 text-[11px]">
                              {t("publishedDescription") || "Make this post visible to the public"}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500" />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-offwhite text-sm cursor-pointer">{t("featured") || "Featured"}</FormLabel>
                            <FormDescription className="text-slate-body/60 text-[11px]">
                              {t("featuredDescription") || "Highlight this post on the blog index"}
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Tags Card */}
                <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TagSelector
                            label={t("tags") || "Tags"}
                            availableTags={availableTags.map((t) => ({ id: t._id, name: t.name }))}
                            selectedTags={availableTags
                              .filter((tag) => (field.value || []).includes(tag._id))
                              .map((t) => ({ id: t._id, name: t.name }))}
                            onChange={(tags) => field.onChange(tags.map((t) => t.id))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Cover Image Card */}
                <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-offwhite text-sm">{t("coverImage") || "Cover Image"}</FormLabel>
                        <FormControl>
                          <FileUploadField
                            label=""
                            value={field.value || []}
                            onChange={(files) => field.onChange(files.slice(0, 1))}
                            maxFiles={1}
                            accept="image/*"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-body/60 text-[11px]">
                          {t("coverImageDescription") || "Upload a cover image for the blog post"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]"
            >
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10"
              >
                <Link href="/admin/blog">
                  {tCommon("cancel")}
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-crimson hover:bg-crimson-light text-white min-w-[120px]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />}
                {isEditing ? (tCommon("save") || "Save") : (tCommon("create") || "Create")}
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
