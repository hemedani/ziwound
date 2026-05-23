"use client";

import React, { useEffect, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Check,
  Loader2,
  MoreHorizontal,
  Trash2,
  Download,
  Eye,
  MapPin,
  Globe,
  Flag,
  Calendar,
  Clock,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Gavel,
  Filter,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sparkles,
  Edit3,
  Link2,
  Image,
  Languages,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { update as updateReport } from "@/app/actions/report/update";
import { remove as removeReport } from "@/app/actions/report/remove";

/* ─── Types ─── */
interface LocationItem {
  _id: string;
  name: string;
}

interface ReportItem {
  _id: string;
  title: string;
  status?: string;
  priority?: string;
  description?: string;
  selected_language?: string;
  hostileCountries?: LocationItem[];
  attackedCountries?: LocationItem[];
  attackedProvinces?: LocationItem[];
  attackedCities?: LocationItem[];
  crime_occurred_at?: string;
  createdAt?: string;
  category?: { _id: string; name: string };
  tags?: { _id: string; name: string }[];
  documents?: { _id: string; title: string }[];
}

interface FilterOption {
  _id: string;
  name: string;
}

interface FilterOptions {
  categories: FilterOption[];
  tags: FilterOption[];
  countries: FilterOption[];
  provinces: FilterOption[];
  cities: FilterOption[];
}

interface StatsCounts {
  pending: number;
  approved: number;
  rejected: number;
  highPriority: number;
  total: number;
}

interface CurrentParams {
  page: number;
  search: string;
  status: string;
  priority: string;
  category: string;
  selected_language: string;
  tagIds: string;
  hostileCountryIds: string;
  attackedCountryIds: string;
  attackedProvinceIds: string;
  attackedCityIds: string;
  crimeOccurredFrom: string;
  crimeOccurredTo: string;
  createdAtFrom: string;
  createdAtTo: string;
  sortBy: string;
  sortOrder: string;
}

interface AdminReportsClientProps {
  reports: ReportItem[];
  statsCounts: StatsCounts;
  filterOptions: FilterOptions;
  error: string | null;
  currentParams: CurrentParams;
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status?: string }) {
  const t = useTranslations("admin");
  const cfg: Record<string, { classes: string; label: string }> = {
    Pending: {
      classes:
        "bg-amber-500/10 text-amber-400 border-amber-500/20",
      label: t("status_pending"),
    },
    Approved: {
      classes:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      label: t("status_approved"),
    },
    Rejected: {
      classes: "bg-crimson/10 text-crimson-light border-crimson/20",
      label: t("status_rejected"),
    },
    InReview: {
      classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      label: t("status_in_review"),
    },
  };
  const s = cfg[status || ""] || {
    classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    label: status || t("status_pending"),
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${s.classes}`}
    >
      {s.label}
    </span>
  );
}

/* ─── Priority Badge ─── */
function PriorityBadge({ priority }: { priority?: string }) {
  const t = useTranslations("admin");
  const cfg: Record<string, { classes: string; label: string }> = {
    High: {
      classes: "bg-crimson/10 text-crimson-light border-crimson/20",
      label: t("priority_high"),
    },
    Medium: {
      classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      label: t("priority_medium"),
    },
    Low: {
      classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      label: t("priority_low"),
    },
  };
  const p = cfg[priority || ""] || {
    classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    label: priority || "",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${p.classes}`}
    >
      {p.label}
    </span>
  );
}

