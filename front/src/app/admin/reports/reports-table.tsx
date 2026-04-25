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

    const headers = ["ID", "Title", "Status", "Priority", "Category", "Date"];
    const csvData = reports.map((r) => [
      r._id,
      r.title,
      r.status,
      r.priority,
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
    } catch (error) {
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
    } catch (error) {
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
        <Button variant="outline" onClick={handleExportCSV} disabled={reports.length === 0}>
          Export CSV
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border">
          <span className="text-sm font-medium ms-2">{selectedIds.length} selected</span>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkUpdate("Approved")}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="me-2 h-4 w-4 text-green-500" />
            )}
            {t("approve")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkUpdate("Rejected")}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="me-2 h-4 w-4 text-red-500" />
            )}
            {t("reject")}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isPending}>
            {isPending ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="me-2 h-4 w-4" />
            )}
            {t("delete")}
          </Button>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] ps-4">
                <Checkbox
                  checked={reports.length > 0 && selectedIds.length === reports.length}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("priority")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead className="text-end pe-4">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("noReports")}
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report: ReportItem) => (
                <TableRow key={report._id}>
                  <TableCell className="ps-4">
                    <Checkbox
                      checked={selectedIds.includes(report._id)}
                      onCheckedChange={() => toggleOne(report._id)}
                      aria-label={`Select ${report.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.category?.name || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === "Pending"
                          ? "outline"
                          : report.status === "Approved"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {t(`status_${getStatusKey(report.status)}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t(`priority_${getPriorityKey(report.priority)}`)}</Badge>
                  </TableCell>
                  <TableCell>
                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "-"}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => openReportDetails(report)}>
                          <Eye className="me-2 h-4 w-4" />
                          {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateStatus(report._id, "Approved")}>
                          <Check className="me-2 h-4 w-4" />
                          {t("approve")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(report._id, "Rejected")}>
                          <X className="me-2 h-4 w-4" />
                          {t("reject")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("viewDetails") || "Report Details"}</DialogTitle>
            <DialogDescription>{selectedReport?._id}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t("title")}</h4>
                <p>{selectedReport.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t("category")}</h4>
                  <p>{selectedReport.category?.name || "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t("date")}</h4>
                  <p>
                    {selectedReport.createdAt
                      ? new Date(selectedReport.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t("status")}</h4>
                  <Badge
                    variant={
                      selectedReport.status === "pending"
                        ? "outline"
                        : selectedReport.status === "approved"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {t(`status_${selectedReport.status || "pending"}`)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t("priority")}</h4>
                  <Badge variant="secondary">
                    {t(`priority_${selectedReport.priority || "low"}`)}
                  </Badge>
                </div>
              </div>
              {selectedReport.documents && selectedReport.documents.length > 0 && (
                <div className="pt-4 border-t mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    {t("documents") || "Linked Documents"}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedReport.documents.map((doc) => (
                      <div key={doc._id} className="text-sm bg-muted/50 p-2 rounded-md border">
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
