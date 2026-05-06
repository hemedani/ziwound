"use client";

import { useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { removeUser } from "@/app/actions/user/removeUser";
import { useToast } from "@/components/ui/use-toast";
import { userSchema } from "@/types/declarations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Shield, Trash2, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UsersTable({ users, error }: { users: userSchema[]; error?: string | null }) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: error,
      });
    }
  }, [error, toast, t]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Ghost":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-crimson/15 text-crimson-light border border-crimson/20">
            {t("level_Ghost") || "Ghost"}
          </span>
        );
      case "Manager":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gold/15 text-gold border border-gold/20">
            {t("level_Manager") || "Manager"}
          </span>
        );
      case "Editor":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {t("level_Editor") || "Editor"}
          </span>
        );
      case "Ordinary":
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/5 text-slate-body border border-white/10">
            {t("level_Ordinary") || "Ordinary"}
          </span>
        );
    }
  };

  const deleteUserAction = async (id: string) => {
    if (!confirm(t("deleteConfirm") || "Are you sure you want to delete this user?")) return;

    try {
      const res = await removeUser({ _id: id }, { success: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: "User deleted successfully",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: "Failed to delete user",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-body">{t("name")}</TableHead>
              <TableHead className="text-slate-body">{t("email") || "Email"}</TableHead>
              <TableHead className="text-slate-body">{t("level")}</TableHead>
              <TableHead className="text-slate-body">{t("date")}</TableHead>
              <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow className="border-white/[0.06]">
                <TableCell colSpan={5} className="h-24 text-center text-slate-body">
                  {t("noUsers") || "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: userSchema) => (
                <TableRow key={user._id} className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell className="font-medium text-offwhite">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell className="text-slate-body">{user.email}</TableCell>
                  <TableCell>{getLevelBadge(user.level)}</TableCell>
                  <TableCell className="text-slate-body">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-end pe-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-body hover:text-offwhite hover:bg-white/5">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-strong border-white/10">
                        <DropdownMenuLabel className="text-slate-body">{t("actions")}</DropdownMenuLabel>
                        <DropdownMenuItem className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Eye className="me-2 h-4 w-4 text-gold" />
                          {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Shield className="me-2 h-4 w-4 text-blue-400" />
                          {t("editRole") || "Edit Role"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Ban className="me-2 h-4 w-4 text-amber-400" />
                          {t("deactivate") || "Deactivate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          className="text-crimson-light focus:bg-white/10 focus:text-crimson-light cursor-pointer"
                          onClick={() => deleteUserAction(user._id!)}
                          disabled={isPending}
                        >
                          <Trash2 className="me-2 h-4 w-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
