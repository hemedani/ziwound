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
import { WarCriminalForm, WarCriminalFormValues } from "./war-criminal-form";
import { add } from "@/app/actions/warCriminal/add";
import { updateRelations } from "@/app/actions/warCriminal/updateRelations";

export function AddWarCriminalDialog() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: WarCriminalFormValues) => {
    try {
      const aliases = data.aliases ? data.aliases.split(",").map((a) => a.trim()).filter(Boolean) : [];
      const nationality = data.nationality ? data.nationality.split(",").map((n) => n.trim()).filter(Boolean) : [];

      const knownFor: Record<string, string> = {};
      if (data.knownFor?.en) knownFor.en = data.knownFor.en;
      if (data.knownFor?.fa) knownFor.fa = data.knownFor.fa;
      if (data.knownFor?.ar) knownFor.ar = data.knownFor.ar;

      const biography: Record<string, string> = {};
      if (data.biography?.en) biography.en = data.biography.en;
      if (data.biography?.fa) biography.fa = data.biography.fa;
      if (data.biography?.ar) biography.ar = data.biography.ar;

      const description: Record<string, string> = {};
      if (data.description?.en) description.en = data.description.en;
      if (data.description?.fa) description.fa = data.description.fa;
      if (data.description?.ar) description.ar = data.description.ar;

      const convictionDetails: Record<string, string> = {};
      if (data.convictionDetails?.en) convictionDetails.en = data.convictionDetails.en;
      if (data.convictionDetails?.fa) convictionDetails.fa = data.convictionDetails.fa;
      if (data.convictionDetails?.ar) convictionDetails.ar = data.convictionDetails.ar;

      const res = await add(
        {
          fullName: data.fullName,
          aliases: aliases.length > 0 ? aliases : undefined,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          nationality: nationality.length > 0 ? nationality : undefined,
          affiliation: data.affiliation,
          rankOrPosition: data.rankOrPosition,
          knownFor: Object.keys(knownFor).length > 0 ? knownFor : undefined,
          biography: Object.keys(biography).length > 0 ? biography : undefined,
          description: Object.keys(description).length > 0 ? description : undefined,
          status: data.status,
          convictionDetails: Object.keys(convictionDetails).length > 0 ? convictionDetails : undefined,
          isEntity: data.isEntity,
        },
        { _id: 1, fullName: 1 },
      );

      if (res?.success) {
        const warCriminalId = res.body?._id;
        if (warCriminalId && (data.photoId)) {
          await updateRelations(
            {
              _id: warCriminalId,
              photoId: data.photoId,
            },
            { _id: 1 },
          );
        }

        toast({
          title: t("success") || "Success",
          description: t("warCriminalCreated") || "War criminal has been created successfully.",
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description: res?.error || res?.body?.message || t("failedToCreateWarCriminal") || "Failed to create war criminal.",
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
          {t("addWarCriminal") || "Add War Criminal"}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong border-white/10 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-offwhite">{t("addWarCriminal") || "Add War Criminal"}</DialogTitle>
          <DialogDescription className="text-slate-body">
            {t("addWarCriminalDescription") || "Create a new war criminal record"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <WarCriminalForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
