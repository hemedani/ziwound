"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  ListFilter,
  SlidersHorizontal,
  X,
  LayoutGrid,
  Table as TableIcon,
  Download,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Calendar,
  FileText,
  FileArchive,
  Globe,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { remove } from "@/app/actions/document/remove";
import { DocumentQuickStats } from "./_components/document-quick-stats";
import { DocumentAdminCard } from "./_components/document-admin-card";
import { DocumentsDataTable } from "./_components/documents-data-table";
import { ConfirmDeleteDialog } from "./_components/confirm-delete-dialog";

const LIMIT = 12;

const languageOptions = [
  { value: "en", label: "English" },
  { value: "fa", label: "Persian (فارسی)" },
  { value: "ar", label: "Arabic (العربية)" },
  { value: "zh", label: "Chinese (中文)" },
  { value: "pt", label: "Portuguese" },
  { value: "es", label: "Spanish" },
  { value: "nl", label: "Dutch" },
  { value: "tr", label: "Turkish" },
  { value: "ru", label: "Russian" },
];

const typeOptions = [
  { value: "all", labelKey: "allTypes" },
  { value: "image", labelKey: "documentTypeImage" },
  { value: "video", labelKey: "documentTypeVideo" },
  { value: "docs", labelKey: "documentTypeDocument" },
];

interface DocumentFile {
  _id?: string;
  name: string;
  mimeType: string;
  type: "image" | "video" | "docs";
}

interface LinkedReport {
  _id?: string;
  title: string;
}

interface DocumentItem {
  _id?: string;
  title: string;
  description?: string;
  selected_language?: string;
  createdAt?: string;
  documentFiles?: DocumentFile[];
  report?: LinkedReport[];
}

interface ReportOption {
  _id: string;
  title: string;
}

interface CurrentParams {
  page: number;
  search: string;
  type: string;
  report: string;
  selected_language: string;
  createdAtFrom: string;
  createdAtTo: string;
  sortBy: string;
  sortOrder: string;
}

interface TypeCounts {
  images: number;
  videos: number;
  documents: number;
}

interface AdminDocumentsClientProps {
  documents: DocumentItem[];
  reports: ReportOption[];
  totalCount: number;
  typeCounts: TypeCounts;
  error: string | null;
  currentParams: CurrentParams;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-crimson/10 px-2.5 py-1 text-[11px] font-medium text-crimson-light border border-crimson/20">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-crimson/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function BulkActionBar({
  count,
  onDelete,
  onClear,
  isPending,
}: {
  count: number;
  onDelete: () => void;
  onClear: () => void;
  isPending: boolean;
}) {
  const t = useTranslations("admin");
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 rounded-xl glass-strong border border-crimson/20 p-3"
    >
      <span className="text-sm font-medium text-offwhite tabular-nums ms-1">
        {count} {t("selected") || "selected"}
      </span>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="text-slate-body hover:text-offwhite h-8 px-2"
      >
        <X className="h-3.5 w-3.5 me-1" />
        {t("clear") || "Clear"}
      </Button>
      <Button
        size="sm"
        onClick={onDelete}
        disabled={isPending}
        className="bg-crimson hover:bg-crimson-light text-white h-8 px-3"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin me-1" />
        ) : (
          <Trash2 className="h-3.5 w-3.5 me-1" />
        )}
        {t("delete")}
      </Button>
    </motion.div>
  );
}

