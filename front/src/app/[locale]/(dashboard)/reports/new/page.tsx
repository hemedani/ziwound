"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { gets as getCategories } from "@/app/actions/category/gets";
import { gets as getTags } from "@/app/actions/tag/gets";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { add as addReport } from "@/app/actions/report/add";
import { add as addDocument } from "@/app/actions/document/add";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadField } from "@/components/form/file-upload-field";
import { TagSelector } from "@/components/form/tag-selector";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import { ReqType } from "@/types/declarations";

const LocationPicker = dynamic(
  () => import("@/components/form/location-picker").then((mod) => mod.LocationPicker),
  { ssr: false, loading: () => <div className="h-20 w-full animate-pulse rounded-md bg-muted" /> },
);

const reportSchema = z.object({
  title: z.string().min(1, "report.titleRequired"),
  description: z.string().min(1, "report.descriptionRequired"),
  address: z.string().optional(),
  country: z.string().min(1, "report.countryRequired"),
  city: z.string().optional(),
  crime_occurred_at: z.string().min(1, "report.crimeOccurredRequired"),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  location: z
    .object({
      address: z.string(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  attachments: z.array(z.string()).optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function NewReportPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          getCategories({ page: 1, limit: 100 }, { _id: 1, name: 1 }),
          getTags({ page: 1, limit: 100 }, { _id: 1, name: 1 }),
        ]);

        if (categoriesRes.success && Array.isArray(categoriesRes.body)) {
          setCategories(categoriesRes.body);
        }
        if (tagsRes.success && Array.isArray(tagsRes.body)) {
          setTags(tagsRes.body);
        }
      } catch (error) {
        console.error("Failed to fetch categories or tags", error);
      }
    };
    fetchData();
  }, []);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      country: "",
      city: "",
      crime_occurred_at: "",
      tags: [],
      category: "",
      location: { address: "" },
      attachments: [],
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    setLoading(true);

    let documentIds: string[] = [];
    if (data.attachments && data.attachments.length > 0) {
      const docResult = await addDocument(
        {
          title: `Attachments for: ${data.title}`,
          description: "Automatically created from report submission",
          documentFileIds: data.attachments,
          language: locale as ReqType["main"]["document"]["add"]["set"]["language"],
        },
        { _id: 1 },
      );

      if (docResult.success && docResult.body && (docResult.body as { _id: string })._id) {
        documentIds = [(docResult.body as { _id: string })._id];
      } else {
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: "Failed to attach files",
        });
        setLoading(false);
        return;
      }
    }

    const result = await addReport({
      title: data.title,
      description: data.description,
      tags: data.tags,
      category: data.category,
      location: data.location
        ? { type: "Point", coordinates: [data.location.longitude || 0, data.location.latitude || 0] }
        : undefined,
      documentIds,
      language: locale as ReqType["main"]["report"]["add"]["set"]["language"],
      status: "Pending",
      crime_occurred_at: new Date(data.crime_occurred_at),
      country: data.country,
      city: data.city,
    });

    if (result.success) {
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
    setLoading(false);
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t("report.newReport")}</CardTitle>
          <CardDescription>{t("report.newReportDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("report.reportTitle")} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("report.reportTitlePlaceholder")}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("report.description")} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t("report.descriptionPlaceholder")}
                        rows={5}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0} / 1000 {t("common.characters")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("report.country")} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("report.countryPlaceholder")}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("report.city")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("report.cityPlaceholder")}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Crime Occurred At */}
              <FormField
                control={form.control}
                name="crime_occurred_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("report.crimeOccurredAt")} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("report.category")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("report.selectCategory")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <TagSelector
                      label={t("report.tags")}
                      availableTags={tags.map((t) => ({ id: t._id, name: t.name }))}
                      selectedTags={(field.value || []).map((id) => {
                        const existingTag = tags.find((t) => t._id === id);
                        return { id, name: existingTag ? existingTag.name : id };
                      })}
                      onChange={(tags) => field.onChange(tags.map((t) => t.id))}
                      creatable={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <LocationPicker
                      label={t("report.location")}
                      value={field.value}
                      onChange={field.onChange}
                      showMap={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Attachments */}
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FileUploadField
                      label={t("report.attachments")}
                      maxFiles={10}
                      maxSize={10 * 1024 * 1024}
                      accept="image/*,.pdf,.doc,.docx"
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                    <FormDescription>{t("report.attachmentsDescription")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/">{t("common.cancel")}</Link>
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? t("common.loading") : t("report.submitReport")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
