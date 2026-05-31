"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageContainer } from "@/components/layout/page-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  CalendarClock,
  MapPin,
  FileImage,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  Pencil,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { gets as getCategories } from "@/app/actions/category/gets";
import { gets as getTags } from "@/app/actions/tag/gets";
import { add as addReport } from "@/app/actions/report/add";
import { get as getCountry } from "@/app/actions/country/get";
import { get as getProvince } from "@/app/actions/province/get";
import { get as getCity } from "@/app/actions/city/get";
import { get as getWarCriminal } from "@/app/actions/warCriminal/get";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { reportFormSchema, LANGUAGE_MAP } from "@/types/report-schema";
import { ReqType } from "@/types/declarations";
import { StepRenderer } from "@/components/form/step-renderer";
import { ReportStepper } from "@/components/form/report/report-stepper";
import { StepWrapper } from "@/components/form/report/step-wrapper";
import { SuccessScreen } from "@/components/form/report/success-screen";
import { cn } from "@/lib/utils";

type FormData = z.infer<typeof reportFormSchema>;

const DRAFT_KEY = "report-form-draft";

const STEP_META = [
  { icon: <FileText className="h-5 w-5" />, titleKey: "step1Title", descKey: "step1Description" },
  { icon: <CalendarClock className="h-5 w-5" />, titleKey: "step2Title", descKey: "step2Description" },
  { icon: <MapPin className="h-5 w-5" />, titleKey: "step3Title", descKey: "step3Description" },
  { icon: <FileImage className="h-5 w-5" />, titleKey: "step4Title", descKey: "step4Description" },
  { icon: <ClipboardCheck className="h-5 w-5" />, titleKey: "step5Title", descKey: "step5Description" },
];

const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ["title", "description"],
  2: ["crime_occurred_at", "priority", "tags", "category"],
  3: [
    "location",
    "hostileCountryIds",
    "attackedCountryIds",
    "attackedProvinceIds",
    "attackedCityIds",
    "warCriminalIds",
  ],
  4: ["documents"],
};

