"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
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
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { FileUploadField } from "@/components/form/file-upload-field";
import { TagSelector } from "@/components/form/tag-selector";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  content: z.string().min(10, "Content is required"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  coverImage: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
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
    },
  });

  // Auto-generate slug from title if empty
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
        // Update post
        const updateRes = await updateBlogPost({
          _id: initialData._id,
          title: data.title,
          slug: data.slug,
          content: data.content,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
        });

        if (!updateRes.success) {
          throw new Error(updateRes.error || updateRes.body?.message || "Failed to update blog post");
        }

        // Update relations
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
        // Add new post
        const addRes = await addBlogPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
          coverImage: coverImageId,
          tags: tagIds,
        });

        if (!addRes.success) {
          throw new Error(addRes.error || addRes.body?.message || "Failed to create blog post");
        }

        toast({
          title: tCommon("success"),
          description: t("blogPostCreated") || "Blog post created successfully",
        });
      }

      router.refresh();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("titlePlaceholder") || "Enter post title"}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleTitleChange(e);
                      }}
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
                  <FormLabel>{t("slug") || "Slug (URL)"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("slugPlaceholder") || "my-awesome-post"} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("slugDescription") || "The URL-friendly version of the title. Must be unique."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="space-y-4 rounded-lg border p-4 bg-card">
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("published") || "Published"}</FormLabel>
                      <FormDescription>
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4 border-t">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("featured") || "Featured"}</FormLabel>
                      <FormDescription>
                        {t("featuredDescription") || "Highlight this post on the blog index"}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("coverImage") || "Cover Image"}</FormLabel>
                  <FormControl>
                    <FileUploadField
                      label={t("coverImage") || "Cover Image"}
                      value={field.value || []}
                      onChange={(files) => field.onChange(files.slice(0, 1))}
                      maxFiles={1}
                      accept="image/*"
                    />
                  </FormControl>
                  <FormDescription>
                    {t("coverImageDescription") || "Upload a cover image for the blog post"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("content") || "Content"}</FormLabel>
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

        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? tCommon("save") : tCommon("create")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blog")}
            disabled={isLoading}
          >
            {tCommon("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
