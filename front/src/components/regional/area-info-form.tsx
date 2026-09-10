"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

type Localized = Partial<Record<(typeof LANGUAGES)[number]["code"], string>>;

export interface AreaInfoField {
  key: string;
  label: string;
}

interface AreaInfoFormProps {
  initialData: {
    _id: string;
    name?: string;
    english_name?: string;
  } & Record<string, Localized | string | undefined>;
  fields: AreaInfoField[];
  saving?: boolean;
  onSubmit: (payload: Record<string, unknown>) => void;
  onCancel: () => void;
}

const extract = (
  value: Localized | string | undefined,
  lang: keyof Localized,
): string => {
  if (typeof value === "object" && value !== null) return value[lang] || "";
  if (typeof value === "string") return lang === "en" ? value : "";
  return "";
};

export function AreaInfoForm({
  initialData,
  fields,
  saving = false,
  onSubmit,
  onCancel,
}: AreaInfoFormProps) {
  const t = useTranslations("regional");
  const [name, setName] = useState(initialData?.name || "");
  const [englishName, setEnglishName] = useState(initialData?.english_name || "");
  const [localized, setLocalized] = useState<Record<string, Localized>>(() => {
    const state: Record<string, Localized> = {};
    for (const field of fields) {
      const current: Localized = {};
      for (const lang of LANGUAGES) {
        const value = extract(initialData?.[field.key], lang.code);
        if (value) current[lang.code] = value;
      }
      state[field.key] = current;
    }
    return state;
  });
  const [activeLang, setActiveLang] = useState<string>("fa");

  const updateField = (key: string, lang: string, value: string) => {
    setLocalized((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [lang]: value || undefined },
    }));
  };

  const handleSubmit = () => {
    const payload: Record<string, unknown> = {
      _id: initialData._id,
      name,
      english_name: englishName,
    };
    for (const field of fields) {
      const value = localized[field.key];
      const filled = Object.fromEntries(
        Object.entries(value || {}).filter(([, v]) => v && v.length > 0),
      );
      if (Object.keys(filled).length > 0) payload[field.key] = filled;
    }
    onSubmit(payload);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm text-offwhite">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-offwhite">English Name</label>
          <Input
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-10"
          />
        </div>
      </div>

      <Tabs value={activeLang} onValueChange={setActiveLang}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-white/5 border-white/10">
          {LANGUAGES.map((lang) => (
            <TabsTrigger
              key={lang.code}
              value={lang.code}
              className="text-xs data-[state=active]:bg-crimson data-[state=active]:text-white text-slate-body"
            >
              {lang.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code} className="mt-3 space-y-3">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-sm text-offwhite">{field.label} ({lang.name})</label>
                <Textarea
                  value={localized[field.key]?.[lang.code] || ""}
                  onChange={(e) => updateField(field.key, lang.code, e.target.value)}
                  placeholder={`${field.label} (${lang.name})`}
                  className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson min-h-24"
                />
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
          className="border-white/10 bg-white/5 text-offwhite hover:bg-white/10"
        >
          {t("cancel")}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="bg-crimson hover:bg-crimson-light text-white"
        >
          {saving && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
