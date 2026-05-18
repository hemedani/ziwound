"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { remove } from "@/app/actions/warCriminal/remove";
import { useToast } from "@/components/ui/use-toast";
import { warCriminalSchema } from "@/types/declarations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Pencil, Eye, Building2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditWarCriminalDialog } from "./edit-war-criminal-dialog";
import Link from "next/link";

const statusColors: Record<string, string> = {
  Accused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Indicted: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Convicted: "bg-red-500/20 text-red-400 border-red-500/30",
  "At Large": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Deceased: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Unknown: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Sanctioned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusTranslationKeys: Record<string, string> = {
  Accused: "Accused",
  Indicted: "Indicted",
  Convicted: "Convicted",
  "At Large": "atLarge",
  Deceased: "Deceased",
  Sanctioned: "Sanctioned",
};

const affiliationTranslationKeys: Record<string, string> = {
  Military: "Military",
  Paramilitary: "Paramilitary",
  Government: "Government",
  "Rebel Group": "rebelGroup",
  "Private Military Company": "privateMilitaryCompany",
  Political: "Political",
  Other: "Other",
};

const affiliationColors: Record<string, string> = {
  Military: "bg-blue-500/20 text-blue-400",
  Paramilitary: "bg-indigo-500/20 text-indigo-400",
  Government: "bg-emerald-500/20 text-emerald-400",
  "Rebel Group": "bg-red-500/20 text-red-400",
  "Private Military Company": "bg-amber-500/20 text-amber-400",
  Political: "bg-violet-500/20 text-violet-400",
  Other: "bg-slate-500/20 text-slate-400",
};

export function WarCriminalsTable({ warCriminals, error }: { warCriminals: warCriminalSchema[]; error?: string | null }) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingWarCriminal, setEditingWarCriminal] = useState<warCriminalSchema | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: error,
      });
    }
  }, [error, toast, t]);

  const deleteWarCriminalAction = async (id: string) => {
    if (!confirm(t("deleteWarCriminalConfirm") || "Are you sure you want to delete this war criminal?")) return;

    try {
      const res = await remove({ _id: id }, { _id: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("warCriminalDeleted") || "War criminal deleted successfully",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("failedToDeleteWarCriminal") || "Failed to delete war criminal",
      });
    }
  };

  const handleEditClick = (warCriminal: warCriminalSchema) => {
    setEditingWarCriminal(warCriminal);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-body">{t("fullName") || "Full Name"}</TableHead>
              <TableHead className="text-slate-body">{t("aliases") || "Aliases"}</TableHead>
              <TableHead className="text-slate-body">{t("affiliation") || "Affiliation"}</TableHead>
              <TableHead className="text-slate-body">{t("status") || "Status"}</TableHead>
              <TableHead className="text-slate-body">{t("type") || "Type"}</TableHead>
              <TableHead className="text-slate-body">{t("createdAt") || "Created At"}</TableHead>
              <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warCriminals.length === 0 ? (
              <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell colSpan={7} className="h-24 text-center text-slate-body">
                  {t("noWarCriminals") || "No war criminals found"}
                </TableCell>
              </TableRow>
            ) : (
              warCriminals.map((wc: warCriminalSchema) => (
                <TableRow key={wc._id} className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell className="font-medium text-offwhite">{wc.fullName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {wc.aliases && wc.aliases.length > 0 ? (
                        wc.aliases.slice(0, 2).map((alias, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-white/10 text-slate-body">
                            {alias}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-slate-body">-</span>
                      )}
                      {wc.aliases && wc.aliases.length > 2 && (
                        <Badge variant="outline" className="text-xs border-white/10 text-slate-body">
                          +{wc.aliases.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {wc.affiliation ? (
                      <Badge className={affiliationColors[wc.affiliation] || "bg-slate-500/20 text-slate-400"}>
                        {t(affiliationTranslationKeys[wc.affiliation] || wc.affiliation)}
                      </Badge>
                    ) : (
                      <span className="text-slate-body">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[wc.status] || "bg-slate-500/20 text-slate-400"}>
                      {t(statusTranslationKeys[wc.status] || wc.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-body">
                      {wc.isEntity ? (
                        <Building2 className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs">{wc.isEntity ? t("organization") || "Organization" : t("individual") || "Individual"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-body">
                    {wc.createdAt ? new Date(wc.createdAt).toLocaleDateString() : "-"}
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
                          <Link href={`/admin/war-criminals/${wc._id}`}>
                            <Eye className="me-2 h-4 w-4" />
                            {t("view") || "View"}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer" onClick={() => handleEditClick(warCriminals.find(w => w._id === wc._id)!)}>
                          <Pencil className="me-2 h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                          onClick={() => deleteWarCriminalAction(wc._id!)}
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

      <EditWarCriminalDialog warCriminal={editingWarCriminal} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </div>
  );
}
