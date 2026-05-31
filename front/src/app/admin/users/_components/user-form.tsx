"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Loader2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { ImagePicker } from "@/components/form/image-picker";
import { FileUploadField } from "@/components/form/file-upload-field";
import { userSchema } from "@/types/declarations";

const LANGUAGES = [
  { code: "fa", name: "فارسی" },
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "pt", name: "Português" },
  { code: "es", name: "Español" },
  { code: "nl", name: "Nederlands" },
  { code: "tr", name: "Türkçe" },
  { code: "ru", name: "Русский" },
] as const;

const localizedFieldSchema = z.object({
  fa: z.string().optional(),
  en: z.string().optional(),
  ar: z.string().optional(),
  zh: z.string().optional(),
  pt: z.string().optional(),
  es: z.string().optional(),
  nl: z.string().optional(),
  tr: z.string().optional(),
  ru: z.string().optional(),
}).optional();

const userFormSchema = z.object({
  first_name: z.string().min(1, JSON.stringify({ key: "validation.required", values: {} })),
  last_name: z.string().min(1, JSON.stringify({ key: "validation.required", values: {} })),
  email: z.string().email(JSON.stringify({ key: "validation.invalidEmail", values: {} })),
  password: z.string().min(6, JSON.stringify({ key: "validation.minLength", values: { min: 6 } })).optional().or(z.literal("")),
  gender: z.enum(["Male", "Female"]),
  level: z.enum(["Manager", "Editor", "Reporter", "Artist", "Diplomat", "Researcher", "Ordinary"]),
  address: z.string().optional(),
  bio: localizedFieldSchema,
  expertise: z.array(z.string()).optional(),
  verified: z.boolean().default(false),
  verificationBadge: z.string().optional(),
  isPublic: z.boolean().default(true),
  is_verified: z.boolean().default(false),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export type UserFormSubmitData = UserFormValues & { avatarId?: string };

interface UserFormProps {
  initialData?: Partial<userSchema>;
  onSubmit: (data: UserFormSubmitData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isEditing = false }: UserFormProps) {
  const t = useTranslations("admin");
  const [isPending, startTransition] = useTransition();
  const [avatarId, setAvatarId] = useState<string>(
    (initialData as Record<string, { _id?: string }> | undefined)?.avatar?._id || ""
  );
  const [newExpertise, setNewExpertise] = useState("");

  const extractFieldValue = (field: Record<string, string> | string | undefined, langCode: string): string => {
    if (typeof field === "object" && field !== null) return field[langCode] || "";
    if (typeof field === "string") return langCode === "en" ? field : "";
    return "";
  };

  const buildDefaultLocalized = (fieldName: string) => ({
    fa: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "fa"),
    en: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "en"),
    ar: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "ar"),
    zh: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "zh"),
    pt: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "pt"),
    es: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "es"),
    nl: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "nl"),
    tr: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "tr"),
    ru: extractFieldValue((initialData as Record<string, unknown>)?.[fieldName] as Record<string, string> | string | undefined, "ru"),
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      email: initialData?.email || "",
      password: "",
      gender: initialData?.gender || "Male",
      level: (initialData?.level === "Ghost" ? "Manager" : initialData?.level) || "Ordinary",
      address: initialData?.address || "",
      bio: buildDefaultLocalized("bio"),
      expertise: initialData?.expertise || [],
      verified: initialData?.verified ?? false,
      verificationBadge: initialData?.verificationBadge || "",
      isPublic: initialData?.isPublic ?? true,
      is_verified: initialData?.is_verified ?? false,
    },
  });

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

  const handleSubmit = (values: UserFormValues) => {
    startTransition(async () => {
      await onSubmit({ ...values, avatarId: avatarId || undefined });
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">
              {t("basicInfo") || "Basic Information"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="first_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite text-sm">{t("firstName") || "First Name"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("firstNamePlaceholder") || "Enter first name"} {...field} dir="auto"
                      className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField control={form.control} name="last_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite text-sm">{t("lastName") || "Last Name"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("lastNamePlaceholder") || "Enter last name"} {...field} dir="auto"
                      className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite text-sm">{t("email") || "Email"}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field}
                      className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite text-sm">{isEditing ? (t("newPassword") || "New Password") : (t("password") || "Password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={isEditing ? t("leaveBlankToKeep") || "Leave blank to keep" : "••••••••"} {...field}
                      className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                  </FormControl>
                  {isEditing && (
                    <FormDescription className="text-xs text-slate-body/60">
                      {t("passwordChangeHint") || "Leave empty to keep current password"}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite text-sm">{t("gender") || "Gender"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
                        <SelectValue placeholder={t("selectGender")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass-strong border-white/10">
                      <SelectItem value="Male">{t("gender_Male") || "Male"}</SelectItem>
                      <SelectItem value="Female">{t("gender_Female") || "Female"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField control={form.control} name="level" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite text-sm">{t("level") || "Role/Level"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
                        <SelectValue placeholder={t("selectLevel")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass-strong border-white/10">
                      <SelectItem value="Ordinary">{t("level_Ordinary") || "Ordinary"}</SelectItem>
                      <SelectItem value="Reporter">{t("Reporter") || "Reporter"}</SelectItem>
                      <SelectItem value="Artist">{t("Artist") || "Artist"}</SelectItem>
                      <SelectItem value="Diplomat">{t("Diplomat") || "Diplomat"}</SelectItem>
                      <SelectItem value="Researcher">{t("Researcher") || "Researcher"}</SelectItem>
                      <SelectItem value="Editor">{t("level_Editor") || "Editor"}</SelectItem>
                      <SelectItem value="Manager">{t("level_Manager") || "Manager"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />
            </div>

            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-offwhite text-sm">{t("address") || "Address"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("addressPlaceholder") || "Full address"} {...field}
                    className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="verificationBadge" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-offwhite text-sm">{t("verificationBadge") || "Verification Badge"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("verificationBadgePlaceholder") || "Badge ID (optional)"} {...field}
                      className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            </div>
          </div>

          {/* Photo */}
          {!isEditing && (
            <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">
                {t("avatar") || "Avatar"}
              </h3>
              <Tabs defaultValue="library">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
                  <TabsTrigger value="library" className="text-xs data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
                    {t("imageLibrary") || "Library"}
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="text-xs data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
                    {t("uploadNew") || "Upload"}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="library" className="mt-3">
                  <ImagePicker value={avatarId} onChange={(id) => setAvatarId(id || "")} />
                </TabsContent>
                <TabsContent value="upload" className="mt-3">
                  <FileUploadField label="" maxFiles={1} accept="image/*"
                    value={avatarId ? [avatarId] : []}
                    onChange={(ids) => setAvatarId(ids[0] || "")} />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Bio */}
          <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">
              {t("bio") || "Bio"}
            </h3>
            <FormField control={form.control} name="bio" render={({ field }) => (
              <FormItem>
                <Tabs defaultValue="fa">
                  <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-white/5 border-white/10">
                    {LANGUAGES.map((lang) => (
                      <TabsTrigger key={lang.code} value={lang.code}
                        className="text-xs data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body">
                        {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {LANGUAGES.map((lang) => (
                    <TabsContent key={lang.code} value={lang.code} className="mt-2">
                      <RichTextEditor
                        value={field.value?.[lang.code] || ""}
                        onChange={(html) => {
                          const current = field.value || {};
                          field.onChange({ ...current, [lang.code]: html || "" });
                        }}
                        placeholder={`${t("bio") || "Bio"} (${lang.name})`}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
            />
          </div>

          {/* Expertise */}
          <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">
              {t("expertise") || "Expertise"}
            </h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input value={newExpertise} onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExpertise(); } }}
                  placeholder={t("expertisePlaceholder") || "Add an expertise..."}
                  className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                <Button type="button" variant="outline" onClick={addExpertise}
                  className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
                  {t("add") || "Add"}
                </Button>
              </div>
              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 rounded-md glass-light border border-white/[0.06]">
                  {expertise.map((item, index) => (
                    <span key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 text-crimson text-sm">
                      {item}
                      <button type="button" onClick={() => removeExpertise(index)}
                        className="hover:bg-crimson/20 transition-colors rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Verification & Status */}
          <div className="rounded-2xl glass-strong p-5 border border-white/[0.06] space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-gold">
              {t("verificationStatus") || "Verification & Status"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="verified" render={({ field }) => (
                <FormItem className="flex flex-col gap-1 p-4 rounded-md glass-light border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mb-0 cursor-pointer text-offwhite text-sm">{t("verified") || "Verified"}</FormLabel>
                  </div>
                  <FormDescription className="text-xs text-slate-body/70">{t("verifiedDescription") || "Role-level verification (Diplomat, Researcher)"}</FormDescription>
                </FormItem>
              )}
              />
              <FormField control={form.control} name="is_verified" render={({ field }) => (
                <FormItem className="flex flex-col gap-1 p-4 rounded-md glass-light border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mb-0 cursor-pointer text-offwhite text-sm">{t("isVerified") || "Email Verified"}</FormLabel>
                  </div>
                  <FormDescription className="text-xs text-slate-body/70">{t("isVerifiedDescription") || "Email address verification"}</FormDescription>
                </FormItem>
              )}
              />
              <FormField control={form.control} name="isPublic" render={({ field }) => (
                <FormItem className="flex items-center gap-2 p-4 rounded-md glass-light border border-white/[0.06]">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mb-0 cursor-pointer text-offwhite text-sm">{t("publicProfile") || "Public Profile"}</FormLabel>
                </FormItem>
              )}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}
              className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10">
              {t("cancel") || "Cancel"}
            </Button>
            <Button type="submit" disabled={isPending} className="bg-crimson hover:bg-crimson-light text-white">
              {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {isEditing ? (t("update") || "Update") : (t("create") || "Create")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