export function AdminDocumentsClient({
  documents,
  reports,
  totalCount,
  typeCounts,
  error: initialError,
  currentParams: params,
}: AdminDocumentsClientProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchVal, setSearchVal] = useState(params.search);
  const [createdAtFromVal, setCreatedAtFromVal] = useState(params.createdAtFrom);
  const [createdAtToVal, setCreatedAtToVal] = useState(params.createdAtTo);

  const hasActiveFilters =
    params.search !== "" ||
    params.type !== "all" ||
    params.report !== "all" ||
    params.selected_language !== "all" ||
    params.createdAtFrom !== "" ||
    params.createdAtTo !== "";

  const buildHref = (overrides: Partial<CurrentParams>) => {
    const merged = { ...params, ...overrides };
    const sp = new URLSearchParams();
    if (merged.page > 1) sp.set("page", String(merged.page));
    if (merged.search) sp.set("search", merged.search);
    if (merged.type !== "all") sp.set("type", merged.type);
    if (merged.report !== "all") sp.set("report", merged.report);
    if (merged.selected_language !== "all")
      sp.set("selected_language", merged.selected_language);
    if (merged.createdAtFrom) sp.set("createdAtFrom", merged.createdAtFrom);
    if (merged.createdAtTo) sp.set("createdAtTo", merged.createdAtTo);
    if (merged.sortBy !== "createdAt") sp.set("sortBy", merged.sortBy);
    if (merged.sortOrder !== "desc") sp.set("sortOrder", merged.sortOrder);
    const qs = sp.toString();
    return `/admin/documents${qs ? `?${qs}` : ""}`;
  };

  const navigate = useCallback(
    (overrides: Partial<CurrentParams>) => {
      router.push(buildHref(overrides));
    },
    [params, router],
  );

  const handleSearch = useCallback(
    (formData: FormData) => {
      const val = (formData.get("search") as string) || "";
      navigate({ search: val, page: 1 });
    },
    [navigate],
  );

  const handleSheetSubmit = useCallback(
    (formData: FormData) => {
      const overrides: Partial<CurrentParams> = {
        page: 1,
        search: params.search,
        type: (formData.get("type") as string) || "all",
        report: (formData.get("report") as string) || "all",
        selected_language: (formData.get("selected_language") as string) || "all",
        sortBy: (formData.get("sortBy") as string) || "createdAt",
        sortOrder: (formData.get("sortOrder") as string) || "desc",
        createdAtFrom: createdAtFromVal,
        createdAtTo: createdAtToVal,
      };
      navigate(overrides);
    },
    [navigate, params.search, createdAtFromVal, createdAtToVal],
  );

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id],
    );
  };

  const handleDeleteClick = (id: string) => {
    setPendingDeleteIds([id]);
    setConfirmDeleteOpen(true);
  };

  const handleBulkDeleteClick = () => {
    setPendingDeleteIds(selectedIds);
    setConfirmDeleteOpen(true);
  };

  const executeDelete = async (ids: string[]) => {
    startTransition(async () => {
      try {
        for (const id of ids) {
          const res = await remove({ _id: id });
          if (!res.success) throw new Error(res.body?.message || "Delete failed");
        }
        toast({
          title: t("success"),
          description:
            ids.length > 1
              ? `${ids.length} ${t("documentsDeleted") || "documents deleted"}`
              : t("documentDeleted") || "Document deleted",
        });
        setSelectedIds([]);
        setConfirmDeleteOpen(false);
        router.refresh();
      } catch (err: unknown) {
        toast({
          variant: "destructive",
          title: t("error"),
          description:
            err instanceof Error ? err.message : "Some deletions failed",
        });
      }
    });
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Type", "Language", "Linked Report", "Files", "Created At"];
    const rows = documents.map((doc) => {
      const firstFile = (doc.documentFiles || [])[0];
      const type = firstFile?.type || "docs";
      const langCode = doc.selected_language || "";
      return [
        doc.title,
        type,
        langCode,
        doc.report?.[0]?.title || "",
        String((doc.documentFiles || []).length),
        doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `documents_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const getActiveFilterLabels = () => {
    const labels: { key: string; label: string; onRemove: () => void }[] = [];
    if (params.search) {
      labels.push({
        key: "search",
        label: `"${params.search}"`,
        onRemove: () => navigate({ search: "", page: 1 }),
      });
    }
    if (params.type !== "all") {
      const opt = typeOptions.find((o) => o.value === params.type);
      labels.push({
        key: "type",
        label: t(opt?.labelKey || "") || params.type,
        onRemove: () => navigate({ type: "all", page: 1 }),
      });
    }
    if (params.report !== "all") {
      const rep = reports.find((r) => r._id === params.report);
      labels.push({
        key: "report",
        label: rep?.title || params.report,
        onRemove: () => navigate({ report: "all", page: 1 }),
      });
    }
    if (params.selected_language !== "all") {
      const lang = languageOptions.find((l) => l.value === params.selected_language);
      labels.push({
        key: "language",
        label: lang?.label || params.selected_language,
        onRemove: () => navigate({ selected_language: "all", page: 1 }),
      });
    }
    return labels;
  };

  const filterLabels = getActiveFilterLabels();

  return (
    <motion.div
      className="space-y-6 p-6 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ============ HERO HEADER ============ */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,27,27,0.08)_0%,_transparent_60%)]" />
          <div className="absolute -top-20 -end-20 h-40 w-40 rounded-full bg-gradient-to-br from-crimson/[0.06] to-transparent blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-crimson" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                  {t("adminPanel")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
                {t("documentsManagement")}
              </h1>
              <p className="text-slate-body mt-1 text-sm">
                {t("documentsManagementDescription")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={documents.length === 0}
                className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
              >
                <Download className="h-4 w-4 me-1.5" />
                {t("exportCsv")}
              </Button>
              <Link href="/admin/documents/new">
                <Button className="bg-crimson hover:bg-crimson-light text-white h-9 shadow-sm shadow-crimon/20">
                  <Plus className="h-4 w-4 me-1.5" />
                  {t("addDocument")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============ STATS ROW ============ */}
      <motion.div variants={itemVariants}>
        <DocumentQuickStats totalCount={totalCount} typeCounts={typeCounts} />
      </motion.div>

      {/* ============ SEARCH + FILTER BAR ============ */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(new FormData(e.currentTarget));
            }}
            className="relative flex-1 w-full"
          >
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-body/60" />
            <Input
              name="search"
              defaultValue={params.search}
              placeholder={t("searchPlaceholder") || "Search documents..."}
              className="ps-9 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/40 focus-visible:ring-crimson h-9 text-sm"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className={`border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10 h-9 ${
                    hasActiveFilters ? "ring-1 ring-crimson" : ""
                  }`}
                >
                  <ListFilter className="h-4 w-4 me-1.5" />
                  {t("filters") || "Filters"}
                  {hasActiveFilters && (
                    <span className="ms-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-crimson text-[10px] font-bold text-white">
                      !
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:max-w-md glass-strong border-white/10 overflow-y-auto"
              >
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-offwhite flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-gold" />
                    {t("filters") || "Filters"}
                  </SheetTitle>
                  <SheetDescription className="text-slate-body">
                    {t("applyFilters") || "Refine the documents list"}
                  </SheetDescription>
                </SheetHeader>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSheetSubmit(new FormData(e.currentTarget));
                  }}
                  className="space-y-5"
                >
                  {/* Type */}
                  <div>
                    <p className="text-xs font-semibold text-gold mb-3 flex items-center gap-1.5">
                      <FileText className="h-3 w-3" />
                      {t("type")}
                    </p>
                    <Select name="type" defaultValue={params.type}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/10">
                        {typeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {t(opt.labelKey) || opt.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div>
                    <p className="text-xs font-semibold text-gold mb-3 flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      {t("language") || "Language"}
                    </p>
                    <Select
                      name="selected_language"
                      defaultValue={params.selected_language}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/10">
                        <SelectItem value="all">
                          {t("allLanguages") || "All Languages"}
                        </SelectItem>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Linked Report */}
                  <div>
                    <p className="text-xs font-semibold text-gold mb-3 flex items-center gap-1.5">
                      <FileText className="h-3 w-3" />
                      {t("linkedReports") || "Linked Report"}
                    </p>
                    <Select name="report" defaultValue={params.report}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/10 max-h-60">
                        <SelectItem value="all">
                          {t("allReports") || "All Reports"}
                        </SelectItem>
                        {reports.map((rep) => (
                          <SelectItem key={rep._id} value={rep._id}>
                            {rep.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <p className="text-xs font-semibold text-gold mb-3 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {t("dateRange") || "Date Range"}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-body/60 mb-1 block">
                          {t("from") || "From"}
                        </label>
                        <Input
                          type="date"
                          value={createdAtFromVal}
                          onChange={(e) => setCreatedAtFromVal(e.target.value)}
                          className="bg-white/5 border-white/10 text-offwhite focus-visible:ring-crimson h-9"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-body/60 mb-1 block">
                          {t("to") || "To"}
                        </label>
                        <Input
                          type="date"
                          value={createdAtToVal}
                          onChange={(e) => setCreatedAtToVal(e.target.value)}
                          className="bg-white/5 border-white/10 text-offwhite focus-visible:ring-crimson h-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <p className="text-xs font-semibold text-gold mb-3">
                      {t("sortBy") || "Sort By"}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Select name="sortBy" defaultValue={params.sortBy}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-strong border-white/10">
                          <SelectItem value="createdAt">{t("date")}</SelectItem>
                          <SelectItem value="title">{t("title")}</SelectItem>
                          <SelectItem value="updatedAt">{t("updatedAt") || "Updated"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select name="sortOrder" defaultValue={params.sortOrder}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-strong border-white/10">
                          <SelectItem value="desc">
                            {t("descending") || "Newest"}
                          </SelectItem>
                          <SelectItem value="asc">
                            {t("ascending") || "Oldest"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <input type="hidden" name="search" value={params.search} />

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-crimson hover:bg-crimson-light text-white h-9"
                    >
                      {t("applyFilters") || "Apply Filters"}
                    </Button>
                    <SheetClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/10 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
                      >
                        {t("cancel") || "Cancel"}
                      </Button>
                    </SheetClose>
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-white/10 overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-9 px-3 rounded-none ${
                  viewMode === "grid"
                    ? "bg-crimson/10 text-crimson-light"
                    : "text-slate-body hover:text-offwhite"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("table")}
                className={`h-9 px-3 rounded-none border-s border-white/10 ${
                  viewMode === "table"
                    ? "bg-crimson/10 text-crimson-light"
                    : "text-slate-body hover:text-offwhite"
                }`}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============ ACTIVE FILTER CHIPS ============ */}
      {filterLabels.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-2"
        >
          {filterLabels.map((f) => (
            <FilterChip key={f.key} label={f.label} onRemove={f.onRemove} />
          ))}
          <button
            onClick={() =>
              navigate({
                search: "",
                type: "all",
                report: "all",
                selected_language: "all",
                createdAtFrom: "",
                createdAtTo: "",
                page: 1,
              })
            }
            className="text-[11px] text-slate-body/50 hover:text-slate-body transition-colors ms-1"
          >
            {t("clearAll") || "Clear All"}
          </button>
        </motion.div>
      )}

      {/* ============ BULK ACTION BAR ============ */}
      {selectedIds.length > 0 && (
        <motion.div variants={itemVariants}>
          <BulkActionBar
            count={selectedIds.length}
            onDelete={handleBulkDeleteClick}
            onClear={() => setSelectedIds([])}
            isPending={isPending}
          />
        </motion.div>
      )}

      {/* ============ ERROR STATE ============ */}
      {initialError && (
        <motion.div variants={itemVariants}>
          <div className="rounded-xl glass-light border border-crimson/20 p-6 text-center">
            <p className="text-crimson-light text-sm mb-3">{initialError}</p>
            <Button
              variant="outline"
              onClick={() => router.refresh()}
              className="border-white/10 text-offwhite hover:bg-white/5"
            >
              {t("tryAgain") || "Try Again"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* ============ DOCUMENTS LIST / EMPTY STATE ============ */}
      {!initialError && (
        <>
          {documents.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/[0.03] mb-4">
                <FileArchive className="h-8 w-8 text-slate-body/30" />
              </div>
              <h3 className="text-lg font-semibold text-offwhite mb-1">
                {hasActiveFilters
                  ? (t("noDocumentsFiltered") || "No documents match your filters")
                  : (t("noDocuments") || "No documents yet")}
              </h3>
              <p className="text-sm text-slate-body/60 mb-6 max-w-sm mx-auto">
                {hasActiveFilters
                  ? (t("tryAdjustingSearch") || "Try adjusting your search or filters")
                  : (t("addDocumentDescription") || "Upload your first evidence document")}
              </p>
              {!hasActiveFilters && (
                <Link href="/admin/documents/new">
                  <Button className="bg-crimson hover:bg-crimson-light text-white">
                    <Plus className="h-4 w-4 me-1.5" />
                    {t("addDocument")}
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              variants={itemVariants}
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {documents.map((doc) => (
                <DocumentAdminCard
                  key={doc._id}
                  doc={doc}
                  onSelect={handleSelect}
                  isSelected={selectedIds.includes(doc._id!)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <DocumentsDataTable
                documents={documents}
                onDelete={handleDeleteClick}
                selectedIds={selectedIds}
                onSelect={handleSelect}
              />
            </motion.div>
          )}
        </>
      )}

      {/* ============ PAGINATION ============ */}
      {!initialError && documents.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between gap-4"
        >
          <p className="text-xs text-slate-body/60">
            {t("showing") || "Showing"}{" "}
            <span className="font-medium text-offwhite">
              {documents.length}
            </span>{" "}
            {t("of") || "of"}{" "}
            <span className="font-medium text-offwhite">{totalCount}</span>{" "}
            {t("documents") || "documents"}
          </p>
          <div className="flex items-center gap-2">
            {params.page > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ page: params.page - 1 })}
                className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 h-8"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                {t("previous")}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-white/10 bg-white/5 text-offwhite/30 h-8"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                {t("previous")}
              </Button>
            )}
            {documents.length >= LIMIT ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ page: params.page + 1 })}
                className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 h-8"
              >
                {t("next")}
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-white/10 bg-white/5 text-offwhite/30 h-8"
              >
                {t("next")}
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* ============ CONFIRM DELETE DIALOG ============ */}
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={() => executeDelete(pendingDeleteIds)}
        isPending={isPending}
        count={pendingDeleteIds.length}
      />
    </motion.div>
  );
}
