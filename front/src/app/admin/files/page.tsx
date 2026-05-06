import { getTranslations } from "next-intl/server";
import { gets } from "@/app/actions/file/gets";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { FilesTable } from "./files-table";
import { ReqType, fileSchema } from "@/types/declarations";

export default async function AdminFilesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin");
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";
  const typeFilter = resolvedSearchParams.type as "image" | "video" | "doc" | "all" | undefined;

  const setQuery: ReqType["main"]["file"]["gets"]["set"] = { page, limit: 20 };
  if (search) {
    setQuery.search = search;
  }

  // Fetch files
  const response = await gets(setQuery, {
    _id: 1,
    name: 1,
    mimeType: 1, type: 1,
    size: 1,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel") || "Admin Panel"}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">
            {t("filesManagement") || "Files Management"}
          </h1>
          <p className="text-slate-body mt-1">
            {t("filesManagementDescription") || "View and manage uploaded files"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <form method="GET" className="flex flex-wrap gap-4 w-full items-start sm:items-center rounded-2xl glass-light p-5 border border-white/[0.06]">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-slate-body" />
            <Input
              name="search"
              placeholder={t("searchFiles") || "Search files..."}
              defaultValue={search}
              className="ps-8 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select name="type" defaultValue={typeFilter || "all"}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson">
                <SelectValue placeholder={t("allTypes") || "All Types"} />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="all">{t("allTypes") || "All Types"}</SelectItem>
                <SelectItem value="image">{t("images") || "Images"}</SelectItem>
                <SelectItem value="video">{t("videos") || "Videos"}</SelectItem>
                <SelectItem value="doc">{t("documents") || "Documents"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-crimson hover:bg-crimson-light text-white">
            {t("filter") || "Filter"}
          </Button>
        </form>
      </div>

      <FilesTable files={files} error={error} />

      <div className="flex items-center justify-end gap-2 py-4">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
            <Link
              href={`/admin/files?page=${page - 1}${search ? `&search=${search}` : ""}${typeFilter ? `&type=${typeFilter}` : ""}`}
            >
              {t("previous") || "Previous"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="border-white/10 bg-white/5 text-offwhite opacity-30">
            {t("previous") || "Previous"}
          </Button>
        )}
        {files.length >= 20 ? (
          <Button variant="outline" size="sm" asChild className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
            <Link
              href={`/admin/files?page=${page + 1}${search ? `&search=${search}` : ""}${typeFilter ? `&type=${typeFilter}` : ""}`}
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
