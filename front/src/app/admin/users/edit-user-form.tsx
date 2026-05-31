"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/form/rich-text-editor";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { userSchema } from "@/types/declarations";

const LANGUAGES = ["fa", "en", "ar", "zh", "pt", "es", "nl", "tr", "ru"] as const;
type Language = (typeof LANGUAGES)[number];

const languageLabels: Record<Language, string> = {
  fa: "فارسی",
  en: "English",
  ar: "العربية",
  zh: "中文",
  pt: "Português",
  es: "Español",
  nl: "Nederlands",
  tr: "Türkçe",
  ru: "Русский",
};

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

const editUserFormSchema = z.object({
  first_name: z.string().min(1, "validation.required"),
  last_name: z.string().min(1, "validation.required"),
  email: z.string().email("validation.invalidEmail"),
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

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;

interface EditUserFormProps {
  user: userSchema;
  onSubmit: (data: EditUserFormValues) => Promise<void>;
  onCancel: () => void;
}

function extractLangValue(field: Record<string, string> | string | undefined, lang: string): string {
  if (typeof field === "object" && field !== null) {
    return field[lang] || "";
  }
  if (typeof field === "string") {
    return lang === "en" ? field : "";
  }
  return "";
}

export function EditUserForm({ user, onSubmit, onCancel }: EditUserFormProps) {
  const t = useTranslations("admin");

  const form = useForm<EditUserFormValues, any, EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      gender: user.gender || "Male",
      level: (user.level === "Ghost" ? undefined : user.level) || "Ordinary",
      address: user.address || "",
      bio: {
        fa: extractLangValue(user.bio, "fa"),
        en: extractLangValue(user.bio, "en"),
        ar: extractLangValue(user.bio, "ar"),
        zh: extractLangValue(user.bio, "zh"),
        pt: extractLangValue(user.bio, "pt"),
        es: extractLangValue(user.bio, "es"),
        nl: extractLangValue(user.bio, "nl"),
        tr: extractLangValue(user.bio, "tr"),
        ru: extractLangValue(user.bio, "ru"),
      },
      expertise: user.expertise || [],
      verified: user.verified ?? false,
      verificationBadge: user.verificationBadge || "",
      isPublic: user.isPublic ?? true,
      is_verified: user.is_verified ?? false,
    },
  });

  const [newExpertise, setNewExpertise] = useState("");

  const addExpertise = () => {
    const value = newExpertise.trim();
    if (value) {
      const current = form.getValues("expertise") || [];
      if (!current.includes(value)) {
        form.setValue("expertise", [...current, value]);
      }
      setNewExpertise("");
    }
  };

  const removeExpertise = (index: number) => {
    const current = form.getValues("expertise") || [];
    form.setValue("expertise", current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: EditUserFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName") || "First Name"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("firstNamePlaceholder") || "Enter first name"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
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
                <FormLabel>{t("lastName") || "Last Name"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("lastNamePlaceholder") || "Enter last name"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email") || "Email"}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="user@example.com" {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("gender") || "Gender"}</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("level") || "Role/Level"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10 text-offwhite">
                    <SelectValue placeholder={t("selectLevel")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="glass-strong border-white/10">
                  <SelectItem value="Ordinary">{t("level_Ordinary") || "Ordinary"}</SelectItem>
                  <SelectItem value="Reporter">{t("level_Reporter") || "Reporter"}</SelectItem>
                  <SelectItem value="Artist">{t("level_Artist") || "Artist"}</SelectItem>
                  <SelectItem value="Diplomat">{t("level_Diplomat") || "Diplomat"}</SelectItem>
                  <SelectItem value="Researcher">{t("level_Researcher") || "Researcher"}</SelectItem>
                  <SelectItem value="Editor">{t("level_Editor") || "Editor"}</SelectItem>
                  <SelectItem value="Manager">{t("level_Manager") || "Manager"}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("address") || "Address"}</FormLabel>
              <FormControl>
                <Input placeholder={t("addressPlaceholder") || "Full address"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio Field - Localized by Language */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bio") || "Bio"}</FormLabel>
              <Tabs defaultValue="fa" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto">
                  {LANGUAGES.map((lang) => (
                    <TabsTrigger key={lang} value={lang} className="text-xs">
                      {languageLabels[lang]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LANGUAGES.map((lang) => (
                  <TabsContent key={lang} value={lang} className="mt-2">
                    <RichTextEditor
                      value={field.value?.[lang as keyof typeof field.value] || ""}
                      onChange={(html) => {
                        const currentBio = field.value || {};
                        field.onChange({
                          ...currentBio,
                          [lang]: html || "",
                        });
                      }}
                      placeholder={`${t("bio") || "Bio"} (${languageLabels[lang]})`}
                    />
                  </TabsContent>
                ))}
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expertise Field - Tag-like input */}
        <FormField
          control={form.control}
          name="expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("expertise") || "Expertise"}</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addExpertise();
                        }
                      }}
                      placeholder={t("expertisePlaceholder") || "Add an expertise..."}
                      className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addExpertise}
                    >
                      {t("add") || "Add"}
                    </Button>
                  </div>
                  {(field.value && field.value.length > 0) && (
                    <div className="flex flex-wrap gap-2 p-3 rounded-md glass-light border border-white/[0.06]">
                      {field.value.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/10 text-crimson text-sm"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeExpertise(index)}
                            className="hover:bg-crimson/20 transition-colors rounded-full p-0.5 hover:opacity-70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="verified"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 p-4 rounded-md glass-light border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mb-0 cursor-pointer">{t("verified") || "Verified"}</FormLabel>
                </div>
                <FormDescription className="text-xs text-slate-body/70">{t("verifiedDescription") || "Indicates whether the user has been verified for their role level (e.g., Diplomat, Researcher)."}</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0 p-4 rounded-md glass-light border border-white/[0.06]">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mb-0 cursor-pointer">{t("publicProfile") || "Public Profile"}</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_verified"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 p-4 rounded-md glass-light border border-white/[0.06]">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className="!mb-0 cursor-pointer">{t("isVerified") || "Email Verified"}</FormLabel>
                <FormDescription className="text-xs text-slate-body/70">{t("isVerifiedDescription") || "Indicates whether the user's email address has been verified."}</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="verificationBadge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("verificationBadge") || "Verification Badge"}</FormLabel>
              <FormControl>
                <Input placeholder={t("verificationBadgePlaceholder") || "Badge ID (optional)"} {...field} className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={form.formState.isSubmitting}>
            {t("cancel") || "Cancel"}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? (t("loading") || "Loading...") : t("save") || "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
