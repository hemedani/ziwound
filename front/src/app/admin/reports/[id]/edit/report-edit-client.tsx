"use client";

import { useState, useTransition, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Plus,
  X,
  Trash2,
  Check,
  FileText,
  ImageIcon,
  Search,
  ExternalLink,
  AlertTriangle,
  ChevronDown,
  Hash,
  Tag,
  Globe,
  MapPin,
  Building2,
  Users,
  Link2,
  Unlink,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { update as updateReport } from "@/app/actions/report/update";
import { updateRelations as updateReportRelations } from "@/app/actions/report/updateRelations";
import { add as addDocument } from "@/app/actions/document/add";
import { FileUploadField } from "@/components/form/file-upload-field";
import { AsyncSelect } from "@/components/form/async-select";
import { DatePickerField } from "@/components/form/date-picker-field";
import { getImageUploadUrl } from "@/utils/imageUrl";
import {
  REPORT_STATUS,
  REPORT_PRIORITY,
  REPORT_LANGUAGES,
} from "@/types/report-schema";

const LocationPicker = dynamic(
  () => import("@/components/form/location-picker").then((mod) => mod.LocationPicker),
  { ssr: false },
);

/* ─── Types ─── */

interface SelectOption {
  _id: string;
  name: string;
  [key: string]: unknown;
}

interface WarCriminalOption {
  _id: string;
  fullName: string;
  status?: string;
}

interface Props {
  report: Record<string, unknown>;
  reportId: string;
  allTags: SelectOption[];
  allCategories: SelectOption[];
  allCountries: SelectOption[];
  allProvinces: SelectOption[];
  allCities: SelectOption[];
  allWarCriminals: WarCriminalOption[];
  allDocuments: SelectOption[];
}

interface ReportData {
  _id?: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  selected_language?: string;
  crime_occurred_at?: string | Date;
  address?: string;
  location?: { type: string; coordinates: [number, number] };
  category?: { _id?: string; name?: string };
  tags?: { _id?: string; name?: string }[];
  documents?: { _id?: string; title?: string }[];
  hostileCountries?: { _id?: string; name?: string }[];
  attackedCountries?: { _id?: string; name?: string }[];
  attackedProvinces?: { _id?: string; name?: string }[];
  attackedCities?: { _id?: string; name?: string }[];
  warCriminals?: { _id?: string; fullName?: string }[];
}

/* ─── Helpers ─── */

const languageNames: Record<string, string> = {
  fa: "فارسی", en: "English", ar: "العربية", zh: "中文",
  pt: "Português", es: "Español", nl: "Nederlands", tr: "Türkçe", ru: "Русский",
};

function extractIds(items: { _id?: string }[] | undefined): string[] {
  return items?.map((i) => i._id).filter(Boolean) as string[] || [];
}

/* ─── Tab Components ─── */

function TabBasicInfo({
  report,
  reportId,
}: {
  report: ReportData;
  reportId: string;
}) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: report.title || "",
    description: report.description || "",
    status: report.status || "Pending",
    priority: report.priority || "Medium",
    selected_language: report.selected_language || "fa",
    crime_occurred_at: report.crime_occurred_at
      ? (typeof report.crime_occurred_at === "string"
          ? report.crime_occurred_at.slice(0, 10)
          : new Date(report.crime_occurred_at).toISOString().slice(0, 10))
      : "",
    address: report.address || "",
  });

  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>(() => {
    if (report.location?.coordinates) {
      return { lng: report.location.coordinates[0], lat: report.location.coordinates[1] };
    }
    return {};
  });

  const handleSubmit = async () => {
    const payload: Record<string, unknown> = { _id: reportId };
    if (form.title !== report.title) payload.title = form.title;
    if (form.description !== report.description) payload.description = form.description;
    if (form.status !== report.status) payload.status = form.status;
    if (form.priority !== report.priority) payload.priority = form.priority;
    if (form.selected_language !== report.selected_language) payload.selected_language = form.selected_language;
    if (form.crime_occurred_at !== (report.crime_occurred_at ? new Date(report.crime_occurred_at).toISOString().slice(0, 10) : "")) {
      payload.crime_occurred_at = form.crime_occurred_at ? new Date(form.crime_occurred_at) : undefined;
    }
    if (form.address !== (report.address || "")) payload.address = form.address || undefined;

    const prevCoords = report.location?.coordinates;
    const coordsChanged =
      (coords.lat !== undefined && coords.lng !== undefined) &&
      (!prevCoords || prevCoords[0] !== coords.lng || prevCoords[1] !== coords.lat);
    if (coordsChanged) {
      payload.location = { type: "Point", coordinates: [coords.lng, coords.lat] as [number, number] };
    } else if (prevCoords && coords.lat === undefined) {
      payload.location = undefined;
    }

    if (Object.keys(payload).length <= 1) {
      toast({ title: t("noChanges") || "No changes", description: t("noChangesDesc") || "No fields were modified" });
      return;
    }

    const res = await updateReport(payload as any, { _id: 1 });
    if (res?.success) {
      toast({ title: t("success") || "Success", description: t("fieldsUpdated") || "Basic fields updated" });
      startTransition(() => router.refresh());
    } else {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: res?.body?.message || t("failedToSave") || "Failed to save",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <GlassCard>
        <div className="mb-1">
          <label className="block text-xs font-medium text-slate-body mb-1.5">{t("title") || "Title"}</label>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/40 h-10"
          />
        </div>
      </GlassCard>

      {/* Description */}
      <GlassCard>
        <div className="mb-1">
          <label className="block text-xs font-medium text-slate-body mb-1.5">{t("description") || "Description"}</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={8}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/40 resize-y min-h-[160px]"
          />
        </div>
      </GlassCard>

      {/* Two-column fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="mb-1">
            <label className="block text-xs font-medium text-slate-body mb-1.5">{t("status") || "Status"}</label>
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                {["Pending", "Approved", "Rejected", "InReview"].map((s) => (
                  <SelectItem key={s} value={s} className="text-offwhite focus:bg-white/10">
                    {t(statusLabel(s))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-1">
            <label className="block text-xs font-medium text-slate-body mb-1.5">{t("priority") || "Priority"}</label>
            <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                {["High", "Medium", "Low"].map((p) => (
                  <SelectItem key={p} value={p} className="text-offwhite focus:bg-white/10">
                    {t(priorityLabel(p))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-1">
            <label className="block text-xs font-medium text-slate-body mb-1.5">{t("reportLanguage") || "Language"}</label>
            <Select value={form.selected_language} onValueChange={(v) => setForm((f) => ({ ...f, selected_language: v }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10 max-h-60">
                {REPORT_LANGUAGES.filter((l) => languageNames[l]).map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-offwhite focus:bg-white/10">
                    {languageNames[lang] || lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-1">
            <label className="block text-xs font-medium text-slate-body mb-1.5">{t("crimeOccurredAt") || "Incident Date"}</label>
            <DatePickerField
              value={form.crime_occurred_at}
              onChange={(v) => setForm((f) => ({ ...f, crime_occurred_at: v }))}
              locale={locale}
            />
          </div>
        </GlassCard>
      </div>

      {/* Location with Map */}
      <GlassCard>
        <LocationPicker
          label={t("location") || t("address") || "Location"}
          value={{
            address: form.address,
            latitude: coords.lat,
            longitude: coords.lng,
          }}
          onChange={(loc) => {
            setForm((f) => ({ ...f, address: loc.address }));
            setCoords({ lat: loc.latitude, lng: loc.longitude });
          }}
        />
      </GlassCard>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-crimson hover:bg-crimson-light text-white h-10 px-8"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t("saveChanges") || "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function TabRelations({
  report,
  reportId,
  allTags,
  allCategories,
  allCountries,
  allProvinces,
  allCities,
  allWarCriminals,
}: {
  report: ReportData;
  reportId: string;
  allTags: SelectOption[];
  allCategories: SelectOption[];
  allCountries: SelectOption[];
  allProvinces: SelectOption[];
  allCities: SelectOption[];
  allWarCriminals: WarCriminalOption[];
}) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentCategoryId = report.category?._id || "";
  const currentTagIds = extractIds(report.tags);
  const currentHostileIds = extractIds(report.hostileCountries);
  const currentAttackedCountryIds = extractIds(report.attackedCountries);
  const currentAttackedProvinceIds = extractIds(report.attackedProvinces);
  const currentAttackedCityIds = extractIds(report.attackedCities);
  const currentWarCriminalIds = extractIds(report.warCriminals);

  const [categoryId, setCategoryId] = useState(currentCategoryId);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(currentTagIds);
  const [hostileIds, setHostileIds] = useState<string[]>(currentHostileIds);
  const [attackedCountryIds, setAttackedCountryIds] = useState<string[]>(currentAttackedCountryIds);
  const [attackedProvinceIds, setAttackedProvinceIds] = useState<string[]>(currentAttackedProvinceIds);
  const [attackedCityIds, setAttackedCityIds] = useState<string[]>(currentAttackedCityIds);
  const [warCriminalIds, setWarCriminalIds] = useState<string[]>(currentWarCriminalIds);

  const hasChanges =
    categoryId !== currentCategoryId ||
    JSON.stringify(selectedTagIds.sort()) !== JSON.stringify(currentTagIds.sort()) ||
    JSON.stringify(hostileIds.sort()) !== JSON.stringify(currentHostileIds.sort()) ||
    JSON.stringify(attackedCountryIds.sort()) !== JSON.stringify(currentAttackedCountryIds.sort()) ||
    JSON.stringify(attackedProvinceIds.sort()) !== JSON.stringify(currentAttackedProvinceIds.sort()) ||
    JSON.stringify(attackedCityIds.sort()) !== JSON.stringify(currentAttackedCityIds.sort()) ||
    JSON.stringify(warCriminalIds.sort()) !== JSON.stringify(currentWarCriminalIds.sort());

  const handleSubmit = async () => {
    const payload: Record<string, unknown> = { _id: reportId };

    if (categoryId !== currentCategoryId) {
      payload.category = categoryId || undefined;
    }

    const buildPatch = (newIds: string[], oldIds: string[], field: string) => {
      const toAdd = newIds.filter((id) => !oldIds.includes(id));
      const toRemove = oldIds.filter((id) => !newIds.includes(id));
      if (toAdd.length > 0) payload[`${field}Ids`] = toAdd;
      if (toRemove.length > 0) payload[`${field}IdsToRemove`] = toRemove;
    };

    buildPatch(selectedTagIds, currentTagIds, "tag");
    buildPatch(hostileIds, currentHostileIds, "hostileCountry");
    buildPatch(attackedCountryIds, currentAttackedCountryIds, "attackedCountry");
    buildPatch(attackedProvinceIds, currentAttackedProvinceIds, "attackedProvince");
    buildPatch(attackedCityIds, currentAttackedCityIds, "attackedCity");
    buildPatch(warCriminalIds, currentWarCriminalIds, "warCriminal");

    const res = await updateReportRelations(payload as any, { _id: 1 });
    if (res?.success) {
      toast({ title: t("success") || "Success", description: t("relationsUpdated") || "Relations updated" });
      startTransition(() => router.refresh());
    } else {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: res?.body?.message || t("failedToSave") || "Failed to save",
      });
    }
  };

  const MultiSelectChips = ({
    label,
    items,
    selectedIds,
    onChange,
    placeholder,
  }: {
    label: string;
    items: { _id: string; name: string }[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    placeholder: string;
  }) => {
    const [search, setSearch] = useState("");
    const filtered = items.filter(
      (i) => i.name.toLowerCase().includes(search.toLowerCase()) && !selectedIds.includes(i._id),
    );
    const selected = items.filter((i) => selectedIds.includes(i._id));

    return (
      <div>
        <label className="block text-xs font-medium text-slate-body mb-1.5">{label}</label>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {selected.map((item) => (
              <span
                key={item._id}
                className="inline-flex items-center gap-1 rounded-full bg-crimson/10 px-2.5 py-1 text-xs font-medium text-crimson-light border border-crimson/20"
              >
                {item.name}
                <button
                  onClick={() => onChange(selectedIds.filter((id) => id !== item._id))}
                  className="hover:bg-crimson/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-body/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="ps-9 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/40 h-9 text-xs"
          />
        </div>
        {search && filtered.length > 0 && (
          <div className="mt-1.5 max-h-36 overflow-y-auto rounded-lg border border-white/[0.06] bg-[#0a0a0a]/95 p-1 space-y-0.5">
            {filtered.map((item) => (
              <button
                key={item._id}
                onClick={() => {
                  onChange([...selectedIds, item._id]);
                  setSearch("");
                }}
                className="w-full text-start px-2.5 py-1.5 text-xs text-offwhite hover:bg-white/5 rounded-md transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
        {!search && selected.length === 0 && (
          <p className="text-xs text-slate-body/40 py-2">{t("noneSelected") || "None selected"}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <GlassCard>
        <label className="block text-xs font-medium text-slate-body mb-2">{t("category") || "Category"}</label>
        <Select value={categoryId || "none"} onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}>
          <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-10">
            <SelectValue placeholder={t("selectCategory") || "Select category"} />
          </SelectTrigger>
          <SelectContent className="glass-strong border-white/10 max-h-60">
            <SelectItem value="none" className="text-slate-body focus:bg-white/10">
              {t("none") || "None"}
            </SelectItem>
            {allCategories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id} className="text-offwhite focus:bg-white/10">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </GlassCard>

      {/* Tags */}
      <GlassCard>
        <MultiSelectChips
          label={t("tags") || "Tags"}
          items={allTags}
          selectedIds={selectedTagIds}
          onChange={setSelectedTagIds}
          placeholder={t("searchTags") || "Search tags..."}
        />
      </GlassCard>

      {/* Location Relations */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-white/5 rounded-lg p-1.5">
            <MapPin className="h-4 w-4 text-gold" />
          </div>
          <h2 className="text-sm font-semibold text-offwhite">{t("locations") || "Locations"}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <MultiSelectChips
            label={t("hostileCountries") || "Hostile Countries"}
            items={allCountries}
            selectedIds={hostileIds}
            onChange={setHostileIds}
            placeholder={t("searchCountries") || "Search countries..."}
          />
          <MultiSelectChips
            label={t("attackedCountries") || "Attacked Countries"}
            items={allCountries}
            selectedIds={attackedCountryIds}
            onChange={setAttackedCountryIds}
            placeholder={t("searchCountries") || "Search countries..."}
          />
          <MultiSelectChips
            label={t("attackedProvinces") || "Attacked Provinces"}
            items={allProvinces}
            selectedIds={attackedProvinceIds}
            onChange={setAttackedProvinceIds}
            placeholder={t("searchProvinces") || "Search provinces..."}
          />
          <MultiSelectChips
            label={t("attackedCities") || "Attacked Cities"}
            items={allCities}
            selectedIds={attackedCityIds}
            onChange={setAttackedCityIds}
            placeholder={t("searchCities") || "Search cities..."}
          />
        </div>
      </GlassCard>

      {/* War Criminals */}
      <GlassCard>
        <MultiSelectChips
          label={t("warCriminals") || "War Criminals"}
          items={allWarCriminals.map((wc) => ({ _id: wc._id, name: wc.fullName }))}
          selectedIds={warCriminalIds}
          onChange={setWarCriminalIds}
          placeholder={t("searchWarCriminals") || "Search war criminals..."}
        />
      </GlassCard>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !hasChanges}
          className={cn(
            "h-10 px-8",
            hasChanges
              ? "bg-crimson hover:bg-crimson-light text-white"
              : "bg-white/5 text-slate-body border border-white/10",
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t("saveChanges") || "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function TabDocuments({
  report,
  reportId,
  allDocuments,
}: {
  report: ReportData;
  reportId: string;
  allDocuments: SelectOption[];
}) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const linkedDocIds = useMemo(() => extractIds(report.documents), [report.documents]);
  const linkedDocs = useMemo(
    () => allDocuments.filter((d) => linkedDocIds.includes(d._id)),
    [allDocuments, linkedDocIds],
  );
  const availableDocs = useMemo(
    () => allDocuments.filter((d) => !linkedDocIds.includes(d._id)),
    [allDocuments, linkedDocIds],
  );

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  /* ── Create new document ── */
  const [newDocForm, setNewDocForm] = useState({
    title: "",
    description: "",
    selected_language: "",
    files: [] as string[],
  });

  const handleCreateDocument = async () => {
    if (!newDocForm.title.trim()) return;
    const res = await addDocument(
      {
        title: newDocForm.title,
        description: newDocForm.description || undefined,
        selected_language: (newDocForm.selected_language || undefined) as
          | "fa"
          | "en"
          | "ar"
          | "zh"
          | "pt"
          | "es"
          | "nl"
          | "tr"
          | "ru"
          | undefined,
        documentFileIds: newDocForm.files.length > 0 ? newDocForm.files : undefined,
      },
      { _id: 1 },
    );
    if (res?.success && (res.body as { _id?: string })?._id) {
      const newDocId = (res.body as { _id: string })._id;
      const linkRes = await updateReportRelations(
        { _id: reportId, documentIds: [newDocId] },
        { _id: 1 },
      );
      if (linkRes?.success) {
        toast({ title: t("success") || "Success", description: t("documentCreated") || "Document created and linked" });
        setShowCreateDialog(false);
        setNewDocForm({ title: "", description: "", selected_language: "", files: [] });
        startTransition(() => router.refresh());
      }
    } else {
      toast({ variant: "destructive", title: t("error") || "Error", description: t("failedToCreate") || "Failed to create document" });
    }
  };

  /* ── Link existing ── */
  const [linkSearch, setLinkSearch] = useState("");
  const filteredAvailable = availableDocs.filter(
    (d) => (d.name || String(d["title"] || "")).toLowerCase().includes(linkSearch.toLowerCase()),
  );

  const handleLinkDocument = async (docId: string) => {
    const res = await updateReportRelations({ _id: reportId, documentIds: [docId] }, { _id: 1 });
    if (res?.success) {
      toast({ title: t("success") || "Success", description: t("documentLinked") || "Document linked" });
      setShowLinkDialog(false);
      startTransition(() => router.refresh());
    } else {
      toast({ variant: "destructive", title: t("error") || "Error", description: res?.body?.message || "Failed to link" });
    }
  };

  /* ── Remove document ── */
  const handleRemoveDocument = async (docId: string) => {
    setRemovingIds((prev) => [...prev, docId]);
    const res = await updateReportRelations({ _id: reportId, documentIdsToRemove: [docId] }, { _id: 1 });
    setRemovingIds((prev) => prev.filter((id) => id !== docId));
    if (res?.success) {
      toast({ title: t("success") || "Success", description: t("documentRemoved") || "Document removed from report" });
      startTransition(() => router.refresh());
    } else {
      toast({ variant: "destructive", title: t("error") || "Error", description: res?.body?.message || "Failed to remove" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Linked Documents */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/5 rounded-lg p-1.5">
              <FileText className="h-4 w-4 text-gold" />
            </div>
            <h2 className="text-sm font-semibold text-offwhite">
              {t("linkedDocuments") || "Linked Documents"}
              {linkedDocs.length > 0 && (
                <span className="text-slate-body/50 ms-1.5">({linkedDocs.length})</span>
              )}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLinkDialog(true)}
              className="border-white/10 text-slate-body hover:text-offwhite hover:bg-white/10 h-8"
            >
              <Link2 className="h-3.5 w-3.5 me-1.5" />
              {t("linkExisting") || "Link Existing"}
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="bg-crimson hover:bg-crimson-light text-white h-8"
            >
              <Plus className="h-3.5 w-3.5 me-1.5" />
              {t("createNew") || "Create New"}
            </Button>
          </div>
        </div>

        {linkedDocs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 text-slate-body/20 mx-auto mb-2" />
            <p className="text-sm text-slate-body/50">{t("noDocumentsLinked") || "No documents linked to this report"}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {linkedDocs.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-white/5 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-gold/60" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-offwhite truncate">{doc.name || String(doc["title"] || doc._id)}</p>
                    <p className="text-[10px] font-mono text-slate-body/40 truncate">{doc._id}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveDocument(doc._id)}
                  disabled={removingIds.includes(doc._id)}
                  className="text-slate-body/50 hover:text-crimson-light hover:bg-crimson/10 shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                >
                  {removingIds.includes(doc._id) ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Unlink className="h-3.5 w-3.5" />
                  )}
                  <span className="ms-1.5 text-xs">{t("remove") || "Remove"}</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* ─── Create Document Dialog ─── */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg glass-strong border-white/10">
          <DialogHeader>
            <DialogTitle className="text-offwhite flex items-center gap-2">
              <Plus className="h-5 w-5 text-gold" />
              {t("createDocument") || "Create Document"}
            </DialogTitle>
            <DialogDescription className="text-slate-body">
              {t("createDocumentDesc") || "Create a new document and link it to this report"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-slate-body mb-1.5">
                {t("title") || "Title"} <span className="text-crimson-light">*</span>
              </label>
              <Input
                value={newDocForm.title}
                onChange={(e) => setNewDocForm((f) => ({ ...f, title: e.target.value }))}
                className="bg-white/5 border-white/10 text-offwhite h-9"
                placeholder={t("documentTitlePlaceholder") || "Document title..."}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-body mb-1.5">{t("description") || "Description"}</label>
              <Textarea
                value={newDocForm.description}
                onChange={(e) => setNewDocForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/40 resize-none"
                placeholder={t("documentDescriptionPlaceholder") || "Optional description..."}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-body mb-1.5">{t("language") || "Language"}</label>
              <Select
                value={newDocForm.selected_language}
                onValueChange={(v) => setNewDocForm((f) => ({ ...f, selected_language: v }))}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-offwhite h-9">
                  <SelectValue placeholder={t("selectLanguage") || "Select language"} />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10 max-h-60">
                  {REPORT_LANGUAGES.filter((l) => languageNames[l]).map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-offwhite focus:bg-white/10">
                      {languageNames[lang] || lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-body mb-1.5">{t("files") || "Files"}</label>
              <FileUploadField
                label=""
                maxFiles={10}
                maxSize={10 * 1024 * 1024}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                value={newDocForm.files}
                onChange={(files) => setNewDocForm((f) => ({ ...f, files }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="border-white/10 text-offwhite hover:bg-white/5"
            >
              {t("cancel") || "Cancel"}
            </Button>
            <Button
              onClick={handleCreateDocument}
              disabled={!newDocForm.title.trim()}
              className="bg-crimson hover:bg-crimson-light text-white"
            >
              {t("createAndLink") || "Create & Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Link Existing Dialog ─── */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-lg glass-strong border-white/10">
          <DialogHeader>
            <DialogTitle className="text-offwhite flex items-center gap-2">
              <Link2 className="h-5 w-5 text-gold" />
              {t("linkExistingDocument") || "Link Existing Document"}
            </DialogTitle>
            <DialogDescription className="text-slate-body">
              {t("linkExistingDocumentDesc") || "Search and select a document to link to this report"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="relative mb-3">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-body/40" />
              <Input
                value={linkSearch}
                onChange={(e) => setLinkSearch(e.target.value)}
                placeholder={t("searchDocuments") || "Search documents..."}
                className="ps-9 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/40 h-9"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredAvailable.length === 0 ? (
                <p className="text-xs text-slate-body/40 text-center py-6">
                  {linkSearch ? t("noResults") || "No results" : t("allDocumentsLinked") || "All documents are already linked"}
                </p>
              ) : (
                filteredAvailable.map((doc) => (
                  <button
                    key={doc._id}
                    onClick={() => handleLinkDocument(doc._id)}
                    className="w-full text-start flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.04] transition-colors group border border-transparent hover:border-white/[0.06]"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-white/5 flex items-center justify-center">
                      <FileText className="h-3.5 w-3.5 text-gold/60" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-offwhite truncate">{doc.name || String(doc["title"] || doc._id)}</p>
                      <p className="text-[10px] text-slate-body/40 truncate">{doc._id}</p>
                    </div>
                    <Link2 className="h-3.5 w-3.5 text-slate-body/30 group-hover:text-gold transition-colors shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Main Component ─── */

function ReportEditClientInner({
  report: rawReport,
  reportId,
  defaultTab,
  allTags,
  allCategories,
  allCountries,
  allProvinces,
  allCities,
  allWarCriminals,
  allDocuments,
}: Props & { defaultTab: string }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const report = rawReport as unknown as ReportData;

  return (
    <div className="space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10" asChild>
          <Link href={`/admin/reports/${reportId}`}>
            <BackArrow className="me-2 h-4 w-4" />
            {t("backToList") || "Back"}
          </Link>
        </Button>
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-8 bg-crimson" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              {t("adminPanel")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-offwhite">
            {t("editReport") || "Edit Report"}
          </h1>
          <p className="text-slate-body mt-1 text-sm truncate max-w-xl">{report.title}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="glass-strong border border-white/[0.06] p-1 w-full sm:w-auto inline-flex h-auto gap-1">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite px-4 py-2 rounded-lg text-sm transition-all"
          >
            <Hash className="h-4 w-4 me-2" />
            {t("basicInformation") || "Basic Info"}
          </TabsTrigger>
          <TabsTrigger
            value="relations"
            className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite px-4 py-2 rounded-lg text-sm transition-all"
          >
            <Link2 className="h-4 w-4 me-2" />
            {t("relationsManagement") || "Relations"}
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body hover:text-offwhite px-4 py-2 rounded-lg text-sm transition-all"
          >
            <FileText className="h-4 w-4 me-2" />
            {t("documentsManagement") || "Documents"}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic" className="mt-0">
            <TabBasicInfo report={report} reportId={reportId} />
          </TabsContent>
          <TabsContent value="relations" className="mt-0">
            <TabRelations
              report={report}
              reportId={reportId}
              allTags={allTags}
              allCategories={allCategories}
              allCountries={allCountries}
              allProvinces={allProvinces}
              allCities={allCities}
              allWarCriminals={allWarCriminals}
            />
          </TabsContent>
          <TabsContent value="documents" className="mt-0">
            <TabDocuments
              report={report}
              reportId={reportId}
              allDocuments={allDocuments}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export function ReportEditClient(props: Props) {
  return (
    <Suspense fallback={null}>
      <ReportEditClientWithTab {...props} />
    </Suspense>
  );
}

function ReportEditClientWithTab(props: Props) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "basic";
  return <ReportEditClientInner {...props} defaultTab={defaultTab} />;
}

/* ─── GlassCard ─── */
function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl glass-strong p-5 border border-white/[0.06]", className)}>
      {children}
    </div>
  );
}

/* ─── Translation Helpers ─── */
function statusLabel(status: string): string {
  const map: Record<string, string> = {
    Pending: "status_pending", Approved: "status_approved",
    Rejected: "status_rejected", InReview: "status_in_review",
  };
  return map[status] || "status_pending";
}

function priorityLabel(priority: string): string {
  const map: Record<string, string> = {
    High: "priority_high", Medium: "priority_medium", Low: "priority_low",
  };
  return map[priority] || "priority_medium";
}

/* ─── Exports for parent page ─── */
export type { ReportData, SelectOption, WarCriminalOption };