export default function MultiStepReportPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | undefined>();
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
  const [countryNameMap, setCountryNameMap] = useState<Record<string, string>>({});
  const [provinceNameMap, setProvinceNameMap] = useState<Record<string, string>>({});
  const [cityNameMap, setCityNameMap] = useState<Record<string, string>>({});
  const [warCriminalNameMap, setWarCriminalNameMap] = useState<Record<string, string>>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRtl = locale === "fa" || locale === "ar";

  const {
    currentStep,
    totalSteps,
    completedSteps,
    nextStep,
    prevStep,
    goToStep,
    clearProgress,
  } = useMultiStepForm({ initialStep: 1, totalSteps: 5 });

  const form = useForm<FormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
      selected_language: locale as FormData["selected_language"],
      crime_occurred_at: "",
      address: "",
      hostileCountryIds: [],
      attackedCountryIds: [],
      attackedProvinceIds: [],
      attackedCityIds: [],
      warCriminalIds: [],
      location: undefined,
      status: "Pending",
      priority: undefined,
      tags: [],
      category: undefined,
      documents: [],
    },
  });

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResult, tagsResult] = await Promise.all([
          getCategories({ page: 1, limit: 100 }, { _id: 1, name: 1 }),
          getTags({ page: 1, limit: 100 }, { _id: 1, name: 1 }),
        ]);
        if (categoriesResult.success && categoriesResult.body) {
          setCategories(categoriesResult.body);
        }
        if (tagsResult.success && tagsResult.body) {
          setAvailableTags(
            tagsResult.body.map((tag: { _id: string; name: string }) => ({
              id: tag._id,
              name: tag.name,
            })),
          );
        }
      } catch {
        // Silent
      }
    };
    loadData();
  }, []);

  // Auto-save draft
  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form.getValues()));
      setIsSavingDraft(true);
      setTimeout(() => setIsSavingDraft(false), 1000);
    } catch {
      // localStorage might be full
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
      draftTimerRef.current = setTimeout(saveDraft, 2000);
    });
    return () => {
      subscription.unsubscribe();
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>;
        if (parsed.title || parsed.description || parsed.crime_occurred_at) {
          form.reset({
            ...form.control._defaultValues,
            ...parsed,
            selected_language: (parsed.selected_language || locale) as FormData["selected_language"],
          });
          toast({ title: t("report.draftRestored"), description: t("report.draftRestoredDescription") });
        }
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load entity names for review step
  useEffect(() => {
    if (currentStep !== 5) return;

    const loadEntityNames = async () => {
      const vals = form.getValues();

      const countryIds = [...new Set([...(vals.hostileCountryIds || []), ...(vals.attackedCountryIds || [])])];
      if (countryIds.length > 0) {
        const results = await Promise.allSettled(
          countryIds.map((id) => getCountry({ _id: id }, { _id: 1, name: 1 })),
        );
        const map: Record<string, string> = {};
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value.success) {
            const entity = Array.isArray(r.value.body) ? r.value.body[0] : r.value.body;
            if (entity?._id && entity?.name) map[entity._id] = entity.name;
          }
        });
        setCountryNameMap(map);
      }

      const provinceIds = [...new Set(vals.attackedProvinceIds || [])];
      if (provinceIds.length > 0) {
        const results = await Promise.allSettled(
          provinceIds.map((id) => getProvince({ _id: id }, { _id: 1, name: 1 })),
        );
        const map: Record<string, string> = {};
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value.success) {
            const entity = Array.isArray(r.value.body) ? r.value.body[0] : r.value.body;
            if (entity?._id && entity?.name) map[entity._id] = entity.name;
          }
        });
        setProvinceNameMap(map);
      }

      const cityIds = [...new Set(vals.attackedCityIds || [])];
      if (cityIds.length > 0) {
        const results = await Promise.allSettled(
          cityIds.map((id) => getCity({ _id: id }, { _id: 1, name: 1 })),
        );
        const map: Record<string, string> = {};
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value.success) {
            const entity = Array.isArray(r.value.body) ? r.value.body[0] : r.value.body;
            if (entity?._id && entity?.name) map[entity._id] = entity.name;
          }
        });
        setCityNameMap(map);
      }

      const wcIds = [...new Set(vals.warCriminalIds || [])];
      if (wcIds.length > 0) {
        const results = await Promise.allSettled(
          wcIds.map((id) => getWarCriminal({ _id: id }, { _id: 1, fullName: 1 })),
        );
        const map: Record<string, string> = {};
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value.success) {
            const entity = Array.isArray(r.value.body) ? r.value.body[0] : r.value.body;
            if (entity?._id && entity?.fullName) map[entity._id] = entity.fullName;
          }
        });
        setWarCriminalNameMap(map);
      }
    };

    loadEntityNames();
  }, [currentStep, form]);

  const handleSaveDraft = () => {
    saveDraft();
    toast({ title: t("report.draftSaved"), description: t("report.draftSavedDescription") });
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const documentIds = data.documents || [];
      const result = await addReport(
        {
          title: data.title,
          description: data.description,
          tags: data.tags,
          category: data.category,
          location: data.location
            ? { type: "Point", coordinates: [data.location.longitude || 0, data.location.latitude || 0] }
            : undefined,
          documentIds,
          status: "Pending",
          crime_occurred_at: new Date(data.crime_occurred_at),
          hostileCountryIds: data.hostileCountryIds,
          attackedCountryIds: data.attackedCountryIds,
          attackedProvinceIds: data.attackedProvinceIds,
          attackedCityIds: data.attackedCityIds,
          warCriminalIds: data.warCriminalIds,
          selected_language: data.selected_language,
          priority: data.priority,
        } as ReqType["main"]["report"]["add"]["set"],
        { _id: 1 },
      );

      if (result.success) {
        const reportId = (result.body as { _id?: string })?._id;
        setSubmittedReportId(reportId);
        localStorage.removeItem(DRAFT_KEY);
        clearProgress();
        setSuccess(true);
        toast({ title: t("common.success"), description: t("report.reportSubmittedSuccess") });
      } else {
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: t("report.reportFailedError"),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("common.unexpectedError"),
      });
    }
    setLoading(false);
  };

  const handleSubmitReport = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: t("report.reportFailedError"),
        });
        setLoading(false);
        return;
      }
      const data = form.getValues() as FormData;
      await onSubmit(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("common.unexpectedError"),
      });
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep] || [];
    const isValid = await form.trigger(fields);
    if (isValid) {
      const data = form.getValues() as unknown as Record<string, unknown>;
      await nextStep(data);
    }
  };

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step) || step < currentStep) {
      goToStep(step);
    }
  };

  if (success) {
    return <SuccessScreen reportId={submittedReportId} locale={locale} />;
  }

  const meta = STEP_META[currentStep - 1];
  const showReview = currentStep === totalSteps;
  const vals = form.watch();

  // ─── Review section ───
  const renderReview = () => {
    const tr = t;
    const selectedCategory = categories.find((c) => c._id === vals.category);
    const selectedTags = availableTags.filter((tag) => vals.tags?.includes(tag.id));
    const priorityLabel = vals.priority ? tr(`report.priority${vals.priority}`) : null;
    const languageLabel = LANGUAGE_MAP[vals.selected_language as keyof typeof LANGUAGE_MAP] || vals.selected_language;

    const sections = [
      {
        step: 1,
        title: tr("report.step1Title"),
        items: [
          { label: tr("report.reportTitle"), value: vals.title },
          { label: tr("report.description"), value: vals.description, truncate: true },
          { label: tr("report.language"), value: languageLabel },
        ],
      },
      {
        step: 2,
        title: tr("report.step2Title"),
        items: [
          { label: tr("report.crimeOccurredAt"), value: vals.crime_occurred_at },
          { label: tr("report.priority"), value: priorityLabel || "-" },
          {
            label: tr("report.category"),
            value: selectedCategory?.name || vals.category || "-",
          },
          {
            label: tr("report.tags"),
            value: selectedTags.length > 0 ? selectedTags.map((t) => t.name).join(", ") : "-",
          },
        ],
      },
      {
        step: 3,
        title: tr("report.step3Title"),
        items: [
          {
            label: tr("report.hostileCountries"),
            value: vals.hostileCountryIds?.length
              ? vals.hostileCountryIds.map((id: string) => countryNameMap[id]).filter(Boolean).join(", ")
              : "-",
          },
          {
            label: tr("report.attackedCountries"),
            value: vals.attackedCountryIds?.length
              ? vals.attackedCountryIds.map((id: string) => countryNameMap[id]).filter(Boolean).join(", ")
              : "-",
          },
          {
            label: tr("report.attackedProvinces"),
            value: vals.attackedProvinceIds?.length
              ? vals.attackedProvinceIds.map((id: string) => provinceNameMap[id]).filter(Boolean).join(", ")
              : "-",
          },
          {
            label: tr("report.attackedCities"),
            value: vals.attackedCityIds?.length
              ? vals.attackedCityIds.map((id: string) => cityNameMap[id]).filter(Boolean).join(", ")
              : "-",
          },
          {
            label: tr("report.warCriminals"),
            value: vals.warCriminalIds?.length
              ? vals.warCriminalIds.map((id: string) => warCriminalNameMap[id]).filter(Boolean).join(", ")
              : "-",
          },
          { label: tr("report.address"), value: vals.address || "-" },
        ],
      },
      {
        step: 4,
        title: tr("report.step4Title"),
        items: [
          {
            label: tr("report.documents"),
            value: vals.documents?.length ? tr("report.documentsAttached", { count: vals.documents.length }) : tr("report.noneAttached"),
          },
        ],
      },
    ];

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl bg-crimson/5 border border-crimson/10 px-4 py-3">
          <Shield className="h-5 w-5 shrink-0 text-crimson" />
          <p className="text-sm text-slate-body">{tr("report.reviewShield")}</p>
        </div>

        {sections.map((section) => (
          <div key={section.step} className="rounded-xl glass-light overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <h4 className="text-sm font-semibold text-offwhite">{section.title}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => goToStep(section.step)}
                className="text-crimson hover:text-crimson-light hover:bg-crimson/10 h-8 px-2 gap-1"
              >
                <Pencil className="h-3 w-3" />
                <span className="text-xs">{tr("report.edit")}</span>
              </Button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 px-4 py-2.5">
                  <span className="text-xs text-slate-body/60 shrink-0 w-28">{item.label}</span>
                  <span
                    className={cn(
                      "text-xs text-offwhite text-end",
                      item.truncate && "line-clamp-2 max-w-[280px]",
                    )}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Confirmation */}
        <div className="flex items-center gap-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-sm text-slate-body">{tr("report.reviewConfirm")}</p>
        </div>
      </div>
    );
  };

  return (
    <PageContainer showHeader={false}>

      <div className="container relative mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-offwhite md:text-3xl"
          >
            {t("report.newReport")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 text-sm text-slate-body/70 max-w-lg mx-auto"
          >
            {t("report.newReportDescription")}
          </motion.p>
        </div>

        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 rounded-2xl glass-strong px-6 py-6 md:px-8"
        >
          <ReportStepper
            currentStep={currentStep}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </motion.div>

        {/* Screen reader live region */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {t("common.step")} {currentStep} {t("common.of")} {totalSteps}:{" "}
          {t(`report.${meta.titleKey}`)}
        </div>

        {/* Step Content */}
        <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!showReview) handleNext();
              }}
            >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {showReview ? (
                  <StepWrapper
                    step={currentStep}
                    title={t(`report.${meta.titleKey}`)}
                    description={t(`report.${meta.descKey}`)}
                    icon={meta.icon}
                  >
                    {renderReview()}
                  </StepWrapper>
                ) : (
                  <StepWrapper
                    step={currentStep}
                    title={t(`report.${meta.titleKey}`)}
                    description={t(`report.${meta.descKey}`)}
                    icon={meta.icon}
                  >
                    <StepRenderer
                      step={currentStep}
                      control={form.control}
                      errors={form.formState.errors}
                      setValue={form.setValue}
                      watch={form.watch}
                      categories={categories}
                      availableTags={availableTags}
                      disabled={loading}
                      locale={locale}
                    />
                  </StepWrapper>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Footer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6"
            >
              <div className="rounded-2xl glass-strong px-6 py-4 md:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(currentStep > 1 && !loading) ? prevStep : undefined}
                      className={cn(
                        "border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white transition-all",
                        currentStep === 1 && "opacity-0 pointer-events-none",
                        loading && "opacity-50 pointer-events-none",
                      )}
                    >
                      <ChevronLeft className={cn("h-4 w-4", isRtl && "rotate-180")} />
                      <span className="ms-2 hidden sm:inline">{t("report.previous")}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className="text-slate-body/50 hover:text-offwhite text-xs gap-1.5"
                    >
                      <Save
                        className={cn("h-3.5 w-3.5", isSavingDraft && "text-emerald-400")}
                      />
                      <span className="hidden sm:inline">
                        {isSavingDraft ? t("report.saved") : t("report.saveDraft")}
                      </span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-slate-body/40 sm:inline">
                      {t("common.step")} {currentStep} {t("common.of")} {totalSteps}
                    </span>

                    {showReview ? (
                      <Button
                        type="button"
                        disabled={loading}
                        onClick={handleSubmitReport}
                        className="bg-crimson hover:bg-crimson-light text-white gap-2 min-w-[140px] animate-pulse-glow"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t("common.loading")}
                          </>
                        ) : (
                          <>
                            {t("report.submitReport")}
                            <ChevronRight className={cn("h-4 w-4", isRtl && "hidden")} />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-crimson hover:bg-crimson-light text-white gap-2"
                      >
                        {t("report.next")}
                        <ChevronRight className={cn("h-4 w-4", isRtl && "hidden")} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </form>
        </Form>
      </div>
    </PageContainer>
  );
}
