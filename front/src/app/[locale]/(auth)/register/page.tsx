"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageContainer } from "@/components/layout/page-container";
import { PageHero } from "@/components/layout/page-hero";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "@/app/actions/user/registerUser";
import { LocationCombobox } from "@/components/regional/location-combobox";
import { Link, useRouter } from "@/i18n/routing";
import { DatePickerField } from "@/components/form/date-picker-field";
import { Loader2, Shield, ArrowRight, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileUploadField } from "@/components/form/file-upload-field";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    first_name: z.string().min(1, "auth.firstNameRequired"),
    last_name: z.string().min(1, "auth.lastNameRequired"),
    email: z.string().email("auth.emailInvalid"),
    password: z.string().min(6, JSON.stringify({ key: "validation.minLength", values: { min: 6 } })),
    gender: z.enum(["Male", "Female"]),
    birth_date: z.string().optional(),
    address: z.string().optional(),
    expertise: z.array(z.string()).optional(),
    applyRegional: z.boolean().default(false),
    regionalAreaType: z.enum(["Country", "Province", "City"]).optional(),
    regionalCountryId: z.string().optional(),
    regionalProvinceId: z.string().optional(),
    regionalCityId: z.string().optional(),
    regionalJustification: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.applyRegional) {
      if (!data.regionalAreaType) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["regionalAreaType"], message: "validation.required" });
      }
      if (data.regionalAreaType === "Country" && !data.regionalCountryId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["regionalCountryId"], message: "validation.required" });
      }
      if (data.regionalAreaType === "Province" && !data.regionalProvinceId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["regionalProvinceId"], message: "validation.required" });
      }
      if (data.regionalAreaType === "City" && !data.regionalCityId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["regionalCityId"], message: "validation.required" });
      }
      if (!data.regionalJustification?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["regionalJustification"], message: "validation.required" });
      }
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations();
  const tRegional = useTranslations("regional");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const [countryScope, setCountryScope] = useState<string>("");
  const [provinceScope, setProvinceScope] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");
  const [newExpertise, setNewExpertise] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      gender: "Male",
      birth_date: "",
      address: "",
      expertise: [],
      applyRegional: false,
    },
  });

  const applyRegional = form.watch("applyRegional");
  const regionalAreaType = form.watch("regionalAreaType");
  const expertise = form.watch("expertise") || [];

  const addExpertise = () => {
    const value = newExpertise.trim();
    if (value && !expertise.includes(value)) {
      form.setValue("expertise", [...expertise, value]);
    }
    setNewExpertise("");
  };

  const removeExpertise = (index: number) => {
    form.setValue("expertise", expertise.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    const result = await registerUser({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      gender: data.gender,
      birth_date: data.birth_date ? (data.birth_date as unknown as Date) : undefined,
      address: data.address || undefined,
      verified: false,
      isPublic: true,
      ...(avatarId ? { avatarId } : {}),
      ...(data.expertise && data.expertise.length > 0 ? { expertise: data.expertise } : {}),
      ...(data.applyRegional
        ? {
            regionalAreaType: data.regionalAreaType,
            regionalCountryId: data.regionalAreaType === "Country" ? data.regionalCountryId || undefined : undefined,
            regionalProvinceId: data.regionalAreaType === "Province" ? data.regionalProvinceId || undefined : undefined,
            regionalCityId: data.regionalAreaType === "City" ? data.regionalCityId || undefined : undefined,
            regionalJustification: data.regionalJustification,
          }
        : {}),
    });

    if (result.success) {
      toast({
        title: t("common.success"),
        description: data.applyRegional
          ? t("regional.applicationSubmitted")
          : t("auth.registerSuccess"),
      });
      router.push("/login");
    } else {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: result.error || t("auth.registerFailed"),
      });
    }
    setLoading(false);
  };

  return (
    <PageContainer showHeader={false} contentClassName="">
      <PageHero
        variant="compact"
        icon={<Shield className="h-5 w-5 text-crimson" />}
        title={t("auth.registerTitle")}
        description={t("auth.registerDescription")}
      />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(153,27,27,0.15)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />

          <div className="relative w-full max-w-xl">
            <div className="rounded-2xl glass-strong p-8 md:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-offwhite">{t("auth.firstName")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={loading}
                              className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-offwhite">{t("auth.lastName")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={loading}
                              className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-offwhite">{t("auth.gender") || "Gender"}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger disabled={loading} className="bg-white/5 border-white/10 text-offwhite h-11">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glass-strong border-white/10">
                              <SelectItem value="Male">{t("auth.gender_Male") || "Male"}</SelectItem>
                              <SelectItem value="Female">{t("auth.gender_Female") || "Female"}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birth_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-offwhite">{t("auth.birthDate") || "Birth date"}</FormLabel>
                          <FormControl>
                            <DatePickerField
                              value={field.value}
                              onChange={field.onChange}
                              locale={locale}
                              disabled={loading}
                              placeholder={t("auth.birthDate") || "Birth date"}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-offwhite">{t("auth.email")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="email@example.com"
                            disabled={loading}
                            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-offwhite">{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            disabled={loading}
                            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-offwhite">{t("auth.address") || "Address"}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={loading}
                            placeholder={t("auth.address") || "Address"}
                            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expertise"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-offwhite">{t("admin.expertise") || "Expertise"}</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder={t("admin.expertisePlaceholder") || "Add an expertise..."}
                                disabled={loading}
                                value={newExpertise}
                                onChange={(e) => setNewExpertise(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addExpertise();
                                  }
                                }}
                                className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                              />
                            </div>
                            {expertise.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {expertise.map((item, index) => (
                                  <div
                                    key={index}
                                    className="inline-flex items-center gap-2 bg-crimson/10 text-crimson px-3 py-1 rounded-full text-sm"
                                  >
                                    {item}
                                    <button
                                      type="button"
                                      onClick={() => removeExpertise(index)}
                                      className="hover:opacity-70"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Regional Manager Application */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="applyRegional"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <button
                              type="button"
                              onClick={() => field.onChange(!field.value)}
                              className="flex w-full items-start gap-3 text-start"
                            >
                              <div
                                className={cn(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                                  field.value
                                    ? "border-crimson bg-crimson"
                                    : "border-white/20 bg-white/5",
                                )}
                              >
                                {field.value && <Shield className="h-3 w-3 text-white" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-offwhite">
                                  {tRegional("becomeRegionalManager")}
                                </p>
                                <p className="mt-1 text-xs text-slate-body/70">
                                  {tRegional("becomeRegionalManagerDescription")}
                                </p>
                              </div>
                              <ChevronDown
                                className={cn(
                                  "mt-1 h-4 w-4 shrink-0 text-slate-body transition-transform",
                                  field.value && "rotate-180",
                                )}
                              />
                            </button>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {applyRegional && (
                      <div className="space-y-4 border-t border-white/10 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">
                          {tRegional("applyTitle")}
                        </p>

                        <FormField
                          control={form.control}
                          name="regionalAreaType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-offwhite text-sm">{tRegional("areaType")}</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  form.setValue("regionalCountryId", undefined);
                                  form.setValue("regionalProvinceId", undefined);
                                  form.setValue("regionalCityId", undefined);
                                  setCountryScope("");
                                  setProvinceScope("");
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger disabled={loading} className="bg-white/5 border-white/10 text-offwhite h-11">
                                    <SelectValue placeholder={tRegional("areaType")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="glass-strong border-white/10">
                                  <SelectItem value="Country">{tRegional("areaTypeCountry")}</SelectItem>
                                  <SelectItem value="Province">{tRegional("areaTypeProvince")}</SelectItem>
                                  <SelectItem value="City">{tRegional("areaTypeCity")}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {regionalAreaType === "Country" && (
                          <FormField
                            control={form.control}
                            name="regionalCountryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-offwhite text-sm">{tRegional("areaTypeCountry")}</FormLabel>
                                <FormControl>
                                  <LocationCombobox
                                    kind="country"
                                    value={field.value}
                                    onChange={(id) => {
                                      field.onChange(id);
                                      form.setValue("regionalProvinceId", undefined);
                                      form.setValue("regionalCityId", undefined);
                                    }}
                                    disabled={loading}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {(regionalAreaType === "Province" || regionalAreaType === "City") && (
                          <FormItem>
                            <FormLabel className="text-offwhite text-sm">{tRegional("areaTypeCountry")}</FormLabel>
                            <LocationCombobox
                              kind="country"
                              value={countryScope}
                              onChange={(id) => {
                                setCountryScope(id);
                                form.setValue("regionalProvinceId", undefined);
                                form.setValue("regionalCityId", undefined);
                                setProvinceScope("");
                              }}
                              disabled={loading}
                            />
                          </FormItem>
                        )}

                        {regionalAreaType === "Province" && (
                          <FormField
                            control={form.control}
                            name="regionalProvinceId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-offwhite text-sm">{tRegional("areaTypeProvince")}</FormLabel>
                                <FormControl>
                                  <LocationCombobox
                                    kind="province"
                                    countryId={countryScope}
                                    value={field.value}
                                    onChange={(id) => {
                                      field.onChange(id);
                                      form.setValue("regionalCityId", undefined);
                                    }}
                                    disabled={loading}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {regionalAreaType === "City" && (
                          <FormItem>
                            <FormLabel className="text-offwhite text-sm">{tRegional("areaTypeProvince")}</FormLabel>
                            <LocationCombobox
                              kind="province"
                              countryId={countryScope}
                              value={provinceScope}
                              onChange={(id) => {
                                setProvinceScope(id);
                                form.setValue("regionalCityId", undefined);
                              }}
                              disabled={loading}
                            />
                          </FormItem>
                        )}

                        {regionalAreaType === "City" && (
                          <FormField
                            control={form.control}
                            name="regionalCityId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-offwhite text-sm">{tRegional("areaTypeCity")}</FormLabel>
                                <FormControl>
                                  <LocationCombobox
                                    kind="city"
                                    countryId={countryScope}
                                    provinceId={provinceScope}
                                    value={field.value}
                                    onChange={(id) => field.onChange(id)}
                                    disabled={loading}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="regionalJustification"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-offwhite text-sm">{tRegional("justification")}</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  disabled={loading}
                                  placeholder={tRegional("justificationPlaceholder")}
                                  className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson min-h-24"
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-slate-body/60">
                                {tRegional("applyDescription")}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <FormLabel className="text-offwhite">{t("admin.avatar") || "Avatar"}</FormLabel>
                    <FileUploadField
                      label=""
                      maxFiles={1}
                      accept="image/*"
                      value={avatarId ? [avatarId] : []}
                      onChange={(ids) => setAvatarId(ids[0] || "")}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-crimson hover:bg-crimson-light text-white gap-2 h-11 animate-pulse-glow"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? t("common.loading") : t("auth.registerButton")}
                    {!loading && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-slate-body">
                  {t("auth.hasAccount")}{" "}
                  <Link
                    href="/login"
                    className="text-gold font-medium hover:text-gold-light transition-colors"
                  >
                    {t("auth.loginButton")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
