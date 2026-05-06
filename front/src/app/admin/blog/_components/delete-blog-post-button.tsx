"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { remove } from "@/app/actions/blogPost/remove";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function DeleteBlogPostMenuItem({ id }: { id: string }) {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(tCommon("confirmDelete") || "Are you sure you want to delete this?")) {
      return;
    }

    startTransition(async () => {
      const result = await remove({ _id: id });

      if (result.success) {
        toast({
          title: tCommon("success"),
          description: t("blogPostDeleted") || "Blog post deleted successfully",
        });
        router.refresh();
      } else {
        toast({
          title: tCommon("error"),
          description: result.error || result.body?.message || "Failed to delete blog post",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <DropdownMenuItem
      className="text-crimson-light focus:bg-white/10 focus:text-offwhite cursor-pointer"
      onSelect={(e) => {
        e.preventDefault();
        handleDelete();
      }}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
      {tCommon("delete") || "Delete"}
    </DropdownMenuItem>
  );
}
