"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { AddUserForm, AddUserFormValues } from "./add-user-form";
import { addUser } from "@/app/actions/user/addUser";

export function AddUserModal() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: AddUserFormValues) => {
    try {
      const expertise = data.expertise && data.expertise.length > 0 ? data.expertise : undefined;

      const LANGUAGES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"] as const;

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

      const res = await addUser(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          gender: data.gender,
          level: data.level,
          address: data.address || undefined,
          bio: buildLocalizedObject(data.bio),
          expertise: expertise,
          verified: data.verified,
          verificationBadge: data.verificationBadge || undefined,
          isPublic: data.isPublic,
          is_verified: data.is_verified,
          ...(data.avatar ? { avatar: data.avatar } : {}),
        },
        { _id: 1, first_name: 1, last_name: 1 },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("userAdded") || "User has been created successfully.",
        });
        setOpen(false);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description: res?.error || res?.body?.message || t("userAddFailed") || "Failed to create user.",
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError") || "An unexpected error occurred.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="me-2 h-4 w-4" />
          {t("addUser") || "Add User"}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-offwhite">{t("addUser") || "Add New User"}</DialogTitle>
          <DialogDescription className="text-slate-body">
            {t("addUserDescription") || "Create a new user account with roles and permissions"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddUserForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
