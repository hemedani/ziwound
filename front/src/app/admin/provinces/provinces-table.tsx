"use client";

import { useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { remove } from "@/app/actions/province/remove";
import { useToast } from "@/components/ui/use-toast";
import { provinceSchema } from "@/types/declarations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProvincesTableProps {
  provinces: (provinceSchema & { country?: { _id?: string } })[];
  countries: Array<{ _id: string; name: string; english_name: string }>;
  error?: string | null;
}

export function ProvincesTable({ provinces, countries, error }: ProvincesTableProps) {
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

  const deleteProvinceAction = async (id: string) => {
    if (!confirm(t("deleteProvinceConfirm") || "Are you sure you want to delete this province?")) return;

    try {
      const res = await remove({ _id: id }, { success: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("provinceDeleted") || "Province deleted successfully",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("failedToDeleteProvince") || "Failed to delete province",
      });
    }
  };

  const getCountryName = (countryId: string | undefined) => {
    if (!countryId) return "Unknown";
    const country = countries.find(c => c._id === countryId);
    return country ? `${country.name} (${country.english_name})` : "Unknown";
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            <TableHead className="text-slate-body">{t("name") || "Name (Local)"}</TableHead>
            <TableHead className="text-slate-body">{t("englishName") || "Name (English)"}</TableHead>
            <TableHead className="text-slate-body">{t("country") || "Country"}</TableHead>
            <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {provinces.length === 0 ? (
            <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
              <TableCell colSpan={4} className="h-24 text-center text-slate-body">
                {t("noProvinces") || "No provinces found"}
              </TableCell>
            </TableRow>
          ) : (
            provinces.map((province) => (
              <TableRow key={province._id} className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell className="font-medium text-offwhite">{province.name}</TableCell>
                <TableCell className="text-slate-body">{province.english_name}</TableCell>
                <TableCell className="text-slate-body">{getCountryName(province.country?._id)}</TableCell>
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
                      <DropdownMenuItem className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer" asChild>
                        <Link href={`/admin/provinces/${province._id}/edit`}>
                          <Pencil className="me-2 h-4 w-4" />
                          {t("edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                        onClick={() => deleteProvinceAction(province._id!)}
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
  );
}
