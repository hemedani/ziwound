"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { remove } from "@/app/actions/heroSlide/remove";
import { useToast } from "@/components/ui/use-toast";
import { heroSlideSchema } from "@/types/declarations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditSlideDialog } from "./edit-slide-dialog";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";

export function HeroSlidesTable({ slides, error }: { slides: heroSlideSchema[]; error?: string | null }) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingSlide, setEditingSlide] = useState<heroSlideSchema | null>(null);
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

  const deleteSlideAction = async (id: string) => {
    if (!confirm(t("deleteSlideConfirm") || "Are you sure you want to delete this slide?")) return;

    try {
      const res = await remove({ _id: id });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("slideDeleted") || "Hero slide deleted successfully",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("failedToDeleteSlide") || "Failed to delete hero slide",
      });
    }
  };

  const handleEditClick = (slide: heroSlideSchema) => {
    setEditingSlide(slide);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-body w-16">{t("order") || "Order"}</TableHead>
              <TableHead className="text-slate-body">{t("image") || "Image"}</TableHead>
              <TableHead className="text-slate-body">{t("title")}</TableHead>
              <TableHead className="text-slate-body">{t("subtitle") || "Subtitle"}</TableHead>
              <TableHead className="text-slate-body">{t("status") || "Status"}</TableHead>
              <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 ? (
              <TableRow className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell colSpan={6} className="h-24 text-center text-slate-body">
                  {t("noSlides") || "No hero slides found"}
                </TableCell>
              </TableRow>
            ) : (
              slides.map((slide: heroSlideSchema) => (
                <TableRow key={slide._id} className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell className="font-medium text-offwhite">{slide.order}</TableCell>
                  <TableCell>
                    {slide.image?.name ? (
                      <div className="relative h-12 w-20 rounded-md overflow-hidden">
                        <Image
                          src={getImageUploadUrl(slide.image.name)}
                          alt={slide.title}
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-12 w-20 rounded-md"
                        style={{ background: slide.gradient || "#0a0a0a" }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-offwhite max-w-xs truncate">{slide.title}</TableCell>
                  <TableCell className="max-w-xs truncate text-slate-body">{slide.subtitle}</TableCell>
                  <TableCell>
                    {slide.isActive ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {t("active") || "Active"}
                      </Badge>
                    ) : (
                      <Badge className="bg-white/10 text-slate-body border-white/10">
                        {t("inactive") || "Inactive"}
                      </Badge>
                    )}
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
                        <DropdownMenuItem className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer" onClick={() => handleEditClick(slide)}>
                          <Pencil className="me-2 h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                          onClick={() => deleteSlideAction(slide._id!)}
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

      <EditSlideDialog slide={editingSlide} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </div>
  );
}
