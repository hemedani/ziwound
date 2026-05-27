import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/file/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { AdminFilesClient } from "./_components/admin-files-client";
import { ReqType, fileSchema } from "@/types/declarations";

interface SearchParams {
  page?: string;
  search?: string;
  type?: string;
}

export default async function AdminFilesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const typeFilter = resolvedSearchParams.type as string | undefined;

  const setQuery: ReqType["main"]["file"]["gets"]["set"] = { page, limit: 20 };
  if (search) setQuery.search = search;
  if (typeFilter && typeFilter !== "all") {
    setQuery.type = typeFilter as "image" | "video" | "docs";
  }

  const response = await gets(setQuery, {
    _id: 1,
    name: 1,
    mimeType: 1,
    type: 1,
    size: 1,
    alt_text: 1,
    createdAt: 1,
    uploader: {
      _id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
    },
  });

  let files: fileSchema[] = [];
  let error: string | null = null;
  if (response?.success) {
    files = response.body || [];
  } else {
    error = response?.error || response?.body?.message || "Failed to fetch files";
  }

  // Compute file type stats from the fetched batch
  const fileTypeStats = [
    { type: "image", count: files.filter((f) => f.type === "image").length, totalSize: files.filter((f) => f.type === "image").reduce((s, f) => s + (f.size || 0), 0) },
    { type: "video", count: files.filter((f) => f.type === "video").length, totalSize: files.filter((f) => f.type === "video").reduce((s, f) => s + (f.size || 0), 0) },
    { type: "docs", count: files.filter((f) => f.type === "docs").length, totalSize: files.filter((f) => f.type === "docs").reduce((s, f) => s + (f.size || 0), 0) },
  ];

  const queryString = `${search ? `&search=${search}` : ""}${typeFilter && typeFilter !== "all" ? `&type=${typeFilter}` : ""}`;
  const prevPageUrl = page > 1 ? `/admin/files?page=${page - 1}${queryString}` : "";
  const nextPageUrl = files.length >= 20 ? `/admin/files?page=${page + 1}${queryString}` : "";

  return (
    <div className="p-6 md:p-8 space-y-6">
      <form method="GET" className="flex flex-wrap gap-3 w-full items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder={t("searchFiles") || "Search files..."}
            defaultValue={search}
            className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select name="type" defaultValue={typeFilter || "all"}>
            <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
              <SelectValue placeholder={t("allTypes") || "All Types"} />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="all">{t("allTypes") || "All Types"}</SelectItem>
              <SelectItem value="image">{t("images") || "Images"}</SelectItem>
              <SelectItem value="video">{t("videos") || "Videos"}</SelectItem>
              <SelectItem value="docs">{t("documents") || "Documents"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
          {t("filter") || "Filter"}
        </Button>
        {search || (typeFilter && typeFilter !== "all") ? (
          <Button variant="outline" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
            <Link href="/admin/files">{t("clear") || "Clear"}</Link>
          </Button>
        ) : null}
      </form>

      <AdminFilesClient
        files={files}
        totalCount={files.length}
        error={error}
        fileTypeStats={fileTypeStats}
        search={search}
        prevPageUrl={prevPageUrl}
        nextPageUrl={nextPageUrl}
      />
    </div>
  );
}
