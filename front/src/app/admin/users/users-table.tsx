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
        return <Badge variant="destructive">{t("level_Ghost") || "Ghost"}</Badge>;
      case "Manager":
        return <Badge variant="default">{t("level_Manager") || "Manager"}</Badge>;
      case "Editor":
        return <Badge variant="secondary">{t("level_Editor") || "Editor"}</Badge>;
      case "Ordinary":
      default:
        return <Badge variant="outline">{t("level_Ordinary") || "Ordinary"}</Badge>;
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
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email") || "Email"}</TableHead>
              <TableHead>{t("level")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead className="text-end pe-4">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noUsers") || "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: userSchema) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getLevelBadge(user.level)}</TableCell>
                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-end pe-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="me-2 h-4 w-4" />
                          {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Shield className="me-2 h-4 w-4" />
                          {t("editRole") || "Edit Role"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Ban className="me-2 h-4 w-4" />
                          {t("deactivate") || "Deactivate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
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
