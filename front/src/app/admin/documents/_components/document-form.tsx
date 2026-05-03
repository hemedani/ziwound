"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { add as addDocument } from "@/app/actions/document/add";
import { update as updateDocument } from "@/app/actions/document/update";
import { updateRelations } from "@/app/actions/document/updateRelations";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FileUploadField } from "@/components/form/file-upload-field";
import { Loader2 } from "lucide-react";
import { ReqType } from "@/types/declarations";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  selected_language: z.string().optional(),
  documentFiles: z.array(z.string()).optional(),
});

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "pa", name: "Punjabi" },
  { code: "de", name: "German" },
  { code: "id", name: "Indonesian" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "tr", name: "Turkish" },
  { code: "ta", name: "Tamil" },
  { code: "vi", name: "Vietnamese" },
  { code: "ko", name: "Korean" },
  { code: "it", name: "Italian" },
  { code: "fa", name: "Persian" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "pl", name: "Polish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ro", name: "Romanian" },
];

type FormValues = z.infer<typeof formSchema>;

interface DocumentFormProps {
  initialData?: {
    _id: string;
    title: string;
    description?: string;
    selected_language?: string;
    documentFiles?: Array<{ _id: string; name?: string }>;
  };
}

export function DocumentForm({ initialData }: DocumentFormProps) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      selected_language: initialData?.selected_language || "",
      documentFiles: initialData?.documentFiles?.map((f) => f._id) || [],
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      if (isEditing && initialData) {
        // Update document
        const updateRes = await updateDocument({
          _id: initialData._id,
          title: data.title,
          description: data.description,
          selected_language: data.selected_language as ReqType["main"]["document"]["add"]["set"]["selected_language"],
        });

        if (!updateRes.success) {
          throw new Error(updateRes.error || updateRes.body?.message || "Failed to update document");
        }

        // Update relations if files changed
        const currentFiles = initialData.documentFiles?.map((f) => f._id) || [];
        const newFiles = data.documentFiles || [];

        const filesToAdd = newFiles.filter((id) => !currentFiles.includes(id));
        const filesToRemove = currentFiles.filter((id) => !newFiles.includes(id));

        if (filesToAdd.length > 0 || filesToRemove.length > 0) {
          const relationRes = await updateRelations({
            _id: initialData._id,
            documentFileIds: filesToAdd.length > 0 ? filesToAdd : undefined,
            documentFileIdsToRemove: filesToRemove.length > 0 ? filesToRemove : undefined,
          });

          if (!relationRes.success) {
            throw new Error(
              relationRes.error || relationRes.body?.message || "Failed to update document files",
            );
          }
        }

        toast({
          title: tCommon("success"),
          description: t("documentUpdated") || "Document updated successfully",
        });
      } else {
        // Add new document
        const addRes = await addDocument({
          title: data.title,
          description: data.description,
          selected_language: data.selected_language as ReqType["main"]["document"]["add"]["set"]["selected_language"],
          documentFileIds: data.documentFiles,
        });

        if (!addRes.success) {
          throw new Error(addRes.error || addRes.body?.message || "Failed to add document");
        }

        toast({
          title: tCommon("success"),
          description: t("documentAdded") || "Document added successfully",
        });
      }

      router.refresh();
      router.push("/admin/documents");
    } catch (error) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("titlePlaceholder") || "Enter document title"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selected_language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("language") || "Language"}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("languagePlaceholder") || "Select a language"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {languages.map((lang) => (
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description") || "Description"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("descriptionPlaceholder") || "Enter document description"}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentFiles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("files") || "Files"}</FormLabel>
              <FormControl>
                <FileUploadField
                  label={t("files") || "Files"}
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? tCommon("save") : tCommon("create")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/documents")}
            disabled={isLoading}
          >
            {tCommon("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
