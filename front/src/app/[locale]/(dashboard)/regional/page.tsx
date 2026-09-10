"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getMe } from "@/app/actions/user/getMe";
import { get as getRegionalRequest } from "@/app/actions/regionalManagerRequest/get";
import { getsMyArea } from "@/app/actions/report/getsMyArea";
import { updateStatus } from "@/app/actions/report/updateStatus";
import { get as getCountry } from "@/app/actions/country/get";
import { get as getProvince } from "@/app/actions/province/get";
import { get as getCity } from "@/app/actions/city/get";
import { update as updateCountry } from "@/app/actions/country/update";
import { update as updateProvince } from "@/app/actions/province/update";
import { update as updateCity } from "@/app/actions/city/update";
import { RegionalApplyForm } from "@/components/regional/regional-apply-form";
import { AreaInfoForm, type AreaInfoField } from "@/components/regional/area-info-form";
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Pencil,
  SearchX,
} from "lucide-react";
import type { DeepPartial, reportSchema, regionalManagerRequestSchema } from "@/types/declarations";

const COUNTRY_FIELDS: AreaInfoField[] = [
  { key: "wars_history", label: "Wars History" },
  { key: "conflict_timeline", label: "Conflict Timeline" },
  { key: "casualties_info", label: "Casualties Info" },
  { key: "war_crimes_documentation", label: "War Crimes Documentation" },
  { key: "human_rights_violations", label: "Human Rights Violations" },
  { key: "genocide_info", label: "Genocide Info" },
  { key: "notable_war_events", label: "Notable War Events" },
];

const PROVINCE_CITY_FIELDS: AreaInfoField[] = [
  { key: "wars_history", label: "Wars History" },
  { key: "conflict_timeline", label: "Conflict Timeline" },
  { key: "casualties_info", label: "Casualties Info" },
  { key: "notable_battles", label: "Notable Battles" },
  { key: "occupation_info", label: "Occupation Info" },
  { key: "destruction_level", label: "Destruction Level" },
  { key: "civilian_impact", label: "Civilian Impact" },
  { key: "war_crimes_events", label: "War Crimes Events" },
  { key: "liberation_info", label: "Liberation Info" },
];

type MeType = {
  _id: string;
  level?: string;
  isRegionalManager?: boolean;
  managesCountry?: { _id: string; name?: string };
  managesProvince?: { _id: string; name?: string };
  managesCity?: { _id: string; name?: string };
  regionalManagerRequests?: { _id?: string; status?: string }[];
};

type ReportItem = DeepPartial<reportSchema>;
type RequestItem = DeepPartial<regionalManagerRequestSchema> & {
  country?: { _id: string; name?: string };
  province?: { _id: string; name?: string };
  city?: { _id: string; name?: string };
};

const statusBadgeClass: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-crimson/10 text-crimson-light border-crimson/20",
};

