"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "fa", name: "فارسی", nativeName: "فارسی", dir: "rtl" },
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ar", name: "العربية", nativeName: "العربية", dir: "rtl" },
  { code: "zh", name: "中文", nativeName: "中文", dir: "ltr" },
  { code: "pt", name: "Português", nativeName: "Português", dir: "ltr" },
  { code: "es", name: "Español", nativeName: "Español", dir: "ltr" },
  { code: "nl", name: "Nederlands", nativeName: "Nederlands", dir: "ltr" },
  { code: "tr", name: "Türkçe", nativeName: "Türkçe", dir: "ltr" },
  { code: "ru", name: "Русский", nativeName: "Русский", dir: "ltr" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

  const switchLanguage = (langCode: string) => {
    // Replace the locale in the pathname
    const newPathname = pathname.replace(`/${locale}`, `/${langCode}`);
    router.push(newPathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-3 gap-2 justify-center rounded-md"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline text-sm font-medium leading-none">
            {currentLang.nativeName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" sideOffset={8} className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={lang.code === locale ? "bg-muted" : ""}
          >
            <div className="flex items-center justify-between w-full">
              <span>{lang.nativeName}</span>
              {lang.code === locale && <span className="text-xs text-muted-foreground">✓</span>}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
