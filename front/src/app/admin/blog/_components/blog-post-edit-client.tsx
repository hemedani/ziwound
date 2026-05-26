"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { update as updateBlogPost } from "@/app/actions/blogPost/update";
import { updateRelations } from "@/app/actions/blogPost/updateRelations";
import { gets as getTags } from "@/app/actions/tag/gets";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadField } from "@/components/form/file-upload-field";
import { TagSelector } from "@/components/form/tag-selector";
import { ImagePicker } from "@/components/form/image-picker";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, ArrowRight, Hash, Link2, BookOpen, Save } from "lucide-react";
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

interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  isFeatured: boolean;
  selected_language?: string;
  coverImage?: { _id: string; name?: string };
  tags?: Array<{ _id: string; name: string }>;
}

interface BlogPostEditClientProps {
  post: BlogPostData;
}

function TabBasicInfo({ post }: { post: BlogPostData }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState(post.title || "");
  const [slug, setSlug] = useState(post.slug || "");
  const [content, setContent] = useState(post.content || "");
  const [selectedLanguage, setSelectedLanguage] = useState(post.selected_language || "all");
  const [isPublished, setIsPublished] = useState(post.isPublished || false);
  const [isFeatured, setIsFeatured] = useState(post.isFeatured || false);

  async function handleSave() {
    if (!title.trim() || title.trim().length < 2) {
      toast({ variant: "destructive", title: t("error") || "Error", description: t("titleRequired") || "Title must be at least 2 characters" });
      return;
    }
    if (!slug.trim() || slug.trim().length < 2) {
      toast({ variant: "destructive", title: t("error") || "Error", description: t("slugRequired") || "Slug must be at least 2 characters" });
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      toast({ variant: "destructive", title: t("error") || "Error", description: t("contentRequired") || "Content must be at least 10 characters" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateBlogPost({
        _id: post._id,
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        isPublished,
        isFeatured,
        ...(selectedLanguage && selectedLanguage !== "all" ? { selected_language: selectedLanguage as "fa" | "en" | "ar" | "zh" | "pt" | "es" | "nl" | "tr" | "ru" | "id" | "hi" | "fr" | "ja" | "pa" | "de" | "te" | "mr" | "ta" | "vi" | "ko" | "it" | "sv" | "pl" | "uk" | "ro" } : {}),
      });

      if (!res.success) {
        throw new Error(res.error || res.body?.message || "Failed to update");
      }

      toast({
        title: t("success") || "Success",
        description: t("blogPostUpdated") || "Blog post updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Slug */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-5">
        <div>
          <label className="block text-sm font-semibold text-offwhite mb-1.5">
            {t("title")} <span className="text-crimson-light">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("titlePlaceholder") || "Enter post title"}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-offwhite mb-1.5">
            {t("slug") || "Slug (URL)"} <span className="text-crimson-light">*</span>
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={t("slugPlaceholder") || "my-awesome-post"}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson font-mono text-sm"
          />
          <p className="mt-1 text-xs text-slate-body/60">
            {t("slugDescription") || "The URL-friendly version of the title. Must be unique."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06]">
        <label className="block text-sm font-semibold text-offwhite mb-1.5">
          {t("content") || "Content"} <span className="text-crimson-light">*</span>
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder={t("contentPlaceholder") || "Write your blog post content here..."}
        />
      </div>

      {/* Settings Card */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {t("settings") || "Settings"}
        </h3>

        <div>
          <label className="block text-sm text-offwhite mb-1.5">{t("language") || "Language"}</label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
              <SelectValue placeholder={t("selectLanguage") || "Select language"} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="all">{t("allLanguages") || "All Languages"}</SelectItem>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
            <Checkbox
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(v) => setIsPublished(!!v)}
              className="border-white/20 data-[state=checked]:bg-crimson data-[state=checked]:border-crimson"
            />
            <div className="space-y-1 leading-none">
              <label htmlFor="isPublished" className="text-offwhite text-sm cursor-pointer">
                {t("published") || "Published"}
              </label>
              <p className="text-slate-body/60 text-[11px]">
                {t("publishedDescription") || "Make this post visible to the public"}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
            <Checkbox
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(v) => setIsFeatured(!!v)}
              className="border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <div className="space-y-1 leading-none">
              <label htmlFor="isFeatured" className="text-offwhite text-sm cursor-pointer">
                {t("featured") || "Featured"}
              </label>
              <p className="text-slate-body/60 text-[11px]">
                {t("featuredDescription") || "Highlight this post on the blog index"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="bg-crimson hover:bg-crimson-light text-white h-10 px-8"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t("saveChanges") || "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function TabRelations({ post }: { post: BlogPostData }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [photoId, setPhotoId] = useState<string>(post.coverImage?._id || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post.tags?.map((tag) => tag._id).filter(Boolean) as string[] || [],
  );
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

  const initialTagIds = post.tags?.map((tag) => tag._id).filter(Boolean) as string[] || [];
  const hasChanges =
    photoId !== (post.coverImage?._id || "") ||
    JSON.stringify([...selectedTagIds].sort()) !== JSON.stringify([...initialTagIds].sort());

  async function handleSave() {
    setIsLoading(true);
    try {
      const tagsToAdd = selectedTagIds.filter((id) => !initialTagIds.includes(id));
      const tagsToRemove = initialTagIds.filter((id) => !selectedTagIds.includes(id));
      const coverChanged = photoId !== (post.coverImage?._id || "");

      if (!coverChanged && tagsToAdd.length === 0 && tagsToRemove.length === 0) {
        toast({
          title: t("success") || "Success",
          description: t("noChanges") || "No changes",
        });
        return;
      }

      const payload: { _id: string; coverImage?: string; tags?: string[]; removeTags?: string[] } = { _id: post._id };
      if (coverChanged) payload.coverImage = photoId || undefined;
      if (tagsToAdd.length > 0) payload.tags = tagsToAdd;
      if (tagsToRemove.length > 0) payload.removeTags = tagsToRemove;

      const res = await updateRelations(payload, {
        _id: 1,
        title: 1,
        coverImage: { _id: 1, name: 1 },
        tags: { _id: 1, name: 1 },
      });

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("relationsUpdated") || "Relations updated successfully.",
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description: res?.error || res?.body?.message || t("failedToUpdateRelations") || "Failed to update relations.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
          {t("coverImage") || "Cover Image"}
        </h3>
        <Tabs defaultValue={photoId ? "library" : "upload"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
            <TabsTrigger value="library" className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
              {t("imageLibrary") || "Library"}
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
              {t("uploadNew") || "Upload"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="library" className="mt-3">
            <ImagePicker
              value={photoId}
              onChange={(id) => setPhotoId(id || "")}
            />
          </TabsContent>
          <TabsContent value="upload" className="mt-3">
            <FileUploadField
              label=""
              maxFiles={1}
              accept="image/*"
              value={photoId ? [photoId] : []}
              onChange={(ids) => setPhotoId(ids[0] || "")}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Tags */}
      <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5" />
          {t("tags") || "Tags"}
        </h3>
        <TagSelector
          label=""
          availableTags={availableTags.map((t) => ({ id: t._id, name: t.name }))}
          selectedTags={availableTags
            .filter((tag) => selectedTagIds.includes(tag._id))
            .map((t) => ({ id: t._id, name: t.name }))}
          onChange={(tags) => setSelectedTagIds(tags.map((t) => t.id))}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className="bg-crimson hover:bg-crimson-light text-white h-10 px-8 disabled:bg-white/5 disabled:text-slate-body disabled:border disabled:border-white/10"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t("saveChanges") || "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export function BlogPostEditClient({ post }: BlogPostEditClientProps) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

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
                  <BackArrow className="h-4 w-4" />
                </Link>
                <div className="h-px w-8 bg-crimson" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                  {t("adminPanel")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
                {t("editPost") || "Edit Blog Post"}
              </h1>
              <p className="text-slate-body mt-1 text-sm">
                {t("editPostDescription") || "Update your blog article details"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
              >
                <Link href="/admin/blog">
                  {t("cancel") || "Cancel"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="max-w-5xl"
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="glass-strong border border-white/[0.06] p-1 w-full sm:w-auto inline-flex h-auto gap-1">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite px-4 py-2 rounded-lg text-sm transition-all"
            >
              <Hash className="h-4 w-4 me-2" />
              {t("basicInformation") || "Basic Info"}
            </TabsTrigger>
            <TabsTrigger
              value="relations"
              className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite px-4 py-2 rounded-lg text-sm transition-all"
            >
              <Link2 className="h-4 w-4 me-2" />
              {t("relations") || "Relations"}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="basic" className="mt-0">
              <TabBasicInfo post={post} />
            </TabsContent>
            <TabsContent value="relations" className="mt-0">
              <TabRelations post={post} />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}
