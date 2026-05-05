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
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-center text-2xl">{t("common.success")}</CardTitle>
            <CardDescription className="text-center">{t("report.reportSubmitted")}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/reports/my">{t("report.myReports")}</Link>
            </Button>
            <Button asChild>
              <Link href="/">{t("common.back")}</Link>
            </Button>
          </CardFooter>
        </Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t("report.newReport")}</CardTitle>
          <CardDescription>{t("report.newReportDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold mb-4">{t("report.step5Title")}</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="font-medium">{t("report.reportTitle")}:</span>{" "}
                        {form.getValues("title")}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.description")}:</span>{" "}
                        {form.getValues("description")}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.language")}:</span>{" "}
                        {form.getValues("selected_language")}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.hostileCountries") || "Hostile Countries"}:</span>{" "}
                        {(form.getValues("hostileCountryIds") || []).length > 0
                          ? (form.getValues("hostileCountryIds") || []).join(", ")
                          : "-"}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.attackedCountries") || "Attacked Countries"}:</span>{" "}
                        {(form.getValues("attackedCountryIds") || []).length > 0
                          ? (form.getValues("attackedCountryIds") || []).join(", ")
                          : "-"}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.attackedProvinces") || "Attacked Provinces"}:</span>{" "}
                        {(form.getValues("attackedProvinceIds") || []).length > 0
                          ? (form.getValues("attackedProvinceIds") || []).join(", ")
                          : "-"}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.attackedCities") || "Attacked Cities"}:</span>{" "}
                        {(form.getValues("attackedCityIds") || []).length > 0
                          ? (form.getValues("attackedCityIds") || []).join(", ")
                          : "-"}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.crimeOccurredAt")}:</span>{" "}
                        {form.getValues("crime_occurred_at")}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.priority")}:</span>{" "}
                        {form.getValues("priority") || "-"}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.category")}:</span>{" "}
                        {form.getValues("category")
                          ? categories.find((c) => c._id === form.getValues("category"))?.name || "-"
                          : "-"}
                      </div>
                      <div>
                        <span className="font-medium">{t("report.tags")}:</span>{" "}
                        {(form.getValues("tags") || []).length > 0
                          ? (form.getValues("tags") || [])
                              .map((tagId) => {
                                const tag = availableTags.find((t) => t.id === tagId);
                                return tag?.name || tagId;
                              })
                              .join(", ")
                          : "-"}
                      </div>
                      {form.getValues("documents") && form.getValues("documents")!.length > 0 && (
                        <div>
                          <span className="font-medium">{t("report.documents")}:</span>
                          <div className="mt-2 space-y-2 ml-4">
                            {form.getValues("documents")!.map((docId, idx) => (
                              <div key={idx} className="border rounded p-2 text-xs">
                                <div>
                                  <span className="font-medium">
                                    {t("report.document")} #{idx + 1}:
                                  </span>{" "}
                                  {docId}
                                </div>
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
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            suppressHydrationWarning
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("report.previous")}
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={loading}>
              {t("report.next")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? t("common.loading") : t("report.submitReport")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
