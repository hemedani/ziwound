"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { gets as getCategories } from "@/app/actions/category/gets";
import { gets as getTags } from "@/app/actions/tag/gets";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { add as addReport } from "@/app/actions/report/add";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Stepper } from "@/components/form/stepper";
import { StepRenderer } from "@/components/form/step-renderer";
import { Form } from "@/components/ui/form";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { reportFormSchema } from "@/types/report-schema";
import { ReqType } from "@/types/declarations";
import { useToast } from "@/components/ui/use-toast";

type FormData = z.infer<typeof reportFormSchema>;

export default function MultiStepReportPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);

  const {
    currentStep,
    totalSteps,
    completedSteps,
    nextStep,
    prevStep,
    goToStep,
    getAllData,
    clearProgress,
  } = useMultiStepForm({ initialStep: 1, totalSteps: 5 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesResult = await getCategories({ page: 1, limit: 100 }, { _id: 1, name: 1 });
        if (categoriesResult.success && categoriesResult.body) {
          setCategories(categoriesResult.body);
        }

        const tagsResult = await getTags({ page: 1, limit: 100 }, { _id: 1, name: 1 });
        if (tagsResult.success && tagsResult.body) {
          setAvailableTags(
            tagsResult.body.map((tag: { _id: string; name: string }) => ({
              id: tag._id,
              name: tag.name,
            })),
          );
        }
      } catch (error) {
        console.error("Error loading categories and tags:", error);
      }
    };

    loadData();
  }, []);

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
      location: undefined,
      status: "Pending",
      priority: undefined,
      tags: [],
      category: undefined,
      documents: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const documentIds = data.documents || [];

      const result = await addReport({
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
        selected_language: data.selected_language,
        priority: data.priority,
      } as ReqType["main"]["report"]["add"]["set"]);

      if (result.success) {
        clearProgress();
        setSuccess(true);
        toast({
          title: t("common.success"),
          description: t("report.reportSubmitted"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: result.error || t("report.reportFailed"),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }

    setLoading(false);
  };

  const handleNext = async () => {
    const data = form.getValues();
    const stepFields: Record<number, (keyof FormData)[]> = {
      1: ["title", "description"],
      2: ["crime_occurred_at", "priority", "tags", "category"],
      3: [
        "location",
        "hostileCountryIds",
        "attackedCountryIds",
        "attackedProvinceIds",
        "attackedCityIds",
      ],
      4: ["documents"],
    };

    const fields = stepFields[currentStep] || [];
    const isValid = await form.trigger(fields);

    if (isValid) {
      await nextStep(data);
    }
  };

  if (success) {
    return (
      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_transparent_60%)]" />
        <div className="relative w-full max-w-md">
          <div className="rounded-2xl glass-strong p-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-offwhite mb-2">{t("common.success")}</h1>
            <p className="text-slate-body mb-8">{t("report.reportSubmitted")}</p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                asChild
                className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
              >
                <Link href="/reports/my">{t("report.myReports")}</Link>
              </Button>
              <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
                <Link href="/">{t("common.back")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div aria-live="polite" aria-atomic="true" className="sr-only" suppressHydrationWarning>
        {t("common.step")} {currentStep} {t("common.of")} {totalSteps}:{" "}
        {currentStep === 1 && t("report.step1Title")}
        {currentStep === 2 && t("report.step2Title")}
        {currentStep === 3 && t("report.step3Title")}
        {currentStep === 4 && t("report.step4Title")}
        {currentStep === 5 && t("report.step5Title")}
      </div>
      <div className="rounded-2xl glass-strong overflow-hidden">
        <div className="p-6 md:p-8 border-b border-white/5">
          <h1 className="text-2xl font-bold text-offwhite">{t("report.newReport")}</h1>
          <p className="text-slate-body mt-1">{t("report.newReportDescription")}</p>
        </div>
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <Stepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              completedSteps={completedSteps}
              onStepClick={(step) => {
                if (completedSteps.includes(step) || step < currentStep) {
                  goToStep(step);
                }
              }}
            />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Form {...form}>
              {currentStep < 5 ? (
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
              ) : (
                <div className="space-y-6">
                  <div className="rounded-xl glass-light p-5">
                    <h3 className="font-semibold text-offwhite mb-4">{t("report.step5Title")}</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.reportTitle")}</span>
                        <span className="text-offwhite">{form.getValues("title")}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.description")}</span>
                        <span className="text-offwhite text-end max-w-xs truncate">{form.getValues("description")}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.language")}</span>
                        <span className="text-offwhite">{form.getValues("selected_language")}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.hostileCountries") || "Hostile Countries"}</span>
                        <span className="text-offwhite">{(form.getValues("hostileCountryIds") || []).length > 0 ? (form.getValues("hostileCountryIds") || []).join(", ") : "-"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.attackedCountries") || "Attacked Countries"}</span>
                        <span className="text-offwhite">{(form.getValues("attackedCountryIds") || []).length > 0 ? (form.getValues("attackedCountryIds") || []).join(", ") : "-"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.attackedProvinces") || "Attacked Provinces"}</span>
                        <span className="text-offwhite">{(form.getValues("attackedProvinceIds") || []).length > 0 ? (form.getValues("attackedProvinceIds") || []).join(", ") : "-"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.attackedCities") || "Attacked Cities"}</span>
                        <span className="text-offwhite">{(form.getValues("attackedCityIds") || []).length > 0 ? (form.getValues("attackedCityIds") || []).join(", ") : "-"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.crimeOccurredAt")}</span>
                        <span className="text-offwhite">{form.getValues("crime_occurred_at")}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.priority")}</span>
                        <span className="text-offwhite">{form.getValues("priority") || "-"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.category")}</span>
                        <span className="text-offwhite">{form.getValues("category") ? categories.find((c) => c._id === form.getValues("category"))?.name || "-" : "-"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-medium text-slate-body">{t("report.tags")}</span>
                        <span className="text-offwhite">{(form.getValues("tags") || []).length > 0 ? (form.getValues("tags") || []).map((tagId) => { const tag = availableTags.find((t) => t.id === tagId); return tag?.name || tagId; }).join(", ") : "-"}</span>
                      </div>
                      {form.getValues("documents") && form.getValues("documents")!.length > 0 && (
                        <div className="pt-2">
                          <span className="font-medium text-slate-body">{t("report.documents")}</span>
                          <div className="mt-2 space-y-2">
                            {form.getValues("documents")!.map((docId, idx) => (
                              <div key={idx} className="rounded-lg glass-light p-3 text-xs">
                                <span className="font-medium text-offwhite">{t("report.document")} #{idx + 1}:</span>{" "}
                                <span className="text-slate-body">{docId}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Form>
          </form>
        </div>
        <div className="flex justify-between gap-4 p-6 md:p-8 border-t border-white/5">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            suppressHydrationWarning
            className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="me-2 h-4 w-4" />
            {t("report.previous")}
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={loading} className="bg-crimson hover:bg-crimson-light text-white gap-2">
              {t("report.next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)} disabled={loading} className="bg-crimson hover:bg-crimson-light text-white gap-2 animate-pulse-glow">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? t("common.loading") : t("report.submitReport")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
