"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, XCircle, Undo2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { decide } from "@/app/actions/regionalManagerRequest/decide";
import { remove } from "@/app/actions/regionalManagerRequest/remove";
import type { DeepPartial, regionalManagerRequestSchema } from "@/types/declarations";

type RequestItem = DeepPartial<regionalManagerRequestSchema> & {
  country?: { _id?: string; name?: string };
  province?: { _id?: string; name?: string };
  city?: { _id?: string; name?: string };
  reviewedBy?: { _id?: string; first_name?: string; last_name?: string };
  user?: {
    _id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    level?: string;
  };
};

const statusBadge: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-crimson/10 text-crimson-light border-crimson/20",
};

function groupByArea(requests: RequestItem[]) {
  const groups = new Map<string, { key: string; areaType: string; areaName: string; requests: RequestItem[] }>();
  const areaTypeOrder: Record<string, number> = { Country: 0, Province: 1, City: 2 };

  for (const request of requests) {
    const areaName = request.country?.name || request.province?.name || request.city?.name || "—";
    const areaId = request.country?._id || request.province?._id || request.city?._id || "unknown";
    const areaType = request.areaType || "Country";
    const groupKey = `${areaType}::${areaId}`;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, { key: groupKey, areaType, areaName, requests: [] });
    }
    groups.get(groupKey)!.requests.push(request);
  }

  return [...groups.values()].sort(
    (a, b) => areaTypeOrder[a.areaType] - areaTypeOrder[b.areaType] || a.areaName.localeCompare(b.areaName),
  );
}

