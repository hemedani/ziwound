"use client";

import { useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { remove } from "@/app/actions/city/remove";
import { useToast } from "@/components/ui/use-toast";
import { citySchema } from "@/types/declarations";
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

interface CitiesTableProps {
  cities: (citySchema & { province?: { _id?: string } })[];
  provinces: Array<{ _id: string; name: string; english_name: string }>;
  error?: string | null;
}

export function CitiesTable({ cities, provinces, error }: CitiesTableProps) {
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

  const deleteCityAction = async (id: string) => {
    if (!confirm(t("deleteCityConfirm") || "Are you sure you want to delete this city?")) return;

    try {
      const res = await remove({ _id: id }, { success: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("cityDeleted") || "City deleted successfully",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("failedToDeleteCity") || "Failed to delete city",
      });
    }
  };

  const getProvinceName = (provinceId: string | undefined) => {
    if (!provinceId) return "Unknown";
    const province = provinces.find(p => p._id === provinceId);
    return province ? `${province.name} (${province.english_name})` : "Unknown";
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name") || "Name (Local)"}</TableHead>
            <TableHead>{t("englishName") || "Name (English)"}</TableHead>
            <TableHead>{t("province") || "Province"}</TableHead>
            <TableHead className="text-end pe-4">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {t("noCities") || "No cities found"}
              </TableCell>
            </TableRow>
          ) : (
            cities.map((city) => (
              <TableRow key={city._id}>
                <TableCell className="font-medium">{city.name}</TableCell>
                <TableCell>{city.english_name}</TableCell>
                <TableCell>{getProvinceName(city.province?._id)}</TableCell>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/cities/${city._id}/edit`}>
                          <Pencil className="me-2 h-4 w-4" />
                          {t("edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteCityAction(city._id!)}
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
