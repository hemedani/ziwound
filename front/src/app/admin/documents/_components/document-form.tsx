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
import { useToast } from "@/components/ui/use-toast";
import { FileUploadField } from "@/components/form/file-upload-field";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  documentFiles: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DocumentFormProps {
  initialData?: {
    _id: string;
    title: string;
    description?: string;
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
            documentFiles: filesToAdd.length > 0 ? filesToAdd : undefined,
            removeDocumentFiles: filesToRemove.length > 0 ? filesToRemove : undefined,
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
          documentFiles: data.documentFiles,
        });

        if (!addRes.success) {
          throw new Error(addRes.error || addRes.body?.message || "Failed to add document");
        }

        toast({
          title: tCommon("success"),
          description: t("documentAdded") || "Document added successfully",
        });
      }

      router.push("/admin/documents");
      router.refresh();
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
