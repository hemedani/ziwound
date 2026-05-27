"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { countrySchema } from "@/types/declarations";
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

export function CountriesTable({
  countries,
  onDelete,
}: {
  countries: countrySchema[];
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("admin");

  if (countries.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center text-slate-body">
        {t("noCountries") || "No countries found"}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/[0.06] hover:bg-transparent">
          <TableHead className="text-slate-body w-[60px]">{t("photo") || "Photo"}</TableHead>
          <TableHead className="text-slate-body">{t("name") || "Name (Local)"}</TableHead>
          <TableHead className="text-slate-body">{t("englishName") || "Name (English)"}</TableHead>
          <TableHead className="text-slate-body hidden md:table-cell">{t("provinces") || "Provinces"}</TableHead>
          <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {countries.map((country) => (
          <TableRow key={country._id} className="border-white/[0.06] hover:bg-white/[0.02]">
            <TableCell>
              {country.photo ? (
                <Image
                  src={getImageUploadUrl(country.photo.name, "image")}
                  alt={country.name}
                  width={48}
                  height={48}
                  unoptimized
                  className="rounded object-cover h-12 w-12"
                />
              ) : (
                <div className="h-12 w-12 rounded bg-white/5 flex items-center justify-center text-slate-body/30 text-xs">
                  -
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium text-offwhite">{country.name}</TableCell>
            <TableCell className="text-slate-body">{country.english_name}</TableCell>
            <TableCell className="text-slate-body hidden md:table-cell">
              {Array.isArray(country.provinces) ? country.provinces.length : 0}
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
                    <Link href={`/admin/countries/${country._id}/edit`}>
                      <Pencil className="me-2 h-4 w-4" />
                      {t("edit")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                    <Link href={`/admin/countries/${country._id}/update-relations`}>
                      <ImageUp className="me-2 h-4 w-4" />
                      {t("updateRelations") || "Update Relations"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                    onClick={() => onDelete(country._id!)}
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