/* ─── Location Badges ─── */
function LocationBadges({
  items,
  icon: Icon,
  max = 2,
}: {
  items?: LocationItem[];
  icon: React.ElementType;
  max?: number;
}) {
  if (!items || items.length === 0) return <span className="text-slate-body/40">—</span>;
  const visible = items.slice(0, max);
  const remaining = items.length - max;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((item) => (
        <span
          key={item._id}
          className="inline-flex items-center gap-0.5 rounded-md bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-slate-body border border-white/[0.04]"
        >
          <Icon className="h-2.5 w-2.5" />
          {item.name}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-[10px] text-slate-body/50">+{remaining}</span>
      )}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href?: string;
}) {
  const Wrapper = href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={href} className="block">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <Wrapper>
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative overflow-hidden rounded-xl glass-light p-4 border border-white/[0.06] transition-all duration-300 hover:bg-white/[0.04] cursor-default"
      >
        <div className="flex items-center gap-3">
          <div
            className={`rounded-lg p-2 ${color} shadow-lg shrink-0`}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-body">{label}</p>
            <p className="text-xl font-bold tracking-tight text-offwhite tabular-nums">
              {value}
            </p>
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
}

/* ─── Filter Chip ─── */
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

/* ─── Bulk Action Bar ─── */
function BulkActionBar({
  count,
  onApprove,
  onReject,
  onDelete,
  onClear,
  isPending,
}: {
  count: number;
  onApprove: () => void;
  onReject: () => void;
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
        onClick={onApprove}
        disabled={isPending}
        className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 px-3"
      >
        <Check className="h-3.5 w-3.5 me-1.5" />
        {t("approve")}
      </Button>
      <Button
        size="sm"
        onClick={onReject}
        disabled={isPending}
        className="bg-crimson hover:bg-crimson-light text-white h-8 px-3"
      >
        <X className="h-3.5 w-3.5 me-1.5" />
        {t("reject")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={isPending}
        className="border-crimson/30 text-crimson-light hover:bg-crimson/10 h-8 px-3"
      >
        <Trash2 className="h-3.5 w-3.5 me-1.5" />
        {t("delete")}
      </Button>
    </motion.div>
  );
}

/* ─── Confirmation Dialog ─── */
function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  count = 1,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  count?: number;
}) {
  const t = useTranslations("admin");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm glass-strong border-white/10">
        <DialogHeader>
          <DialogTitle className="text-offwhite flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-crimson-light" />
            {count > 1
              ? t("deleteReports") || "Delete Reports"
              : t("delete") || "Delete Report"}
          </DialogTitle>
          <DialogDescription className="text-slate-body">
            {count > 1
              ? (t("deleteReportsConfirm") ||
                  `Are you sure you want to delete ${count} reports?`)
              : (t("deleteConfirm") ||
                  "Are you sure you want to delete this report?")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-offwhite hover:bg-white/5"
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="bg-crimson hover:bg-crimson-light text-white"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin me-2" />}
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Component ─── */
export function AdminReportsClient({
  reports,
  statsCounts,
  filterOptions,
  error: initialError,
  currentParams,
}: AdminReportsClientProps) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const params = currentParams;
  const page = params.page;

  const hasActiveFilters =
    params.status !== "all" ||
    params.priority !== "all" ||
    params.category !== "all" ||
    params.selected_language !== "all" ||
    params.tagIds !== "" ||
    params.hostileCountryIds !== "" ||
    params.attackedCountryIds !== "" ||
    params.attackedProvinceIds !== "" ||
    params.attackedCityIds !== "" ||
    params.crimeOccurredFrom !== "" ||
    params.crimeOccurredTo !== "" ||
    params.createdAtFrom !== "" ||
    params.createdAtTo !== "";

  useEffect(() => {
    if (initialError) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: initialError,
      });
    }
  }, [initialError, toast, t]);

  /* ── Build query string ── */
  const buildHref = useCallback(
    (overrides: Partial<CurrentParams>) => {
      const merged = { ...params, ...overrides };
      const sp = new URLSearchParams();
      if (merged.page > 1) sp.set("page", String(merged.page));
      if (merged.search) sp.set("search", merged.search);
      if (merged.status !== "all") sp.set("status", merged.status);
      if (merged.priority !== "all") sp.set("priority", merged.priority);
      if (merged.category !== "all") sp.set("category", merged.category);
      if (merged.selected_language !== "all")
        sp.set("selected_language", merged.selected_language);
      if (merged.tagIds) sp.set("tagIds", merged.tagIds);
      if (merged.hostileCountryIds)
        sp.set("hostileCountryIds", merged.hostileCountryIds);
      if (merged.attackedCountryIds)
        sp.set("attackedCountryIds", merged.attackedCountryIds);
      if (merged.attackedProvinceIds)
        sp.set("attackedProvinceIds", merged.attackedProvinceIds);
      if (merged.attackedCityIds)
        sp.set("attackedCityIds", merged.attackedCityIds);
      if (merged.crimeOccurredFrom)
        sp.set("crimeOccurredFrom", merged.crimeOccurredFrom);
      if (merged.crimeOccurredTo)
        sp.set("crimeOccurredTo", merged.crimeOccurredTo);
      if (merged.createdAtFrom)
        sp.set("createdAtFrom", merged.createdAtFrom);
      if (merged.createdAtTo)
        sp.set("createdAtTo", merged.createdAtTo);
      if (merged.sortBy !== "createdAt")
        sp.set("sortBy", merged.sortBy);
      if (merged.sortOrder !== "desc")
        sp.set("sortOrder", merged.sortOrder);
      const qs = sp.toString();
      return `/admin/reports${qs ? `?${qs}` : ""}`;
    },
    [params],
  );

  const navigate = (overrides: Partial<CurrentParams>) => {
    router.push(buildHref(overrides));
  };

  /* ── Actions ── */
  const handleSearch = (formData: FormData) => {
    const searchVal = formData.get("search") as string;
    navigate({ search: searchVal, page: 1 });
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await updateReport({ _id: id, status: status as any }, { _id: 1 });
    if (res?.success) {
      toast({ title: t("success"), description: t("reportUpdated") || "Report updated" });
      startTransition(() => router.refresh());
    } else {
      toast({
        variant: "destructive",
        title: t("error"),
        description: res?.body?.message || "Failed to update",
      });
    }
  };

  const deleteReports = async (ids: string[]) => {
    let success = true;
    for (const id of ids) {
      const res = await removeReport({ _id: id }, { _id: 1 });
      if (!res?.success) success = false;
    }
    if (success) {
      toast({
        title: t("success"),
        description:
          ids.length > 1
            ? `${ids.length} ${t("reportsDeleted") || "reports deleted"}`
            : t("reportDeleted") || "Report deleted",
      });
    } else {
      toast({ variant: "destructive", title: t("error"), description: "Some deletions failed" });
    }
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    setConfirmDeleteOpen(false);
    startTransition(() => router.refresh());
  };

  const handleBulkApprove = () => {
    selectedIds.forEach((id) => updateStatus(id, "Approved"));
  };
  const handleBulkReject = () => {
    selectedIds.forEach((id) => updateStatus(id, "Rejected"));
  };
  const handleBulkDelete = () => {
    setPendingDeleteIds([...selectedIds]);
    setConfirmDeleteOpen(true);
  };

  const toggleAll = () => {
    if (selectedIds.length === reports.length && reports.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reports.map((r) => r._id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const handleExportCSV = () => {
    if (reports.length === 0) return;
    const headers = [
      "ID",
      "Title",
      "Status",
      "Priority",
      "Hostile Countries",
      "Attacked Countries",
      "Attacked Provinces",
      "Attacked Cities",
      "Category",
      "Language",
      "Crime Date",
      "Created At",
    ];
    const csvData = reports.map((r) => [
      r._id,
      r.title,
      r.status || "",
      r.priority || "",
      r.hostileCountries?.map((c) => c.name).join("; ") || "",
      r.attackedCountries?.map((c) => c.name).join("; ") || "",
      r.attackedProvinces?.map((p) => p.name).join("; ") || "",
      r.attackedCities?.map((c) => c.name).join("; ") || "",
      r.category?.name || "",
      r.selected_language || "",
      r.crime_occurred_at
        ? new Date(r.crime_occurred_at).toLocaleDateString("fa-IR")
        : "",
      r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("fa-IR")
        : "",
    ]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reports_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ── Filter change handlers ── */
  const applyFilter = (key: string, value: string) => {
    navigate({ [key]: value, page: 1 } as any);
  };

  const clearFilter = (key: keyof CurrentParams) => {
    navigate({ [key]: key === "search" ? "" : "all" === "all" ? "all" : "", page: 1 } as any);
  };

  const clearAllFilters = () => {
    navigate({
      page: 1,
      search: "",
      status: "all",
      priority: "all",
      category: "all",
      selected_language: "all",
      tagIds: "",
      hostileCountryIds: "",
      attackedCountryIds: "",
      attackedProvinceIds: "",
      attackedCityIds: "",
      crimeOccurredFrom: "",
      crimeOccurredTo: "",
      createdAtFrom: "",
      createdAtTo: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const sortLabels: Record<string, string> = {
    createdAt: t("date"),
    title: t("title"),
    status: t("status"),
    priority: t("priority"),
  };

  const statItems = [
    {
      label: t("status_pending"),
      value: statsCounts.pending,
      icon: Clock,
      color: "bg-amber-500/20 text-amber-400",
      href: buildHref({ status: "Pending", page: 1 }),
    },
    {
      label: t("status_approved"),
      value: statsCounts.approved,
      icon: ShieldCheck,
      color: "bg-emerald-500/20 text-emerald-400",
      href: buildHref({ status: "Approved", page: 1 }),
    },
    {
      label: t("status_rejected"),
      value: statsCounts.rejected,
      icon: AlertTriangle,
      color: "bg-crimson/20 text-crimson-light",
      href: buildHref({ status: "Rejected", page: 1 }),
    },
    {
      label: t("priority_high"),
      value: statsCounts.highPriority,
      icon: TrendingUp,
      color: "bg-crimson/20 text-crimson-light",
      href: buildHref({ priority: "High", page: 1 }),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

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
                {t("reportsManagement")}
              </h1>
              <p className="text-slate-body mt-1 text-sm">
                {t("reportsManagementDescription")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={reports.length === 0}
                className="border-white/10 bg-white/5 text-slate-body hover:text-offwhite hover:bg-white/10 h-9"
              >
                <Download className="h-4 w-4 me-1.5" />
                {t("exportCsv")}
              </Button>
              <Link href="/admin/reports/new">
                <Button className="bg-crimson hover:bg-crimson-light text-white h-9 shadow-sm shadow-crimon/20">
                  <Plus className="h-4 w-4 me-1.5" />
                  {t("addReport") || "New Report"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============ STATS ROW ============ */}
      <motion.div
        variants={itemVariants}
        className="grid gap-3 grid-cols-2 md:grid-cols-4"
      >
        {statItems.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </motion.div>

      {/* ============ SEARCH + FILTER BAR ============ */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(new FormData(e.currentTarget)); }} className="relative flex-1 w-full">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-body/60" />
            <Input
              name="search"
              defaultValue={params.search}
              placeholder={t("searchPlaceholder") || "Search reports..."}
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
                className="w-80 sm:w-96 glass-strong border-white/10 overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="text-offwhite flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-gold" />
                    {t("filters") || "Filters"}
                  </SheetTitle>
                  <SheetDescription className="text-slate-body">
                    {t("applyFilters") || "Refine the reports list"}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-5">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-medium text-slate-body mb-1.5">
                      {t("status")}
                    </label>
                    <Select
                      value={params.status}
                      onValueChange={(v) => applyFilter("status", v)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/10">
                        <SelectItem value="all">
                          {t("allStatuses") || "All Statuses"}
                        </SelectItem>
                        <SelectItem value="Pending">
                          {t("status_pending")}
                        </SelectItem>
                        <SelectItem value="Approved">
                          {t("status_approved")}
                        </SelectItem>
                        <SelectItem value="Rejected">
                          {t("status_rejected")}
                        </SelectItem>
                        <SelectItem value="InReview">
                          {t("status_in_review")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-medium text-slate-body mb-1.5">
                      {t("priority")}
                    </label>
                    <Select
                      value={params.priority}
                      onValueChange={(v) => applyFilter("priority", v)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/10">
                        <SelectItem value="all">
                          {t("allPriorities") || "All Priorities"}
                        </SelectItem>
                        <SelectItem value="High">
                          {t("priority_high")}
                        </SelectItem>
                        <SelectItem value="Medium">
                          {t("priority_medium")}
                        </SelectItem>
                        <SelectItem value="Low">
                          {t("priority_low")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-slate-body mb-1.5">
                      {t("category")}
                    </label>
                    <Select
                      value={params.category}
                      onValueChange={(v) => applyFilter("category", v)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/10 max-h-60">
                        <SelectItem value="all">
                          {t("allCategories") || "All Categories"}
                        </SelectItem>
                        {filterOptions.categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-medium text-slate-body mb-1.5">
                      <Tag className="h-3 w-3 inline me-1" />
                      {t("tags")}
                    </label>
                    <Select
                      value={params.tagIds || "all"}
                      onValueChange={(v) =>
                        applyFilter("tagIds", v === "all" ? "" : v)
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong border-white/10 max-h-60">
                        <SelectItem value="all">
                          {t("allTags") || "All Tags"}
                        </SelectItem>
                        {filterOptions.tags.map((tag) => (
                          <SelectItem key={tag._id} value={tag._id}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-xs font-medium text-slate-body mb-1.5">
                      <Languages className="h-3 w-3 inline me-1" />
                      {t("language") || "Language"}
                    </label>
                    <Select
                      value={params.selected_language}
                      onValueChange={(v) =>
                        applyFilter("selected_language", v)
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
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

                  {/* Geography section */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs font-semibold text-gold mb-3 flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      {t("locations") || "Locations"}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-body mb-1.5">
                          {t("hostileCountries") || "Hostile Countries"}
                        </label>
                        <Select
                          value={
                            params.hostileCountryIds || "all"
                          }
                          onValueChange={(v) =>
                            applyFilter(
                              "hostileCountryIds",
                              v === "all" ? "" : v,
                            )
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-strong border-white/10 max-h-60">
                            <SelectItem value="all">
                              {t("allHostileCountries") ||
                                "All Hostile Countries"}
                            </SelectItem>
                            {filterOptions.countries.map((c) => (
                              <SelectItem key={c._id} value={c._id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-body mb-1.5">
                          {t("attackedCountries") || "Attacked Countries"}
                        </label>
                        <Select
                          value={
                            params.attackedCountryIds || "all"
                          }
                          onValueChange={(v) =>
                            applyFilter(
                              "attackedCountryIds",
                              v === "all" ? "" : v,
                            )
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-strong border-white/10 max-h-60">
                            <SelectItem value="all">
                              {t("allAttackedCountries") ||
                                "All Attacked Countries"}
                            </SelectItem>
                            {filterOptions.countries.map((c) => (
                              <SelectItem key={c._id} value={c._id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-body mb-1.5">
                          {t("attackedProvinces") || "Attacked Provinces"}
                        </label>
                        <Select
                          value={
                            params.attackedProvinceIds || "all"
                          }
                          onValueChange={(v) =>
                            applyFilter(
                              "attackedProvinceIds",
                              v === "all" ? "" : v,
                            )
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-strong border-white/10 max-h-60">
                            <SelectItem value="all">
                              {t("allAttackedProvinces") ||
                                "All Attacked Provinces"}
                            </SelectItem>
                            {filterOptions.provinces.map((p) => (
                              <SelectItem key={p._id} value={p._id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-body mb-1.5">
                          {t("attackedCities") || "Attacked Cities"}
                        </label>
                        <Select
                          value={params.attackedCityIds || "all"}
                          onValueChange={(v) =>
                            applyFilter(
                              "attackedCityIds",
                              v === "all" ? "" : v,
                            )
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-strong border-white/10 max-h-60">
                            <SelectItem value="all">
                              {t("allAttackedCities") ||
                                "All Attacked Cities"}
                            </SelectItem>
                            {filterOptions.cities.map((c) => (
                              <SelectItem key={c._id} value={c._id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs font-semibold text-gold mb-3 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {t("dateRange") || "Date Range"}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-body mb-1.5">
                          {t("from") || "From"}
                        </label>
                        <Input
                          type="date"
                          defaultValue={params.crimeOccurredFrom}
                          onChange={(e) =>
                            applyFilter(
                              "crimeOccurredFrom",
                              e.target.value,
                            )
                          }
                          className="bg-white/5 border-white/10 text-offwhite h-9 [color-scheme:dark]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-body mb-1.5">
                          {t("to") || "To"}
                        </label>
                        <Input
                          type="date"
                          defaultValue={params.crimeOccurredTo}
                          onChange={(e) =>
                            applyFilter(
                              "crimeOccurredTo",
                              e.target.value,
                            )
                          }
                          className="bg-white/5 border-white/10 text-offwhite h-9 [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear All */}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full border-white/10 text-slate-body hover:text-offwhite hover:bg-white/5"
                  >
                    <X className="h-4 w-4 me-1.5" />
                    {t("clearAll") || "Clear All Filters"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select
              value={`${params.sortBy}-${params.sortOrder}`}
              onValueChange={(v) => {
                const [sortBy, sortOrder] = v.split("-");
                navigate({ sortBy, sortOrder, page: 1 });
              }}
            >
              <SelectTrigger className="w-40 bg-white/5 border-white/10 text-offwhite h-9 text-sm">
                <ArrowUpDown className="h-3.5 w-3.5 me-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                <SelectItem value="createdAt-desc">
                  {t("date")} ↓
                </SelectItem>
                <SelectItem value="createdAt-asc">
                  {t("date")} ↑
                </SelectItem>
                <SelectItem value="title-asc">
                  {t("title")} A-Z
                </SelectItem>
                <SelectItem value="title-desc">
                  {t("title")} Z-A
                </SelectItem>
                <SelectItem value="status-asc">
                  {t("status")} ↑
                </SelectItem>
                <SelectItem value="status-desc">
                  {t("status")} ↓
                </SelectItem>
                <SelectItem value="priority-asc">
                  {t("priority")} ↑
                </SelectItem>
                <SelectItem value="priority-desc">
                  {t("priority")} ↓
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 mt-3"
            >
              {params.status !== "all" && (
                <FilterChip
                  label={`${t("status")}: ${t(`status_${params.status.toLowerCase()}` as any)}`}
                  onRemove={() => applyFilter("status", "all")}
                />
              )}
              {params.priority !== "all" && (
                <FilterChip
                  label={`${t("priority")}: ${t(`priority_${params.priority.toLowerCase()}` as any)}`}
                  onRemove={() => applyFilter("priority", "all")}
                />
              )}
              {params.category !== "all" && (
                <FilterChip
                  label={`${t("category")}: ${filterOptions.categories.find((c) => c._id === params.category)?.name || params.category}`}
                  onRemove={() => applyFilter("category", "all")}
                />
              )}
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-medium text-crimson-light hover:text-crimson transition-colors"
              >
                {t("clearAll") || "Clear All"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ============ BULK ACTION BAR ============ */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <BulkActionBar
            count={selectedIds.length}
            onApprove={handleBulkApprove}
            onReject={handleBulkReject}
            onDelete={handleBulkDelete}
            onClear={() => setSelectedIds([])}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* ============ REPORTS TABLE ============ */}
      <motion.div variants={itemVariants}>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="w-10 ps-4">
                  <Checkbox
                    checked={
                      reports.length > 0 &&
                      selectedIds.length === reports.length
                    }
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                    className="border-white/20 data-[state=checked]:bg-crimson data-[state=checked]:border-crimson"
                  />
                </TableHead>
                <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider">
                  {t("title")}
                </TableHead>
                <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                  {t("category")}
                </TableHead>
                <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                  {t("locations") || "Locations"}
                </TableHead>
                <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider">
                  {t("status")}
                </TableHead>
                <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                  {t("priority")}
                </TableHead>
                <TableHead className="text-slate-body text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                  {t("date")}
                </TableHead>
                <TableHead className="text-end pe-4 text-slate-body text-xs font-semibold uppercase tracking-wider">
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow className="border-white/[0.06]">
                  <TableCell
                    colSpan={8}
                    className="h-64 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="rounded-full bg-white/[0.03] p-4 border border-white/[0.06]">
                        <FileText className="h-8 w-8 text-slate-body/40" />
                      </div>
                      <p className="text-sm text-slate-body/60">
                        {hasActiveFilters
                          ? (t("noReportsFiltered") ||
                              "No reports match your filters")
                          : t("noReports")}
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllFilters}
                          className="border-white/10 text-slate-body hover:text-offwhite"
                        >
                          <X className="h-3.5 w-3.5 me-1.5" />
                          {t("clearAll") || "Clear Filters"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, idx) => (
                  <motion.tr
                    key={report._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: idx * 0.03,
                      duration: 0.3,
                    }}
                    className="group border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                  >
                    <TableCell className="ps-4 w-10">
                      <Checkbox
                        checked={selectedIds.includes(report._id)}
                        onCheckedChange={() => toggleOne(report._id)}
                        aria-label={`Select ${report.title}`}
                        className="border-white/20 data-[state=checked]:bg-crimson data-[state=checked]:border-crimson"
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/reports/${report._id}`}
                        className="font-medium text-offwhite text-sm hover:text-crimson-light transition-colors line-clamp-1"
                      >
                        {report.title || "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs text-slate-body">
                        {report.category?.name || (
                          <span className="text-slate-body/40">—</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <LocationBadges
                        items={[
                          ...(report.attackedProvinces || []).slice(0, 2),
                        ]}
                        icon={MapPin}
                        max={1}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <PriorityBadge priority={report.priority} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-xs text-slate-body tabular-nums">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString(
                              "fa-IR",
                            )
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-end pe-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-slate-body hover:text-offwhite hover:bg-white/5"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="glass-strong border-white/10 min-w-[160px]"
                        >
                          <DropdownMenuLabel className="text-slate-body text-xs">
                            {t("actions")}
                          </DropdownMenuLabel>
                          <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                            <Link
                              href={`/admin/reports/${report._id}`}
                              className="flex items-center"
                            >
                              <Eye className="me-2 h-4 w-4 text-gold" />
                              {t("viewDetails")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                            <Link
                              href={`/admin/reports/${report._id}/edit`}
                              className="flex items-center"
                            >
                              <Edit3 className="me-2 h-4 w-4 text-blue-400" />
                              {t("edit")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(report._id, "Approved")
                            }
                            className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                          >
                            <Check className="me-2 h-4 w-4 text-emerald-400" />
                            {t("approve")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(report._id, "Rejected")
                            }
                            className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer"
                          >
                            <X className="me-2 h-4 w-4 text-crimson-light" />
                            {t("reject")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => {
                              setPendingDeleteIds([report._id]);
                              setConfirmDeleteOpen(true);
                            }}
                            className="text-crimson-light focus:bg-white/10 focus:text-crimson-light cursor-pointer"
                          >
                            <Trash2 className="me-2 h-4 w-4" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* ============ PAGINATION ============ */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between gap-4"
      >
        <p className="text-xs text-slate-body/60">
          {t("showing") || "Showing"}{" "}
          <span className="font-medium text-offwhite">
            {reports.length}
          </span>{" "}
          {t("of") || "of"}{" "}
          <span className="font-medium text-offwhite">
            {statsCounts.total}
          </span>{" "}
          {t("reports") || "reports"}
        </p>
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ page: page - 1 })}
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
          {reports.length >= 15 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ page: page + 1 })}
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

      {/* ============ CONFIRM DELETE DIALOG ============ */}
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={() => deleteReports(pendingDeleteIds)}
        isPending={isPending}
        count={pendingDeleteIds.length}
      />
    </motion.div>
  );
}
