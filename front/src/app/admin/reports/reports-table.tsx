"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { update } from "@/app/actions/report/update";
import { remove } from "@/app/actions/report/remove";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, MoreHorizontal, Check, X, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusKey = (status?: string): string => {
  const statusMap: Record<string, string> = {
    Approved: "approved",
    Pending: "pending",
    Rejected: "rejected",
    InReview: "in_review",
  };
  return statusMap[status || ""] || "pending";
};

const getPriorityKey = (priority?: string): string => {
  const priorityMap: Record<string, string> = {
    High: "high",
    Medium: "medium",
    Low: "low",
  };
  return priorityMap[priority || ""] || "low";
};

type ReportItem = {
  _id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  hostileCountries?: { _id: string; name: string }[];
  attackedCountries?: { _id: string; name: string }[];
  attackedProvinces?: { _id: string; name: string }[];
  attackedCities?: { _id: string; name: string }[];
  crime_occurred_at?: string;
  category?: { _id: string; name: string };
  documents?: { _id: string; title: string }[];
};

export function ReportsTable({ reports, error }: { reports: ReportItem[]; error?: string | null }) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: error,
      });
    }
  }, [error, toast, t]);

  const openReportDetails = (report: ReportItem) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    if (reports.length === 0) return;

    const headers = ["ID", "Title", "Status", "Priority", "Hostile Countries", "Attacked Countries", "Attacked Provinces", "Attacked Cities", "Crime Date", "Category", "Date"];
    const csvData = reports.map((r) => [
      r._id,
      r.title,
      r.status,
      r.priority,
      r.hostileCountries?.map((c) => c.name).join(", ") || "",
      r.attackedCountries?.map((c) => c.name).join(", ") || "",
      r.attackedProvinces?.map((p) => p.name).join(", ") || "",
      r.attackedCities?.map((c) => c.name).join(", ") || "",
      r.crime_occurred_at ? new Date(r.crime_occurred_at).toLocaleDateString() : "",
      r.category?.name || "",
      r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reports_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleAll = () => {
    if (selectedIds.length === reports.length && reports.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reports.map((r) => r._id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const updateStatus = async (id: string, status: "Pending" | "Approved" | "Rejected") => {
    try {
      const res = await update({ _id: id, status }, { _id: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: "Report status updated",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: "Failed to update report",
      });
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const res = await remove({ _id: id }, { _id: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: "Report deleted",
        });
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (_error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: "Failed to delete report",
      });
    }
  };

  const handleBulkUpdate = async (status: "Pending" | "Approved" | "Rejected") => {
    if (!selectedIds.length) return;

    // Process sequentially to avoid rate limiting/overloading if there are many
    for (const id of selectedIds) {
      await update({ _id: id, status }, { _id: 1 });
    }

    toast({
      title: t("success") || "Success",
      description: `Updated ${selectedIds.length} reports to ${status}`,
    });
    setSelectedIds([]);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;

    for (const id of selectedIds) {
      await remove({ _id: id }, { _id: 1 });
    }

    toast({
      title: t("success") || "Success",
      description: `Deleted ${selectedIds.length} reports`,
    });
    setSelectedIds([]);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleExportCSV} disabled={reports.length === 0} className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white">
          {t("exportCsv")}
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl glass-light border border-white/[0.06]">
          <span className="text-sm font-medium ms-2 text-offwhite">{selectedIds.length} selected</span>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkUpdate("Approved")}
            disabled={isPending}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            {isPending ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="me-2 h-4 w-4" />
            )}
            {t("approve")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkUpdate("Rejected")}
            disabled={isPending}
            className="border-crimson/30 text-crimson-light hover:bg-crimson/10 hover:text-crimson"
          >
            {isPending ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="me-2 h-4 w-4" />
            )}
            {t("reject")}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isPending} className="bg-crimson hover:bg-crimson-light">
            {isPending ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="me-2 h-4 w-4" />
            )}
            {t("delete")}
          </Button>
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="w-[40px] ps-4 text-slate-body">
                <Checkbox
                  checked={reports.length > 0 && selectedIds.length === reports.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="text-slate-body">{t("title")}</TableHead>
              <TableHead className="text-slate-body">{t("category")}</TableHead>
              <TableHead className="text-slate-body">{t("hostileCountries") || "Hostile Countries"}</TableHead>
              <TableHead className="text-slate-body">{t("attackedCountries") || "Attacked Countries"}</TableHead>
              <TableHead className="text-slate-body">{t("attackedProvinces") || "Attacked Provinces"}</TableHead>
              <TableHead className="text-slate-body">{t("attackedCities") || "Attacked Cities"}</TableHead>
              <TableHead className="text-slate-body">{t("status")}</TableHead>
              <TableHead className="text-slate-body">{t("priority")}</TableHead>
              <TableHead className="text-slate-body">{t("date")}</TableHead>
              <TableHead className="text-end pe-4 text-slate-body">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow className="border-white/[0.06]">
                <TableCell colSpan={11} className="h-24 text-center text-slate-body">
                  {t("noReports")}
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report: ReportItem) => (
                <TableRow key={report._id} className="border-white/[0.06] hover:bg-white/[0.02]">
                  <TableCell className="ps-4">
                    <Checkbox
                      checked={selectedIds.includes(report._id)}
                      onCheckedChange={() => toggleOne(report._id)}
                      aria-label={`Select ${report.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-offwhite">{report.title}</TableCell>
                  <TableCell className="text-slate-body">{report.category?.name || "-"}</TableCell>
                  <TableCell className="text-slate-body">{report.hostileCountries?.map((c) => c.name).join(", ") || "-"}</TableCell>
                  <TableCell className="text-slate-body">{report.attackedCountries?.map((c) => c.name).join(", ") || "-"}</TableCell>
                  <TableCell className="text-slate-body">{report.attackedProvinces?.map((p) => p.name).join(", ") || "-"}</TableCell>
                  <TableCell className="text-slate-body">{report.attackedCities?.map((c) => c.name).join(", ") || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        report.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : report.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : report.status === "Rejected"
                              ? "bg-crimson/10 text-crimson-light border-crimson/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {t(`status_${getStatusKey(report.status)}`)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/5 text-slate-body border border-white/10">
                      {t(`priority_${getPriorityKey(report.priority)}`)}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-body">
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "-"}
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
                        <DropdownMenuItem onClick={() => openReportDetails(report)} className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Eye className="me-2 h-4 w-4 text-gold" />
                          {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => updateStatus(report._id, "Approved")} className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <Check className="me-2 h-4 w-4 text-emerald-400" />
                          {t("approve")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(report._id, "Rejected")} className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                          <X className="me-2 h-4 w-4 text-crimson-light" />
                          {t("reject")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          className="text-crimson-light focus:bg-white/10 focus:text-crimson-light cursor-pointer"
                          onClick={() => deleteReport(report._id)}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md glass-strong border-white/10">
          <DialogHeader>
            <DialogTitle className="text-offwhite">{t("viewDetails") || "Report Details"}</DialogTitle>
            <DialogDescription className="text-slate-body">{selectedReport?._id}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-slate-body">{t("title")}</h4>
                <p className="text-offwhite">{selectedReport.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-body">{t("category")}</h4>
                  <p className="text-offwhite">{selectedReport.category?.name || "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-body">{t("date")}</h4>
                  <p className="text-offwhite">
                    {selectedReport.createdAt
                      ? new Date(selectedReport.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-body">{t("status")}</h4>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      selectedReport.status === "Pending"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : selectedReport.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : selectedReport.status === "Rejected"
                            ? "bg-crimson/10 text-crimson-light border-crimson/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {t(`status_${getStatusKey(selectedReport.status)}`)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-body">{t("priority")}</h4>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/5 text-slate-body border border-white/10">
                    {t(`priority_${getPriorityKey(selectedReport.priority)}`)}
                  </span>
                </div>
              </div>
              {selectedReport.documents && selectedReport.documents.length > 0 && (
                <div className="pt-4 border-t border-white/10 mt-4">
                  <h4 className="text-sm font-medium text-slate-body mb-2">
                    {t("documents") || "Linked Documents"}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedReport.documents.map((doc) => (
                      <div key={doc._id} className="text-sm bg-white/[0.03] p-2 rounded-md border border-white/[0.06] text-offwhite">
                        {doc.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
