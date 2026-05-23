"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";
import { TagSelector } from "@/components/form/tag-selector";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { updateRelations } from "@/app/actions/blogPost/updateRelations";
import { gets as getTags } from "@/app/actions/tag/gets";
import { getImageUploadUrl } from "@/utils/imageUrl";

interface CoverImage {
  _id?: string;
  name?: string;
  mimeType?: string;
  type?: string;
  alt_text?: string;
}

interface BlogTag {
  _id?: string;
  name: string;
}

interface BlogPostRelationsFormProps {
  post: {
    _id: string;
    title: string;
    slug?: string;
    coverImage?: CoverImage;
    tags?: BlogTag[];
  };
}

export function BlogPostRelationsForm({ post }: BlogPostRelationsFormProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
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

  const hasExistingPhoto = !!post.coverImage?._id;
  const initialTagIds = post.tags?.map((tag) => tag._id).filter(Boolean) as string[] || [];

  const handleSave = async () => {
    if (!post._id) return;
    setIsLoading(true);

    try {
      const tagsToAdd = selectedTagIds.filter((id) => !initialTagIds.includes(id));
      const tagsToRemove = initialTagIds.filter((id) => !selectedTagIds.includes(id));
      const coverChanged = photoId !== (post.coverImage?._id || "");

      if (!coverChanged && tagsToAdd.length === 0 && tagsToRemove.length === 0) {
        toast({
          title: t("success") || "Success",
          description: t("relationsUpdated") || "Relations updated successfully.",
        });
        router.push("/admin/blog");
        return;
      }

      const payload: {
        _id: string;
        coverImage?: string;
        tags?: string[];
        removeTags?: string[];
      } = { _id: post._id };

      if (coverChanged) {
        payload.coverImage = photoId || undefined;
      }
      if (tagsToAdd.length > 0) {
        payload.tags = tagsToAdd;
      }
      if (tagsToRemove.length > 0) {
        payload.removeTags = tagsToRemove;
      }

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
        router.push("/admin/blog");
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
  };

  const handleRemovePhoto = () => {
    setPhotoId("");
  };

  const selectedTags = availableTags
    .filter((tag) => selectedTagIds.includes(tag._id))
    .map((t) => ({ id: t._id, name: t.name }));

  return (
    <div className="rounded-2xl glass-light p-6 border border-white/[0.06] space-y-8">
      {/* Cover Image Section */}
      <div>
        <h2 className="text-xl font-semibold text-offwhite mb-1">
          {t("coverImage") || "Cover Image"}
        </h2>
        <p className="text-sm text-slate-body mb-4">
          {t("coverImageDescription") || "Upload a cover image for the blog post"}
        </p>

        {hasExistingPhoto && (
          <div className="space-y-2 mb-4">
            <p className="text-sm text-slate-body">
              {t("currentPhoto") || "Current Photo"}
            </p>
            <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-white/[0.06]">
              <Image
                src={getImageUploadUrl(post.coverImage!.name || "", "image")}
                alt={post.coverImage?.alt_text || post.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <Tabs defaultValue={photoId ? "library" : "upload"}>
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
            <TabsTrigger value="library">{t("imageLibrary") || "Library"}</TabsTrigger>
            <TabsTrigger value="upload">{t("uploadNew") || "Upload"}</TabsTrigger>
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

        {photoId && photoId !== post.coverImage?._id && (
          <p className="text-xs text-amber-400 mt-2">
            {t("photoChanged") || "Photo has been changed."}
          </p>
        )}

        {photoId && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemovePhoto}
            disabled={isLoading}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 mt-3"
          >
            <Trash2 className="me-2 h-4 w-4" />
            {t("removePhoto") || "Remove Photo"}
          </Button>
        )}
      </div>

      {/* Tags Section */}
      <div className="border-t border-white/[0.06] pt-8">
        <h2 className="text-xl font-semibold text-offwhite mb-1">
          {t("tags") || "Tags"}
        </h2>
        <p className="text-sm text-slate-body mb-4">
          {t("manageTags") || "Add or remove tags from this blog post"}
        </p>

        <div className="max-w-md">
          <TagSelector
            label=""
            availableTags={availableTags.map((t) => ({ id: t._id, name: t.name }))}
            selectedTags={selectedTags}
            onChange={(tags) => setSelectedTagIds(tags.map((t) => t.id))}
          />
        </div>

        {JSON.stringify(selectedTagIds.sort()) !== JSON.stringify(initialTagIds.sort()) && (
          <p className="text-xs text-amber-400 mt-2">
            {t("tagsChanged") || "Tags have been changed."}
          </p>
        )}
      </div>

      {/* Single Save Button */}
      <div className="border-t border-white/[0.06] pt-6 flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-crimson hover:bg-crimson-light text-white"
        >
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {t("save") || "Save"}
        </Button>
      </div>
    </div>
  );
}
