"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { userSchema } from "@/types/declarations";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Pencil, ImageUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getLevelStyles(level: string) {
  switch (level) {
    case "Ghost": return "bg-crimson/15 text-crimson-light border-crimson/20";
    case "Manager": return "bg-gold/15 text-gold border-gold/20";
    case "Editor": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Reporter": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Artist": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Diplomat": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Researcher": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    default: return "bg-white/5 text-slate-body border-white/10";
  }
}

function LevelBadge({ level }: { level: string }) {
  const t = useTranslations("admin");
  const styles = getLevelStyles(level);
  const labelKey = level === "Reporter" || level === "Artist" || level === "Diplomat" || level === "Researcher"
    ? level
    : `level_${level}`;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${styles}`}>
      {t(labelKey) || level}
    </span>
  );
}

export function UsersTable({
  users,
  onDelete,
}: {
  users: userSchema[];
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("admin");

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center text-slate-body">
        {t("noUsers") || "No users found"}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/[0.06] hover:bg-transparent">
          <TableHead className="text-slate-body w-[48px]"></TableHead>
          <TableHead className="text-slate-body">{t("name")}</TableHead>
          <TableHead className="text-slate-body">{t("email") || "Email"}</TableHead>
          <TableHead className="text-slate-body">{t("level")}</TableHead>
          <TableHead className="text-slate-body hidden md:table-cell">{t("date")}</TableHead>
          <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id} className="border-white/[0.06] hover:bg-white/[0.02]">
            <TableCell>
              {user.avatar ? (
                <Image
                  src={getImageUploadUrl(user.avatar.name, "image")}
                  alt={`${user.first_name} ${user.last_name}`}
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-full object-cover h-10 w-10"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-body/50 text-sm font-medium">
                  {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium text-offwhite">
              {user.first_name} {user.last_name}
            </TableCell>
            <TableCell className="text-slate-body">{user.email}</TableCell>
            <TableCell><LevelBadge level={user.level} /></TableCell>
            <TableCell className="text-slate-body hidden md:table-cell">
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
                  <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                    <Link href={`/admin/users/${user._id}/edit`}>
                      <Pencil className="me-2 h-4 w-4" />
                      {t("edit")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                    <Link href={`/admin/users/${user._id}/update-relations`}>
                      <ImageUp className="me-2 h-4 w-4" />
                      {t("updateRelations") || "Update Relations"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                    onClick={() => onDelete(user._id!)}
                  >
                    <Trash2 className="me-2 h-4 w-4" />
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
