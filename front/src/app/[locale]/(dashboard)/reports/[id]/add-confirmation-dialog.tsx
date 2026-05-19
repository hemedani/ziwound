"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { FileUploadField } from "@/components/form/file-upload-field";
import { Loader2, Plus } from "lucide-react";
import { add as addConfirmation } from "@/app/actions/confirmation/add";
import { ReqType } from "@/types/declarations";

const languages = [
  { code: "fa", name: "Persian" },
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "zh", name: "Chinese" },
  { code: "pt", name: "Portuguese" },
  { code: "es", name: "Spanish" },
  { code: "nl", name: "Dutch" },
  { code: "tr", name: "Turkish" },
  { code: "ru", name: "Russian" },
];

const confirmationTypes = ["Diary", "Eyewitness", "OfficialStatement", "MediaNote", "Other"];

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.string(),
  selected_language: z.string(),
  supportingFileIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddConfirmationDialogProps {
  reportId: string;
  onAdded: () => void;
}

export function AddConfirmationDialog({ reportId, onAdded }: AddConfirmationDialogProps) {
  const t = useTranslations("confirmation");
  const tCommon = useTranslations("common");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      type: confirmationTypes[0],
      selected_language: "fa",
      supportingFileIds: [],
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const result = await addConfirmation({
        title: data.title,
        content: data.content,
        type: data.type as ReqType["main"]["confirmation"]["add"]["set"]["type"],
        selected_language: data.selected_language as ReqType["main"]["confirmation"]["add"]["set"]["selected_language"],
        reportId,
        supportingFileIds: data.supportingFileIds,
        isVerified: false,
      });

      if (!result.success) {
        throw new Error(result.error || result.body?.message || "Failed to add confirmation");
      }

      toast({
        title: tCommon("success"),
        description: t("addConfirmation") + " " + tCommon("success"),
      });

      setOpen(false);
      form.reset();
      onAdded();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-crimson hover:bg-crimson-light text-white gap-2">
          <Plus className="h-4 w-4" />
          {t("addConfirmation") || "Add Confirmation"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-strong border-white/10">
        <DialogHeader>
          <DialogTitle className="text-offwhite">{t("addConfirmation") || "Add Confirmation"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("titleLabel") || "Title"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("titleLabel") || "Enter title"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("typeLabel") || "Type"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                          <SelectValue placeholder={t("typeLabel") || "Select type"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-strong border-white/10">
                        {confirmationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`types.${type}`) || type}
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
                name="selected_language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCommon("language") || "Language"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                          <SelectValue placeholder={tCommon("language") || "Select language"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-strong border-white/10">
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
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contentLabel") || "Content"}</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ""}
                      onChange={(html) => field.onChange(html)}
                      placeholder={t("contentLabel") || "Enter content..."}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportingFileIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("supportingFiles") || "Supporting Files"}</FormLabel>
                  <FormControl>
                    <FileUploadField
                      label={t("supportingFiles") || "Supporting Files"}
                      value={field.value}
                      onChange={field.onChange}
                      maxFiles={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading} className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-crimson hover:bg-crimson-light text-white">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tCommon("submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
