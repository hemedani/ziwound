"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { WarCriminalForm, WarCriminalFormValues } from "./war-criminal-form";
import { update } from "@/app/actions/warCriminal/update";
import { updateRelations } from "@/app/actions/warCriminal/updateRelations";
import { warCriminalSchema } from "@/types/declarations";

interface EditWarCriminalDialogProps {
  warCriminal: warCriminalSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWarCriminalDialog({ warCriminal, open, onOpenChange }: EditWarCriminalDialogProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: WarCriminalFormValues) => {
    if (!warCriminal?._id) return;

    try {
      const aliases = data.aliases ? data.aliases.split(",").map((a) => a.trim()).filter(Boolean) : undefined;
      const nationality = data.nationality ? data.nationality.split(",").map((n) => n.trim()).filter(Boolean) : undefined;

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

      const res = await update(
        {
          _id: warCriminal._id,
          fullName: data.fullName,
          ...(aliases !== undefined && aliases.length > 0 ? { aliases } : {}),
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          ...(nationality !== undefined && nationality.length > 0 ? { nationality } : {}),
          affiliation: data.affiliation,
          rankOrPosition: data.rankOrPosition,
          ...(Object.keys(knownFor).length > 0 ? { knownFor } : {}),
          ...(Object.keys(biography).length > 0 ? { biography } : {}),
          ...(Object.keys(description).length > 0 ? { description } : {}),
          status: data.status,
          ...(Object.keys(convictionDetails).length > 0 ? { convictionDetails } : {}),
          isEntity: data.isEntity,
        },
        { _id: 1, fullName: 1 },
      );

      if (res?.success) {
        if (data.photoId) {
          await updateRelations(
            {
              _id: warCriminal._id,
              photoId: data.photoId,
            },
            { _id: 1 },
          );
        }

        toast({
          title: t("success") || "Success",
          description: t("warCriminalUpdated") || "War criminal has been updated successfully.",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description: res?.error || res?.body?.message || t("failedToUpdateWarCriminal") || "Failed to update war criminal.",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-offwhite">{t("editWarCriminal") || "Edit War Criminal"}</DialogTitle>
          <DialogDescription className="text-slate-body">
            {t("editWarCriminalDescription") || "Update the details of this war criminal"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {warCriminal && (
            <WarCriminalForm
              initialData={{
                ...warCriminal,
                photoId: (warCriminal.photo as { _id?: string } | undefined)?._id,
              }}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              isEditing
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
