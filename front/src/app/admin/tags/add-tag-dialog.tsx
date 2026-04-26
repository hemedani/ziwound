"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { TagForm, TagFormValues } from "./tag-form";
import { add } from "@/app/actions/tag/add";

export function AddTagDialog() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: TagFormValues) => {
    try {
      const res = await add({ ...data, description: data.description ?? "" }, { _id: 1, name: 1 });

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("tagCreated") || "Tag has been created successfully.",
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.error || res?.body?.message || t("failedToCreateTag") || "Failed to create tag.",
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="me-2 h-4 w-4" />
          {t("addTag") || "Add Tag"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addTag") || "Add Tag"}</DialogTitle>
          <DialogDescription>
            {t("addTagDescription") || "Create a new tag for reports"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TagForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