export default function RegionalDashboardPage() {
  const t = useTranslations("regional");
  const tReport = useTranslations("report");
  const { toast } = useToast();

  const [me, setMe] = useState<MeType | null>(null);
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);

  const [noteDialog, setNoteDialog] = useState<{ open: boolean; report: ReportItem | null; action: string }>({
    open: false,
    report: null,
    action: "",
  });
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [areaData, setAreaData] = useState<Record<string, unknown> | null>(null);
  const [editingArea, setEditingArea] = useState(false);
  const [savingArea, setSavingArea] = useState(false);

  const loadMe = useCallback(async () => {
    const res = await getMe({
      _id: 1,
      first_name: 1,
      last_name: 1,
      email: 1,
      level: 1,
      isRegionalManager: 1,
      managesCountry: { _id: 1, name: 1 },
      managesProvince: { _id: 1, name: 1 },
      managesCity: { _id: 1, name: 1 },
      regionalManagerRequests: { _id: 1, status: 1 },
    });

    if (res.success && res.body) {
      setMe(res.body as MeType);
    }
    return res.body as MeType | null;
  }, []);

  const loadRequest = useCallback(async (userId: string, meData: MeType) => {
    const reqList = meData.regionalManagerRequests || [];
    if (reqList.length === 0) return;
    const rank: Record<string, number> = { Approved: 3, Pending: 2, Rejected: 1 };
    const best = reqList.reduce<{ _id?: string; status?: string } | null>(
      (acc, item) => {
        if (!acc) return item;
        return (rank[item.status || ""] || 0) > (rank[acc.status || ""] || 0)
          ? item
          : acc;
      },
      null,
    );
    const reqId = best?._id;
    if (!reqId) return;
    const res = await getRegionalRequest(
      { _id: reqId },
      {
        _id: 1,
        status: 1,
        areaType: 1,
        justification: 1,
        reviewNote: 1,
        decidedAt: 1,
        country: { _id: 1, name: 1 },
        province: { _id: 1, name: 1 },
        city: { _id: 1, name: 1 },
      },
    );
    if (res.success && res.body) {
      setRequest(res.body as RequestItem);
    }
  }, []);

  const loadReports = useCallback(async () => {
    setReportsLoading(true);
    const res = await getsMyArea(
      { page: 1, limit: 100, sortBy: "createdAt", sortOrder: "desc" },
      {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
        priority: 1,
        reviewNote: 1,
        crime_occurred_at: 1,
        createdAt: 1,
        attackedCountries: { _id: 1, name: 1 },
        attackedProvinces: { _id: 1, name: 1 },
        attackedCities: { _id: 1, name: 1 },
      },
    );
    setReportsLoading(false);
    if (res.success) {
      const body = res.body as { list?: ReportItem[] };
      setReports(Array.isArray(body) ? body : (body.list || []));
    }
  }, []);

  const loadAreaData = useCallback(async (meData: MeType) => {
    const countryProjection = {
      _id: 1,
      name: 1,
      english_name: 1,
      wars_history: 1,
      conflict_timeline: 1,
      casualties_info: 1,
      international_response: 1,
      war_crimes_documentation: 1,
      human_rights_violations: 1,
      genocide_info: 1,
      chemical_weapons_info: 1,
      displacement_info: 1,
      reconstruction_status: 1,
      international_sanctions: 1,
      notable_war_events: 1,
    } as const;
    const provinceCityProjection = {
      _id: 1,
      name: 1,
      english_name: 1,
      wars_history: 1,
      conflict_timeline: 1,
      casualties_info: 1,
      notable_battles: 1,
      occupation_info: 1,
      destruction_level: 1,
      civilian_impact: 1,
      mass_graves_info: 1,
      war_crimes_events: 1,
      liberation_info: 1,
    } as const;
    if (meData.managesCountry?._id) {
      const res = await getCountry({ _id: meData.managesCountry._id }, countryProjection);
      if (res.success && res.body) {
        const body = res.body as Record<string, unknown> | Record<string, unknown>[];
        setAreaData(Array.isArray(body) ? (body[0] || null) : body);
      }
    } else if (meData.managesProvince?._id) {
      const res = await getProvince({ _id: meData.managesProvince._id }, provinceCityProjection);
      if (res.success && res.body) {
        const body = res.body as Record<string, unknown> | Record<string, unknown>[];
        setAreaData(Array.isArray(body) ? (body[0] || null) : body);
      }
    } else if (meData.managesCity?._id) {
      const res = await getCity({ _id: meData.managesCity._id }, provinceCityProjection);
      if (res.success && res.body) {
        const body = res.body as Record<string, unknown> | Record<string, unknown>[];
        setAreaData(Array.isArray(body) ? (body[0] || null) : body);
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      const meData = await loadMe();
      if (meData) {
        await loadRequest(meData._id, meData);
        if (meData.isRegionalManager) {
          await Promise.all([loadReports(), loadAreaData(meData)]);
        }
      }
      setLoading(false);
    })();
  }, [loadMe, loadRequest, loadReports, loadAreaData]);

  const managedAreaName =
    me?.managesCountry?.name || me?.managesProvince?.name || me?.managesCity?.name;

  const openNoteDialog = (report: ReportItem, action: string) => {
    setNote("");
    setNoteDialog({ open: true, report, action });
  };

  const handleStatusChange = async (report: ReportItem, status: string, reviewNote?: string) => {
    setSubmitting(true);
    const res = await updateStatus(
      { _id: report._id || "", status: status as "Pending" | "Approved" | "Rejected" | "InReview", reviewNote },
      { _id: 1 },
    );
    setSubmitting(false);
    setNoteDialog({ open: false, report: null, action: "" });

    if (res.success) {
      toast({ title: t("statusUpdated") });
      setReports((prev) =>
        prev.map((r) => (r._id === report._id ? { ...r, status: status as ReportItem["status"] } : r)),
      );
    } else {
      toast({ variant: "destructive", title: t("commonError"), description: res.body?.message });
    }
  };

  const handleAreaInfoSave = async (payload: Record<string, unknown>) => {
    setSavingArea(true);
    let res: { success: boolean; body?: { message?: string } };
    if (me?.managesCountry?._id) {
      res = await updateCountry(payload as never, { _id: 1 });
    } else if (me?.managesProvince?._id) {
      res = await updateProvince(payload as never, { _id: 1 });
    } else if (me?.managesCity?._id) {
      res = await updateCity(payload as never, { _id: 1 });
    } else {
      res = { success: false, body: { message: "no area" } };
    }
    setSavingArea(false);

    if (res.success) {
      toast({ title: t("areaInfoUpdated") });
      setEditingArea(false);
      if (me) await loadAreaData(me);
    } else {
      toast({ variant: "destructive", title: t("areaInfoUpdateError"), description: res.body?.message });
    }
  };

  if (loading) {
    return (
      <PageContainer showHeader={false} contentClassName="">
        <div className="container mx-auto px-4 md:px-8 py-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-crimson" />
        </div>
      </PageContainer>
    );
  }

  const isApproved = me?.isRegionalManager === true;
  const latestStatus = request?.status;
  const canApply = !isApproved && latestStatus !== "Pending";

  return (
    <PageContainer showHeader={false} contentClassName="">
      <PageHero
        icon={<ShieldCheck className="h-5 w-5 text-crimson" />}
        title={t("title")}
        description={t("subtitle")}
      />
      <div className="container mx-auto px-4 md:px-8 py-8">
        {!isApproved && (
          <div className="mx-auto max-w-lg space-y-4">
            {latestStatus === "Pending" && (
              <div className="rounded-2xl glass-strong border border-amber-500/20 p-6 text-center space-y-3">
                <Clock className="mx-auto h-10 w-10 text-amber-400" />
                <h2 className="text-lg font-semibold text-offwhite">{t("requestPendingTitle")}</h2>
                <p className="text-sm text-slate-body">{t("requestPendingDescription")}</p>
                <Badge className={statusBadgeClass["Pending"]}>{t("statusPending")}</Badge>
              </div>
            )}

            {latestStatus === "Rejected" && (
              <div className="rounded-2xl glass-strong border border-crimson/20 p-6 text-center space-y-3">
                <XCircle className="mx-auto h-10 w-10 text-crimson-light" />
                <h2 className="text-lg font-semibold text-offwhite">{t("requestRejectedTitle")}</h2>
                <p className="text-sm text-slate-body">{t("requestRejectedDescription")}</p>
                {request?.reviewNote && (
                  <div className="rounded-lg bg-white/[0.03] border border-white/10 p-3 text-start">
                    <p className="text-xs text-slate-body/70 mb-1">{t("reviewNote")}</p>
                    <p className="text-sm text-offwhite">{request.reviewNote}</p>
                  </div>
                )}
              </div>
            )}

            {canApply && (
              <div className="rounded-2xl glass-strong border border-white/[0.08] p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-offwhite">{t("applyTitle")}</h2>
                  <p className="text-sm text-slate-body">{t("applyDescription")}</p>
                </div>
                <RegionalApplyForm onSuccess={loadMe} />
              </div>
            )}
          </div>
        )}

        {isApproved && (
          <div className="space-y-6">
            {/* Assignment card */}
            <div className="rounded-2xl glass-strong border border-white/[0.08] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-body/60">{t("managedArea")}</p>
                    <p className="text-lg font-semibold text-offwhite">{managedAreaName || t("noArea")}</p>
                  </div>
                </div>
                <Badge className={statusBadgeClass["Approved"]}>
                  <CheckCircle2 className="me-1 h-3 w-3" /> {t("requestApprovedTitle")}
                </Badge>
              </div>
            </div>

            {/* Reports in area */}
            <div className="rounded-2xl glass-strong border border-white/[0.08] p-6">
              <h3 className="mb-4 text-base font-semibold text-offwhite">{t("areaReportsTitle")}</h3>

              {reportsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-crimson" />
                </div>
              ) : reports.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title={t("noReports")}
                  description=""
                  className="border-white/[0.06] bg-white/[0.02] min-h-[200px]"
                />
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-offwhite">{report.title}</p>
                        <p className="mt-0.5 text-xs text-slate-body/70">
                          {tReport("status")}: {report.status} •{" "}
                          {report.attackedCities?.map((c) => c.name).filter(Boolean).join(", ") ||
                            report.attackedProvinces?.map((p) => p.name).filter(Boolean).join(", ") ||
                            report.attackedCountries?.map((c) => c.name).filter(Boolean).join(", ") ||
                            "—"}
                        </p>
                        {report.reviewNote && (
                          <p className="mt-1 text-xs text-slate-body/70">Note: {report.reviewNote}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={report.status === "Approved" ? statusBadgeClass["Approved"] : report.status === "Rejected" ? statusBadgeClass["Rejected"] : statusBadgeClass["Pending"]}
                        >
                          {report.status}
                        </Badge>
                        {report.status !== "Approved" && (
                          <Button
                            size="sm"
                            className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            onClick={() => openNoteDialog(report, "Approved")}
                          >
                            {t("approve")}
                          </Button>
                        )}
                        {report.status !== "Rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-crimson-light hover:bg-crimson/10"
                            onClick={() => openNoteDialog(report, "Rejected")}
                          >
                            {t("reject")}
                          </Button>
                        )}
                        {report.status !== "InReview" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-400 hover:bg-amber-500/10"
                            onClick={() => handleStatusChange(report, "InReview")}
                          >
                            {t("inReview")}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Area info */}
            <div className="rounded-2xl glass-strong border border-white/[0.08] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-offwhite">{t("editAreaInfo")}</h3>
                {!editingArea && (
                  <Button size="sm" variant="outline" onClick={() => setEditingArea(true)} className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
                    <Pencil className="me-1 h-3.5 w-3.5" />
                    {t("editAreaInfo")}
                  </Button>
                )}
              </div>

              {editingArea && areaData && (
                <AreaInfoForm
                  initialData={areaData as never}
                  fields={me?.managesCountry?._id ? COUNTRY_FIELDS : PROVINCE_CITY_FIELDS}
                  saving={savingArea}
                  onSubmit={handleAreaInfoSave}
                  onCancel={() => setEditingArea(false)}
                />
              )}

              {!editingArea && areaData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-xs text-slate-body/70">Name</p>
                    <p className="text-sm text-offwhite">{(areaData as { name?: string }).name}</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-xs text-slate-body/70">English Name</p>
                    <p className="text-sm text-offwhite">{(areaData as { english_name?: string }).english_name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Note dialog */}
      <Dialog open={noteDialog.open} onOpenChange={(open) => setNoteDialog((p) => ({ ...p, open }))}>
        <DialogContent className="border-white/[0.08] bg-background/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-offwhite">
              {noteDialog.action === "Approved" ? t("approve") : t("reject")}
            </DialogTitle>
            <DialogDescription className="text-slate-body/70">{t("noteLabel")}</DialogDescription>
          </DialogHeader>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("notePlaceholder")}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson min-h-24"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="glass" onClick={() => setNoteDialog({ open: false, report: null, action: "" })} disabled={submitting}>
              {t("cancel")}
            </Button>
            <Button
              className={noteDialog.action === "Approved" ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-crimson hover:bg-crimson-light text-white"}
              disabled={submitting}
              onClick={() => noteDialog.report && handleStatusChange(noteDialog.report, noteDialog.action, note || undefined)}
            >
              {submitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {t("submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
