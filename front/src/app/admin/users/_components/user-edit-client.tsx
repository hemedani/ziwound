"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UserForm, UserFormSubmitData } from "./user-form";
import { useToast } from "@/components/ui/use-toast";
import { updateUser } from "@/app/actions/user/updateUser";
import { userSchema } from "@/types/declarations";

export function UserEditClient({ user }: { user: userSchema }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: UserFormSubmitData) => {
    const LANG_CODES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"];

    const buildLocalized = (values: Record<string, string> | undefined) => {
      if (!values) return undefined;
      const obj: Record<string, string> = {};
      for (const lang of LANG_CODES) {
        const val = values[lang];
        if (val?.trim()) obj[lang] = val;
      }
      return Object.keys(obj).length > 0 ? obj : undefined;
    };

    try {
      const updatePayload: Record<string, unknown> = {
        _id: user._id!,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        gender: data.gender,
        level: data.level,
        address: data.address || undefined,
        bio: buildLocalized(data.bio as Record<string, string>),
        expertise: data.expertise && data.expertise.length > 0 ? data.expertise : undefined,
        verified: data.verified,
        verificationBadge: data.verificationBadge || undefined,
        isPublic: data.isPublic,
        is_verified: data.is_verified,
      };

      if (data.password && data.password.trim()) {
        updatePayload.password = data.password;
      }

      const res = await updateUser(
        updatePayload as Parameters<typeof updateUser>[0],
        { _id: 1, first_name: 1, last_name: 1 },
      );

      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("userUpdated") || "User has been updated successfully.",
        });
        router.push("/admin/users");
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description:
            res?.body?.message || res?.error || t("userUpdateFailed") || "Failed to update user.",
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

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/users"
              className="text-slate-body hover:text-offwhite transition-colors"
            >
              <BackArrow className="h-4 w-4" />
            </Link>
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("usersManagement") || "Users"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
            {t("editUser") || "Edit User"}
          </h1>
          <p className="text-slate-body mt-1 text-sm">
            {t("editUserDescription") || "Update user information and role"}
          </p>
        </div>
      </div>

      <UserForm
        initialData={user}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/users")}
        isEditing
      />
    </div>
  );
}
