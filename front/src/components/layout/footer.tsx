"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">G</span>
              </div>
              <span className="font-bold text-xl">{t("appName")}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">{t("description")}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/reports/new`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("submitReport")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/reports/my`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("myReports")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/war-crimes`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("warCrimes")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and support */}
          <div>
            <h3 className="text-sm font-semibold mb-3">{t("support")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/help`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("help")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            {t("copyright", {
              year: new Date().getFullYear(),
            })}
          </p>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
