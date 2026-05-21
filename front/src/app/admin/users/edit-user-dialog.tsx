"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { updateUser } from "@/app/actions/user/updateUser";
import { getUser } from "@/app/actions/user/getUser";
import { userSchema } from "@/types/declarations";
import { EditUserForm, EditUserFormValues } from "./edit-user-form";

const LANGUAGES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"] as const;

interface EditUserDialogProps {
  user: userSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [fullUser, setFullUser] = useState<userSchema | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user?._id) {
      setLoading(true);
      setFullUser(null);
      getUser(
        { _id: user._id },
        {
          _id: 1,
          first_name: 1,
          last_name: 1,
          email: 1,
          gender: 1,
          level: 1,
          address: 1,
          bio: 1,
          expertise: 1,
          verified: 1,
          verificationBadge: 1,
          isPublic: 1,
          is_verified: 1,
          avatar: { _id: 1, name: 1 },
        },
      ).then((res) => {
        if (res?.success && res.body) {
          setFullUser(res.body);
        } else {
          toast({
            variant: "destructive",
            title: t("error") || "Error",
            description: t("userFetchFailed") || "Failed to load user data.",
          });
        }
      }).finally(() => setLoading(false));
    } else {
      setFullUser(null);
    }
  }, [open, user?._id, toast, t]);

  const handleSubmit = async (data: EditUserFormValues) => {
    if (!user?._id) return;

    try {
      const buildLocalizedObject = (values: Record<string, string> | undefined) => {
        if (!values) return undefined;
        const obj: Record<string, string> = {};
        for (const lang of LANGUAGES) {
          const val = values[lang];
          if (val && val.trim()) {
            obj[lang] = val;
          }
        }
        return Object.keys(obj).length > 0 ? obj : undefined;
      };

      const res = await updateUser(
        {
          _id: user._id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          gender: data.gender,
          level: data.level,
          address: data.address || undefined,
          bio: buildLocalizedObject(data.bio),
          expertise: data.expertise && data.expertise.length > 0 ? data.expertise : undefined,
          verified: data.verified,
          verificationBadge: data.verificationBadge || undefined,
          isPublic: data.isPublic,
          is_verified: data.is_verified,
        },
        { _id: 1, first_name: 1, last_name: 1 },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("userUpdated") || "User has been updated successfully.",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description: res?.error || res?.body?.message || t("userUpdateFailed") || "Failed to update user.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-offwhite">{t("editUser") || "Edit User"}</DialogTitle>
          <DialogDescription className="text-slate-body">
            {t("editUserDescription") || "Update user information and role"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-crimson" />
            </div>
          ) : (
            <EditUserForm
              user={fullUser || user}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
