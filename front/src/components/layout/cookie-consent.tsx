"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const COOKIE_NAME = "ziwound_cookie_consent";
const MAX_AGE_DAYS = 365;

type ConsentValue = "accepted" | "declined";

const getCookieValue = (): ConsentValue | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : "";

  if (value === "accepted" || value === "declined") {
    return value;
  }

  return null;
};

const setCookieValue = (value: ConsentValue) => {
  if (typeof document === "undefined") {
    return;
  }

  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
};

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getCookieValue();
    setVisible(!existing);
  }, []);

  const handleChoice = (value: ConsentValue) => {
    setCookieValue(value);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <Card className="w-full max-w-2xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/60 shadow-lg">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">{t("title")}</p>
            <p className="text-sm text-muted-foreground">
              {t("description")}{" "}
              <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">
                {t("learnMore")}
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => handleChoice("declined")}
              className="w-full sm:w-auto">
              {t("decline")}
            </Button>
            <Button onClick={() => handleChoice("accepted")} className="w-full sm:w-auto">
              {t("accept")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