export function RegionalRequestsClient({
  requests,
  error,
  activeStatus,
}: {
  requests: RequestItem[];
  error: string | null;
  activeStatus?: string;
}) {
  const t = useTranslations("admin");
  const tRegional = useTranslations("regional");
  const { toast } = useToast();
  const router = useRouter();

  const [dialog, setDialog] = useState<{ open: boolean; request: RequestItem | null; decision: "Approved" | "Rejected" }>({
    open: false,
    request: null,
    decision: "Approved",
  });
  const [revokeDialog, setRevokeDialog] = useState<{ open: boolean; request: RequestItem | null }>({
    open: false,
    request: null,
  });
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = () => router.refresh();

  const handleDecide = async () => {
    if (!dialog.request?._id) return;
    setSubmitting(true);
    const res = await decide(
      { _id: dialog.request._id, decision: dialog.decision, reviewNote: note || undefined },
      { _id: 1 },
    );
    setSubmitting(false);
    setDialog({ open: false, request: null, decision: "Approved" });
    setNote("");

    if (res.success) {
      toast({ title: dialog.decision === "Approved" ? t("approve") : t("reject") });
      refresh();
    } else {
      toast({ variant: "destructive", title: t("error"), description: res.body?.message });
    }
  };

  const handleRevoke = async () => {
    const request = revokeDialog.request;
    if (!request?._id) return;
    setSubmitting(true);
    const res = await remove({ _id: request._id }, { _id: 1 });
    setSubmitting(false);
    setRevokeDialog({ open: false, request: null });
    if (res.success) {
      toast({ title: t("revoked") });
      refresh();
    } else {
      toast({ variant: "destructive", title: t("error"), description: res.body?.message });
    }
  };

  const areaName = (request: RequestItem) =>
    request.country?.name || request.province?.name || request.city?.name || tRegional("noArea");

  const levelLabel = (level?: string) => {
    if (!level) return "";
    const special = ["Reporter", "Artist", "Diplomat", "Researcher"];
    const key = special.includes(level) ? level : `level_${level}`;
    return t(key) || level;
  };

  if (error) {
    return (
      <EmptyState
        icon={XCircle}
        title={t("error")}
        description={error}
        className="border-white/[0.06] bg-white/[0.02] min-h-[300px]"
      />
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title={t("empty") || "No requests"}
        description={t("regionalRequestsDescription")}
        className="border-white/[0.06] bg-white/[0.02] min-h-[300px]"
      />
    );
  }

  const renderCard = (request: RequestItem) => (
    <div
      key={request._id}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-offwhite">
              {request.user?.first_name} {request.user?.last_name}
            </p>
            {request.user?.level && (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-body">
                {levelLabel(request.user.level)}
              </span>
            )}
            <Badge variant="outline" className={statusBadge[request.status || "Pending"]}>
              {request.status ? t(`status_${request.status}`) : t("allStatuses")}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-slate-body/70">{request.user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-white/10 text-slate-body">
              {request.areaType ? t(`areaType_${request.areaType}`) : request.areaType}
            </Badge>
            <Badge variant="outline" className="border-white/10 text-slate-body">
              {areaName(request)}
            </Badge>
            {request.decidedAt && (
              <span className="text-slate-body/50">
                {new Date(request.decidedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {request.justification && (
            <p className="mt-2 text-sm italic text-slate-body/80">
              &ldquo;{request.justification}&rdquo;
            </p>
          )}
          {request.reviewNote && (
            <p className="mt-1 text-xs text-slate-body/60">
              {t("decisionNote")}: {request.reviewNote}
            </p>
          )}
          {request.reviewedBy?.first_name && (
            <p className="mt-1 text-xs text-slate-body/50">
              {t("reviewedBy")}: {request.reviewedBy.first_name} {request.reviewedBy.last_name}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {request.status === "Pending" && (
            <>
              <Button
                size="sm"
                className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                onClick={() => {
                  setNote("");
                  setDialog({ open: true, request, decision: "Approved" });
                }}
              >
                <CheckCircle2 className="me-1 h-3.5 w-3.5" />
                {t("approveRequest")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-crimson-light hover:bg-crimson/10"
                onClick={() => {
                  setNote("");
                  setDialog({ open: true, request, decision: "Rejected" });
                }}
              >
                <XCircle className="me-1 h-3.5 w-3.5" />
                {t("rejectRequest")}
              </Button>
            </>
          )}
          {request.status === "Approved" && (
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 bg-white/5 text-slate-body hover:bg-white/10"
              onClick={() => setRevokeDialog({ open: true, request })}
              disabled={submitting}
            >
              <Undo2 className="me-1 h-3.5 w-3.5" />
              {t("revokeAccess")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const showGroups = activeStatus === "Approved";
  const groups = showGroups ? groupByArea(requests) : [];

  return (
    <div>
      {showGroups ? (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.key}>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-crimson/10 text-crimson-light">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-offwhite">
                  {t(`areaType_${group.areaType}`) || group.areaType}: {group.areaName}
                </h3>
                <span className="text-xs text-slate-body/50">({group.requests.length})</span>
              </div>
              <div className="space-y-3">{group.requests.map(renderCard)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">{requests.map(renderCard)}</div>
      )}

      <Dialog open={dialog.open} onOpenChange={(open) => setDialog((p) => ({ ...p, open }))}>
        <DialogContent className="border-white/[0.08] bg-background/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-offwhite">
              {dialog.decision === "Approved" ? t("approveRequest") : t("rejectRequest")}
            </DialogTitle>
            <DialogDescription className="text-slate-body/70">
              {dialog.request?.user?.first_name} {dialog.request?.user?.last_name} —{" "}
              {areaName(dialog.request || {})}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("decisionNote")}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson min-h-24"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="glass"
              onClick={() => setDialog({ open: false, request: null, decision: "Approved" })}
              disabled={submitting}
            >
              {t("cancel")}
            </Button>
            <Button
              className={
                dialog.decision === "Approved"
                  ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-crimson hover:bg-crimson-light text-white"
              }
              disabled={submitting}
              onClick={handleDecide}
            >
              {submitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {dialog.decision === "Approved" ? t("approveRequest") : t("rejectRequest")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={revokeDialog.open} onOpenChange={(open) => setRevokeDialog((p) => ({ ...p, open }))}>
        <DialogContent className="border-white/[0.08] bg-background/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-offwhite">{t("confirmRevokeTitle")}</DialogTitle>
            <DialogDescription className="text-slate-body/70">
              {t("confirmRevokeDescription", {
                name:
                  `${revokeDialog.request?.user?.first_name || ""} ${revokeDialog.request?.user?.last_name || ""}`.trim() ||
                  t("regionalManager"),
                area: areaName(revokeDialog.request || {}),
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="glass"
              onClick={() => setRevokeDialog({ open: false, request: null })}
              disabled={submitting}
            >
              {t("cancel")}
            </Button>
            <Button
              className="bg-crimson hover:bg-crimson-light text-white"
              disabled={submitting}
              onClick={handleRevoke}
            >
              {submitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {t("revokeAccess")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
