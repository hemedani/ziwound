import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/heroSlide/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { HeroSlidesTable } from "./hero-slides-table";
import { ReqType, heroSlideSchema } from "@/types/declarations";
import { AddSlideDialog } from "./add-slide-dialog";

export default async function AdminHeroSlidesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const sortBy = resolvedSearchParams.sortBy || "order";
  const sortOrder = resolvedSearchParams.sortOrder || "asc";

  const setQuery: ReqType["main"]["heroSlide"]["gets"]["set"] = {
    page,
    limit: 20,
    sortBy: sortBy as "order" | "createdAt" | "updatedAt",
    sortOrder: sortOrder as "asc" | "desc",
  };
  if (search) {
    setQuery.isActive = search;
  }

  const response = await gets(setQuery, {
    _id: 1,
    title: 1,
    subtitle: 1,
    gradient: 1,
    ctaText: 1,
    ctaLink: 1,
    secondaryCtaText: 1,
    secondaryCtaLink: 1,
    order: 1,
    isActive: 1,
    createdAt: 1,
    image: { _id: 1, name: 1, mimeType: 1, type: 1 },
  });

  let slides: heroSlideSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    slides = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch hero slides";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">
            {t("heroSlidesManagement") || "Hero Slides"}
          </h1>
          <p className="text-slate-body mt-1">
            {t("heroSlidesManagementDescription") || "Manage homepage hero slider content"}
          </p>
        </div>
        <AddSlideDialog />
      </div>

      <div className="rounded-2xl glass-light p-5 border border-white/[0.06]">
        <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder={t("searchSlides") || "Search slides..."}
              defaultValue={search}
              className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>
          <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
            {t("search") || "Search"}
          </Button>
        </form>
      </div>

      <HeroSlidesTable slides={slides} error={error} />

      <div className="flex items-center justify-end gap-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link
              href={`/admin/hero-slides?page=${page - 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {slides.length >= 20 ? (
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white" asChild>
            <Link
              href={`/admin/hero-slides?page=${page + 1}${search ? `&search=${search}` : ""}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
            >
              {t("next") || "Next"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("next") || "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
